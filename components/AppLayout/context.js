import { createContext, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children, value }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
