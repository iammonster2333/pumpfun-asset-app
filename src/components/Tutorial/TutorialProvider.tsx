import React, { createContext, useState } from 'react';

interface TutorialContextType {
  showTutorial: () => void;
  isTutorialVisible: boolean;
  hideTutorial: () => void;
}

export const TutorialContext = createContext<TutorialContextType | null>(null);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);
  
  const showTutorial = () => setIsTutorialVisible(true);
  const hideTutorial = () => setIsTutorialVisible(false);
  
  const value: TutorialContextType = {
    showTutorial,
    isTutorialVisible,
    hideTutorial
  };
  
  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};