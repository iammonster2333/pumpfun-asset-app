import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck, FaInfoCircle, FaChartLine, FaExchangeAlt, FaPlus, FaUsers, FaComments, FaRocket } from 'react-icons/fa';
import { useAppStore } from '@/stores/useAppStore';
import { TutorialContext } from './TutorialProvider';

type TutorialStep = {
  id: number;
  title: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  element?: string; // CSS selector for the element to highlight
};

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: '欢迎来到 PumpFun',
    description: '这是一个创新的资产发行和交易平台，让我们一起来了解如何使用吧！',
    icon: <FaRocket />,
    position: 'center',
  },
  {
    id: 2,
    title: '浏览资产',
    description: '上下滑动来浏览不同的资产，就像刷短视频一样简单！',
    icon: <FaChartLine />,
    position: 'center',
    element: '.feed-container',
  },
  {
    id: 3,
    title: '查看K线',
    description: 'K线图显示资产的价格走势，帮助你做出明智的交易决策。',
    icon: <FaChartLine />,
    position: 'center',
    element: '.kline-chart',
  },
  {
    id: 4,
    title: '交易资产',
    description: '点击买入或卖出按钮进行交易，设置数量和价格，轻松完成交易。',
    icon: <FaExchangeAlt />,
    position: 'bottom',
    element: '.trade-buttons',
  },
  {
    id: 5,
    title: '发行资产',
    description: '点击加号按钮创建自己的资产，设置名称、符号、描述等信息。',
    icon: <FaPlus />,
    position: 'bottom',
    element: '.create-asset-button',
  },
  {
    id: 6,
    title: '社区互动',
    description: '查看资产详情页的社区标签，参与讨论，了解最新动态。',
    icon: <FaUsers />,
    position: 'right',
    element: '.community-tab',
  },
  {
    id: 7,
    title: '发送弹幕',
    description: '在观看K线时发送弹幕，与其他用户实时互动。',
    icon: <FaComments />,
    position: 'right',
    element: '.danmaku-input',
  },
  {
    id: 8,
    title: '排行榜',
    description: '查看热门资产和顶级交易者，发现新的投资机会。',
    icon: <FaChartLine />,
    position: 'left',
    element: '.leaderboard-link',
  },
  {
    id: 9,
    title: '准备好了吗？',
    description: '现在你已经了解了PumpFun的基本功能，开始你的交易之旅吧！',
    icon: <FaCheck />,
    position: 'center',
  },
];

interface TutorialGuideProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({ 
  onComplete, 
  autoStart = false 
}) => {
  const { user, updateSettings } = useAppStore();
  const { 
    isTutorialVisible, 
    hideTutorial, 
    completeTutorial,
    currentStep,
    setCurrentStep,
    totalSteps 
  } = useContext(TutorialContext);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 当教程完成时调用onComplete回调
    if (onComplete && currentStep > totalSteps) {
      completeTutorial();
      onComplete();
    }
  }, [currentStep, totalSteps, completeTutorial, onComplete]);

  useEffect(() => {
    if (isTutorialVisible && tutorialSteps[currentStep]?.element) {
      const element = document.querySelector(tutorialSteps[currentStep].element!) as HTMLElement;
      setHighlightedElement(element);

      if (element) {
        // 滚动到元素位置
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightedElement(null);
    }

    return () => {
      setHighlightedElement(null);
    };
  }, [currentStep, isTutorialVisible]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // 更新用户设置，不再显示教程
    if (user) {
      updateSettings({ showTutorial: false });
    }
    if (onComplete) {
      onComplete();
    } else {
      completeTutorial();
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    } else {
      hideTutorial();
    }
  };

  if (!isTutorialVisible) {
    return null;
  }

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <>
      <AnimatePresence>
        {isTutorialVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* 高亮元素的遮罩 */}
            {highlightedElement && (
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute bg-primary bg-opacity-20 border-2 border-primary rounded-lg pointer-events-none"
                  style={{
                    top: highlightedElement.getBoundingClientRect().top - 4,
                    left: highlightedElement.getBoundingClientRect().left - 4,
                    width: highlightedElement.getBoundingClientRect().width + 8,
                    height: highlightedElement.getBoundingClientRect().height + 8,
                  }}
                />
              </div>
            )}

            {/* 教程卡片 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`bg-dark-800 rounded-xl p-6 max-w-md mx-4 shadow-2xl border border-dark-700 relative ${
                currentTutorialStep.position === 'center' ? 'relative' :
                currentTutorialStep.position === 'top' ? 'absolute top-24' :
                currentTutorialStep.position === 'bottom' ? 'absolute bottom-24' :
                currentTutorialStep.position === 'left' ? 'absolute left-24' :
                'absolute right-24'
              }`}
            >
              {/* 关闭按钮 */}
              <button
                onClick={handleComplete}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                aria-label="关闭教程"
              >
                <FaTimes size={20} />
              </button>

              {/* 图标 */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {currentTutorialStep.icon}
                </div>
              </div>

              {/* 标题 */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {currentTutorialStep.title}
              </h3>

              {/* 描述 */}
              <p className="text-gray-300 text-center mb-6">
                {currentTutorialStep.description}
              </p>

              {/* 图片（如果有） */}
              {currentTutorialStep.image && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={currentTutorialStep.image} 
                    alt={currentTutorialStep.title} 
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* 进度指示器 */}
              <div className="flex justify-center mb-6">
                {tutorialSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      index === currentStep ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* 按钮 */}
              <div className="flex justify-between">
                {currentStep > 0 ? (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white transition-colors"
                  >
                    <FaArrowLeft className="mr-2" /> 上一步
                  </button>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="flex items-center px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white transition-colors"
                  >
                    跳过
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white transition-colors"
                >
                  {currentStep < tutorialSteps.length - 1 ? (
                    <>
                      下一步 <FaArrowRight className="ml-2" />
                    </>
                  ) : (
                    <>
                      完成 <FaCheck className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};