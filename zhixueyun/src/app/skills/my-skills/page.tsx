"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";

export default function MySkillsPage() {
  const { user } = useAuth();

  // 示例技能数据
  const skillCategories = [
    {
      name: "前端开发",
      level: 4,
      progress: 80,
      skills: [
        { name: "HTML/CSS", level: 5 },
        { name: "JavaScript", level: 4 },
        { name: "React", level: 4 },
        { name: "Vue", level: 3 },
        { name: "TypeScript", level: 4 },
      ],
    },
    {
      name: "后端开发",
      level: 3,
      progress: 60,
      skills: [
        { name: "Node.js", level: 4 },
        { name: "Python", level: 3 },
        { name: "数据库", level: 3 },
        { name: "API设计", level: 3 },
      ],
    },
    {
      name: "移动开发",
      level: 2,
      progress: 40,
      skills: [
        { name: "React Native", level: 2 },
        { name: "Flutter", level: 1 },
        { name: "移动UI设计", level: 2 },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          {/* 用户信息卡片 */}
          <Card className="mb-8">
            <CardContent className="flex items-center gap-6 py-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.[0] || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{user?.name || "用户"}</h2>
                <div className="flex gap-4 text-gray-600 dark:text-gray-400">
                  <span>技能等级: 23</span>
                  <span>•</span>
                  <span>已掌握技能: 12</span>
                  <span>•</span>
                  <span>学习时长: 168小时</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 技能分类卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <Badge variant="outline">
                      Lv.{category.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>掌握度</span>
                        <span>{category.progress}%</span>
                      </div>
                      <Progress value={category.progress} />
                    </div>
                    
                    <div className="space-y-2">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex justify-between items-center">
                          <span className="text-sm">{skill.name}</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < skill.level
                                    ? "bg-gradient-to-r from-green-400 to-blue-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
                        提升技能
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 学习建议 */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>学习建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">建议提升移动开发技能</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      您的移动开发技能还有提升空间，建议学习React Native进阶课程
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    查看课程
                  </Button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">前端开发技能优秀</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      建议尝试教授他人，提升教学技能
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    开始教学
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 