import React, { createContext, useState, useContext, PropsWithChildren } from 'react';

interface ToggleContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

export const useToggleDarkMode = () => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('useToggleDarkMode must be used within a ToggleProvider');
  }
  return context;
};

export const ToggleProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Initial state for dark mode

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ToggleContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ToggleContext.Provider>
  );
};

