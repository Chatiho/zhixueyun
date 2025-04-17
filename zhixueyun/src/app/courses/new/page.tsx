"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function NewCoursesPage() {
  const router = useRouter();

  // 示例最新课程数据
  const newCourses = [
    {
      id: "course-009",
      title: "Flutter移动应用开发实战",
      instructor: "徐飞",
      instructorTitle: "移动开发专家",
      category: "编程开发",
      price: 329,
      rating: 4.7,
      reviewCount: 78,
      thumbnail: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800&auto=format&fit=crop",
      isNew: true,
      publishDate: "2023-10-15",
      tags: ["Flutter", "移动开发", "跨平台"],
      description: "从零开始学习Flutter，掌握跨平台移动应用开发技术，打造精美的移动App。",
    },
    {
      id: "course-010",
      title: "数据驱动营销：提升ROI策略",
      instructor: "周芳",
      instructorTitle: "营销总监",
      category: "商业管理",
      price: 249,
      rating: 4.5,
      reviewCount: 43,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      isNew: true,
      publishDate: "2023-10-10",
      tags: ["营销", "数据分析", "ROI优化"],
      description: "学习如何利用数据分析来优化营销策略，提高营销投资回报率。",
    },
    {
      id: "course-011",
      title: "后端架构设计与性能优化",
      instructor: "刘强",
      instructorTitle: "架构师",
      category: "编程开发",
      price: 399,
      rating: 4.9,
      reviewCount: 67,
      thumbnail: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?q=80&w=800&auto=format&fit=crop",
      isNew: true,
      publishDate: "2023-10-05",
      tags: ["后端", "架构设计", "性能优化"],
      description: "深入学习后端系统架构设计原则与实践，掌握系统性能优化的关键技术。",
    },
    {
      id: "course-012",
      title: "Python数据科学入门到精通",
      instructor: "张明",
      instructorTitle: "数据科学家",
      category: "数据分析",
      price: 349,
      rating: 4.8,
      reviewCount: 91,
      thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=800&auto=format&fit=crop",
      isNew: true,
      publishDate: "2023-09-28",
      tags: ["Python", "数据科学", "机器学习"],
      description: "系统学习Python数据科学生态，掌握数据分析、可视化和机器学习基础。",
    },
    {
      id: "course-013",
      title: "零基础UI设计入门",
      instructor: "李颖",
      instructorTitle: "资深UI设计师",
      category: "设计创意",
      price: 199,
      rating: 4.6,
      reviewCount: 112,
      thumbnail: "https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?q=80&w=800&auto=format&fit=crop",
      isNew: true,
      publishDate: "2023-09-20",
      tags: ["UI设计", "设计原则", "Figma"],
      description: "从零基础开始学习UI设计，掌握设计原则、工具使用和实战技巧。",
    },
    {
      id: "course-014",
      title: "区块链技术与应用开发",
      instructor: "王刚",
      instructorTitle: "区块链专家",
      category: "编程开发",
      price: 449,
      rating: 4.7,
      reviewCount: 58,
      thumbnail: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=800&auto=format&fit=crop",
      isNew: true,
      publishDate: "2023-09-15",
      tags: ["区块链", "智能合约", "DApp"],
      description: "深入了解区块链技术原理，学习智能合约开发和去中心化应用构建。",
    },
  ];

  // 处理课程点击
  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">最新课程</h1>
            <p className="text-gray-600 dark:text-gray-400">
              探索刚刚上线的新课程，抢先学习最新知识
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
                  placeholder="搜索最新课程..."
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
            {newCourses.map((course) => (
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
                    <Badge className="bg-gradient-to-r from-green-500 to-teal-500">
                      新课
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {course.description}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                      发布于: {formatDate(course.publishDate)}
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