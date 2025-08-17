import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { User, Achievement } from '@/types';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user } = useAppStore();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'assets' | 'trades'>('overview');

  useEffect(() => {
    // 模拟用户数据
    const mockUser: User = {
      id: userId || 'current-user',
      username: userId ? '其他用户' : '我',
      avatar: 'https://via.placeholder.com/100',
      walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      balance: { sol: 10.5, usdc: 1000 },
      level: 5,
      experience: 2500,
      achievements: [
        {
          id: 'first-trade',
          name: '首次交易',
          description: '完成第一笔交易',
          icon: '🎯',
          unlockedAt: new Date('2024-01-01'),
          rarity: 'common'
        },
        {
          id: 'profit-master',
          name: '盈利大师',
          description: '单日盈利超过1000美元',
          icon: '💰',
          unlockedAt: new Date('2024-01-15'),
          rarity: 'rare'
        }
      ],
      createdAt: new Date('2024-01-01'),
      lastActiveAt: new Date()
    };

    setProfileUser(mockUser);
  }, [userId]);

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-16 pb-20">
      <div className="container mx-auto px-4">
        {/* 用户信息卡片 */}
        <div className="bg-dark-800 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={profileUser.avatar}
              alt={profileUser.username}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{profileUser.username}</h1>
              <p className="text-gray-400">Lv.{profileUser.level} • {profileUser.experience} 经验</p>
              <p className="text-sm text-gray-500">{profileUser.walletAddress.slice(0, 8)}...{profileUser.walletAddress.slice(-8)}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                ${profileUser.balance.usdc.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {profileUser.balance.sol.toFixed(4)} SOL
              </div>
            </div>
          </div>

          {/* 等级进度条 */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>经验值</span>
              <span>{profileUser.experience} / {(profileUser.level + 1) * 1000}</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(profileUser.experience % 1000) / 10}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex bg-dark-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            成就
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'assets'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            资产
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'trades'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            交易
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="bg-dark-800 rounded-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">统计概览</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">总交易次数</div>
                  <div className="text-2xl font-bold text-white">156</div>
                </div>
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">总盈利</div>
                  <div className="text-2xl font-bold text-success">+$12,450</div>
                </div>
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">发行资产</div>
                  <div className="text-2xl font-bold text-white">3</div>
                </div>
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">加入天数</div>
                  <div className="text-2xl font-bold text-white">45</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">成就徽章</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {profileUser.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-dark-700 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h3 className="text-white font-semibold mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      achievement.rarity === 'common' ? 'bg-gray-600 text-white' :
                      achievement.rarity === 'rare' ? 'bg-blue-600 text-white' :
                      achievement.rarity === 'epic' ? 'bg-purple-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">我的资产</h2>
              
              <div className="space-y-4">
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">M</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">MoonDoge</h3>
                        <p className="text-sm text-gray-400">MDOGE</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">1,000,000</div>
                      <div className="text-sm text-success">+$2,450</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trades' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">最近交易</h2>
              
              <div className="space-y-4">
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">买入 MDOGE</h3>
                      <p className="text-sm text-gray-400">2024-01-15 14:30</p>
                    </div>
                    <div className="text-right">
                      <div className="text-success font-semibold">+1,000 MDOGE</div>
                      <div className="text-sm text-gray-400">$500</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">卖出 TECH</h3>
                      <p className="text-sm text-gray-400">2024-01-14 09:15</p>
                    </div>
                    <div className="text-right">
                      <div className="text-danger font-semibold">-500 TECH</div>
                      <div className="text-sm text-gray-400">$1,250</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 