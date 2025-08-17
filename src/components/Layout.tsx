import React, { useContext } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useWallet } from './WalletProvider';
import { BottomNavigation } from './BottomNavigation';
import { TopBar } from './TopBar';
import { NotificationPanel } from './NotificationPanel';
import { TutorialContext } from './Tutorial/TutorialProvider';
import { TutorialGuide } from './Tutorial/TutorialGuide';
import { FiHelpCircle } from 'react-icons/fi';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentView, unreadNotifications } = useAppStore();
  const { wallet } = useWallet();
  const { showTutorial, isTutorialVisible } = useContext(TutorialContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white relative">
      {/* 顶部导航栏 */}
      <TopBar />
      
      {/* 主内容区域 */}
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {/* 通知面板 */}
      {unreadNotifications > 0 && <NotificationPanel />}
      
      {/* 底部导航 */}
      <BottomNavigation />
      
      {/* 教程按钮 */}
      <button 
        onClick={showTutorial}
        className="fixed right-4 bottom-20 bg-primary-500 p-3 rounded-full shadow-lg z-40 hover:bg-primary-600 transition-colors"
        aria-label="显示教程"
      >
        <FiHelpCircle size={24} />
      </button>
      
      {/* 教程指南 */}
      {isTutorialVisible && <TutorialGuide />}
      
      {/* 钱包连接提示 */}
      {!wallet.connected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">连接钱包</h3>
            <p className="text-gray-300 mb-6">
              请连接您的钱包以开始交易和发行资产
            </p>
            <button className="btn btn-primary w-full">
              连接钱包
            </button>
          </div>
        </div>
      )}
    </div>
  );
};