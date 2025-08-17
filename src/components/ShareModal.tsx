import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Asset } from '@/types';
import { FaTwitter, FaTelegram, FaFacebook, FaLink, FaQrcode, FaWeibo, FaWeixin } from 'react-icons/fa';

interface ShareModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ asset, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const shareUrl = `${window.location.origin}/asset/${asset.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = (platform: string) => {
    let shareLink = '';
    const text = `查看 ${asset.name} (${asset.symbol}) 的实时价格和交易数据`;
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'weibo':
        shareLink = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank');
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-dark-800 rounded-t-xl w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">分享 {asset.symbol}</h3>
              <button
                className="text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {showQR ? (
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  {/* 这里应该是实际的二维码，这里用占位符代替 */}
                  <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-dark-800">资产二维码</p>
                  </div>
                </div>
                <button
                  className="bg-primary text-white py-2 px-4 rounded-lg mb-4"
                  onClick={() => setShowQR(false)}
                >
                  返回分享选项
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <button
                    className="flex flex-col items-center"
                    onClick={() => handleShare('twitter')}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center mb-1">
                      <FaTwitter className="text-white text-xl" />
                    </div>
                    <span className="text-xs text-gray-300">Twitter</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center"
                    onClick={() => handleShare('telegram')}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-1">
                      <FaTelegram className="text-white text-xl" />
                    </div>
                    <span className="text-xs text-gray-300">Telegram</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center"
                    onClick={() => handleShare('facebook')}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                      <FaFacebook className="text-white text-xl" />
                    </div>
                    <span className="text-xs text-gray-300">Facebook</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center"
                    onClick={() => handleShare('weibo')}
                  >
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mb-1">
                      <FaWeibo className="text-white text-xl" />
                    </div>
                    <span className="text-xs text-gray-300">微博</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center"
                    onClick={() => setShowQR(true)}
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-1">
                      <FaQrcode className="text-white text-xl" />
                    </div>
                    <span className="text-xs text-gray-300">二维码</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-1">
                      <FaWeixin className="text-white text-xl" />
                    </div>
                    <span className="text-xs text-gray-300">微信</span>
                  </button>
                </div>
                
                <div className="flex items-center bg-dark-700 rounded-lg p-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-white text-sm border-none focus:outline-none"
                  />
                  <button
                    className="ml-2 bg-primary text-white px-3 py-1 rounded text-sm"
                    onClick={handleCopyLink}
                  >
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};