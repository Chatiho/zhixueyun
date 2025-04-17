"use client";

import { useState, useEffect, useCallback } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dot, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Filter, 
  Archive, 
  Mail, 
  MailOpen, 
  Clock,
  AlertCircle,
  Gift,
  Video,
  BookOpen,
  ThumbsUp,
  Search,
  ArrowUpDown,
  CalendarDays,
  Download,
  Upload,
  Settings,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNotifications, Notification, NotificationType, PriorityLevel } from "@/contexts/notification-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationCard } from "@/components/notification-card";
import { motion, AnimatePresence } from "framer-motion";

// 用于渲染不同类型通知的图标
const NotificationIcon = ({ type, priority }: { type: NotificationType; priority?: PriorityLevel }) => {
  const priorityColor = priority === 'high' ? 'animate-pulse text-red-500' : '';
  
  switch (type) {
    case "system":
      return <AlertCircle className={`h-6 w-6 text-blue-500 ${priorityColor}`} />;
    case "course":
      return <BookOpen className={`h-6 w-6 text-green-500 ${priorityColor}`} />;
    case "live":
      return <Video className={`h-6 w-6 text-red-500 ${priorityColor}`} />;
    case "like":
      return <ThumbsUp className={`h-6 w-6 text-pink-500 ${priorityColor}`} />;
    case "reward":
      return <Gift className={`h-6 w-6 text-amber-500 ${priorityColor}`} />;
    case "comment":
      return <Mail className={`h-6 w-6 text-purple-500 ${priorityColor}`} />;
    default:
      return <Bell className={`h-6 w-6 text-gray-500 ${priorityColor}`} />;
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsWithSearch,
    notificationSettings,
    updateNotificationSettings
  } = useNotifications();
  
  // 搜索和排序状态
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "priority">("newest");
  
  // 通知设置对话框状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // 当前激活的通知标签
  const [activeTab, setActiveTab] = useState<NotificationType | "all" | "unread" | "read">("all");
  
  // 过滤并排序通知
  const getFilteredAndSortedNotifications = useCallback(() => {
    // 先根据标签过滤
    let filtered = getNotificationsByType(activeTab);
    
    // 根据搜索词过滤
    if (searchTerm.trim() !== "") {
      filtered = getNotificationsWithSearch(searchTerm);
      
      // 再次应用类型过滤
      if (activeTab !== "all") {
        if (activeTab === "unread") {
          filtered = filtered.filter(n => !n.isRead);
        } else if (activeTab === "read") {
          filtered = filtered.filter(n => n.isRead);
        } else {
          filtered = filtered.filter(n => n.type === activeTab);
        }
      }
    }
    
    // 排序
    return [...filtered].sort((a, b) => {
      if (sortOrder === "newest") {
        return b.date.getTime() - a.date.getTime();
      } else if (sortOrder === "oldest") {
        return a.date.getTime() - b.date.getTime();
      } else {
        // 按优先级排序
        const priorityValue = { high: 3, medium: 2, low: 1 };
        return (priorityValue[b.priority || "low"] || 0) - (priorityValue[a.priority || "low"] || 0);
      }
    });
  }, [getNotificationsByType, getNotificationsWithSearch, activeTab, searchTerm, sortOrder]);
  
  const filteredNotifications = getFilteredAndSortedNotifications();

  // 添加页面分析
  useEffect(() => {
    // 模拟页面数据分析
    console.log("通知页面访问", { 
      unreadCount, 
      totalCount: notifications.length,
      activeTab
    });
  }, []);

  // 页面容器动画变量
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            {/* 标题栏和主要操作 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bell className="h-7 w-7 text-green-500" />
                通知中心
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white ml-2 animate-pulse">
                    <span>{unreadCount} 未读</span>
                  </Badge>
                )}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/notifications/analytics">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      通知分析
                    </span>
                  </Button>
                </Link>
                
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="搜索通知..." 
                    className="pl-10 w-full md:w-[200px] bg-white/80 dark:bg-gray-800/80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <span className="flex items-center gap-1">
                        <ArrowUpDown className="h-4 w-4" />
                        {sortOrder === "newest" ? "最新优先" : 
                         sortOrder === "oldest" ? "最早优先" : "优先级"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                      <span>最新优先</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                      <span>最早优先</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("priority")}>
                      <span>按优先级</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <span className="flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        筛选
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setActiveTab("all")}>
                      <span>所有通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("unread")}>
                      <span>未读通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("read")}>
                      <span>已读通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab("system")}>
                      <span>系统通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("course")}>
                      <span>课程通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("live")}>
                      <span>直播通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("reward")}>
                      <span>奖励通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("like")}>
                      <span>社交通知</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1"
                >
                  <span className="flex items-center gap-1">
                    <CheckCheck className="h-4 w-4" />
                    全部已读
                  </span>
                </Button>
                
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <span className="flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        设置
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>通知设置</DialogTitle>
                      <DialogDescription>
                        自定义您希望接收的通知类型和接收方式
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-notifications" className="text-sm font-medium">
                          电子邮件通知
                        </label>
                        <input
                          id="email-notifications"
                          type="checkbox"
                          checked={notificationSettings.enableEmailNotifications}
                          onChange={(e) => updateNotificationSettings({enableEmailNotifications: e.target.checked})}
                          className="h-4 w-4 text-green-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="push-notifications" className="text-sm font-medium">
                          推送通知
                        </label>
                        <input
                          id="push-notifications"
                          type="checkbox"
                          checked={notificationSettings.enablePushNotifications}
                          onChange={(e) => updateNotificationSettings({enablePushNotifications: e.target.checked})}
                          className="h-4 w-4 text-green-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="sound-effects" className="text-sm font-medium">
                          声音效果
                        </label>
                        <input
                          id="sound-effects"
                          type="checkbox"
                          checked={notificationSettings.enableSoundEffects}
                          onChange={(e) => updateNotificationSettings({enableSoundEffects: e.target.checked})}
                          className="h-4 w-4 text-green-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="daily-digest" className="text-sm font-medium">
                          每日通知摘要
                        </label>
                        <input
                          id="daily-digest"
                          type="checkbox"
                          checked={notificationSettings.dailyDigest}
                          onChange={(e) => updateNotificationSettings({dailyDigest: e.target.checked})}
                          className="h-4 w-4 text-green-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="mute-live" className="text-sm font-medium">
                          静音直播通知
                        </label>
                        <input
                          id="mute-live"
                          type="checkbox"
                          checked={notificationSettings.muteLiveNotifications}
                          onChange={(e) => updateNotificationSettings({muteLiveNotifications: e.target.checked})}
                          className="h-4 w-4 text-green-600"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="mute-comments" className="text-sm font-medium">
                          静音评论通知
                        </label>
                        <input
                          id="mute-comments"
                          type="checkbox"
                          checked={notificationSettings.muteCommentNotifications}
                          onChange={(e) => updateNotificationSettings({muteCommentNotifications: e.target.checked})}
                          className="h-4 w-4 text-green-600"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        toast.success("通知设置已保存");
                        setIsSettingsOpen(false);
                      }}>
                        <span>保存设置</span>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <span className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    清空
                  </span>
                </Button>
              </div>
            </div>
            
            {/* 通知类型标签 */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
              <TabsList className="grid grid-cols-4 md:grid-cols-7 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl">
                <TabsTrigger value="all" className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">
                  <span className="flex items-center gap-1">
                    <Archive className="h-4 w-4" />
                    <span className="hidden md:inline">全部</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">
                  <span className="flex items-center gap-1">
                    <MailOpen className="h-4 w-4" />
                    <span className="hidden md:inline">未读</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span className="hidden md:inline">系统</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="course" className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden md:inline">课程</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="live" className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all md:block">
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    <span className="hidden md:inline">直播</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="reward" className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all md:block">
                  <span className="flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    <span className="hidden md:inline">奖励</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="like" className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all md:block">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="hidden md:inline">点赞</span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* 通知列表 */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-100 dark:border-green-900/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {activeTab === "all" ? <Archive className="h-5 w-5" /> : 
                     activeTab === "unread" ? <MailOpen className="h-5 w-5" /> : 
                     activeTab === "read" ? <Mail className="h-5 w-5" /> : 
                     activeTab === "system" ? <AlertCircle className="h-5 w-5" /> : 
                     activeTab === "course" ? <BookOpen className="h-5 w-5" /> : 
                     activeTab === "live" ? <Video className="h-5 w-5" /> : 
                     activeTab === "reward" ? <Gift className="h-5 w-5" /> :
                     activeTab === "like" ? <ThumbsUp className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                    <span>
                      {activeTab === "all" ? "所有通知" : 
                       activeTab === "unread" ? "未读通知" : 
                       activeTab === "read" ? "已读通知" : 
                       activeTab === "system" ? "系统通知" : 
                       activeTab === "course" ? "课程通知" : 
                       activeTab === "live" ? "直播通知" : 
                       activeTab === "reward" ? "奖励通知" :
                       activeTab === "like" ? "点赞通知" : "通知"}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-normal text-gray-500 flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>共 {filteredNotifications.length} 条</span>
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <span>
                            <Download className="h-4 w-4" />
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.success("已导出为PDF")}>
                          <span>导出为PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("已导出为CSV")}>
                          <span>导出为CSV</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(100vh-350px)] overflow-y-auto">
                  {filteredNotifications.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      <AnimatePresence>
                        {filteredNotifications.map((notification) => (
                          <NotificationCard 
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onDelete={deleteNotification}
                            onAction={(url) => {
                              // 标记为已读并跳转
                              if (!notification.isRead) {
                                markAsRead(notification.id);
                              }
                              // 实际跳转
                              router.push(url as string);
                            }}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : searchTerm ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <p><span>没有找到包含 "{searchTerm}" 的通知</span></p>
                      <Button variant="link" onClick={() => setSearchTerm("")}>
                        <span>清除搜索</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <p><span>暂无通知</span></p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 