"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// 用户类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "teacher" | "admin";
  createdAt: Date;
  lastLogin: Date;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// 模拟用户数据
const mockUser: User = {
  id: "usr_123456",
  name: "张三",
  email: "zhangsan@example.com",
  avatar: "/avatars/default.svg",
  role: "student",
  createdAt: new Date("2023-01-15"),
  lastLogin: new Date(),
};

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 模拟检查用户会话
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // 在实际应用中，这里会调用API检查用户会话是否有效
        // 这里我们模拟已登录状态
        const savedUser = localStorage.getItem("user");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } else {
          // 开发环境下自动登录模拟用户
          if (process.env.NODE_ENV === "development") {
            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(mockUser));
          }
        }
      } catch (error) {
        console.error("检查用户会话时出错", error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    };
    
    checkUserSession();
  }, []);
  
  // 登录函数
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 在实际应用中，这里会调用API进行身份验证
      // 这里我们模拟成功登录
      if (email && password) {
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("登录成功");
        return true;
      }
      
      toast.error("用户名或密码错误");
      return false;
    } catch (error) {
      console.error("登录失败", error);
      toast.error("登录失败，请稍后再试");
      return false;
    }
  };
  
  // 登出函数
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast.success("已安全退出登录");
  };
  
  // 更新用户资料
  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // 在实际应用中，这里会调用API更新用户资料
      // 这里我们模拟成功更新
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("资料已更新");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("更新用户资料失败", error);
      toast.error("更新资料失败，请稍后再试");
      return false;
    }
  };
  
  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext必须在UserProvider内部使用");
  }
  return context;
}; 