import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TutorialGuide } from './TutorialGuide';
import { useAppStore } from '@/stores/useAppStore';

interface TutorialContextType {
  showTutorial: () => void;
  hideTutorial: () => void;
  isTutorialVisible: boolean;
  completeTutorial: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const TutorialContext = createContext<TutorialContextType>({
  showTutorial: () => {},
  hideTutorial: () => {},
  isTutorialVisible: false,
  completeTutorial: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  totalSteps: 9,
});

export const useTutorial = () => useContext(TutorialContext);

interface TutorialProviderProps {
  children: React.ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const { user, updateSettings } = useAppStore();
  const [isTutorialVisible, setIsTutorialVisible] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

  useEffect(() => {
    // 检查用户是否是第一次使用应用
    if (user?.settings?.firstTimeUser && !user?.settings?.tutorialCompleted) {
      // 延迟显示教程，让用户先看到应用界面
      const timer = setTimeout(() => {
        showTutorial();
        // 标记用户不再是首次使用
        updateSettings({ firstTimeUser: false });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, showTutorial, updateSettings]);

  const showTutorial = useCallback(() => {
    setCurrentStep(1);
    setIsTutorialVisible(true);
  }, []);

  const hideTutorial = useCallback(() => {
    setIsTutorialVisible(false);
  }, []);

  const completeTutorial = useCallback(() => {
    setIsTutorialVisible(false);
    updateSettings({ tutorialCompleted: true });
  }, [updateSettings]);

  return (
    <TutorialContext.Provider
      value={{
        showTutorial,
        hideTutorial,
        isTutorialVisible,
        completeTutorial,
        currentStep,
        setCurrentStep,
        totalSteps
      }}
    >
      {children}
      <TutorialGuide 
        autoStart={isTutorialVisible} 
        onComplete={completeTutorial} 
      />
    </TutorialContext.Provider>
  );
};