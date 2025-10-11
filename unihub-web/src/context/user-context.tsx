'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { PageLoading } from '@/components/ui/loading';

type UserContextType = {
  user: any | null;
  isLoading: boolean;
  isError: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isError: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const { data: user, isLoading, isError } = useUser(token);
  
  if (!isMounted) return null;
  if (isLoading) return <PageLoading/>;

  return (
    <UserContext.Provider value={{ user, isLoading, isError }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
