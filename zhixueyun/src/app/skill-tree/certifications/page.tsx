"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const certifications = [
  {
    id: "web-dev",
    title: "Web开发认证",
    level: "中级",
    description: "验证Web开发相关技能，包括前端开发和基础后端知识",
    requirements: [
      "HTML5 & CSS3基础",
      "JavaScript编程能力",
      "React或Vue框架使用经验",
      "基础后端开发知识"
    ],
    duration: "120分钟",
    questions: 100,
    price: 200,
    passRate: "75%"
  },
  {
    id: "data-analysis",
    title: "数据分析认证",
    level: "高级",
    description: "验证数据分析能力，包括数据处理、统计分析和数据可视化",
    requirements: [
      "Python数据分析",
      "统计学基础",
      "数据可视化技能",
      "机器学习基础"
    ],
    duration: "180分钟",
    questions: 120,
    price: 300,
    passRate: "70%"
  }
];

export default function CertificationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">技能认证</h1>
          <div className="grid gap-6 md:grid-cols-2">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{cert.title}</h2>
                    <Badge>{cert.level}</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {cert.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">时长: {cert.duration}</Badge>
                    <Badge variant="outline">题目: {cert.questions}题</Badge>
                    <Badge variant="outline">通过率: {cert.passRate}</Badge>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">要求技能：</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {cert.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {cert.price} 技能点
                    </div>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      开始认证
                    </Button>
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