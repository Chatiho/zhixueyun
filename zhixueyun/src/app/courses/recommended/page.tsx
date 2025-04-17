"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function RecommendedCoursesPage() {
  const router = useRouter();

  // 示例推荐课程数据
  const recommendedCourses = [
    {
      id: "course-001",
      title: "React高级组件设计",
      instructor: "李明",
      instructorTitle: "资深前端架构师",
      category: "编程开发",
      price: 299,
      rating: 4.8,
      reviewCount: 246,
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=800&auto=format&fit=crop",
      featured: true,
      tags: ["React", "组件设计", "前端", "架构"],
      description: "学习如何设计可复用、高性能、易测试的React组件，掌握高级组件设计模式。",
    },
    {
      id: "course-003",
      title: "云原生应用架构",
      instructor: "张伟",
      instructorTitle: "云计算架构师",
      category: "云计算与DevOps",
      price: 399,
      rating: 4.9,
      reviewCount: 312,
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
      featured: true,
      tags: ["云原生", "微服务", "Docker", "Kubernetes"],
      description: "探索现代云原生应用的架构设计，学习容器化、微服务和服务网格等关键技术。",
    },
    {
      id: "course-005",
      title: "敏捷项目管理实战",
      instructor: "陈红",
      instructorTitle: "敏捷教练",
      category: "商业管理",
      price: 159,
      rating: 4.5,
      reviewCount: 230,
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      featured: true,
      tags: ["敏捷", "Scrum", "项目管理", "团队协作"],
      description: "学习敏捷项目管理的核心原则和实践，提高团队效率和产品交付质量。",
    },
    {
      id: "course-006",
      title: "机器学习模型部署与优化",
      instructor: "赵强",
      instructorTitle: "AI工程师",
      category: "人工智能",
      price: 499,
      rating: 4.8,
      reviewCount: 156,
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      featured: true,
      tags: ["机器学习", "模型部署", "优化", "MLOps"],
      description: "从理论到实践，学习如何高效部署和优化机器学习模型以用于生产环境。",
    },
    {
      id: "course-007",
      title: "高级JavaScript设计模式",
      instructor: "王峰",
      instructorTitle: "高级前端工程师",
      category: "编程开发",
      price: 279,
      rating: 4.7,
      reviewCount: 192,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop",
      featured: true,
      tags: ["JavaScript", "设计模式", "前端架构"],
      description: "掌握JavaScript高级设计模式，提升代码质量和可维护性，打造健壮的前端应用。",
    },
    {
      id: "course-008",
      title: "用户体验研究方法",
      instructor: "林小雨",
      instructorTitle: "UX研究员",
      category: "设计创意",
      price: 199,
      rating: 4.6,
      reviewCount: 178,
      thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
      featured: true,
      tags: ["UX", "用户研究", "设计思维"],
      description: "学习专业的用户体验研究方法，通过深入了解用户需求来创造更好的产品体验。",
    },
  ];

  // 处理课程点击
  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">推荐课程</h1>
            <p className="text-gray-600 dark:text-gray-400">
              精选高质量课程，助力你的学习与职业发展
            </p>
          </div>

          {/* 搜索框 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  type="search"
                  placeholder="搜索推荐课程..."
                  className="pl-10"
                />
              </div>
              <Link href="/courses/search">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full md:w-auto">
                  搜索
                </Button>
              </Link>
            </div>
          </div>

          {/* 课程列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-48">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                      推荐
                    </Badge>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {course.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {course.instructor} · {course.instructorTitle}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.934l6.18 3.625-1.626-7.03L20 7.934l-7.19-.618L10 1 7.19 7.316 0 7.934l5.445 4.595-1.626 7.03L10 15.934z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-1 text-sm font-medium">
                        {course.rating}
                      </span>
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        ({course.reviewCount})
                      </span>
                    </div>
                    <span className="font-bold text-lg">¥{course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 