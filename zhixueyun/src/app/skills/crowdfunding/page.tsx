"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CrowdfundingCourse {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  category: string;
  targetAmount: number;
  currentAmount: number;
  supporterCount: number;
  deadline: string;
  thumbnail: string;
  status: "进行中" | "即将开始" | "已结束";
  skillPoints: number;
}

const crowdfundingCourses: CrowdfundingCourse[] = [
  {
    id: "cf-001",
    title: "区块链技术与应用开发",
    description: "从零开始学习区块链技术，掌握智能合约开发，构建去中心化应用（DApp）。",
    instructor: {
      name: "张教授",
      title: "区块链技术专家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    category: "编程开发",
    targetAmount: 10000,
    currentAmount: 6800,
    supporterCount: 168,
    deadline: "2024-04-30",
    thumbnail: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    status: "进行中",
    skillPoints: 200
  },
  {
    id: "cf-002",
    title: "AI绘画与数字艺术创作",
    description: "探索AI辅助创作的前沿技术，掌握Stable Diffusion、Midjourney等工具的专业应用。",
    instructor: {
      name: "李艺",
      title: "数字艺术家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    category: "设计创意",
    targetAmount: 8000,
    currentAmount: 2400,
    supporterCount: 89,
    deadline: "2024-05-15",
    thumbnail: "https://images.unsplash.com/photo-1634129675882-aa9c4478c4e6",
    status: "进行中",
    skillPoints: 150
  },
  {
    id: "cf-003",
    title: "元宇宙产品设计与开发",
    description: "学习虚拟现实和增强现实技术，打造沉浸式元宇宙产品体验。",
    instructor: {
      name: "王工",
      title: "元宇宙产品专家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    },
    category: "设计创意",
    targetAmount: 15000,
    currentAmount: 3000,
    supporterCount: 45,
    deadline: "2024-06-01",
    thumbnail: "https://images.unsplash.com/photo-1614066891961-c919d63ea260",
    status: "即将开始",
    skillPoints: 300
  }
];

export default function CrowdfundingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"全部" | "进行中" | "即将开始" | "已结束">("全部");

  const filteredCourses = crowdfundingCourses
    .filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(course => filter === "全部" ? true : course.status === filter);

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    return "bg-orange-500";
  };

  const getStatusColor = (status: CrowdfundingCourse["status"]) => {
    switch (status) {
      case "进行中": return "bg-green-500";
      case "即将开始": return "bg-blue-500";
      case "已结束": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">课程众筹</h1>
              <Link href="/skills/crowdfunding/create">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  发起众筹
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              支持优质课程提案，用技能点投资未来的学习机会
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                type="search"
                placeholder="搜索课程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:max-w-xs"
              />
              <div className="flex flex-wrap gap-2">
                {(["全部", "进行中", "即将开始", "已结束"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    className={filter === status 
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white transition-colors"}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link href={`/skills/crowdfunding/${course.id}`} key={course.id}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 ${getStatusColor(course.status)}`}
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={course.instructor.avatar} />
                        <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{course.instructor.name}</p>
                        <p className="text-xs text-gray-500">{course.instructor.title}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>众筹进度</span>
                          <span>{Math.round((course.currentAmount / course.targetAmount) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(course.currentAmount / course.targetAmount) * 100}
                          className={getProgressColor(course.currentAmount, course.targetAmount)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">目标金额</p>
                          <p className="font-semibold">{course.targetAmount} 技能点</p>
                        </div>
                        <div>
                          <p className="text-gray-500">支持人数</p>
                          <p className="font-semibold">{course.supporterCount} 人</p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-gray-500">截止日期</p>
                        <p className="font-semibold">{formatDate(course.deadline)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 