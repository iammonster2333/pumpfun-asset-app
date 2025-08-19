import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Asset } from '@/types';
import { KlineChart } from './KlineChart';
import { TradePanel } from './TradePanel';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { ShareModal } from './ShareModal';

interface AssetCardProps {
  asset: Asset;
  isActive: boolean;
  onLoadMore?: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = React.memo(({ 
  asset, 
  isActive, 
  onLoadMore 
}) => {
  const [showTradePanel, setShowTradePanel] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(asset.price);
  const [priceChange, setPriceChange] = useState(asset.priceChange24h);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 1000));
  const [commentCount] = useState(Math.floor(Math.random() * 100));
  const cardRef = useRef<HTMLDivElement>(null);
  const [tfClickCount, setTfClickCount] = useState(0);
  
  // 时间周期（由父组件控制K线图）
  type TimeFrame =
    | '1m' | '3m' | '5m' | '15m'
    | '1d' | '3d' | '5d'
    | '1w' | '3w'
    | '1M' | '3M';
  const [timeframe, setTimeframe] = useState<TimeFrame>('1m');
  
  // 使用Intersection Observer优化滚动性能
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(isActive);

  // 使用Intersection Observer检测可见性
  useEffect(() => {
    if (!cardRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } // 当30%的元素可见时触发
    );
    
    observerRef.current.observe(cardRef.current);
    
    return () => {
      if (observerRef.current && cardRef.current) {
        observerRef.current.unobserve(cardRef.current);
      }
    };
  }, []);

  // 全局点击调试：观察事件是否被拦截
  useEffect(() => {
    const onDocClickCapture = (e: MouseEvent) => {
      // @ts-ignore
      const tag = (e.target && (e.target as HTMLElement).tagName) || 'unknown';
      console.log('[Doc][capture] click on', tag);
    };
    const onDocClick = (e: MouseEvent) => {
      // @ts-ignore
      const tag = (e.target && (e.target as HTMLElement).tagName) || 'unknown';
      console.log('[Doc][bubble] click on', tag);
    };
    document.addEventListener('click', onDocClickCapture, true);
    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('click', onDocClickCapture, true);
      document.removeEventListener('click', onDocClick);
    };
  }, []);
  
  // 模拟实时价格更新 - 只在卡片可见且激活时更新
  useEffect(() => {
    if (!isActive || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.02; // ±1% 变化
        return prev * (1 + change);
      });
      
      // 更新24小时变化
      setPriceChange(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, isVisible]);

  // 使用useCallback优化事件处理函数
  const handleBuy = useCallback(() => {
    setShowTradePanel(true);
  }, []);

  const handleSell = useCallback(() => {
    setShowTradePanel(true);
  }, []);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleFavorite = useCallback(() => {
    setIsFavorited(prev => !prev);
    setLikeCount(prev => prev + (isFavorited ? -1 : 1));
  }, [isFavorited]);

  // 切换时间周期（驱动K线图）
  const handleTimeframeChange = useCallback((tf: TimeFrame) => {
    console.log('[AssetCard] 切换到时间周期:', tf);
    setTimeframe(tf);
    setTfClickCount((c) => c + 1);
    // 向全局广播，未受控的 KlineChart 将监听此事件
    try {
      const evt = new CustomEvent('kline:setTimeframe', { detail: tf });
      window.dispatchEvent(evt);
    } catch (e) {
      // 部分环境 CustomEvent 可能需要 polyfill
      // @ts-ignore
      window.dispatchEvent({ type: 'kline:setTimeframe', detail: tf });
    }
    // 兜底：设置全局变量，便于页面轮询同步
    // @ts-ignore
    window.__kline_tf = tf;
  }, []);

  // 使用useMemo优化渲染性能
  const priceDisplay = useMemo(() => {
    return {
      price: currentPrice.toFixed(4),
      change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
      changeColor: priceChange >= 0 ? 'text-success' : 'text-danger'
    };
  }, [currentPrice, priceChange]);
  
  return (
    <div 
      ref={cardRef}
      className="relative h-screen bg-dark-900 overflow-hidden"
      style={{ willChange: 'transform' }} // 优化GPU加速
    >
      {/* K线图（主要内容） - 只在可见时渲染完整图表 */}
      <div className="absolute inset-0 z-0">
        <KlineChart 
          data={asset.klineData}
          isActive={isActive && isVisible}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          showControls={false}
        />
      </div>
      
      {/* 顶部信息栏（不拦截交互） */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-dark-900 to-transparent pointer-events-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{asset.symbol}</h3>
            <p className="text-sm text-gray-300">{asset.name}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">${priceDisplay.price}</p>
            <p className={`text-sm ${priceDisplay.changeColor}`}>
              {priceDisplay.change}
            </p>
          </div>
        </div>
      </div>
      
      {createPortal(
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[2147483647] px-4"
          style={{ pointerEvents: 'auto' }}
          onClickCapture={() => console.log('[AssetCard] capture: 点击到时间周期条容器')}
          onClick={() => console.log('[AssetCard] bubble: 点击到时间周期条容器')}
          onMouseEnter={() => console.log('[AssetCard] 鼠标进入周期条容器')}
        >
          <div className="relative flex items-center justify-center flex-wrap gap-2 bg-dark-800 bg-opacity-80 shadow-lg rounded-full p-2 w-fit mx-auto pointer-events-auto"
               onPointerDown={(e) => { e.stopPropagation(); }}
               onMouseDown={(e) => { e.stopPropagation(); }}
               onTouchStart={(e) => { e.stopPropagation(); }}
               onClick={(e) => { e.stopPropagation(); }}>
            <span className="text-xs text-gray-300 px-2 py-0.5 rounded bg-dark-700/80 select-none">
              TF: {timeframe} · Clicks: {tfClickCount}
            </span>
            {(['1m','3m','5m','15m','1d','3d','5d','1w','3w','1M','3M'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                  timeframe === tf ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
                onPointerDown={(e) => { e.stopPropagation(); }}
                onMouseDown={(e) => { e.stopPropagation(); }}
                onTouchStart={(e) => { e.stopPropagation(); }}
                onClick={(e) => { e.stopPropagation(); handleTimeframeChange(tf); }}
                onMouseEnter={() => console.log(`[AssetCard] hover: ${tf}`)}
                type="button"
                role="button"
                tabIndex={0}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
      
      {/* 底部操作区域 */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-4">
        <div className="flex space-x-3 mb-4">
          <button 
            onClick={handleBuy}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            买入
          </button>
          <button 
            onClick={handleSell}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            卖出
          </button>
        </div>

        <div className="flex justify-around">
          <motion.button 
            className="text-white flex flex-col items-center"
            onClick={handleFavorite}
            whileTap={{ scale: 0.9 }}
          >
            {isFavorited ? (
              <FaHeart className="h-6 w-6 text-red-500" />
            ) : (
              <FaRegHeart className="h-6 w-6" />
            )}
            <span className="text-xs mt-1">{likeCount}</span>
          </motion.button>
          
          <motion.button 
            className="text-white flex flex-col items-center"
            onClick={() => setShowComments(!showComments)}
            whileTap={{ scale: 0.9 }}
          >
            <FaComment className="h-6 w-6" />
            <span className="text-xs mt-1">{commentCount}</span>
          </motion.button>
          
          <motion.button 
            className="text-white flex flex-col items-center"
            onClick={handleShare}
            whileTap={{ scale: 0.9 }}
          >
            <FaShare className="h-6 w-6" />
            <span className="text-xs mt-1">分享</span>
          </motion.button>
        </div>
      </div>
      
      {/* 分享模态框 */}
      <ShareModal 
        asset={asset}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
      
      {/* 交易面板 */}
      {showTradePanel && (
        <div className="absolute inset-0 z-20 bg-dark-900 bg-opacity-95">
          <TradePanel 
            asset={asset} 
            currentPrice={currentPrice} 
            onClose={() => setShowTradePanel(false)} 
          />
        </div>
      )}
      
      {/* 资产标签（不拦截交互） */}
      <div className="absolute bottom-32 left-4 z-10 pointer-events-none">
        <div className="flex flex-wrap gap-2">
          {asset.tags && asset.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-dark-800 bg-opacity-70 rounded-full text-xs text-gray-300">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});