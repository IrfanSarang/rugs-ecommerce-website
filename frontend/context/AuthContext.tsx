"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/api";

interface AuthContextType {
    user: any;
    login: (userData: any, redirectUrl?: string) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await apiCall("/auth/profile");
                setUser(data);
            } catch (error) {
                // If 401, user is just not logged in which is fine
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData: any, redirectUrl?: string) => {
        setUser(userData);
        if (redirectUrl) {
            router.push(redirectUrl);
        } else {
            router.push("/");
        }
    };

    const logout = async () => {
        try {
            await apiCall("/auth/logout", "POST");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
