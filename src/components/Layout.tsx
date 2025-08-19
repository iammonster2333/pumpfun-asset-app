import React, { useContext, useEffect, useRef } from 'react';
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
  const { unreadNotifications } = useAppStore();
  const { wallet, connect } = useWallet();
  const tutorialContext = useContext(TutorialContext);
  const showTutorial = tutorialContext?.showTutorial || (() => {});
  const isTutorialVisible = tutorialContext?.isTutorialVisible || false;
  const mainRef = useRef<HTMLElement | null>(null);

  // 当事件起源于图表容器（.kline-chart）时，阻止中间区滚动。
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const isOverChart = (e: Event): boolean => {
      // 通过当前指针位置判断是否悬停在 .kline-chart 上，避免被上层透明层拦截后 target 不在图表内的问题
      try {
        let x = 0, y = 0;
        if ((e as any).clientX != null && (e as any).clientY != null) {
          x = (e as any).clientX;
          y = (e as any).clientY;
        } else if ((e as TouchEvent).touches && (e as TouchEvent).touches[0]) {
          x = (e as TouchEvent).touches[0].clientX;
          y = (e as TouchEvent).touches[0].clientY;
        }
        const stack = (document as any).elementsFromPoint
          ? (document as any).elementsFromPoint(x, y)
          : [document.elementFromPoint(x, y)].filter(Boolean);
        if (!stack || stack.length === 0) return false;
        // 命中栈中任意元素的祖先若包含 .kline-chart 即认为在图表之上
        return stack.some((el: Element) => !!(el && (el as any).closest && (el as any).closest('.kline-chart')));
      } catch {
        return false;
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (isOverChart(e)) {
        e.preventDefault();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isOverChart(e)) {
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    // 兜底：在 window 层也拦截，确保任何滚动源自图表时都不触发页面滚动
    const onWinWheel = (e: WheelEvent) => { if (isOverChart(e)) e.preventDefault(); };
    const onWinTouchMove = (e: TouchEvent) => { if (isOverChart(e)) e.preventDefault(); };
    window.addEventListener('wheel', onWinWheel, { passive: false, capture: true });
    window.addEventListener('touchmove', onWinTouchMove, { passive: false, capture: true });

    // 当鼠标/触点进入图表区域时，暂时禁用主容器和窗口滚动；离开时恢复
    const onEnter = (e: Event) => {
      if (isOverChart(e)) {
        el.style.overflowY = 'hidden';
        document.body.style.overflow = 'hidden';
        (document.documentElement as HTMLElement).style.overflow = 'hidden';
      }
    };
    const onLeave = (e: Event) => {
      if (isOverChart(e)) {
        el.style.overflowY = '';
        document.body.style.overflow = '';
        (document.documentElement as HTMLElement).style.overflow = '';
      }
    };
    document.addEventListener('mouseover', onEnter, { capture: true });
    document.addEventListener('pointerdown', onEnter, { capture: true });
    document.addEventListener('mouseleave', onLeave, { capture: true });
    document.addEventListener('pointerup', onLeave, { capture: true });
    return () => {
      el.removeEventListener('wheel', onWheel as EventListener, true);
      el.removeEventListener('touchmove', onTouchMove as EventListener, true);
      window.removeEventListener('wheel', onWinWheel as EventListener, true);
      window.removeEventListener('touchmove', onWinTouchMove as EventListener, true);
      document.removeEventListener('mouseover', onEnter as EventListener, true);
      document.removeEventListener('pointerdown', onEnter as EventListener, true);
      document.removeEventListener('mouseleave', onLeave as EventListener, true);
      document.removeEventListener('pointerup', onLeave as EventListener, true);
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
      {/* 顶部导航栏 */}
      <TopBar />
      
      {/* 主内容区域：唯一滚动容器（避免用 document 滚动） */}
      <main ref={mainRef} className="flex-1 overflow-y-auto pb-28 md:pb-32">
        {children}
      </main>
      
      {/* 通知面板 */}
      {unreadNotifications > 0 && <NotificationPanel />}
      
      {/* 底部导航 */}
      <BottomNavigation />
      
      {/* 教程按钮 */}
      <button 
        onClick={showTutorial}
        className="fixed right-4 bottom-20 bg-blue-500 p-3 rounded-full shadow-lg z-40 hover:bg-blue-600 transition-colors"
        aria-label="显示教程"
      >
        <FiHelpCircle size={24} />
      </button>
      
      {/* 教程指南 */}
      {isTutorialVisible && <TutorialGuide />}
      
      {/* 钱包连接提示 */}
      {!wallet.connected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">连接钱包</h3>
            <p className="text-gray-300 mb-6">
              请连接您的钱包以开始交易和发行资产
            </p>
            <button 
              onClick={connect}
              disabled={wallet.connecting}
              className="btn btn-primary w-full"
            >
              {wallet.connecting ? '连接中...' : '连接钱包'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};