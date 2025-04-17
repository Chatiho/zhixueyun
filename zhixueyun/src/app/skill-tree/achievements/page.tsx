"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const achievements = [
  {
    id: "frontend-master",
    title: "前端大师",
    description: "完成所有前端开发相关课程",
    progress: 75,
    total: 12,
    completed: 9,
    badges: [
      {
        name: "HTML5专家",
        icon: "🏆",
        acquired: true
      },
      {
        name: "CSS大师",
        icon: "🎨",
        acquired: true
      },
      {
        name: "JavaScript高手",
        icon: "⚡",
        acquired: true
      },
      {
        name: "React专家",
        icon: "⚛️",
        acquired: false
      }
    ]
  },
  {
    id: "backend-expert",
    title: "后端专家",
    description: "完成所有后端开发相关课程",
    progress: 60,
    total: 15,
    completed: 9,
    badges: [
      {
        name: "Java工程师",
        icon: "☕",
        acquired: true
      },
      {
        name: "Python高手",
        icon: "🐍",
        acquired: true
      },
      {
        name: "数据库专家",
        icon: "💾",
        acquired: false
      },
      {
        name: "微服务架构师",
        icon: "🌐",
        acquired: false
      }
    ]
  }
];

export default function AchievementsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">成就中心</h1>
          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{achievement.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {achievement.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">完成进度</span>
                      <span className="text-sm font-medium">
                        {achievement.completed}/{achievement.total}
                      </span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">已获得的徽章：</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {achievement.badges.map((badge) => (
                        <div
                          key={badge.name}
                          className={`flex items-center p-3 rounded-lg border ${
                            badge.acquired
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                              : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-50"
                          }`}
                        >
                          <span className="text-2xl mr-3">{badge.icon}</span>
                          <div>
                            <div className="font-medium">{badge.name}</div>
                            <Badge variant={badge.acquired ? "default" : "secondary"}>
                              {badge.acquired ? "已获得" : "未获得"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 