import React, { useState, useEffect } from 'react';
import { Asset } from '@/types';
import { useWallet } from './WalletProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface TradePanelProps {
  asset: Asset;
  currentPrice: number;
  onClose: () => void;
  onSuccess?: (type: 'buy' | 'sell', amount: number, price: number) => void;
}

export const TradePanel: React.FC<TradePanelProps> = ({
  asset,
  currentPrice,
  onClose,
  onSuccess
}) => {
  const { wallet } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState<number>(0.5); // 滑点设置，默认0.5%
  const [leverage, setLeverage] = useState<number>(1); // 杠杆设置，默认1倍
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceImpact, setPriceImpact] = useState<number>(0);

  // 计算价格影响
  useEffect(() => {
    if (!asset || !amount || Number(amount) <= 0) {
      setPriceImpact(0);
      return;
    }
    
    // 模拟价格影响计算
    const amountValue = Number(amount);
    // 假设资产有流动性属性，这里模拟一个值
    const liquidity = 1000;
    const impact = (amountValue / liquidity) * 100;
    setPriceImpact(Math.min(impact, 10)); // 最大10%
  }, [amount, asset]);

  // 计算交易后的预估价格
  const calculateEstimatedPrice = () => {
    if (!asset || !amount || Number(amount) <= 0) return currentPrice;
    
    const impact = priceImpact / 100;
    
    if (tradeType === 'buy') {
      // 买入时价格上涨
      return currentPrice * (1 + impact);
    } else {
      // 卖出时价格下跌
      return currentPrice * (1 - impact);
    }
  };
  
  const handleTrade = async () => {
    if (!wallet.connected) {
      alert('请先连接钱包');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入有效的交易数量');
      return;
    }

    setIsLoading(true);
    
    try {
      // 模拟交易处理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const amountValue = parseFloat(amount);
      const estimatedPrice = calculateEstimatedPrice();
      const totalValue = amountValue * estimatedPrice;
      
      // 生成模拟交易哈希
      const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      alert(`${tradeType === 'buy' ? '买入' : '卖出'}成功！\n数量: ${amount} ${asset.symbol}${leverage > 1 ? ` (${leverage}x杠杆)` : ''}\n总价值: $${totalValue.toFixed(2)}`);
      
      // 回调
      onSuccess?.(tradeType, amountValue, estimatedPrice);
      onClose();
    } catch (error) {
      alert('交易失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const maxAmount = tradeType === 'buy' 
    ? ((wallet.balance?.usdc || 0) * leverage) / currentPrice
    : 1000; // 模拟持有数量

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-dark-800 rounded-lg p-6 max-w-sm mx-4 w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {tradeType === 'buy' ? '买入' : '卖出'} {asset.symbol}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* 资产信息 */}
        <div className="bg-dark-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">当前价格</span>
            <span className="text-white font-semibold">
              ${currentPrice.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">24h变化</span>
            <span className={`font-semibold ${
              asset.priceChange24h >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* 交易类型切换 */}
        <div className="flex bg-dark-700 rounded-lg p-1 mb-6">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tradeType === 'buy'
                ? 'bg-success text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            买入
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              tradeType === 'sell'
                ? 'bg-danger text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            卖出
          </button>
        </div>

        {/* 交易数量输入 */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              交易数量 ({asset.symbol})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full input bg-dark-700 border-0 text-white"
              step="0.0001"
              min="0"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>可用: {maxAmount.toFixed(4)} {asset.symbol}{leverage > 1 ? ` (${leverage}x杠杆)` : ''}</span>
              <button
                onClick={() => setAmount(maxAmount.toFixed(4))}
                className="text-primary hover:text-primary-300"
              >
                最大
              </button>
            </div>
          </div>

          {/* 高级选项切换 */}
          <div>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              高级选项 
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3 pt-3 border-t border-dark-600">
                    {/* 滑点设置 */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>滑点容忍度</span>
                        <span>{slippage}%</span>
                      </div>
                      <div className="flex space-x-2">
                        {[0.1, 0.5, 1.0, 2.0].map((value) => (
                          <button
                            key={value}
                            onClick={() => setSlippage(value)}
                            className={`flex-1 py-1 text-sm rounded ${slippage === value ? 'bg-blue-500 text-white' : 'bg-dark-700 text-gray-400'}`}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* 杠杆设置（仅买入时显示） */}
                    {tradeType === 'buy' && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>杠杆倍数</span>
                          <span>{leverage}x</span>
                        </div>
                        <div className="flex space-x-2">
                          {[1, 2, 5, 10].map((value) => (
                            <button
                              key={value}
                              onClick={() => setLeverage(value)}
                              className={`flex-1 py-1 text-sm rounded ${leverage === value ? (value === 1 ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white') : 'bg-dark-700 text-gray-400'}`}
                            >
                              {value}x
                            </button>
                          ))}
                        </div>
                        {leverage > 1 && (
                          <div className="mt-2 text-xs text-yellow-500">
                            警告：使用杠杆交易风险较高，可能导致资金损失。
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 总价值显示 */}
          {amount && (
            <div className="bg-dark-700 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">预估价格</span>
                <span className={`${priceImpact > 3 ? 'text-yellow-400' : priceImpact > 5 ? 'text-red-400' : 'text-white'}`}>
                  ${calculateEstimatedPrice().toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">价格影响</span>
                <span className={`${priceImpact > 3 ? 'text-yellow-400' : priceImpact > 5 ? 'text-red-400' : 'text-green-400'}`}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">总价值 (USD)</span>
                <span className="text-white font-semibold">
                  ${(parseFloat(amount) * calculateEstimatedPrice()).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 钱包余额 */}
        <div className="bg-dark-700 rounded-lg p-3 mb-6">
          <div className="text-sm text-gray-300 mb-2">钱包余额</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">SOL</span>
              <span className="text-white">{wallet.balance?.sol.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">USDC</span>
              <span className="text-white">${wallet.balance?.usdc.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* 交易按钮 */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 btn btn-secondary"
            disabled={isLoading}
          >
            取消
          </button>
          <button
            onClick={handleTrade}
            disabled={isLoading || !amount}
            className={`flex-1 btn btn-lg ${
              tradeType === 'buy' ? 'btn-success' : 'btn-danger'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="loading-spinner w-4 h-4"></div>
                <span>处理中...</span>
              </div>
            ) : (
              `${tradeType === 'buy' ? '买入' : '卖出'} ${asset.symbol}${tradeType === 'buy' && leverage > 1 ? ` (${leverage}x)` : ''}`
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};