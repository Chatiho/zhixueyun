"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const learningPaths = [
  {
    id: "frontend",
    title: "前端开发工程师",
    description: "从零开始学习前端开发，掌握HTML、CSS、JavaScript等核心技术",
    level: "入门到高级",
    duration: "6-12个月",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Vue", "Node.js"],
    courses: 12,
    students: 1500,
  },
  {
    id: "backend",
    title: "后端开发工程师",
    description: "系统学习后端开发，掌握Java、Python等编程语言和数据库技术",
    level: "入门到高级",
    duration: "8-14个月",
    skills: ["Java", "Python", "MySQL", "Redis", "Spring Boot", "微服务"],
    courses: 15,
    students: 1200,
  },
];

export default function LearningPathsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">学习路径</h1>
          <div className="grid gap-6 md:grid-cols-2">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{path.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {path.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">难度: {path.level}</Badge>
                    <Badge variant="outline">时长: {path.duration}</Badge>
                    <Badge variant="outline">{path.courses}门课程</Badge>
                    <Badge variant="outline">{path.students}名学员</Badge>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">包含技能：</h3>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    开始学习
                  </Button>
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