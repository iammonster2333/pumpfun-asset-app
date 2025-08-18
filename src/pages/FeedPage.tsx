import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Asset } from '@/types';
import { AssetCard } from '@/components/AssetCard';
import { DanmakuLayer } from '@/components/DanmakuLayer';
import { useSpring, animated, useSprings } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { useVirtualizer } from '@tanstack/react-virtual';

export const FeedPage: React.FC = () => {
  const { assets, setAssets, currentAsset, setCurrentAsset } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // 使用虚拟列表优化性能
  const virtualizer = useVirtualizer({
    count: assets.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => window.innerHeight,
    overscan: 2, // 预加载前后2个项目
  });

  // 模拟资产数据
  useEffect(() => {
    const mockAssets: Asset[] = [
      {
        id: 'asset-1',
        name: 'MoonDoge',
        symbol: 'MDOGE',
        description: '去中心化的狗狗币生态系统，致力于为社区创造价值',
        creatorId: 'creator-1',
        creator: {
          id: 'creator-1',
          username: 'MoonDoge团队',
          avatar: 'https://via.placeholder.com/40',
          walletAddress: 'mock-address-1',
          balance: { sol: 100, usdc: 10000 },
          level: 5,
          experience: 1000,
          achievements: [],
          createdAt: new Date(),
          lastActiveAt: new Date()
        },
        contractAddress: 'mock-contract-1',
        totalSupply: 1000000000,
        circulatingSupply: 500000000,
        price: 0.0001,
        priceChange24h: 15.5,
        priceChange7d: 45.2,
        marketCap: 50000,
        volume24h: 15000,
        liquidity: 25000,
        holders: 1250,
        klineData: generateMockKlineData(),
        tags: ['meme', 'community', 'defi'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'asset-2',
        name: 'TechToken',
        symbol: 'TECH',
        description: '专注于区块链技术创新的代币，支持开发者生态',
        creatorId: 'creator-2',
        creator: {
          id: 'creator-2',
          username: 'Tech团队',
          avatar: 'https://via.placeholder.com/40',
          walletAddress: 'mock-address-2',
          balance: { sol: 50, usdc: 5000 },
          level: 3,
          experience: 500,
          achievements: [],
          createdAt: new Date(),
          lastActiveAt: new Date()
        },
        contractAddress: 'mock-contract-2',
        totalSupply: 10000000,
        circulatingSupply: 3000000,
        price: 2.5,
        priceChange24h: -5.2,
        priceChange7d: 12.8,
        marketCap: 7500000,
        volume24h: 500000,
        liquidity: 1000000,
        holders: 850,
        klineData: generateMockKlineData(),
        tags: ['technology', 'innovation', 'developer'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'asset-3',
        name: 'GreenCoin',
        symbol: 'GREEN',
        description: '环保主题的代币，支持可持续发展和绿色项目',
        creatorId: 'creator-3',
        creator: {
          id: 'creator-3',
          username: 'Green团队',
          avatar: 'https://via.placeholder.com/40',
          walletAddress: 'mock-address-3',
          balance: { sol: 25, usdc: 2500 },
          level: 2,
          experience: 200,
          achievements: [],
          createdAt: new Date(),
          lastActiveAt: new Date()
        },
        contractAddress: 'mock-contract-3',
        totalSupply: 50000000,
        circulatingSupply: 15000000,
        price: 0.8,
        priceChange24h: 8.7,
        priceChange7d: 25.3,
        marketCap: 12000000,
        volume24h: 800000,
        liquidity: 1500000,
        holders: 2100,
        klineData: generateMockKlineData(),
        tags: ['environmental', 'sustainability', 'green'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setAssets(mockAssets);
  }, []);

  // 使用react-spring实现流畅的滑动动画
  const [{ y }, api] = useSpring(() => ({ y: 0 }));
  
  // 处理拖拽手势
  const bind = useDrag(
    ({ down, movement: [, my], direction: [, dir], velocity: [, vy], cancel }) => {
      // 如果拖拽速度超过阈值，自动滑动到下一个或上一个
      if (vy > 0.5 && !down) {
        const newIndex = dir > 0 
          ? Math.min(currentIndex + 1, assets.length - 1) 
          : Math.max(currentIndex - 1, 0);
          
        // 如果索引变化，更新当前资产
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
          setCurrentAsset(assets[newIndex]);
        }
        
        // 动画滑动到新位置
        api.start({ 
          y: -newIndex * window.innerHeight, 
          immediate: false,
          config: { tension: 200, friction: 30 }
        });
        return;
      }
      
      // 正在拖拽时，跟随手指移动
      if (down) {
        setIsSwiping(true);
        // 限制拖拽范围
        const minY = -(assets.length - 1) * window.innerHeight;
        const maxY = 0;
        const newY = Math.max(minY, Math.min(maxY, my));
        api.start({ y: newY, immediate: true });
      } else {
        setIsSwiping(false);
        // 松开手指时，自动吸附到最近的卡片
        const cardHeight = window.innerHeight;
        const closestIndex = Math.min(
          assets.length - 1,
          Math.max(0, Math.round(-y.get() / cardHeight))
        );
        
        setCurrentIndex(closestIndex);
        setCurrentAsset(assets[closestIndex]);
        
        api.start({ 
          y: -closestIndex * cardHeight,
          immediate: false,
          config: { tension: 200, friction: 30 }
        });
      }
    },
    { 
      axis: 'y',
      bounds: { top: -(assets.length - 1) * window.innerHeight, bottom: 0 },
      rubberband: true,
    }
  );
  
  // 监听窗口大小变化，调整位置
  useEffect(() => {
    const handleResize = () => {
      api.start({ 
        y: -currentIndex * window.innerHeight,
        immediate: true
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, api]);

  // 加载更多资产
  const loadMoreAssets = useCallback(async () => {
    if (isLoading || assets.length >= 20) return; // 限制最大加载数量
    
    setIsLoading(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 添加新的模拟资产
    const newAssets = generateMockAssets(assets.length, 5);
    setAssets([...assets, ...newAssets]);
    
    setIsLoading(false);
  }, [isLoading, assets, setAssets]);

  // 检测是否接近底部，加载更多内容
  useEffect(() => {
    if (currentIndex >= assets.length - 3 && !isLoading) {
      loadMoreAssets();
    }
  }, [currentIndex, assets.length, isLoading, loadMoreAssets]);

  return (
    <div 
      className="relative min-h-screen bg-dark-900 overflow-hidden touch-none" 
      ref={containerRef}
      style={{ height: '100vh' }}
    >
      <animated.div 
        {...bind()}
        style={{ 
          y,
          height: assets.length * window.innerHeight,
          position: 'absolute',
          width: '100%',
          willChange: 'transform',
          touchAction: 'none',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const asset = assets[virtualItem.index];
          if (!asset) return null;
          
          return (
            <div
              key={asset.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                transform: `translateY(${virtualItem.index * window.innerHeight}px)`,
              }}
            >
              <AssetCard 
                asset={asset} 
                isActive={virtualItem.index === currentIndex} 
                onLoadMore={loadMoreAssets} 
              />
              {virtualItem.index === currentIndex && (
                <DanmakuLayer assetId={asset.id} />
              )}
            </div>
          );
        })}
      </animated.div>
      
      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-50">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* 滑动提示 */}
      {currentIndex === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-50 animate-pulse pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">👆</span>
            <span>上滑查看更多资产</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 生成模拟资产数据
function generateMockAssets(startIndex: number, count: number) {
  const assets: Asset[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = `asset-${startIndex + i + 1}`;
    const randomPrice = Math.random() * 10 + 0.1; // 0.1 到 10.1 之间的随机价格
    
    assets.push({
      id,
      name: `Asset ${startIndex + i + 1}`,
      symbol: `AST${startIndex + i + 1}`,
      description: `这是一个示例资产 ${startIndex + i + 1}，用于演示滑动效果和K线图展示。`,
      creatorId: `creator-${i % 5 + 1}`,
      creator: {
        id: `creator-${i % 5 + 1}`,
        username: `Creator ${i % 5 + 1}`,
        avatar: `https://via.placeholder.com/40?text=C${i % 5 + 1}`,
        walletAddress: `mock-address-${i % 5 + 1}`,
        balance: { sol: 100 * (i % 5 + 1), usdc: 10000 * (i % 5 + 1) },
        level: (i % 5) + 1,
        experience: 1000 * (i % 5 + 1),
        achievements: [],
        createdAt: new Date(),
        lastActiveAt: new Date()
      },
      contractAddress: `mock-contract-${id}`,
      totalSupply: 1000000 * (i + 1),
      circulatingSupply: 500000 * (i + 1),
      price: randomPrice,
      priceChange24h: (Math.random() * 40) - 20, // -20% 到 +20% 的随机变化
      priceChange7d: (Math.random() * 80) - 40, // -40% 到 +40% 的随机变化
      marketCap: randomPrice * 500000 * (i + 1),
      volume24h: randomPrice * 50000 * (Math.random() + 0.5),
      liquidity: randomPrice * 100000 * (Math.random() + 0.5),
      holders: 500 + Math.floor(Math.random() * 5000),
      klineData: generateMockKlineData(),
      tags: ['defi', 'meme', 'gaming', 'nft', 'metaverse'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: 'active',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return assets;
}

// 模拟K线数据生成函数
function generateMockKlineData() {
  const data = [];
  const now = Date.now();
  let price = 1 + Math.random() * 10;
  
  for (let i = 0; i < 100; i++) {
    const timestamp = now - (100 - i) * 60000; // 每分钟一个数据点
    const change = (Math.random() - 0.5) * 0.1;
    price = price * (1 + change);
    
    data.push({
      timestamp,
      open: price,
      high: price * (1 + Math.random() * 0.05),
      low: price * (1 - Math.random() * 0.05),
      close: price,
      volume: Math.random() * 1000000
    });
  }
  
  return data;
}