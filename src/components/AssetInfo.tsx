import React from 'react';
import { Asset } from '@/types';

interface AssetInfoProps {
  asset: Asset;
  currentPrice: number;
  priceChange: number;
}

export const AssetInfo: React.FC<AssetInfoProps> = ({ 
  asset, 
  currentPrice, 
  priceChange 
}) => {
  return (
    <div className="space-y-3">
      {/* 资产基本信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {asset.symbol.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{asset.name}</h2>
            <p className="text-sm text-gray-400">{asset.symbol}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${currentPrice.toFixed(4)}
          </div>
          <div className={`text-sm font-semibold ${
            priceChange >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 资产描述 */}
      <div className="bg-dark-700/50 rounded-lg p-3">
        <p className="text-sm text-gray-300 leading-relaxed">
          {asset.description}
        </p>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">市值</div>
          <div className="text-sm font-semibold text-white">
            ${(asset.marketCap / 1000000).toFixed(2)}M
          </div>
        </div>
        
        <div className="bg-dark-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">24h成交量</div>
          <div className="text-sm font-semibold text-white">
            ${(asset.volume24h / 1000).toFixed(1)}K
          </div>
        </div>
        
        <div className="bg-dark-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">流动性</div>
          <div className="text-sm font-semibold text-white">
            ${(asset.liquidity / 1000).toFixed(1)}K
          </div>
        </div>
        
        <div className="bg-dark-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">持有人数</div>
          <div className="text-sm font-semibold text-white">
            {asset.holders.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2">
        {asset.tags.map((tag, index) => (
          <span 
            key={index}
            className="badge badge-outline text-xs px-2 py-1"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 创建者信息 */}
      <div className="flex items-center justify-between bg-dark-700/50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <img 
            src={asset.creator.avatar} 
            alt={asset.creator.username}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-300">
            创建者: {asset.creator.username}
          </span>
        </div>
        
        <div className="text-xs text-gray-400">
          Lv.{asset.creator.level}
        </div>
      </div>
    </div>
  );
}; 