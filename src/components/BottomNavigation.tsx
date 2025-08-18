import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadNotifications } = useAppStore();

  const navItems = [
    {
      path: '/',
      label: '发现',
      icon: '🏠',
      active: location.pathname === '/'
    },
    {
      path: '/leaderboard',
      label: '排行榜',
      icon: '🏆',
      active: location.pathname === '/leaderboard'
    },
    {
      path: '/create',
      label: '发行',
      icon: '➕',
      active: location.pathname === '/create'
    },
    {
      path: '/guild',
      label: '帮派',
      icon: '⚔️',
      active: location.pathname.startsWith('/guild')
    },
    {
      path: '/profile',
      label: '我的',
      icon: '👤',
      active: location.pathname.startsWith('/profile'),
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-30">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
              item.active
                ? 'text-blue-500 bg-blue-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <span className="text-lg">{item.icon}</span>
              {item.badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 