import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { WalletState } from '@/types';

interface WalletContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  wallet: WalletState;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { wallet, setWalletState, updateUserBalance } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const connect = async () => {
    try {
      setWalletState({ connecting: true, error: undefined });
      
      // 模拟钱包连接
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      const mockBalance = {
        sol: 10.5,
        usdc: 1000
      };
      
      setWalletState({
        connected: true,
        address: mockAddress,
        balance: mockBalance,
        connecting: false,
        error: undefined
      });
      
      updateUserBalance(mockBalance);
      
    } catch (error) {
      setWalletState({
        connecting: false,
        error: error instanceof Error ? error.message : '连接失败'
      });
    }
  };

  const disconnect = () => {
    setWalletState({
      connected: false,
      address: undefined,
      balance: undefined,
      connecting: false,
      error: undefined
    });
  };

  useEffect(() => {
    // 检查是否有保存的钱包状态
    const savedWallet = localStorage.getItem('wallet-state');
    if (savedWallet) {
      try {
        const parsed = JSON.parse(savedWallet);
        if (parsed.connected) {
          setWalletState(parsed);
        }
      } catch (error) {
        console.error('Failed to parse saved wallet state:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('wallet-state', JSON.stringify(wallet));
    }
  }, [wallet, isInitialized]);

  const value: WalletContextType = {
    connect,
    disconnect,
    wallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 