import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

interface BusStop {
  name: string;
  time: string | null;
}

interface BusRoute {
  type: string;
  route: string;
  stopsPreview: string;
  stops: BusStop[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 解析Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // 解析数据（跳过表头）
    const busData: BusRoute[] = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 3) continue;

      const busType = String(row[0] || '').trim();
      const routeName = String(row[1] || '').trim();
      const stopsPreview = String(row[2] || '').trim();

      if (!busType || !routeName || !stopsPreview) continue;

      // 解析站点
      const stops: BusStop[] = [];
      const stopParts = stopsPreview.split('->');

      for (const stopPart of stopParts) {
        const timeMatch = stopPart.match(/（(\d{2}:\d{2})）/);
        let time: string | null = null;
        let stopName = stopPart.trim();

        if (timeMatch) {
          time = timeMatch[1];
          stopName = stopPart.substring(0, timeMatch.index).trim();
        }

        if (stopName) {
          stops.push({
            name: stopName,
            time: time,
          });
        }
      }

      busData.push({
        type: busType,
        route: routeName,
        stopsPreview: stopsPreview,
        stops: stops,
      });
    }

    if (busData.length === 0) {
      return NextResponse.json(
        { error: 'Excel文件中没有找到有效的班车数据' },
        { status: 400 }
      );
    }

    // 保存到文件
    const dataPath = path.join(process.cwd(), 'app', 'bus_data.json');
    fs.writeFileSync(dataPath, JSON.stringify(busData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      count: busData.length,
      message: '数据更新成功',
    });
  } catch (error) {
    console.error('上传处理错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理文件时出错' },
      { status: 500 }
    );
  }
}
