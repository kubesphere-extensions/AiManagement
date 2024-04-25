import React from 'react';

const defaultContext: {
  pool?: Pool;
  getPool: () => void;
} = {
  pool: undefined,
  getPool: () => {},
};

export const DetailPageContext = React.createContext(defaultContext);

export const useDetailPage = () => React.useContext(DetailPageContext);