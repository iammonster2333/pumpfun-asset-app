import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { motion } from 'framer-motion';
import { FaDiscord, FaTelegram, FaTwitter, FaGlobe } from 'react-icons/fa';
import { Asset } from '@/types';

export const AssetPage: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const { assets, currentAsset, setCurrentAsset, addDanmaku } = useAppStore();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chart');
  const [comment, setComment] = useState('');
  
  // 模拟社区数据
  const [communityData, setCommunityData] = useState({
    members: 1245,
    posts: 78,
    events: [
      { id: 1, title: 'AMA 直播', date: '2023-06-15 20:00', participants: 156 },
      { id: 2, title: '社区空投活动', date: '2023-06-20 12:00', participants: 432 },
      { id: 3, title: '开发路线图讨论', date: '2023-06-25 19:00', participants: 89 }
    ],
    announcements: [
      { id: 1, title: '重要更新：V2版本即将发布', date: '2023-06-10', content: '我们很高兴地宣布，V2版本将在下周发布，带来更多激动人心的功能...' },
      { id: 2, title: '合作伙伴关系公告', date: '2023-06-05', content: '我们已与XYZ公司建立战略合作伙伴关系，共同推动...' }
    ]
  });
  
  // 模拟评论数据
  const [comments, setComments] = useState([
    { id: 1, userId: 'user1', username: '加密爱好者', avatar: 'https://avatars.dicebear.com/api/avataaars/user1.svg', content: '这个项目非常有潜力，团队很专业！', timestamp: Date.now() - 3600000, likes: 24 },
    { id: 2, userId: 'user2', username: '区块链分析师', avatar: 'https://avatars.dicebear.com/api/avataaars/user2.svg', content: '我对这个代币的经济模型很感兴趣，希望能看到更多技术细节。', timestamp: Date.now() - 7200000, likes: 15 },
    { id: 3, userId: 'user3', username: 'Web3探索者', avatar: 'https://avatars.dicebear.com/api/avataaars/user3.svg', content: '刚刚买了一些，期待价格上涨！🚀', timestamp: Date.now() - 10800000, likes: 32 }
  ]);

  useEffect(() => {
    if (assetId) {
      // 从store中查找资产
      const foundAsset = assets.find(a => a.id === assetId);
      if (foundAsset) {
        setAsset(foundAsset);
        setCurrentAsset(foundAsset);
      } else {
        // 模拟API调用获取资产详情
        setTimeout(() => {
          const mockAsset: Asset = {
            id: assetId,
            name: 'Mock Asset',
            symbol: 'MOCK',
            description: '这是一个模拟资产，用于演示目的。',
            creatorId: 'creator-1',
            creator: {
              id: 'creator-1',
              username: 'Mock Creator',
              avatar: 'https://avatars.dicebear.com/api/avataaars/creator1.svg',
              walletAddress: 'mock-address',
              balance: { sol: 0, usdc: 0 },
              level: 1,
              experience: 0,
              achievements: [],
              createdAt: new Date(),
              lastActiveAt: new Date()
            },
            website: 'https://example.com',
            twitter: '@mockasset',
            telegram: 't.me/mockasset',
            discord: 'discord.gg/mockasset',
            contractAddress: 'mock-contract',
            totalSupply: 1000000,
            circulatingSupply: 500000,
            price: 1.0,
            priceChange24h: 5.2,
            priceChange7d: 15.8,
            marketCap: 500000,
            volume24h: 50000,
            liquidity: 100000,
            holders: 500,
            klineData: [],
            tags: ['mock', 'demo'],
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setAsset(mockAsset);
          setCurrentAsset(mockAsset);
        }, 1000);
      }
      setIsLoading(false);
    }
  }, [assetId, assets]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">加载资产信息...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">资产未找到</h2>
          <p className="text-gray-400">抱歉，找不到该资产的信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-16 pb-20">
      <div className="container mx-auto px-4">
        {/* 资产头部信息 */}
        <div className="bg-dark-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {asset.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
                <p className="text-lg text-gray-400">{asset.symbol}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                ${asset.price.toFixed(4)}
              </div>
              <div className={`text-lg font-semibold ${
                asset.priceChange24h >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
              </div>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            {asset.description}
          </p>

          {/* 关键指标网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">市值</div>
              <div className="text-lg font-semibold text-white">
                ${(asset.marketCap / 1000000).toFixed(2)}M
              </div>
            </div>
            
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">24h成交量</div>
              <div className="text-lg font-semibold text-white">
                ${(asset.volume24h / 1000).toFixed(1)}K
              </div>
            </div>
            
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">流动性</div>
              <div className="text-lg font-semibold text-white">
                ${(asset.liquidity / 1000).toFixed(1)}K
              </div>
            </div>
            
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">持有人数</div>
              <div className="text-lg font-semibold text-white">
                {asset.holders.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 交易按钮 */}
        <div className="flex space-x-4 mb-6">
          <button className="flex-1 btn btn-success btn-lg">
            买入 {asset.symbol}
          </button>
          <button className="flex-1 btn btn-danger btn-lg">
            卖出 {asset.symbol}
          </button>
        </div>

        {/* 资产详情标签页 */}
        <div className="bg-dark-800 rounded-lg">
          <div className="border-b border-dark-700">
            <div className="flex overflow-x-auto">
              <button 
                className={`flex-1 py-4 px-6 ${activeTab === 'chart' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('chart')}
              >
                图表
              </button>
              <button 
                className={`flex-1 py-4 px-6 ${activeTab === 'trades' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('trades')}
              >
                交易历史
              </button>
              <button 
                className={`flex-1 py-4 px-6 ${activeTab === 'holders' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('holders')}
              >
                持有人
              </button>
              <button 
                className={`flex-1 py-4 px-6 ${activeTab === 'info' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('info')}
              >
                信息
              </button>
              <button 
                className={`flex-1 py-4 px-6 ${activeTab === 'community' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('community')}
              >
                社区
              </button>
              <button 
                className={`flex-1 py-4 px-6 ${activeTab === 'comments' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('comments')}
              >
                评论
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* 图表标签页 */}
            {activeTab === 'chart' && (
              <div className="h-64 bg-dark-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">K线图表将在这里显示</p>
              </div>
            )}
            
            {/* 交易历史标签页 */}
            {activeTab === 'trades' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">最近交易</h3>
                <div className="bg-dark-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">时间</th>
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">类型</th>
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">价格</th>
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">数量</th>
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">交易者</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="border-b border-dark-600 last:border-0">
                          <td className="py-3 px-4 text-white">{new Date(Date.now() - index * 600000).toLocaleTimeString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${index % 2 === 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                              {index % 2 === 0 ? '买入' : '卖出'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">${(asset.price * (1 + (Math.random() * 0.02 - 0.01))).toFixed(4)}</td>
                          <td className="py-3 px-4 text-white">{Math.floor(Math.random() * 1000)}</td>
                          <td className="py-3 px-4 text-blue-400">0x{Math.random().toString(16).substring(2, 10)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* 持有人标签页 */}
            {activeTab === 'holders' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">持有人排行</h3>
                <div className="bg-dark-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">排名</th>
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">地址</th>
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">持有量</th>
                        <th className="py-3 px-4 text-left text-gray-400 font-medium">占比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }).map((_, index) => {
                        const holdingAmount = Math.floor(asset.totalSupply * (0.2 - index * 0.03));
                        const percentage = (holdingAmount / asset.totalSupply * 100).toFixed(2);
                        return (
                          <tr key={index} className="border-b border-dark-600 last:border-0">
                            <td className="py-3 px-4 text-white">#{index + 1}</td>
                            <td className="py-3 px-4 text-blue-400">0x{Math.random().toString(16).substring(2, 10)}...</td>
                            <td className="py-3 px-4 text-white">{holdingAmount.toLocaleString()}</td>
                            <td className="py-3 px-4 text-white">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* 信息标签页 */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">资产信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-dark-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">合约地址</div>
                      <div className="text-white break-all">{asset.contractAddress}</div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">创建者</div>
                      <div className="text-white flex items-center">
                        <img src={asset.creator.avatar} alt="Creator" className="w-6 h-6 rounded-full mr-2" />
                        {asset.creator.username}
                      </div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">创建时间</div>
                      <div className="text-white">{asset.createdAt.toLocaleDateString()}</div>
                    </div>
                    <div className="bg-dark-700 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">总供应量</div>
                      <div className="text-white">{asset.totalSupply.toLocaleString()} {asset.symbol}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">社交链接</h3>
                  <div className="flex flex-wrap gap-4">
                    {asset.website && (
                      <a href={asset.website} target="_blank" rel="noopener noreferrer" className="flex items-center bg-dark-700 hover:bg-dark-600 rounded-lg px-4 py-3 text-white transition-colors">
                        <FaGlobe className="mr-2" /> 网站
                      </a>
                    )}
                    {asset.twitter && (
                      <a href={`https://twitter.com/${asset.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-dark-700 hover:bg-dark-600 rounded-lg px-4 py-3 text-white transition-colors">
                        <FaTwitter className="mr-2 text-blue-400" /> Twitter
                      </a>
                    )}
                    {asset.telegram && (
                      <a href={`https://t.me/${asset.telegram.replace('t.me/', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-dark-700 hover:bg-dark-600 rounded-lg px-4 py-3 text-white transition-colors">
                        <FaTelegram className="mr-2 text-blue-500" /> Telegram
                      </a>
                    )}
                    {asset.discord && (
                      <a href={`https://discord.gg/${asset.discord.replace('discord.gg/', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-dark-700 hover:bg-dark-600 rounded-lg px-4 py-3 text-white transition-colors">
                        <FaDiscord className="mr-2 text-indigo-400" /> Discord
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* 社区标签页 */}
            {activeTab === 'community' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-dark-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{communityData.members}</div>
                    <div className="text-gray-400">社区成员</div>
                  </div>
                  <div className="bg-dark-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{communityData.posts}</div>
                    <div className="text-gray-400">社区帖子</div>
                  </div>
                  <div className="bg-dark-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{communityData.events.length}</div>
                    <div className="text-gray-400">即将举行的活动</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">公告</h3>
                  <div className="space-y-4">
                    {communityData.announcements.map(announcement => (
                      <motion.div 
                        key={announcement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-dark-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-white">{announcement.title}</h4>
                          <span className="text-sm text-gray-400">{announcement.date}</span>
                        </div>
                        <p className="text-gray-300">{announcement.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">即将举行的活动</h3>
                  <div className="space-y-4">
                    {communityData.events.map(event => (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-dark-700 rounded-lg p-4 border-l-4 border-blue-500"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                          <span className="text-sm text-gray-400">{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <span className="mr-2">参与人数: {event.participants}</span>
                          <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                            参与
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* 评论标签页 */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">评论 ({comments.length})</h3>
                
                {/* 评论输入框 */}
                <div className="bg-dark-700 rounded-lg p-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="分享你的想法..."
                    className="w-full bg-dark-600 border border-dark-500 rounded-md px-4 py-2 text-white min-h-[80px] mb-3"
                  />
                  <div className="flex justify-end">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                      onClick={() => {
                        if (comment.trim()) {
                          // 添加新评论
                          const newComment = {
                            id: Date.now(),
                            userId: 'current-user',
                            username: '当前用户',
                            avatar: 'https://avatars.dicebear.com/api/avataaars/currentuser.svg',
                            content: comment,
                            timestamp: Date.now(),
                            likes: 0
                          };
                          setComments([newComment, ...comments]);
                          setComment('');
                          
                          // 同时发送一条弹幕
                          addDanmaku({
                            id: `danmaku-${Date.now()}`,
                            assetId: asset.id,
                            userId: 'current-user',
                            username: '当前用户',
                            content: comment,
                            timestamp: Date.now(),
                            color: '#ffffff',
                            fontSize: 16,
                            fontWeight: 'normal',
                            position: Math.floor(Math.random() * 80) + 10,
                            type: 'normal'
                          });
                        }
                      }}
                    >
                      发布评论
                    </button>
                  </div>
                </div>
                
                {/* 评论列表 */}
                <div className="space-y-4">
                  {comments.map(comment => (
                    <motion.div 
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-dark-700 rounded-lg p-4"
                    >
                      <div className="flex items-start">
                        <img src={comment.avatar} alt={comment.username} className="w-10 h-10 rounded-full mr-3" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-white">{comment.username}</span>
                            <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-gray-300 mb-2">{comment.content}</p>
                          <div className="flex items-center text-sm text-gray-400">
                            <button className="flex items-center hover:text-blue-400 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              {comment.likes}
                            </button>
                            <button className="flex items-center ml-4 hover:text-blue-400 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              回复
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};