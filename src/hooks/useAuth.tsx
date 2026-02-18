import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type User = {
  id: string;
  email?: string;
};

type Session = {
  access_token: string;
  refresh_token: string;
  user: User;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchAuth(endpoint: string, body?: any, accessToken?: string) {
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function checkAdminRole(userId: string, accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/has_role`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _user_id: userId, _role: "admin" }),
      }
    );
    if (!res.ok) return false;
    return await res.json();
  } catch {
    return false;
  }
}

const SESSION_KEY = "olex-auth-session";

function saveSession(session: Session | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const saved = loadSession();
    if (!saved) {
      setLoading(false);
      return;
    }

    try {
      // Verify the session is still valid by getting user
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${saved.access_token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        const validSession = { ...saved, user: { id: userData.id, email: userData.email } };
        setSession(validSession);
        setUser(validSession.user);
        saveSession(validSession);
        const admin = await checkAdminRole(validSession.user.id, validSession.access_token);
        setIsAdmin(admin);
      } else {
        // Try refresh
        try {
          const refreshData = await fetchAuth("token?grant_type=refresh_token", {
            refresh_token: saved.refresh_token,
          });
          const newSession: Session = {
            access_token: refreshData.access_token,
            refresh_token: refreshData.refresh_token,
            user: { id: refreshData.user.id, email: refreshData.user.email },
          };
          setSession(newSession);
          setUser(newSession.user);
          saveSession(newSession);
          const admin = await checkAdminRole(newSession.user.id, newSession.access_token);
          setIsAdmin(admin);
        } catch {
          // Session expired
          saveSession(null);
        }
      }
    } catch {
      saveSession(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // Safety timeout
    const timeout = setTimeout(() => setLoading(false), 5000);
    restoreSession().finally(() => clearTimeout(timeout));
    return () => clearTimeout(timeout);
  }, [restoreSession]);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await fetchAuth("token?grant_type=password", { email, password });
      const newSession: Session = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: { id: data.user.id, email: data.user.email },
      };
      setSession(newSession);
      setUser(newSession.user);
      saveSession(newSession);
      const admin = await checkAdminRole(newSession.user.id, newSession.access_token);
      setIsAdmin(admin);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    if (session?.access_token) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      } catch {}
    }
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    saveSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
