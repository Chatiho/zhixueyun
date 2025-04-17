"use client";

import React, { useRef, useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Clock,
  AlertCircle,
  Gift,
  Video,
  BookOpen,
  ThumbsUp,
  Mail,
} from "lucide-react";
import { Notification, NotificationType, PriorityLevel } from "@/contexts/notification-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onAction?: (url: string) => void;
  className?: string;
  priority?: "high" | "medium" | "low";
  index?: number; // 用于动画序列
}

// 获取通知图标
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "course":
      return <BookOpen className="h-5 w-5 text-blue-500" />;
    case "live":
      return <Video className="h-5 w-5 text-red-500" />;
    case "achievement":
      return <Gift className="h-5 w-5 text-yellow-500" />;
    case "alert":
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    case "like":
      return <ThumbsUp className="h-5 w-5 text-pink-500" />;
    case "message":
      return <Mail className="h-5 w-5 text-indigo-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onAction,
  className,
  priority = "medium",
  index = 0,
}: NotificationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { id, title, message, time, isRead, type, url } = notification;

  // 根据优先级设置不同的动画效果
  const getPriorityStyles = () => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500 animate-border-pulse";
      case "medium":
        return "border-l-2 border-yellow-500";
      default:
        return "border-l border-gray-300 dark:border-gray-700";
    }
  };

  // 处理阅读通知
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRead) {
      onMarkAsRead(id);
    }
  };

  // 处理删除通知
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    // 动画完成后删除
    setTimeout(() => {
      onDelete(id);
    }, 300);
  };

  // 处理点击通知
  const handleCardClick = () => {
    if (url && onAction) {
      onAction(url);
    }
    setIsExpanded(!isExpanded);
    if (!isRead) {
      onMarkAsRead(id);
    }
  };

  // 处理键盘导航
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick();
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      x: -100, 
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isDeleting ? "exit" : "visible"}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200",
        getPriorityStyles(),
        !isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : "",
        url ? "cursor-pointer hover-scale" : "",
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={cardRef}
      role="button"
      aria-expanded={isExpanded}
    >
      <div className="p-4 flex items-start justify-between">
        {/* 通知图标 */}
        <div className="flex-shrink-0 mr-4 mt-1">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center animate-pop-in" style={{ animationDelay: `${index * 0.1}s` }}>
            {getNotificationIcon(type)}
          </div>
        </div>

        {/* 通知内容 */}
        <div className="flex-grow mr-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className={cn(
              "text-base font-medium",
              !isRead ? "font-semibold text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-gray-200"
            )}>
              {title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
              <span className="hidden md:inline">
                <Clock className="inline h-3 w-3 mr-1 -mt-0.5" />
              </span>
              {time}
            </span>
          </div>
          
          <p className={cn(
            "text-sm text-gray-600 dark:text-gray-400",
            isExpanded ? "" : "line-clamp-2"
          )}>
            {message}
          </p>

          {isExpanded && url && (
            <div className="mt-3 animate-fade-in-up">
              <a 
                href={url} 
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover-highlight inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                查看详情
              </a>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-shrink-0 flex-col space-y-2">
          {!isRead ? (
            <motion.button
              className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 dark:hover:text-blue-400 transition-colors duration-200"
              onClick={handleMarkAsRead}
              title="标记为已读"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCheck className="h-4 w-4" />
            </motion.button>
          ) : (
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-none animate-fade-in"
            >
              已读
            </Badge>
          )}
          
          <motion.button
            className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors duration-200"
            onClick={handleDelete}
            title="删除通知"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onAction?: (url: string) => void;
  className?: string;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  onAction,
  className,
}: NotificationListProps) {
  // 对通知按优先级进行排序
  const sortedNotifications = [...notifications].sort((a, b) => {
    // 优先展示未读通知
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    
    // 按优先级排序
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // 最后按时间排序
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className={cn("space-y-3", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sortedNotifications.length > 0 ? (
        sortedNotifications.map((notification, index) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onAction={onAction}
            priority={notification.priority}
            index={index}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 animate-float">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">暂无通知</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            您的通知将显示在这里
          </p>
        </div>
      )}
    </motion.div>
  );
} 