'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  const handleAuth = () => {
    // 简单的密码验证
    if (password === 'admin2025') {
      setAuthenticated(true);
      setMessage('');
    } else {
      setMessage('密码错误');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('请选择文件');
      return;
    }

    setUploading(true);
    setMessage('正在上传和解析文件...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ 成功！已更新 ${result.count} 条班车线路`);
        setFile(null);

        // 3秒后刷新页面查看新数据
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 3000);
      } else {
        setMessage(`❌ 错误: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ 上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setUploading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold text-gray-800">管理员登录</h1>
            <p className="text-gray-500 text-sm mt-2">请输入管理密码</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="输入管理密码"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />

            {message && (
              <p className="text-red-500 text-sm text-center">{message}</p>
            )}

            <button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              登录
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-all text-sm"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                📊 班车数据管理
              </h1>
              <p className="text-gray-600 mt-2">上传新的Excel文件来更新班车数据</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              返回首页
            </button>
          </div>

          <div className="space-y-6">
            {/* 文件上传区域 */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-700 font-medium mb-2">
                  {file ? file.name : '点击选择Excel文件'}
                </p>
                <p className="text-gray-500 text-sm">
                  支持 .xlsx 和 .xls 格式
                </p>
              </label>
            </div>

            {/* 说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">📋 Excel格式要求：</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 第一列：班车类型（如"上班班车"、"下班班车"）</li>
                <li>• 第二列：线路名（如"QS-020"）</li>
                <li>• 第三列：站点预览（完整的站点列表字符串）</li>
              </ul>
            </div>

            {/* 状态消息 */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('✅')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : message.includes('❌')
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                {message}
              </div>
            )}

            {/* 上传按钮 */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`w-full py-4 rounded-xl font-medium transition-all shadow-lg ${
                !file || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {uploading ? '⏳ 正在上传...' : '🚀 上传并更新数据'}
            </button>
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>💡 提示：上传新文件将完全替换现有的班车数据</p>
          <p className="mt-1">请确保Excel文件格式正确后再上传</p>
        </div>
      </div>
    </div>
  );
}
