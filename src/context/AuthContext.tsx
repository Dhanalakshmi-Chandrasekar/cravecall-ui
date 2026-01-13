import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
    id?: string;
    email: string;
    name?: string;
    role?: string;
};

type AuthResult = { error?: { message: string } };

type AuthContextType = {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthResult>;
    signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:9002";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Optional: restore user if you have /users/me (with auth)
    useEffect(() => {
        const restoreUser = async () => {
            const savedToken = localStorage.getItem("token");

            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${savedToken}`,
                    },
                });

                if (!res.ok) throw new Error("Unauthorized");

                const data = await res.json();
                setUser(data); // { name, email, role, ... }
                setToken(savedToken);
            } catch {
                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        restoreUser();
    }, []);

    const signIn = async (email: string, password: string): Promise<AuthResult> => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                return { error: { message: data?.detail || data?.message || "Login failed" } };
            }

            const accessToken = data?.access_token || data?.token || null;

            // If backend doesn't return token yet, still allow login UI success
            if (accessToken) {
                localStorage.setItem("token", accessToken);
                setToken(accessToken);
            }

            setUser(data?.user || { email, name: data?.name });

            return {};
        } catch (e: any) {
            return { error: { message: e?.message || "Network error" } };
        }
    };

    const signUp = async (
        name: string,
        email: string,
        password: string
    ): Promise<AuthResult> => {
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                return {
                    error: { message: data?.detail || data?.message || "Register failed" },
                };
            }

            // ✅ DO NOT store token
            // ✅ DO NOT set user
            // Just show success and go to login

            return {};
        } catch (e: any) {
            return { error: { message: e?.message || "Network error" } };
        }
    };


    const signOut = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({ user, token, loading, signIn, signUp, signOut }),
        [user, token, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
