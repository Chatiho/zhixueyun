"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Course, coursesDatabase } from "@/data/courses";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface CourseDetailClientProps {
  courseId: string;
}

export default function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟API调用延迟
    const timer = setTimeout(() => {
      const course = coursesDatabase.find(course => course.id === courseId);
      if (course) {
        setCourseData(course);
      } else {
        toast.error("未找到课程信息");
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <FixedHeader />
        <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
          <div className="container mx-auto px-4 flex justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">加载课程信息...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <FixedHeader />
        <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
          <div className="container mx-auto px-4 flex justify-center items-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">课程未找到</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">抱歉，您请求的课程信息不存在</p>
              <Link href="/courses">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  返回课程列表
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 处理报名课程
  const handleEnrollCourse = () => {
    toast.success(`已成功购买课程《${courseData.title}》，消耗${courseData.skillPoints}技能点`);
    router.push(`/courses/${courseData.id}/learn`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 课程头部信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-[400px]">
              <img
                src={courseData.thumbnail}
                alt={courseData.title}
                className="w-full h-full object-cover"
              />
              {courseData.videoUrl && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    观看预览
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{courseData.category}</Badge>
                <Badge variant="outline">{courseData.subCategory}</Badge>
                <Badge variant="outline">难度: {courseData.level}</Badge>
                <Badge variant="outline">时长: {courseData.duration}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{courseData.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-medium">{courseData.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    ({courseData.reviewCount}评价)
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {courseData.studentCount}名学员
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  更新于 {courseData.updatedAt}
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={courseData.instructor.avatar} />
                  <AvatarFallback>
                    {courseData.instructor.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{courseData.instructor.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {courseData.instructor.title}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {courseData.skillPoints} 技能点
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    购买后永久观看
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={handleEnrollCourse}
                >
                  立即报名
                </Button>
              </div>
            </div>
          </div>

          {/* 课程详情Tab */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="overview" className="flex-1">课程概览</TabsTrigger>
                <TabsTrigger value="curriculum" className="flex-1">课程大纲</TabsTrigger>
                <TabsTrigger value="instructor" className="flex-1">讲师介绍</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h2>课程介绍</h2>
                  <div className={`${!showMore && "line-clamp-3"}`}>
                    {courseData.description}
                  </div>
                  <Button
                    variant="link"
                    className="px-0"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "收起" : "展开"}
                  </Button>

                  <h2>课程目标</h2>
                  <ul>
                    {courseData.tags.map((tag, index) => (
                      <li key={index}>{tag}</li>
                    ))}
                  </ul>

                  <h2>适合人群</h2>
                  <ul>
                    {courseData.prerequisites.map((prerequisite, index) => (
                      <li key={index}>{prerequisite}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="p-6">
                <div className="space-y-4">
                  {courseData.chapters.map((chapter, index) => (
                    <div key={index} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4">
                        <h3 className="font-medium">
                          第{index + 1}章：{chapter.title}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {chapter.duration} · {chapter.lessons.length}节课
                        </div>
                      </div>
                      <div className="divide-y dark:divide-gray-700">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <div className="flex items-center">
                              <span className="text-gray-500 w-8">{lessonIndex + 1}.</span>
                              <span>{lesson.title}</span>
                              {lesson.free && (
                                <Badge variant="outline" className="ml-2">
                                  免费预览
                                </Badge>
                              )}
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={courseData.instructor.avatar} />
                    <AvatarFallback>
                      {courseData.instructor.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{courseData.instructor.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {courseData.instructor.title}
                    </p>
                    <div className="prose dark:prose-invert">
                      <p>
                        {courseData.instructor.name}是一位经验丰富的{courseData.instructor.title}，
                        在{courseData.category}领域有着深厚的积累。他/她擅长将复杂的概念简化，
                        让学员能够轻松理解和掌握。
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 