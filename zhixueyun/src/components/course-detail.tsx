"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Course, coursesDatabase } from "@/data/courses";

// 扩展Course类型来定义CourseData
interface CourseData extends Course {
  enrolled: boolean;
  progress: number;
  nextLessonId: string | null;
}

interface CourseDetailProps {
  courseId: string;
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        // 修改查找逻辑，同时支持两种ID格式
        const foundCourse = coursesDatabase.find(c => 
          c.id === courseId || c.id === `course-${courseId.padStart(3, '0')}`
        );
        
        if (!foundCourse) {
          toast.error("未找到课程信息");
          return;
        }

        // 在组件内部转换Course到CourseData
        const courseWithData: CourseData = {
          ...foundCourse,
          enrolled: false, // 默认未报名
          progress: 0,     // 默认进度为0
          nextLessonId: foundCourse.chapters[0]?.lessons[0]?.id || null
        };

        setCourse(courseWithData);
        
        // 获取相关课程
        if (courseWithData.category) {
          const related = coursesDatabase
            .filter(c => c.category === courseWithData.category && c.id !== courseId)
            .slice(0, 4)
            .map(c => ({
              ...c,
              enrolled: false,
              progress: 0,
              nextLessonId: c.chapters[0]?.lessons[0]?.id || null
            }));
          setRelatedCourses(related);
        }
      } catch (error) {
        console.error("获取课程信息失败:", error);
        toast.error("获取课程信息失败");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = () => {
    if (!course) return;
    toast.success(`成功报名课程: ${course.title}`);
  };

  const handleRelatedCourseClick = (courseId: string) => {
    // 从完整ID中提取数字部分
    const idNumber = courseId.match(/\d+/)?.[0] || courseId;
    router.push(`/skills/${idNumber}`);
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4 flex justify-center items-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">加载课程信息...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4 flex justify-center items-center h-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">课程未找到</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">抱歉，您请求的课程信息不存在</p>
            <Link href="/skills">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                返回课程列表
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/skills')}
            className="mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回课程列表
          </Button>
          <span className="text-gray-500 dark:text-gray-400 mx-2">|</span>
          <span className="text-gray-500 dark:text-gray-400">{course.category}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
            
            <div className="flex items-center space-x-4">
              <Avatar>
                <img src={course.instructor.avatar} alt={course.instructor.name} />
              </Avatar>
              <div>
                <p className="font-semibold">{course.instructor.name}</p>
                <p className="text-sm text-gray-500">{course.instructor.title}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="outline">{course.duration}</Badge>
              <Badge variant="outline">评分: {course.rating}/5</Badge>
              <Badge variant="outline">{course.studentCount} 人已报名</Badge>
            </div>

            <div className="space-y-4">
              <Button onClick={handleEnroll} className="w-full">
                报名课程 ({course.skillPoints} 技能点)
              </Button>
              {course.videoUrl && (
                <Button variant="outline" onClick={togglePreview} className="w-full">
                  预览课程
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">课程大纲</h2>
            {course.chapters.map((chapter, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{chapter.title}</h3>
                <ul className="space-y-2">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <li key={lessonIndex} className="flex justify-between text-sm">
                      <span>{lesson.title}</span>
                      <span className="text-gray-500">{lesson.duration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {isPreviewOpen && course.videoUrl && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <Button
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={togglePreview}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
              <video
                className="w-full aspect-video rounded-lg"
                src={course.videoUrl}
                controls
                autoPlay
              />
            </div>
          </div>
        )}

        {relatedCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">相关课程</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCourses.map((relatedCourse) => (
                <motion.div
                  key={relatedCourse.id}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => handleRelatedCourseClick(relatedCourse.id)}
                >
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{relatedCourse.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {relatedCourse.description}
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline">{relatedCourse.category}</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 