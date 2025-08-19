import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            RichFlow
          </h1>
          <p className="text-gray-400">
            金融短视频资产交易平台
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="loading-spinner"></div>
          <span className="text-gray-300">加载中...</span>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>发现 • 投资 • 交易</p>
        </div>
      </div>
    </div>
  );
}; 