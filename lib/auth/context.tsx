import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { getActiveAccount } from '@/lib/db/accounts';
import { verifyPin } from '@/lib/crypto/pin';
import type { Account } from '@/types/db';

export type SignInResult = { ok: true } | { ok: false; reason: string };

interface AuthContextValue {
  account: Account | null;
  signingIn: boolean;
  signIn: (pin: string) => Promise<SignInResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const signIn = useCallback(async (pin: string): Promise<SignInResult> => {
    if (!pin || pin.length < 4) {
      return { ok: false, reason: 'Kulang ang PIN' };
    }

    setSigningIn(true);
    try {
      const active = await getActiveAccount();
      if (!active) {
        return { ok: false, reason: 'Walang account na naka-setup' };
      }
      const ok = await verifyPin(pin, active.pinSalt, active.pinHash);
      if (!ok) {
        return { ok: false, reason: 'Mali ang PIN' };
      }
      setAccount(active);
      return { ok: true };
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOut = useCallback(() => setAccount(null), []);

  return (
    <AuthContext.Provider value={{ account, signingIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
