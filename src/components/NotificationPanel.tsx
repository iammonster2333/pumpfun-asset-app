import React, { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';

export const NotificationPanel: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleMarkAllRead = () => {
    unreadNotifications.forEach(notification => {
      markNotificationAsRead(notification.id);
    });
  };

  if (unreadNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-50">
      <div className="bg-dark-800 rounded-lg shadow-lg border border-dark-700 max-w-sm">
        {/* 通知头部 */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white">通知</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-primary hover:text-primary-300"
            >
              全部已读
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? '−' : '+'}
            </button>
          </div>
        </div>

        {/* 通知列表 */}
        {isOpen && (
          <div className="max-h-64 overflow-y-auto">
            {unreadNotifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b border-dark-700 hover:bg-dark-700/50 transition-colors cursor-pointer"
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'trade' ? 'bg-success' :
                    notification.type === 'price_alert' ? 'bg-warning' :
                    notification.type === 'achievement' ? 'bg-primary' :
                    'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-300 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notification.type === 'trade' ? 'bg-success/20 text-success' :
                        notification.type === 'price_alert' ? 'bg-warning/20 text-warning' :
                        notification.type === 'achievement' ? 'bg-primary/20 text-primary' :
                        'bg-gray-400/20 text-gray-400'
                      }`}>
                        {notification.type === 'trade' ? '交易' :
                         notification.type === 'price_alert' ? '价格提醒' :
                         notification.type === 'achievement' ? '成就' :
                         notification.type === 'guild' ? '帮派' : '系统'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {unreadNotifications.length > 5 && (
              <div className="p-4 text-center">
                <span className="text-sm text-gray-400">
                  还有 {unreadNotifications.length - 5} 条未读通知
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 