import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { WebSocketMessage, Danmaku } from '@/types';

interface WebSocketContextType {
  sendMessage: (message: WebSocketMessage) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { addDanmaku, addNotification, updateAsset } = useAppStore();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 模拟WebSocket连接
    const connectWebSocket = () => {
      // 在实际应用中，这里会连接到真实的WebSocket服务器
      console.log('Connecting to WebSocket...');
      
      // 模拟连接成功
      setTimeout(() => {
        setIsConnected(true);
        console.log('WebSocket connected');
      }, 1000);

      // 模拟接收消息
      const messageInterval = setInterval(() => {
        if (isConnected) {
          // 模拟价格更新
          const mockPriceUpdate: WebSocketMessage = {
            type: 'price_update',
            data: {
              assetId: 'mock-asset-1',
              price: Math.random() * 100,
              change24h: (Math.random() - 0.5) * 20
            },
            timestamp: Date.now()
          };

          // 模拟弹幕
          const mockDanmaku: Danmaku = {
            id: `danmaku-${Date.now()}`,
            assetId: 'mock-asset-1',
            userId: 'mock-user-1',
            user: {
              id: 'mock-user-1',
              username: '用户' + Math.floor(Math.random() * 1000),
              avatar: 'https://via.placeholder.com/40',
              walletAddress: 'mock-address',
              balance: { sol: 0, usdc: 0 },
              level: 1,
              experience: 0,
              achievements: [],
              createdAt: new Date(),
              lastActiveAt: new Date()
            },
            content: ['🚀起飞了！', '📈看涨！', '💎钻石手', '🔥热起来了'][Math.floor(Math.random() * 4)],
            type: 'comment',
            color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 4)],
            position: 'scroll',
            duration: 8000,
            createdAt: new Date()
          };

          // 处理消息
          handleMessage(mockPriceUpdate);
          addDanmaku(mockDanmaku);
        }
      }, 3000);

      return () => {
        clearInterval(messageInterval);
      };
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, [isConnected]);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'price_update':
        // 更新资产价格
        updateAsset(message.data.assetId, {
          price: message.data.price,
          priceChange24h: message.data.change24h
        });
        break;
      
      case 'trade':
        // 处理交易通知
        addNotification({
          id: `notification-${Date.now()}`,
          userId: 'current-user',
          type: 'trade',
          title: '新交易',
          message: `${message.data.assetName} 有新的交易`,
          data: message.data,
          read: false,
          createdAt: new Date()
        });
        break;
      
      case 'danmaku':
        // 处理弹幕
        addDanmaku(message.data);
        break;
      
      case 'notification':
        // 处理系统通知
        addNotification(message.data);
        break;
    }
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.log('WebSocket not connected, message:', message);
    }
  };

  const value: WebSocketContextType = {
    sendMessage,
    isConnected
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 