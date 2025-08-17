import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Leaderboard, LeaderboardEntry, Asset } from '@/types';
import { motion } from 'framer-motion';
import { FaFire, FaChartLine, FaUsers, FaRocket, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { KlineChart } from '@/components/KlineChart';

export const LeaderboardPage: React.FC = () => {
  const { user, assets } = useAppStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activeCategory, setActiveCategory] = useState<'traders' | 'assets' | 'trending'>('traders');
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [trendingAssets, setTrendingAssets] = useState<Asset[]>([]);
  const [hotAssets, setHotAssets] = useState<Asset[]>([]);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    // 模拟生成热门资产数据
    const generateHotAssets = () => {
      // 假设我们有一些资产数据
      const mockAssets: Asset[] = Array(10).fill(null).map((_, index) => ({
        id: `asset-${index + 1}`,
        name: `热门资产 ${index + 1}`,
        symbol: `HOT${index + 1}`,
        description: `这是一个热门资产示例 ${index + 1}`,
        creatorId: `user-${index % 5 + 1}`,
        creator: {
          id: `user-${index % 5 + 1}`,
          username: `创建者 ${index % 5 + 1}`,
          avatar: `https://via.placeholder.com/40?text=${index % 5 + 1}`,
          walletAddress: `mock-address-${index % 5 + 1}`,
          balance: { sol: 100 - index, usdc: 10000 - index * 100 },
          level: 10 - (index % 5),
          experience: 5000 - index * 100,
          achievements: [],
          createdAt: new Date(),
          lastActiveAt: new Date()
        },
        contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        totalSupply: 1000000 - index * 10000,
        circulatingSupply: 800000 - index * 8000,
        price: 10 - index * 0.5,
        priceChange24h: (Math.random() * 20) - 10,
        priceChange7d: (Math.random() * 40) - 20,
        marketCap: (10 - index * 0.5) * (800000 - index * 8000),
        volume24h: Math.random() * 1000000,
        liquidity: Math.random() * 500000,
        holders: Math.floor(Math.random() * 10000),
        klineData: Array(24).fill(null).map((_, i) => ({
          timestamp: Date.now() - (23 - i) * 3600000,
          open: 10 - index * 0.5 + Math.random() * 2 - 1,
          high: 10 - index * 0.5 + Math.random() * 3,
          low: 10 - index * 0.5 - Math.random() * 3,
          close: 10 - index * 0.5 + Math.random() * 2 - 1,
          volume: Math.random() * 100000
        })),
        tags: ['热门', '新上线', '高波动'],
        status: 'active' as const,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 3600000),
        updatedAt: new Date(),
        website: `https://example${index}.com`,
        twitter: `https://twitter.com/asset${index}`,
        telegram: `https://t.me/asset${index}`,
        discord: `https://discord.gg/asset${index}`,
        whitepaper: `https://example${index}.com/whitepaper.pdf`
      }));
      
      // 按交易量排序
      return mockAssets.sort((a, b) => b.volume24h - a.volume24h);
    };
    
    // 模拟生成趋势资产数据
    const generateTrendingAssets = () => {
      // 假设我们有一些资产数据
      const mockAssets: Asset[] = Array(10).fill(null).map((_, index) => ({
        id: `trending-${index + 1}`,
        name: `趋势资产 ${index + 1}`,
        symbol: `TREND${index + 1}`,
        description: `这是一个趋势资产示例 ${index + 1}`,
        creatorId: `user-${index % 5 + 1}`,
        creator: {
          id: `user-${index % 5 + 1}`,
          username: `创建者 ${index % 5 + 1}`,
          avatar: `https://via.placeholder.com/40?text=${index % 5 + 1}`,
          walletAddress: `mock-address-${index % 5 + 1}`,
          balance: { sol: 100 - index, usdc: 10000 - index * 100 },
          level: 10 - (index % 5),
          experience: 5000 - index * 100,
          achievements: [],
          createdAt: new Date(),
          lastActiveAt: new Date()
        },
        contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        totalSupply: 1000000 - index * 10000,
        circulatingSupply: 800000 - index * 8000,
        price: 5 + index * 0.5,
        priceChange24h: 10 + Math.random() * 40,  // 趋势资产价格变化较大
        priceChange7d: 20 + Math.random() * 80,
        marketCap: (5 + index * 0.5) * (800000 - index * 8000),
        volume24h: Math.random() * 1000000,
        liquidity: Math.random() * 500000,
        holders: Math.floor(Math.random() * 10000),
        klineData: Array(24).fill(null).map((_, i) => ({
          timestamp: Date.now() - (23 - i) * 3600000,
          open: 5 + index * 0.5 - Math.random() * 2,
          high: 5 + index * 0.5 + Math.random() * 3,
          low: 5 + index * 0.5 - Math.random() * 1,
          close: 5 + index * 0.5 + Math.random() * 2,  // 趋势向上
          volume: Math.random() * 100000 + 50000
        })),
        tags: ['趋势', '爆发', '高增长'],
        status: 'active' as const,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 3600000),
        updatedAt: new Date(),
        website: `https://trend${index}.com`,
        twitter: `https://twitter.com/trend${index}`,
        telegram: `https://t.me/trend${index}`,
        discord: `https://discord.gg/trend${index}`,
        whitepaper: `https://trend${index}.com/whitepaper.pdf`
      }));
      
      // 按价格变化排序
      return mockAssets.sort((a, b) => b.priceChange24h - a.priceChange24h);
    };
    
    // 设置热门和趋势资产
    setHotAssets(generateHotAssets());
    setTrendingAssets(generateTrendingAssets());
    
    // 模拟排行榜数据
    const mockLeaderboards: Leaderboard[] = [
      {
        id: 'daily-profit',
        type: 'daily_profit',
        period: 'daily',
        entries: [
          {
            rank: 1,
            userId: 'user-1',
            user: {
              id: 'user-1',
              username: '交易大师',
              avatar: 'https://via.placeholder.com/40',
              walletAddress: 'mock-address-1',
              balance: { sol: 100, usdc: 10000 },
              level: 10,
              experience: 5000,
              achievements: [],
              createdAt: new Date(),
              lastActiveAt: new Date()
            },
            value: 15420.50,
            change: 12.5
          },
          {
            rank: 2,
            userId: 'user-2',
            user: {
              id: 'user-2',
              username: '币圈老手',
              avatar: 'https://via.placeholder.com/40',
              walletAddress: 'mock-address-2',
              balance: { sol: 80, usdc: 8000 },
              level: 8,
              experience: 4000,
              achievements: [],
              createdAt: new Date(),
              lastActiveAt: new Date()
            },
            value: 12350.75,
            change: 8.3
          },
          {
            rank: 3,
            userId: 'user-3',
            user: {
              id: 'user-3',
              username: '新手小白',
              avatar: 'https://via.placeholder.com/40',
              walletAddress: 'mock-address-3',
              balance: { sol: 50, usdc: 5000 },
              level: 5,
              experience: 2000,
              achievements: [],
              createdAt: new Date(),
              lastActiveAt: new Date()
            },
            value: 9875.25,
            change: 15.7
          }
        ],
        updatedAt: new Date()
      }
    ];

    setLeaderboards(mockLeaderboards);
  }, []);

  const currentLeaderboard = leaderboards.find(lb => lb.period === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-16 pb-20">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">排行榜</h1>
          <p className="text-gray-400">发现最热门的资产和交易者</p>
        </div>

        {/* 类别切换 */}
        <div className="flex bg-dark-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveCategory('traders')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              activeCategory === 'traders'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <FaUsers className="mr-2" /> 交易者
          </button>
          <button
            onClick={() => setActiveCategory('assets')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              activeCategory === 'assets'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <FaFire className="mr-2" /> 热门资产
          </button>
          <button
            onClick={() => setActiveCategory('trending')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              activeCategory === 'trending'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <FaChartLine className="mr-2" /> 趋势发现
          </button>
        </div>

        {/* 时间周期切换 - 仅在交易者类别时显示 */}
        {activeCategory === 'traders' && (
          <div className="flex bg-dark-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              日榜
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'weekly'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              周榜
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              月榜
            </button>
          </div>
        )}
        
        {/* 资产时间周期切换 - 仅在资产或趋势类别时显示 */}
        {(activeCategory === 'assets' || activeCategory === 'trending') && (
          <div className="flex bg-dark-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setTimeframe('1h')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                timeframe === '1h'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              1小时
            </button>
            <button
              onClick={() => setTimeframe('24h')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                timeframe === '24h'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              24小时
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                timeframe === '7d'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              7天
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                timeframe === '30d'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              30天
            </button>
          </div>
        )}

        {/* 交易者排行榜 */}
        {activeCategory === 'traders' && (
          <div className="bg-dark-800 rounded-lg overflow-hidden">
            {currentLeaderboard?.entries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center p-4 border-b border-dark-700 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/10' :
                  index === 2 ? 'bg-gradient-to-r from-orange-600/10 to-orange-700/10' :
                  'hover:bg-dark-700/50'
                } transition-colors`}
              >
                {/* 排名 */}
                <div className="w-12 h-12 flex items-center justify-center mr-4">
                  {index === 0 && (
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🥇</span>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🥈</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🥉</span>
                    </div>
                  )}
                  {index > 2 && (
                    <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 font-bold">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* 用户信息 */}
                <div className="flex-1 flex items-center">
                  <img
                    src={entry.user.avatar}
                    alt={entry.user.username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{entry.user.username}</h3>
                    <p className="text-sm text-gray-400">Lv.{entry.user.level}</p>
                  </div>
                </div>

                {/* 盈利数据 */}
                <div className="text-right">
                  <div className="text-lg font-bold text-success">
                    +${entry.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-success">
                    +{entry.change}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 热门资产排行榜 */}
        {activeCategory === 'assets' && (
          <div className="bg-dark-800 rounded-lg overflow-hidden">
            {hotAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center p-4 border-b border-dark-700 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/10' :
                  index === 2 ? 'bg-gradient-to-r from-orange-600/10 to-orange-700/10' :
                  'hover:bg-dark-700/50'
                } transition-colors`}
              >
                {/* 排名 */}
                <div className="w-12 h-12 flex items-center justify-center mr-4">
                  {index === 0 && (
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🥇</span>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🥈</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🥉</span>
                    </div>
                  )}
                  {index > 2 && (
                    <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 font-bold">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* 资产信息 */}
                <div className="flex-1 flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{asset.symbol.substring(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{asset.name}</h3>
                    <p className="text-sm text-gray-400">{asset.symbol}</p>
                  </div>
                </div>

                {/* 迷你K线图 */}
                <div className="w-24 h-16 mx-2">
                  <KlineChart 
                    data={asset.klineData} 
                    height={60} 
                    showVolume={false} 
                    timeframe={timeframe}
                  />
                </div>

                {/* 价格数据 */}
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ${asset.price.toFixed(4)}
                  </div>
                  <div className={`text-sm flex items-center justify-end ${
                    timeframe === '1h' ? 
                      (asset.priceChange24h >= 0 ? 'text-success' : 'text-danger') :
                    timeframe === '7d' ? 
                      (asset.priceChange7d >= 0 ? 'text-success' : 'text-danger') :
                    timeframe === '30d' ? 
                      (asset.priceChange7d >= 0 ? 'text-success' : 'text-danger') :
                      (asset.priceChange24h >= 0 ? 'text-success' : 'text-danger')
                  }`}>
                    {timeframe === '1h' ? 
                      (asset.priceChange24h >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />) :
                    timeframe === '7d' ? 
                      (asset.priceChange7d >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />) :
                    timeframe === '30d' ? 
                      (asset.priceChange7d >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />) :
                      (asset.priceChange24h >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />)
                    }
                    {timeframe === '1h' ? 
                      `${Math.abs(asset.priceChange24h / 24).toFixed(2)}%` :
                    timeframe === '7d' ? 
                      `${Math.abs(asset.priceChange7d).toFixed(2)}%` :
                    timeframe === '30d' ? 
                      `${Math.abs(asset.priceChange7d * 4).toFixed(2)}%` :
                      `${Math.abs(asset.priceChange24h).toFixed(2)}%`
                    }
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 趋势发现 */}
        {activeCategory === 'trending' && (
          <div className="bg-dark-800 rounded-lg overflow-hidden">
            {trendingAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-col p-4 border-b border-dark-700 hover:bg-dark-700/50 transition-colors"
              >
                <div className="flex items-center mb-3">
                  {/* 资产信息 */}
                  <div className="flex-1 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{asset.symbol.substring(0, 2)}</span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-white font-semibold mr-2">{asset.name}</h3>
                        <span className="bg-success/20 text-success text-xs px-2 py-0.5 rounded-full flex items-center">
                          <FaRocket className="mr-1" size={10} /> 趋势
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{asset.symbol}</p>
                    </div>
                  </div>

                  {/* 价格数据 */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      ${asset.price.toFixed(4)}
                    </div>
                    <div className="text-sm text-success flex items-center justify-end">
                      <FaArrowUp className="mr-1" />
                      {timeframe === '1h' ? 
                        `${(asset.priceChange24h / 24).toFixed(2)}%` :
                      timeframe === '7d' ? 
                        `${asset.priceChange7d.toFixed(2)}%` :
                      timeframe === '30d' ? 
                        `${(asset.priceChange7d * 4).toFixed(2)}%` :
                        `${asset.priceChange24h.toFixed(2)}%`
                      }
                    </div>
                  </div>
                </div>

                {/* K线图 */}
                <div className="w-full h-32 mt-2">
                  <KlineChart 
                    data={asset.klineData} 
                    height={120} 
                    showVolume={true} 
                    timeframe={timeframe}
                  />
                </div>

                {/* 趋势标签 */}
                <div className="flex mt-3 flex-wrap">
                  {asset.tags.map((tag, i) => (
                    <span key={i} className="bg-dark-700 text-gray-300 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                      #{tag}
                    </span>
                  ))}
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mr-2 mb-1">
                    #交易量{Math.floor(Math.random() * 100) + 20}%↑
                  </span>
                  <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full mr-2 mb-1">
                    #持有人{Math.floor(Math.random() * 50) + 10}%↑
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 我的排名 - 仅在交易者类别时显示 */}
        {user && activeCategory === 'traders' && (
          <div className="mt-6 bg-dark-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">我的排名</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">我</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{user.username}</h4>
                  <p className="text-sm text-gray-400">Lv.{user.level}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">第 15 名</div>
                <div className="text-sm text-gray-400">+$2,450.75</div>
              </div>
            </div>
          </div>
        )}

        {/* 趋势分析 - 仅在趋势类别时显示 */}
        {activeCategory === 'trending' && (
          <div className="mt-6 bg-dark-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">趋势分析</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <FaFire className="text-primary mr-2" />
                  <h4 className="text-white font-medium">热门标签</h4>
                </div>
                <div className="flex flex-wrap">
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mr-2 mb-2">#DeFi</span>
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mr-2 mb-2">#GameFi</span>
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mr-2 mb-2">#NFT</span>
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mr-2 mb-2">#Meme</span>
                  <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mr-2 mb-2">#AI</span>
                </div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <FaChartLine className="text-success mr-2" />
                  <h4 className="text-white font-medium">增长最快</h4>
                </div>
                <div className="text-sm text-gray-300">
                  <div className="flex justify-between items-center mb-1">
                    <span>TREND1</span>
                    <span className="text-success">+87.5%</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span>TREND3</span>
                    <span className="text-success">+65.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>TREND5</span>
                    <span className="text-success">+52.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 热门资产分析 - 仅在热门资产类别时显示 */}
        {activeCategory === 'assets' && (
          <div className="mt-6 bg-dark-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">市场概览</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-gray-400 text-sm mb-1">总交易量 (24h)</div>
                <div className="text-white text-xl font-bold">$24,567,890</div>
                <div className="text-success text-sm">+12.5% ↑</div>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="text-gray-400 text-sm mb-1">活跃资产数</div>
                <div className="text-white text-xl font-bold">1,234</div>
                <div className="text-success text-sm">+5.2% ↑</div>
              </div>
            </div>
            <div className="bg-dark-700 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <FaFire className="text-primary mr-2" />
                <h4 className="text-white font-medium">交易量分布</h4>
              </div>
              <div className="flex h-8 rounded-lg overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '35%' }}></div>
                <div className="bg-success h-full" style={{ width: '25%' }}></div>
                <div className="bg-warning h-full" style={{ width: '20%' }}></div>
                <div className="bg-danger h-full" style={{ width: '10%' }}></div>
                <div className="bg-gray-600 h-full" style={{ width: '10%' }}></div>
              </div>
              <div className="flex text-xs mt-2 text-gray-400 justify-between">
                <span>DeFi 35%</span>
                <span>GameFi 25%</span>
                <span>NFT 20%</span>
                <span>其他 20%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};