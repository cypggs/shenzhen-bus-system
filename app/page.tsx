'use client';

import { useState, useMemo } from 'react';
import busData from './bus_data.json';

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

export default function Home() {
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');

  const filteredBuses = useMemo(() => {
    let results = busData as BusRoute[];

    if (searchQuery1.trim()) {
      const query1 = searchQuery1.toLowerCase().trim();
      results = results.filter((bus) => {
        const routeMatch = bus.route.toLowerCase().includes(query1);
        const typeMatch = bus.type.toLowerCase().includes(query1);
        const stopsMatch = bus.stopsPreview.toLowerCase().includes(query1);
        const stopNamesMatch = bus.stops.some(stop =>
          stop.name.toLowerCase().includes(query1)
        );
        return routeMatch || typeMatch || stopsMatch || stopNamesMatch;
      });
    }

    if (searchQuery2.trim()) {
      const query2 = searchQuery2.toLowerCase().trim();
      results = results.filter((bus) => {
        const routeMatch = bus.route.toLowerCase().includes(query2);
        const typeMatch = bus.type.toLowerCase().includes(query2);
        const stopsMatch = bus.stopsPreview.toLowerCase().includes(query2);
        const stopNamesMatch = bus.stops.some(stop =>
          stop.name.toLowerCase().includes(query2)
        );
        return routeMatch || typeMatch || stopsMatch || stopNamesMatch;
      });
    }

    return results;
  }, [searchQuery1, searchQuery2]);

  const handleClear = () => {
    setSearchQuery1('');
    setSearchQuery2('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            🚌 深圳班车查询系统
          </h1>
          <p className="text-gray-600">智能双关键字搜索，快速查找您的班车线路</p>
        </div>

        {/* 搜索框 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                关键字 1
              </label>
              <input
                type="text"
                value={searchQuery1}
                onChange={(e) => setSearchQuery1(e.target.value)}
                placeholder="输入站点名、线路号或班车类型..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                关键字 2
              </label>
              <input
                type="text"
                value={searchQuery2}
                onChange={(e) => setSearchQuery2(e.target.value)}
                placeholder="输入站点名、线路号或班车类型..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              💡 提示：两个关键字同时匹配，缩小搜索范围
            </p>
            {(searchQuery1 || searchQuery2) && (
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                清空搜索
              </button>
            )}
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <p className="text-sm font-medium">
              找到 <span className="text-2xl font-bold mx-1">{filteredBuses.length}</span> 条班车线路
              {(searchQuery1 || searchQuery2) && (
                <span className="ml-2 text-blue-100">
                  {searchQuery1 && `"${searchQuery1}"`}
                  {searchQuery1 && searchQuery2 && ' & '}
                  {searchQuery2 && `"${searchQuery2}"`}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 班车列表 */}
        <div className="space-y-4">
          {filteredBuses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">没有找到匹配的班车线路</p>
              <p className="text-gray-400 text-sm mt-2">请尝试其他关键字</p>
            </div>
          ) : (
            filteredBuses.map((bus, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
              >
                {/* 线路头部 */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md">
                      {bus.route}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bus.type === '上班班车'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {bus.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">共 {bus.stops.length} 个站点</p>
                    {bus.stops[0]?.time && (
                      <p className="text-sm font-medium text-blue-600">
                        发车时间：{bus.stops[0].time}
                      </p>
                    )}
                  </div>
                </div>

                {/* 站点列表 */}
                <div className="space-y-2">
                  {bus.stops.map((stop, stopIndex) => (
                    <div
                      key={stopIndex}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {stopIndex === 0 ? (
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                            起
                          </div>
                        ) : stopIndex === bus.stops.length - 1 ? (
                          <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                            终
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {stopIndex + 1}
                          </div>
                        )}
                        {stop.time && (
                          <span className="text-sm font-mono text-blue-600 font-medium min-w-[50px]">
                            {stop.time}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{stop.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 页脚 */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>数据更新时间：2025.11.04</p>
          <p className="mt-2">共收录 {busData.length} 条深圳地区班车线路</p>
        </div>
      </div>
    </div>
  );
}
