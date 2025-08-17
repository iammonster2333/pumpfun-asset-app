import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/components/WalletProvider';
import { useAppStore } from '@/stores/useAppStore';
import { motion } from 'framer-motion';

export const CreateAssetPage: React.FC = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const { addAsset } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    totalSupply: '',
    initialPrice: '',
    tags: '',
    initialLiquidity: '',
    category: 'crypto', // 默认类别
    logo: '',
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
    whitepaper: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.connected) {
      alert('请先连接钱包');
      return;
    }

    setIsLoading(true);
    
    try {
      // 模拟资产创建过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newAsset = {
        id: `asset-${Date.now()}`,
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        description: formData.description,
        creatorId: 'current-user',
        creator: {
          id: 'current-user',
          username: '我',
          avatar: 'https://via.placeholder.com/40',
          walletAddress: wallet.address || '',
          balance: wallet.balance || { sol: 0, usdc: 0 },
          level: 1,
          experience: 0,
          achievements: [],
          createdAt: new Date(),
          lastActiveAt: new Date()
        },
        contractAddress: `contract-${Date.now()}`,
        totalSupply: parseFloat(formData.totalSupply),
        circulatingSupply: parseFloat(formData.totalSupply) * 0.1, // 10% 流通
        price: parseFloat(formData.initialPrice),
        priceChange24h: 0,
        priceChange7d: 0,
        marketCap: parseFloat(formData.totalSupply) * parseFloat(formData.initialPrice),
        volume24h: 0,
        liquidity: parseFloat(formData.initialLiquidity),
        holders: 1,
        klineData: [],
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      addAsset(newAsset);
      alert('资产创建成功！');
      navigate(`/asset/${newAsset.id}`);
      
    } catch (error) {
      alert('资产创建失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = formData.name && formData.symbol && formData.description;

  // 渲染资产预览
  const renderAssetPreview = () => {
    const previewAsset = {
      name: formData.name || '资产名称',
      symbol: formData.symbol.toUpperCase() || 'SYM',
      description: formData.description || '资产描述...',
      price: parseFloat(formData.initialPrice) || 1.0,
      priceChange24h: 0,
      logo: formData.logo || `https://avatars.dicebear.com/api/identicon/${formData.symbol || 'preview'}.svg`,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : ['标签1', '标签2'],
    };
    
    return (
      <div className="bg-dark-800 rounded-lg overflow-hidden shadow-lg">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center">
            <img src={previewAsset.logo} alt={previewAsset.name} className="w-12 h-12 rounded-full mr-3" />
            <div>
              <h3 className="text-xl font-bold text-white">{previewAsset.name}</h3>
              <p className="text-blue-100">{previewAsset.symbol}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">价格</p>
              <p className="text-xl font-bold text-white">${previewAsset.price.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">24h变化</p>
              <p className="text-green-500">+0.00%</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">描述</p>
            <p className="text-white">{previewAsset.description}</p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm mb-1">标签</p>
            <div className="flex flex-wrap gap-2">
              {previewAsset.tags.map((tag, index) => (
                <span key={index} className="bg-dark-700 text-blue-400 px-2 py-1 rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-16 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-dark-800 rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">发行新资产</h1>
            <p className="text-gray-400">创建您自己的数字资产，开始您的金融之旅</p>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-primary text-white' : 'bg-dark-700 text-gray-400'
              }`}>
                1
              </div>
              <div className={`w-16 h-0.5 ${
                step >= 2 ? 'bg-primary' : 'bg-dark-700'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-primary text-white' : 'bg-dark-700 text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        资产名称 *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="例如：MoonDoge"
                        className="w-full input bg-dark-700 border-0 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        代币符号 *
                      </label>
                      <input
                        type="text"
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        placeholder="例如：MDOGE"
                        className="w-full input bg-dark-700 border-0 text-white"
                        maxLength={10}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        资产描述 *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="描述您的资产愿景和用途..."
                        rows={4}
                        className="w-full input bg-dark-700 border-0 text-white resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        标签
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="例如：meme, community, defi (用逗号分隔)"
                        className="w-full input bg-dark-700 border-0 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        资产类别
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full input bg-dark-700 border-0 text-white"
                      >
                        <option value="crypto">加密货币</option>
                        <option value="defi">DeFi</option>
                        <option value="nft">NFT</option>
                        <option value="gamefi">GameFi</option>
                        <option value="metaverse">元宇宙</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!canProceed}
                      className="w-full btn btn-primary btn-lg"
                    >
                      下一步
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        总供应量 *
                      </label>
                      <input
                        type="number"
                        name="totalSupply"
                        value={formData.totalSupply}
                        onChange={handleInputChange}
                        placeholder="例如：1000000"
                        className="w-full input bg-dark-700 border-0 text-white"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        初始价格 (USD) *
                      </label>
                      <input
                        type="number"
                        name="initialPrice"
                        value={formData.initialPrice}
                        onChange={handleInputChange}
                        placeholder="例如：0.001"
                        className="w-full input bg-dark-700 border-0 text-white"
                        min="0.0001"
                        step="0.0001"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        初始流动性 (USDC) *
                      </label>
                      <input
                        type="number"
                        name="initialLiquidity"
                        value={formData.initialLiquidity}
                        onChange={handleInputChange}
                        placeholder="例如：1000"
                        className="w-full input bg-dark-700 border-0 text-white"
                        min="100"
                        required
                      />
                    </div>

                    {/* 费用说明 */}
                    <div className="bg-dark-700 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-white mb-2">发行费用</h3>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>智能合约部署</span>
                          <span>0.01 SOL</span>
                        </div>
                        <div className="flex justify-between">
                          <span>流动性注入</span>
                          <span>{formData.initialLiquidity ? `${formData.initialLiquidity} USDC` : '0 USDC'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>平台手续费</span>
                          <span>0.001 SOL</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 btn btn-secondary"
                      >
                        上一步
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || !formData.totalSupply || !formData.initialPrice || !formData.initialLiquidity}
                        className="flex-1 btn btn-success btn-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="loading-spinner w-4 h-4"></div>
                            <span>创建中...</span>
                          </div>
                        ) : (
                          '创建资产'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
            
            {/* 预览区域 */}
            <div>
              <div className="bg-dark-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">资产预览</h2>
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {previewMode ? '基本预览' : '详细预览'}
                  </button>
                </div>
                
                {previewMode ? (
                  <div className="aspect-[9/16] bg-dark-900 rounded-lg overflow-hidden">
                    <div className="h-full flex flex-col">
                      <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-center">
                          <img 
                            src={formData.logo || `https://avatars.dicebear.com/api/identicon/${formData.symbol || 'preview'}.svg`} 
                            alt="资产预览" 
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                          />
                          <h3 className="text-2xl font-bold text-white mb-1">{formData.name || '资产名称'}</h3>
                          <p className="text-blue-400 text-lg mb-4">${formData.symbol.toUpperCase() || 'SYM'}</p>
                          <p className="text-3xl font-bold text-white mb-2">${parseFloat(formData.initialPrice) || 0}</p>
                          <p className="text-green-500">+0.00%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  renderAssetPreview()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};