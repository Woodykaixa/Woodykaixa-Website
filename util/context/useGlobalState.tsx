import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type GlobalStates = {
  loading: boolean;
  theme: 'light';
};
type GlobalStateActions = {
  setLoading: (loading: boolean) => void;
};
export type UserContextType = [GlobalStates, GlobalStateActions];

const getInitialStates = (): GlobalStates => {
  return {
    loading: false,
    theme: 'light',
  };
};

const Ctx = createContext<UserContextType>(null as any);

export function useGlobalStates() {
  return useContext(Ctx);
}

export function GlobalStateContext({ children }: { children: ReactNode }) {
  const [states, _setStates] = useState<GlobalStates>(getInitialStates());
  const mergeStates = useCallback((states: Partial<GlobalStates>) => {
    _setStates(prev => ({
      ...prev,
      ...states,
    }));
  }, []);
  const actions: GlobalStateActions = useMemo(
    () => ({
      setLoading(loading) {
        mergeStates({ loading });
      },
    }),
    [mergeStates]
  );

  return <Ctx.Provider value={[states, actions]}>{children}</Ctx.Provider>;
}
