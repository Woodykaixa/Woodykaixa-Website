import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Simplify } from '../type';
import { Err, OK, User } from '@/dto';

type UserContextStates = User.AuthResp | null;
type UserContextActions = {
  setUser: (user: UserContextStates) => void;
  updateUser: (user: Simplify<Partial<NotNull<UserContextStates>>>) => void;
  fetchUser: () => Promise<Err.CommonResp>;
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
      fetchUser: async () => {
        const resp = await fetch(`/api/user/auth`, {
          headers: {
            'content-type': 'application/json',
          },
        });
        const json = (await resp.json()) as User.AuthResp;
        if (resp.status === OK.code) {
          _setStates({ ...json });
          return {
            error: OK.text,
            desc: OK.text,
          };
        }
        return json as unknown as Err.CommonResp;
      },
    }),
    []
  );

  return <UserContext.Provider value={[states, actions]}>{children}</UserContext.Provider>;
}
