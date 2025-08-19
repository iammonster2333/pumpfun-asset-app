import React from 'react';
import { useWallet } from './WalletProvider';

export const TopBar: React.FC = () => {
  const { wallet, connect, disconnect } = useWallet();

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-md border-b border-gray-700 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RichFlow</span>
        </div>
        
        <div className="flex items-center">
          {wallet.connected ? (
            <div className="flex items-center space-x-2">
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-2"></span>
                已连接
              </div>
              <button 
                onClick={disconnect}
                className="bg-red-500/20 text-red-400 hover:text-red-300 px-3 py-1 rounded-lg text-sm transition-colors"
              >
                断开
              </button>
            </div>
          ) : (
            <button 
              onClick={connect}
              disabled={wallet.connecting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              {wallet.connecting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>连接中...</span>
                </div>
              ) : (
                '连接钱包'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
