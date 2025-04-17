"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // 在组件挂载时检查本地存储中的用户信息
  useEffect(() => {
    if (!isBrowser) return;

    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("验证本地存储中的用户信息时出错:", error);
        // 清除可能损坏的数据
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (phone: string, code: string) => {
    if (!isBrowser) {
      throw new Error("登录功能只能在客户端使用");
    }

    try {
      setIsLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户数据
      const userData: User = {
        id: "user123",
        name: "智学云用户",
        phone: phone,
        email: "example@example.com",
        avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${phone}`
      };
      
      // 模拟令牌
      const token = "mock_jwt_token_" + Date.now();
      
      // 存储用户数据和令牌
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      
      setUser(userData);
    } catch (error) {
      console.error("登录失败:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (!isBrowser) return;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // 如果在服务器端或者初始化未完成，返回加载状态
  if (!isBrowser || !isInitialized) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          isLoading: true,
          login,
          logout
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth必须在AuthProvider内部使用");
  }
  return context;
} 