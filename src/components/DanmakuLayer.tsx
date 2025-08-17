import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Danmaku, User } from '@/types';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiSend, FiHeart, FiMessageCircle, FiX } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

interface DanmakuLayerProps {
  assetId?: string;
  isActive?: boolean;
}

export const DanmakuLayer: React.FC<DanmakuLayerProps> = ({ assetId, isActive = true }) => {
  const { danmaku, addDanmaku, clearDanmaku, user } = useAppStore();
  const [activeDanmaku, setActiveDanmaku] = useState<Danmaku[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [reactionCount, setReactionCount] = useState({ likes: 0, comments: 0 });
  const [showReactions, setShowReactions] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.3 });
  
  // 弹幕动画控制
  const controls = useAnimation();
  
  // 过滤当前资产的弹幕
  useEffect(() => {
    if (!isActive) {
      setActiveDanmaku([]);
      return;
    }
    
    const filtered = danmaku.filter(d => d.assetId === assetId);
    setActiveDanmaku(filtered);
    
    // 模拟弹幕增加
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newDanmaku: Danmaku = {
          id: `danmaku-${Date.now()}`,
          content: ['🚀 起飞了！', '看好这个项目', '这资产要爆了', '早期上车', '这K线漂亮', '做多做多！'][
            Math.floor(Math.random() * 6)
          ],
          user: {
            id: `user-${Math.floor(Math.random() * 1000)}`,
            name: `用户${Math.floor(Math.random() * 1000)}`,
            avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
          },
          timestamp: new Date().toISOString(),
          assetId: assetId || '',
          color: ['#ffffff', '#ffcc00', '#ff6b6b', '#4cd964', '#5ac8fa', '#ffcc00'][
            Math.floor(Math.random() * 6)
          ],
          isPremium: Math.random() > 0.8,
          position: {
            x: window.innerWidth,
            y: 50 + Math.random() * (window.innerHeight - 200),
          },
          speed: 5 + Math.random() * 10,
        };
        
        addDanmaku(newDanmaku);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [assetId, danmaku, isActive, addDanmaku]);
  
  // 处理弹幕发送
  const handleSendDanmaku = useCallback(() => {
    if (!inputValue.trim() || !user) return;
    
    const newDanmaku: Danmaku = {
      id: `danmaku-${Date.now()}`,
      content: inputValue,
      user,
      timestamp: new Date().toISOString(),
      assetId: assetId || '',
      color: '#ffffff',
      isPremium: false,
      position: {
        x: window.innerWidth,
        y: 50 + Math.random() * (window.innerHeight - 200),
      },
      speed: 8,
    };
    
    addDanmaku(newDanmaku);
    setInputValue('');
    setShowInput(false);
  }, [inputValue, user, assetId, addDanmaku]);
  
  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowInput(false);
      } else if (e.key === 'Enter' && showInput) {
        handleSendDanmaku();
      } else if (e.key === 'c' && !showInput) {
        setShowInput(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInput, handleSendDanmaku]);
  
  // 自动聚焦输入框
  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);
  
  // 模拟反应数据
  useEffect(() => {
    if (!isActive) return;
    
    setReactionCount({
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
    });
    
    const interval = setInterval(() => {
      setReactionCount(prev => ({
        likes: prev.likes + (Math.random() > 0.7 ? 1 : 0),
        comments: prev.comments + (Math.random() > 0.9 ? 1 : 0),
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // 弹幕动画
  const danmakuVariants = useMemo(() => ({
    initial: (danmaku: Danmaku) => ({
      x: window.innerWidth,
      y: danmaku.position.y,
      opacity: 0,
    }),
    animate: (danmaku: Danmaku) => ({
      x: -300,
      y: danmaku.position.y,
      opacity: 1,
      transition: {
        x: {
          duration: danmaku.speed,
          ease: 'linear',
        },
        opacity: {
          duration: 0.5,
        },
      },
    }),
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  }), []);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-20 overflow-hidden"
    >
      <div ref={ref} className="absolute inset-0">
        {/* 弹幕显示区域 - 性能优化 */}
        <div className="relative w-full h-full pointer-events-none">
          <AnimatePresence>
            {inView && activeDanmaku.map((danmaku) => (
              <motion.div
                key={danmaku.id}
                className={`danmaku ${danmaku.isPremium ? 'font-bold' : ''}`}
                style={{
                  color: danmaku.color,
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 3px rgba(0,0,0,0.8)',
                  fontSize: danmaku.isPremium ? '18px' : '16px',
                }}
                custom={danmaku}
                variants={danmakuVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {danmaku.isPremium && '🔥 '}
                {danmaku.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* 弹幕输入框 */}
      <AnimatePresence>
        {showInput && (
          <motion.div 
            className="absolute bottom-20 left-0 right-0 mx-auto w-4/5 max-w-md glass-effect rounded-full overflow-hidden flex items-center px-4 py-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white"
              placeholder="发送弹幕..."
              maxLength={50}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendDanmaku}
              className="ml-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2"
            >
              <FiSend />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInput(false)}
              className="ml-2 text-white bg-gray-700 rounded-full p-2"
            >
              <FiX />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 弹幕控制按钮 */}
      <div className="absolute bottom-4 right-4 flex space-x-2 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInput(true)}
          className="glass-effect rounded-full p-3"
        >
          <FiMessageCircle className="text-white" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReactions(!showReactions)}
          className="glass-effect rounded-full p-3 relative"
        >
          <FiHeart className="text-white" />
          {reactionCount.likes > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {reactionCount.likes > 999 ? '999+' : reactionCount.likes}
            </span>
          )}
        </motion.button>
      </div>
      
      {/* 弹幕计数器 */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <motion.div 
          className="glass-effect rounded-lg px-3 py-1 text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <span className="text-gray-300">弹幕: </span>
          <span className="text-white font-semibold">{activeDanmaku.length}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default DanmakuLayer;

// CSS样式已移至index.css文件中