"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// 课程分类
const categories = [
  { name: "全部课程", value: "all" },
  { name: "编程开发", value: "programming" },
  { name: "设计创意", value: "design" },
  { name: "商业管理", value: "business" },
  { name: "数据分析", value: "data" },
  { name: "云计算", value: "cloud" },
  { name: "人工智能", value: "ai" },
];

// 价格筛选
const priceFilters = [
  { name: "全部", value: "all" },
  { name: "免费", value: "free" },
  { name: "付费", value: "paid" },
];

// 示例课程数据
const coursesData = [
  {
    id: "course-001",
    title: "React高级组件设计",
    instructor: "李明",
    instructorTitle: "资深前端架构师",
    category: "programming",
    skillPointsCost: 50,
    rating: 4.8,
    reviewCount: 246,
    studentCount: 1205,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=800&auto=format&fit=crop",
    tags: ["React", "组件设计", "前端开发"],
    description: "学习如何设计可复用、高性能、易测试的React组件，掌握高级组件设计模式。",
    featured: true,
  },
  {
    id: "course-002",
    title: "UI/UX设计原则与实践",
    instructor: "王芳",
    instructorTitle: "设计总监",
    category: "design",
    skillPointsCost: 40,
    rating: 4.7,
    reviewCount: 189,
    studentCount: 892,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    tags: ["UI设计", "用户体验", "设计系统"],
    description: "从用户体验和界面设计的基本原则出发，学习如何创建美观且易用的产品界面。",
    featured: true,
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 过滤课程
  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesPrice = selectedPrice === "all" || 
      (selectedPrice === "free" && course.skillPointsCost === 0) ||
      (selectedPrice === "paid" && course.skillPointsCost > 0);
    const matchesSearch = searchQuery === "" || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // 推荐课程
  const featuredCourses = coursesData.filter(course => course.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">探索精品课程</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              在这里发现高质量的技能课程，开启你的学习之旅。每门课程都经过精心设计，
              帮助你掌握实用技能，提升职业竞争力。
            </p>
          </div>

          {/* 搜索栏 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder="搜索课程、讲师或关键词..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* 分类过滤 */}
              <div>
                <h3 className="text-sm font-medium mb-3">课程分类</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.value)}
                      className={
                        selectedCategory === category.value
                          ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          : ""
                      }
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 价格过滤 */}
              <div>
                <h3 className="text-sm font-medium mb-3">价格筛选</h3>
                <div className="flex flex-wrap gap-2">
                  {priceFilters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={selectedPrice === filter.value ? "default" : "outline"}
                      onClick={() => setSelectedPrice(filter.value)}
                      className={
                        selectedPrice === filter.value
                          ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          : ""
                      }
                    >
                      {filter.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 推荐课程 */}
          {featuredCourses.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">推荐课程</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500">
                          推荐
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            <span className="font-medium">{course.instructor}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs block">
                              {course.instructorTitle}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 dark:text-green-400 font-bold">
                            {course.skillPointsCost} 技能点
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {course.studentCount} 名学员
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button 
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          onClick={() => router.push(`/courses/${course.id}`)}
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 课程列表 */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">全部课程</h2>
              <p className="text-gray-600 dark:text-gray-400">
                共 {filteredCourses.length} 门课程
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          <span className="font-medium">{course.instructor}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs block">
                            {course.instructorTitle}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 dark:text-green-400 font-bold">
                          {course.skillPointsCost} 技能点
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {course.studentCount} 名学员
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        onClick={() => router.push(`/courses/${course.id}`)}
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 