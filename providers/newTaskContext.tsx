import React, { createContext, useState, useContext, PropsWithChildren } from 'react';

interface NewTaskContextType {
  newTaskAdded: boolean;
  setNewTaskAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewTaskContext = createContext<NewTaskContextType | undefined>(undefined);

export const useNewTask = () => {
  const context = useContext(NewTaskContext);
  if (!context) {
    throw new Error('useNewTask must be used within a NewTaskProvider');
  }
  return context;
};

export const NewTaskProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [newTaskAdded, setNewTaskAdded] = useState<boolean>(false);

  return (
    <NewTaskContext.Provider value={{ newTaskAdded, setNewTaskAdded }}>
      {children}
    </NewTaskContext.Provider>
  );
};
