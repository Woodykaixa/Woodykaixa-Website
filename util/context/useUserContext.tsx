import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Simplify } from '../type';
import { Err, OK, User } from '@/dto';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

type UserContextStates = User.AuthResp | null;
type UserContextActions = {
  setUser: (user: UserContextStates) => void;
  updateUser: (user: Simplify<Partial<NotNull<UserContextStates>>>) => void;
};
export type UserContextType = [UserContextStates, UserContextActions];
type NotNull<T> = T extends null ? never : T;

const UserContext = createContext<UserContextType>(null as any);

export function useUserInfo() {
  return useContext(UserContext);
}

export function UserInfoContext({ children }: { children: ReactNode }) {
  const [states, _setStates] = useState<UserContextStates>(null);
  const actions: UserContextActions = useMemo(
    () => ({
      setUser: user => {
        _setStates(user);
      },
      updateUser: user => {
        _setStates(prev => {
          return {
            ...prev!,
            ...user,
          };
        });
      },
    }),
    []
  );

  return <UserContext.Provider value={[states, actions]}>{children}</UserContext.Provider>;
}
