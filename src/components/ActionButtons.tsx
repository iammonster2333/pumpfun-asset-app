import React from 'react';

interface ActionButtonsProps {
  onShare: () => void;
  onFavorite: () => void;
  onLoadMore?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onShare,
  onFavorite,
  onLoadMore
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-4">
        <button
          onClick={onShare}
          className="flex flex-col items-center space-y-1 text-gray-300 hover:text-white transition-colors"
        >
          <div className="w-6 h-6 bg-dark-700 rounded-full flex items-center justify-center">
            <span className="text-sm">📤</span>
          </div>
          <span className="text-xs">分享</span>
        </button>
        
        <button
          onClick={onFavorite}
          className="flex flex-col items-center space-y-1 text-gray-300 hover:text-white transition-colors"
        >
          <div className="w-6 h-6 bg-dark-700 rounded-full flex items-center justify-center">
            <span className="text-sm">❤️</span>
          </div>
          <span className="text-xs">收藏</span>
        </button>
      </div>
      
      {onLoadMore && (
        <button
          onClick={onLoadMore}
          className="btn btn-sm btn-ghost text-gray-300 hover:text-white"
        >
          加载更多
        </button>
      )}
    </div>
  );
}; 