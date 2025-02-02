import React, { createContext, useContext, useState } from 'react';
import { Spin } from 'antd';

interface LoadingContextType {
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  setLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      <Spin spinning={loading} size="large">
        {children}
      </Spin>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext); 