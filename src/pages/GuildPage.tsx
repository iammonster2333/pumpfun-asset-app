import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Guild, GuildMember } from '@/types';

export const GuildPage: React.FC = () => {
  const { guildId } = useParams<{ guildId?: string }>();
  const { user } = useAppStore();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'assets' | 'tasks'>('overview');

  useEffect(() => {
    // 模拟帮派数据
    const mockGuild: Guild = {
      id: guildId || 'guild-1',
      name: '财富联盟',
      description: '专注于价值投资的精英帮派，致力于发现和投资优质资产',
      avatar: 'https://via.placeholder.com/100',
      leaderId: 'leader-1',
      members: [
        {
          userId: 'leader-1',
          role: 'leader',
          joinedAt: new Date('2024-01-01'),
          contribution: 5000
        },
        {
          userId: 'member-1',
          role: 'officer',
          joinedAt: new Date('2024-01-05'),
          contribution: 3000
        },
        {
          userId: 'member-2',
          role: 'member',
          joinedAt: new Date('2024-01-10'),
          contribution: 1500
        }
      ],
      level: 8,
      experience: 7500,
      totalAssets: 15,
      totalValue: 250000,
      createdAt: new Date('2024-01-01')
    };

    setGuild(mockGuild);
  }, [guildId]);

  if (!guild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-16 pb-20">
      <div className="container mx-auto px-4">
        {/* 帮派信息卡片 */}
        <div className="bg-dark-800 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={guild.avatar}
              alt={guild.name}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{guild.name}</h1>
              <p className="text-gray-400">Lv.{guild.level} • {guild.members.length} 成员</p>
              <p className="text-sm text-gray-500">{guild.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                ${guild.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {guild.totalAssets} 个资产
              </div>
            </div>
          </div>

          {/* 帮派等级进度条 */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>帮派经验</span>
              <span>{guild.experience} / {(guild.level + 1) * 1000}</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(guild.experience % 1000) / 10}%` }}
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
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            成员
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
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            任务
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="bg-dark-800 rounded-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">帮派概览</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">总资产价值</div>
                  <div className="text-2xl font-bold text-white">${guild.totalValue.toLocaleString()}</div>
                </div>
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">成员数量</div>
                  <div className="text-2xl font-bold text-white">{guild.members.length}</div>
                </div>
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">发行资产</div>
                  <div className="text-2xl font-bold text-white">{guild.totalAssets}</div>
                </div>
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">成立天数</div>
                  <div className="text-2xl font-bold text-white">45</div>
                </div>
              </div>

              {/* 最近活动 */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">最近活动</h3>
                <div className="space-y-3">
                  <div className="bg-dark-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">新成员加入</p>
                        <p className="text-sm text-gray-400">用户123加入了帮派</p>
                      </div>
                      <span className="text-xs text-gray-500">2小时前</span>
                    </div>
                  </div>
                  <div className="bg-dark-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">资产发行</p>
                        <p className="text-sm text-gray-400">帮派发行了新资产 TECH</p>
                      </div>
                      <span className="text-xs text-gray-500">1天前</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">帮派成员</h2>
              
              <div className="space-y-4">
                {guild.members.map((member, index) => (
                  <div key={member.userId} className="bg-dark-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {member.role === 'leader' ? '👑' : 
                             member.role === 'officer' ? '⭐' : '👤'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            成员 {index + 1}
                            {member.role === 'leader' && <span className="text-yellow-500 ml-2">帮主</span>}
                            {member.role === 'officer' && <span className="text-blue-500 ml-2">官员</span>}
                          </h3>
                          <p className="text-sm text-gray-400">
                            贡献: ${member.contribution.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">帮派资产</h2>
              
              <div className="space-y-4">
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">M</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">MoonDoge</h3>
                        <p className="text-sm text-gray-400">帮派联合发行</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">$50,000</div>
                      <div className="text-sm text-success">+15.2%</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">T</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">TechToken</h3>
                        <p className="text-sm text-gray-400">技术投资</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">$75,000</div>
                      <div className="text-sm text-success">+8.7%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">帮派任务</h2>
              
              <div className="space-y-4">
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">周度投资目标</h3>
                    <span className="text-sm text-success">进行中</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    本周帮派总投资额达到 $100,000
                  </p>
                  <div className="w-full bg-dark-600 rounded-full h-2 mb-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>进度: 75%</span>
                    <span>$75,000 / $100,000</span>
                  </div>
                </div>
                
                <div className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">新成员招募</h3>
                    <span className="text-sm text-gray-400">已完成</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    招募3名新成员加入帮派
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 