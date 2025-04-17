"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course, coursesDatabase } from "@/data/courses";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CourseProgress } from '@/types/course';

export default function CourseLearnPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [courseProgress, setCourseProgress] = useState<CourseProgress>({
    currentChapter: 0,
    currentLesson: 0,
    lessonProgress: {},
    lastPosition: 0,
    progress: 0,
    lastAccessTime: new Date().toISOString()
  });

  // 保存进度到localStorage
  const saveProgress = (chapterIndex: number, lessonIndex: number, currentTime: number) => {
    const progressKey = `course-progress-${resolvedParams.id}`;
    const newProgress: CourseProgress = {
      currentChapter: chapterIndex,
      currentLesson: lessonIndex,
      lessonProgress: {
        ...courseProgress.lessonProgress,
        [`${chapterIndex}-${lessonIndex}`]: currentTime
      },
      lastPosition: currentTime,
      progress: calculateOverallProgress(),
      lastAccessTime: new Date().toISOString()
    };
    setCourseProgress(newProgress);
    localStorage.setItem(progressKey, JSON.stringify(newProgress));
  };

  // 计算总体课程进度
  const calculateOverallProgress = (): number => {
    if (!courseData) return 0;
    
    const totalLessons = courseData.chapters.reduce((sum, chapter) => 
      sum + chapter.lessons.length, 0);
    
    const completedLessons = Object.values(courseProgress.lessonProgress).filter(
      time => time > 0
    ).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  // 加载保存的进度
  const loadSavedProgress = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem(`course-progress-${resolvedParams.id}`);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress) as CourseProgress;
        // 验证数据结构
        if (
          typeof parsed.currentChapter === 'number' &&
          typeof parsed.currentLesson === 'number' &&
          typeof parsed.lastPosition === 'number' &&
          typeof parsed.progress === 'number' &&
          typeof parsed.lastAccessTime === 'string' &&
          typeof parsed.lessonProgress === 'object'
        ) {
          setCourseProgress(parsed);
        } else {
          console.error('Invalid progress data structure');
          setCourseProgress({
            currentChapter: 0,
            currentLesson: 0,
            lessonProgress: {},
            lastPosition: 0,
            progress: 0,
            lastAccessTime: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      setCourseProgress({
        currentChapter: 0,
        currentLesson: 0,
        lessonProgress: {},
        lastPosition: 0,
        progress: 0,
        lastAccessTime: new Date().toISOString()
      });
    }
  }, [resolvedParams.id]);

  // 定期保存进度
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && courseData?.chapters[courseProgress.currentChapter]) {
        saveProgress(
          courseProgress.currentChapter,
          courseProgress.currentLesson,
          videoRef.current.currentTime
        );
      }
    }, 5000); // 每5秒保存一次进度

    return () => clearInterval(interval);
  }, [courseProgress.currentChapter, courseProgress.currentLesson, resolvedParams.id]);

  // 更新视频进度处理函数
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCurrentTime(currentTime);
      
      // 如果视频播放完成，自动进入下一课时
      if (currentTime >= videoRef.current.duration - 1) {
        const currentChapter = courseData?.chapters[courseProgress.currentChapter];
        if (currentChapter) {
          if (courseProgress.currentLesson < currentChapter.lessons.length - 1) {
            // 进入下一课时
            playLesson(courseProgress.currentChapter, courseProgress.currentLesson + 1);
          } else if (courseProgress.currentChapter < courseData.chapters.length - 1) {
            // 进入下一章节的第一课时
            playLesson(courseProgress.currentChapter + 1, 0);
          }
        }
      }
    }
  };

  // 更新播放课时的函数
  const playLesson = (chapterIndex: number, lessonIndex: number) => {
    const chapter = courseData?.chapters[chapterIndex];
    const lesson = chapter?.lessons[lessonIndex];
    
    if (!chapter || !lesson) return;
    
    setCourseProgress(prev => ({
      ...prev,
      currentChapter: chapterIndex,
      currentLesson: lessonIndex,
    }));

    if (videoRef.current && lesson.videoUrl) {
      videoRef.current.src = lesson.videoUrl;
      videoRef.current.currentTime = courseProgress.lessonProgress[`${chapterIndex}-${lessonIndex}`] || 0;
      videoRef.current.play().catch(err => console.error("播放失败:", err));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const course = coursesDatabase.find(c => c.id === resolvedParams.id);
        if (course) {
          setCourseData(course);
          loadSavedProgress();
        }
      } catch (error) {
        console.error("获取课程信息失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [resolvedParams.id, loadSavedProgress]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 课程头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{courseData.title}</h1>
              <Link href={`/courses/${courseData.id}`}>
                <Button variant="outline">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  返回课程详情
                </Button>
              </Link>
            </div>
            <Progress value={courseProgress.progress} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>学习进度: {courseProgress.progress}%</span>
              <span>最近学习: {new Date(courseProgress.lastAccessTime).toLocaleString()}</span>
            </div>
          </div>

          {/* 课程内容 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 课程大纲 */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">课程大纲</h2>
              <div className="space-y-4">
                {courseData.chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex}>
                    <h3 className="font-medium mb-2">
                      第{chapterIndex + 1}章：{chapter.title}
                    </h3>
                    <ul className="space-y-2">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <li
                          key={lessonIndex}
                          className={`
                            p-2 rounded cursor-pointer
                            ${
                              chapterIndex === courseProgress.currentChapter &&
                              lessonIndex === courseProgress.currentLesson
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }
                          `}
                          onClick={() => {
                            setCourseProgress(prev => ({
                              ...prev,
                              currentChapter: chapterIndex,
                              currentLesson: lessonIndex
                            }));
                          }}
                        >
                          {lessonIndex + 1}. {lesson.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 视频播放区域 */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video bg-black">
                {courseData.chapters[courseProgress.currentChapter]?.lessons[courseProgress.currentLesson]?.videoUrl ? (
                  <video
                    src={courseData.chapters[courseProgress.currentChapter]?.lessons[courseProgress.currentLesson]?.videoUrl}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    暂无视频资源
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {courseData.chapters[courseProgress.currentChapter]?.lessons[courseProgress.currentLesson]?.title}
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p>本节课程介绍了{courseData.chapters[courseProgress.currentChapter]?.title}的核心概念和实践方法。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 