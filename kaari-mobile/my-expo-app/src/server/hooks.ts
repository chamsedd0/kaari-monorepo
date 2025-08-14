import React from 'react';
import { serverClient, ServerClient } from './client';

const ServerClientContext = React.createContext<ServerClient>(serverClient);

export function ServerClientProvider({ children, value }: { children: React.ReactNode; value?: ServerClient }) {
  return <ServerClientContext.Provider value={value || serverClient}>{children}</ServerClientContext.Provider>;
}

export function useServer() {
  return React.useContext(ServerClientContext);
}


