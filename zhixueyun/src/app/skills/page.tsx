"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { coursesDatabase } from "@/data/courses";

const categories = [
  "全部",
  "编程开发",
  "设计创意",
  "商业管理",
  "语言学习",
  "生活技能"
];

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredCourses = selectedCategory === "全部"
    ? coursesDatabase
    : coursesDatabase.filter(course => course.category === selectedCategory);

  // 从课程ID中提取数字部分
  const getSimpleId = (courseId: string) => {
    return courseId.match(/\d+/)?.[0] || courseId;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">技能课程</h1>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category 
                    ? "bg-primary text-white"
                    : "hover:bg-primary hover:text-white transition-colors"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link href={`/skills/${getSimpleId(course.id)}`} key={course.id}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img
                        src={course.thumbnail || course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">{course.instructor.name}</span>
                      </div>
                      <span className="text-primary font-semibold">
                        {course.skillPoints} 技能点
                      </span>
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
