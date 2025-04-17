"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// 通知类型定义
export type NotificationType = "system" | "course" | "live" | "like" | "reward" | "comment" | "achievement" | "alert" | "message";

// 通知优先级
export type PriorityLevel = "high" | "medium" | "low";

// 定义通知对象的类型
export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  isRead: boolean;
  date: Date;
  priority?: PriorityLevel;
  actionUrl?: string;
  url?: string;
  relatedId?: string;
  tags?: string[];
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, "id" | "date" | "time" | "isRead">) => void;
  getNotificationsByType: (type: NotificationType | "all" | "unread" | "read") => Notification[];
  getNotificationsWithSearch: (searchTerm: string) => Notification[];
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

export interface NotificationSettings {
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  enableSoundEffects: boolean;
  dailyDigest: boolean;
  muteLiveNotifications: boolean;
  muteCommentNotifications: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 初始示例通知
const initialNotifications: Notification[] = [
  { 
    id: 1, 
    title: "课程更新", 
    message: "《Python基础入门》课程已更新新章节", 
    time: "10分钟前", 
    type: "course", 
    isRead: false,
    date: new Date(Date.now() - 10 * 60 * 1000),
    priority: "medium",
    actionUrl: "/skills/python-basic",
    tags: ["课程", "更新"]
  },
  { 
    id: 2, 
    title: "系统通知", 
    message: "您的账户信息已成功更新", 
    time: "30分钟前", 
    type: "system", 
    isRead: false,
    date: new Date(Date.now() - 30 * 60 * 1000),
    priority: "low",
    tags: ["账户", "信息"]
  },
  { 
    id: 3, 
    title: "技能点奖励", 
    message: "您因完成《数据结构》课程测验获得了15个技能点", 
    time: "1小时前", 
    type: "reward", 
    isRead: false,
    date: new Date(Date.now() - 60 * 60 * 1000),
    priority: "medium",
    actionUrl: "/wallet",
    tags: ["奖励", "技能点"]
  },
  { 
    id: 4, 
    title: "直播提醒", 
    message: "张教授的《机器学习实战》直播将于今天下午2点开始", 
    time: "2小时前", 
    type: "live", 
    isRead: true,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    priority: "high",
    actionUrl: "/live/ml-workshop",
    tags: ["直播", "机器学习"]
  },
  { 
    id: 5, 
    title: "点赞通知", 
    message: "李明对您的课程《Web前端开发》点了赞", 
    time: "昨天", 
    type: "like", 
    isRead: true,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    priority: "low",
    actionUrl: "/my-courses/web-frontend",
    tags: ["社交", "点赞"]
  },
];

const defaultSettings: NotificationSettings = {
  enableEmailNotifications: true,
  enablePushNotifications: true,
  enableSoundEffects: true,
  dailyDigest: false,
  muteLiveNotifications: false,
  muteCommentNotifications: false,
};

// 格式化时间函数
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? "昨天" : days > 7 ? `${Math.floor(days / 7)}周前` : `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return "刚刚";
  }
};

export const NotificationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultSettings);
  
  // 获取未读通知数量
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  // 标记通知为已读
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success("全部通知已标记为已读");
  };
  
  // 删除指定通知
  const deleteNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  // 清空所有通知
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("已清空所有通知");
  };
  
  // 添加新通知
  const addNotification = (notification: Omit<Notification, "id" | "date" | "time" | "isRead">) => {
    const now = new Date();
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      date: now,
      time: "刚刚",
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // 根据设置决定是否显示提示
    if (
      (notification.type === "live" && notificationSettings.muteLiveNotifications) ||
      (notification.type === "comment" && notificationSettings.muteCommentNotifications)
    ) {
      return;
    }
    
    // 显示通知提示
    if (notificationSettings.enablePushNotifications) {
      toast(newNotification.title, {
        description: newNotification.message,
        action: {
          label: "查看",
          onClick: () => markAsRead(newNotification.id)
        },
      });
    }
    
    // 播放通知声音
    if (notificationSettings.enableSoundEffects) {
      // 模拟播放声音
      console.log("播放通知声音");
    }
  };
  
  // 根据类型获取通知
  const getNotificationsByType = (type: NotificationType | "all" | "unread" | "read"): Notification[] => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter(notification => !notification.isRead);
    if (type === "read") return notifications.filter(notification => notification.isRead);
    return notifications.filter(notification => notification.type === type);
  };
  
  // 搜索通知
  const getNotificationsWithSearch = (searchTerm: string): Notification[] => {
    if (!searchTerm.trim()) return notifications;
    
    const term = searchTerm.toLowerCase();
    return notifications.filter(
      notification => 
        notification.title.toLowerCase().includes(term) ||
        notification.message.toLowerCase().includes(term) ||
        notification.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  };
  
  // 更新通知设置
  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({
      ...prev,
      ...settings,
    }));
  };
  
  // 定期更新相对时间
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          time: formatTimeAgo(notification.date)
        }))
      );
    }, 60000); // 每分钟更新一次
    
    return () => clearInterval(intervalId);
  }, []);
  
  // 模拟随机接收新通知
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.15) { // 15%概率收到新通知
        const types: NotificationType[] = ["system", "course", "live", "reward", "like", "comment"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        let title = "";
        let message = "";
        let priority: PriorityLevel = "medium";
        let tags: string[] = [];
        let actionUrl = "";
        
        switch (randomType) {
          case "system":
            title = "系统通知";
            message = "您的账户安全检查已完成，一切正常";
            tags = ["系统", "安全"];
            priority = "low";
            break;
          case "course":
            title = "课程推荐";
            message = `根据您的兴趣，推荐《${['Web开发','AI编程','大数据分析'][Math.floor(Math.random() * 3)]}》课程`;
            tags = ["推荐", "学习"];
            actionUrl = "/recommendations";
            break;
          case "live":
            title = "直播预告";
            message = "明天下午3点将有《高效学习方法》直播课，不要错过";
            tags = ["直播", "预告"];
            priority = "high";
            actionUrl = "/live";
            break;
          case "reward":
            title = "技能点奖励";
            message = `恭喜您获得${Math.floor(Math.random() * 20) + 5}技能点奖励`;
            tags = ["奖励", "技能点"];
            actionUrl = "/wallet";
            break;
          case "like":
            title = "点赞通知";
            message = "您的课程分享获得了新的点赞";
            tags = ["社交", "点赞"];
            break;
          case "comment":
            title = "评论回复";
            message = "有人回复了您的评论，点击查看";
            tags = ["评论", "互动"];
            actionUrl = "/comments";
            break;
        }
        
        addNotification({
          title,
          message,
          type: randomType,
          priority,
          tags,
          actionUrl: actionUrl || undefined,
        });
      }
    }, 60000); // 每分钟检查
    
    return () => clearInterval(intervalId);
  }, [notificationSettings]);
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
        getNotificationsByType,
        getNotificationsWithSearch,
        notificationSettings,
        updateNotificationSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}; 