"use client";

import React from "react";
import { useNotifications } from "@/contexts/notification-context";
import { ChevronLeft, BarChart4, PieChart, TrendingUp, Download, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// 类型定义
type Period = "week" | "month" | "year";
type ChartData = {
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  priorityDistribution: Array<{
    priority: string;
    count: number;
    percentage: number;
  }>;
  readRateData: Array<{
    day: number;
    readRate: number;
  }>;
  readRate: number;
  readCount: number;
  unreadCount: number;
};

// 通知类型映射
const notificationTypeMap: Record<string, string> = {
  system: "系统通知",
  course: "课程通知",
  live: "直播通知",
  like: "点赞通知",
  reward: "奖励通知",
  comment: "评论通知"
};

// 优先级颜色映射
const priorityColorMap: Record<string, { bg: string, text: string }> = {
  high: { bg: "rgba(239, 68, 68, 0.1)", text: "rgb(239, 68, 68)" },
  medium: { bg: "rgba(59, 130, 246, 0.1)", text: "rgb(59, 130, 246)" },
  low: { bg: "rgba(107, 114, 128, 0.1)", text: "rgb(107, 114, 128)" }
};

// 子组件: 类型分布图表
const TypeDistributionChart = ({ data }: { data: ChartData["typeDistribution"] }) => (
  <div className="mt-6 space-y-4">
    {data.map(({ type, count, percentage }) => (
      <div key={type} className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{notificationTypeMap[type] || type}</span>
          <span>{count} ({percentage}%)</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    ))}
  </div>
);

// 子组件: 优先级分布图表
const PriorityDistributionChart = ({ data }: { data: ChartData["priorityDistribution"] }) => (
  <div className="grid grid-cols-3 gap-4 mt-6">
    {data.map(({ priority, count, percentage }) => {
      const colors = priorityColorMap[priority];
      return (
        <motion.div
          key={priority}
          className="flex flex-col items-center p-4 rounded-lg"
          style={{ backgroundColor: colors.bg }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: `${colors.text}20` }}
          >
            <span className="text-2xl font-bold" style={{ color: colors.text }}>
              {percentage}%
            </span>
          </div>
          <span className="font-medium">
            {priority === "high" ? "高优先级" :
             priority === "medium" ? "中优先级" :
             "低优先级"}
          </span>
          <span className="text-sm text-gray-500 mt-1">{count}条</span>
        </motion.div>
      );
    })}
  </div>
);

// 子组件: 阅读率图表
const ReadRateChart = ({ data }: { data: Omit<ChartData, "typeDistribution" | "priorityDistribution"> }) => (
  <div className="mt-6">
    <div className="flex justify-between items-center mb-6">
      <div className="flex-1">
        <div className="text-3xl font-bold text-blue-500">{data.readRate}%</div>
        <div className="text-sm text-gray-500">通知阅读率</div>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
          <span className="text-sm">已读 ({data.readCount})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
          <span className="text-sm">未读 ({data.unreadCount})</span>
        </div>
      </div>
    </div>

    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${data.readRate}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>

    <div className="mt-8">
      <h3 className="font-medium mb-4">阅读率趋势</h3>
      <div className="flex justify-between items-end h-40">
        {data.readRateData.map(({ day, readRate }, index) => (
          <div key={day} className="flex flex-col items-center">
            <motion.div
              className="w-8 bg-blue-500 rounded-t"
              style={{ maxWidth: "24px" }}
              initial={{ height: 0 }}
              animate={{ height: `${readRate / 100 * 150}px` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
            <span className="text-xs mt-2">{index + 1}日</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 主组件
const NotificationAnalyticsPage = () => {
  const { notifications } = useNotifications();
  const [period, setPeriod] = React.useState<Period>("month");
  const [chartData, setChartData] = React.useState<ChartData>({
    typeDistribution: [],
    priorityDistribution: [],
    readRateData: [],
    readRate: 0,
    readCount: 0,
    unreadCount: 0
  });

  // 计算统计数据
  React.useEffect(() => {
    if (!notifications.length) return;

    // 类型分布
    const typeCount: Record<string, number> = {};
    notifications.forEach(notification => {
      typeCount[notification.type] = (typeCount[notification.type] || 0) + 1;
    });
    const typeDistribution = Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / notifications.length) * 100)
    }));

    // 优先级分布
    const priorityCount: Record<string, number> = {};
    notifications.forEach(notification => {
      const priority = notification.priority || "medium";
      priorityCount[priority] = (priorityCount[priority] || 0) + 1;
    });
    const priorityDistribution = Object.entries(priorityCount).map(([priority, count]) => ({
      priority,
      count,
      percentage: Math.round((count / notifications.length) * 100)
    }));

    // 阅读率数据
    const readCount = notifications.filter(n => n.isRead).length;
    const unreadCount = notifications.length - readCount;
    const readRate = Math.round((readCount / notifications.length) * 100);
    
    // 模拟趋势数据
    const readRateData = Array(7).fill(0).map((_, i) => ({
      day: i,
      readRate: Math.round(50 + Math.random() * 40)
    }));

    setChartData({
      typeDistribution,
      priorityDistribution,
      readRateData,
      readRate,
      readCount,
      unreadCount
    });
  }, [notifications, period]);

  return (
    <div className="container max-w-4xl py-8">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/notifications" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>返回</span>
          </Link>
          <h1 className="text-2xl font-bold">通知分析</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 时间选择器 */}
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="year">今年</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* 导出按钮 */}
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-400 cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="space-y-6">
        {/* 通知类型分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart4 className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">通知类型分布</h2>
          </div>
          <TypeDistributionChart data={chartData.typeDistribution} />
        </motion.div>

        {/* 优先级分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">优先级分布</h2>
          </div>
          <PriorityDistributionChart data={chartData.priorityDistribution} />
        </motion.div>

        {/* 通知阅读率 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">通知阅读率</h2>
          </div>
          <ReadRateChart data={chartData} />
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationAnalyticsPage; 