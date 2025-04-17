"use client";

import { useState, useEffect } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  FileVideo,
  FileImage,
  ExternalLink,
  BarChart3,
  BarChart2,
  ChevronLeft
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Course, coursesDatabase } from "@/data/courses";
import Image from "next/image";
import { EnrolledCourse } from '@/types/course';
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

// 课程内容类型
type ContentType = "video" | "image" | "cloud-drive";

// 课程状态
type CourseStatus = "pending" | "approved" | "rejected";

interface MyCourse {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  status: CourseStatus;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  skillPoints: number;
  views: number;
  downloads: number;
}

// 用户课程进度类型
interface UserCourseProgress {
  courseId: string;
  progress: number;
  lastAccessTime: string;
  nextLessonId: string | null;
}

// 已报名课程类型
interface EnrolledCourse extends Course {
  progress: number;
  lastAccessTime: string;
  nextLessonId: string | null;
  coverImage: string; // 添加 coverImage 属性
}

// 格式化日期
const formatDate = (date: Date): string => {
  return format(date, 'yyyy年MM月dd日', { locale: zhCN });
};

// 获取内容类型显示文本
const getContentTypeText = (type: ContentType): string => {
  switch (type) {
    case 'video':
      return '视频课程';
    case 'image':
      return '图片教程';
    case 'cloud-drive':
      return '网盘分享';
    default:
      return '未知类型';
  }
};

// 获取内容类型图标
const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'video':
      return <FileVideo className="h-5 w-5" />;
    case 'image':
      return <FileImage className="h-5 w-5" />;
    case 'cloud-drive':
      return <ExternalLink className="h-5 w-5" />;
    default:
      return null;
  }
};

// 获取状态显示文本和颜色
const getStatusInfo = (status: CourseStatus) => {
  switch (status) {
    case 'pending':
      return { text: '审核中', color: 'text-yellow-500', icon: <Clock className="h-4 w-4 text-yellow-500" /> };
    case 'approved':
      return { text: '已通过', color: 'text-green-500', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
    case 'rejected':
      return { text: '未通过', color: 'text-red-500', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    default:
      return { text: '未知状态', color: 'text-gray-500', icon: null };
  }
};

function CourseCard({ course, onContinue, onShowStats }: {
  course: EnrolledCourse;
  onContinue: (course: EnrolledCourse) => void;
  onShowStats: (course: EnrolledCourse) => void;
}) {
  return (
    <div className="bg-card rounded-lg shadow-md p-4 flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-md">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{course.progress}%</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowStats(course)}
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => onContinue(course)}>
            继续学习
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [courseToDelete, setCourseToDelete] = useState<MyCourse | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const router = useRouter();
  
  // 模拟获取课程数据
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟课程数据
        const mockCourses: MyCourse[] = [
          {
            id: '1',
            title: 'React基础入门到实战',
            description: '从零开始学习React，掌握前端开发必备技能',
            contentType: 'video',
            status: 'approved',
            thumbnailUrl: 'https://via.placeholder.com/300x200',
            createdAt: new Date(2023, 6, 15),
            updatedAt: new Date(2023, 6, 20),
            skillPoints: 50,
            views: 328,
            downloads: 156
          },
          {
            id: '2',
            title: 'Python数据分析实战指南',
            description: '利用Python进行数据分析和可视化的完整教程',
            contentType: 'cloud-drive',
            status: 'pending',
            thumbnailUrl: 'https://via.placeholder.com/300x200',
            createdAt: new Date(2023, 8, 5),
            updatedAt: new Date(2023, 8, 5),
            skillPoints: 80,
            views: 0,
            downloads: 0
          },
          {
            id: '3',
            title: 'UI设计基础教程',
            description: '学习UI设计的基本原则和实践技巧',
            contentType: 'image',
            status: 'rejected',
            thumbnailUrl: 'https://via.placeholder.com/300x200',
            createdAt: new Date(2023, 7, 10),
            updatedAt: new Date(2023, 7, 12),
            skillPoints: 30,
            views: 0,
            downloads: 0
          }
        ];
        
        setCourses(mockCourses);
        
        // 计算总收益
        const totalPoints = mockCourses
          .filter(course => course.status === 'approved')
          .reduce((sum, course) => sum + (course.skillPoints * course.downloads), 0);
        
        setTotalEarnings(totalPoints);
      } catch (error) {
        console.error('获取课程失败:', error);
        toast.error('获取课程数据失败，请刷新重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  useEffect(() => {
    // 模拟获取用户课程进度数据
    const mockEnrolledCourses: EnrolledCourse[] = [
      {
        id: "1",
        title: "React高级组件设计",
        description: "学习React高级组件设计模式，掌握组件复用和状态管理的最佳实践",
        instructor: {
          id: "inst1",
          name: "张教授",
          title: "高级前端工程师",
          avatar: "/avatars/instructor1.jpg"
        },
        category: "前端开发",
        subCategory: "React",
        skillPoints: 2000,
        rating: 4.8,
        reviewCount: 128,
        studentCount: 1560,
        duration: "24小时",
        level: "高级",
        thumbnail: "/courses/react-advanced-thumb.jpg",
        featured: true,
        tags: ["React", "组件设计", "状态管理"],
        chapters: [
          {
            id: "ch1",
            title: "组件设计基础",
            duration: "2小时",
            lessons: [
              {
                id: "1-1",
                title: "组件设计原则",
                duration: 45,
                videoUrl: "/videos/1-1.mp4"
              },
              {
                id: "1-2",
                title: "组件生命周期",
                duration: 50,
                videoUrl: "/videos/1-2.mp4"
              }
            ]
          }
        ],
        updatedAt: "2024-03-20",
        progress: 35,
        lastAccessTime: "2024-03-20T10:30:00Z",
        nextLessonId: "1-2",
        coverImage: "/courses/react-advanced.jpg"
      },
      {
        id: "2",
        title: "UI/UX设计原则与实践",
        description: "深入学习UI/UX设计理论，掌握用户体验设计的核心原则",
        instructor: {
          id: "inst2",
          name: "李设计",
          title: "资深UI设计师",
          avatar: "/avatars/instructor2.jpg"
        },
        category: "设计",
        subCategory: "UI设计",
        skillPoints: 1800,
        rating: 4.9,
        reviewCount: 96,
        studentCount: 1280,
        duration: "20小时",
        level: "中级",
        thumbnail: "/courses/uiux-design-thumb.jpg",
        featured: false,
        tags: ["UI设计", "UX设计", "设计原则"],
        chapters: [
          {
            id: "ch2",
            title: "设计基础理论",
            duration: "1.5小时",
            lessons: [
              {
                id: "2-1",
                title: "设计心理学",
                duration: 40,
                videoUrl: "/videos/2-1.mp4"
              }
            ]
          }
        ],
        updatedAt: "2024-03-19",
        progress: 20,
        lastAccessTime: "2024-03-19T15:20:00Z",
        nextLessonId: "2-1",
        coverImage: "/courses/uiux-design.jpg"
      }
    ];

    setEnrolledCourses(mockEnrolledCourses);
    setLoading(false);
  }, []);
  
  // 打开课程统计弹窗
  const openStatsDialog = (course: MyCourse) => {
    setSelectedCourse(course);
    setShowStatsDialog(true);
  };
  
  // 打开删除确认弹窗
  const confirmDelete = (course: MyCourse) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };
  
  // 删除课程
  const deleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 从列表中移除
      setCourses(prevCourses => 
        prevCourses.filter(course => course.id !== courseToDelete.id)
      );
      
      toast.success('课程已删除');
      
      // 更新总收益
      if (courseToDelete.status === 'approved') {
        setTotalEarnings(prev => 
          prev - (courseToDelete.skillPoints * courseToDelete.downloads)
        );
      }
    } catch (error) {
      console.error('删除课程失败:', error);
      toast.error('删除失败，请重试');
    } finally {
      setShowDeleteDialog(false);
      setCourseToDelete(null);
    }
  };
  
  // 获取状态标签样式
  const getStatusBadgeClass = (status: CourseStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleContinueLearning = (course: EnrolledCourse) => {
    router.push(`/courses/${course.id}/learn`);
  };

  const handleShowStats = (course: EnrolledCourse) => {
    setSelectedCourse(course);
    setShowStatsDialog(true);
  };

  if (selectedCourse) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <FixedHeader />
          <main className="flex-1 py-8 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 max-w-6xl">
              <Button asChild className="mb-4">
                <Link href="/my-courses" className="flex items-center">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  返回课程列表
                </Link>
              </Button>
              
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
                <Progress value={selectedCourse.progress} className="w-full" />
                <p className="text-sm text-gray-500">
                  学习进度: {selectedCourse.progress}%
                </p>
                
                <div className="grid gap-4">
                  {selectedCourse.chapters.map((chapter, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{chapter.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {chapter.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                            >
                              <div className="flex items-center">
                                <span>{lesson.title}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {lesson.duration}分钟
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <FixedHeader />
        <main className="flex-1 py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* 页面标题和创建按钮 */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold">我的课程</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  管理您的学习进度和课程内容
                </p>
              </div>
              <Link href="/my-courses/upload">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  发布新课程
                </Button>
              </Link>
            </div>
            
            {/* 总收益卡片 */}
            <Card className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium opacity-90">总技能点收益</h3>
                    <p className="text-3xl font-bold mt-2">{totalEarnings}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="opacity-90">已通过课程: {courses.filter(c => c.status === 'approved').length}</p>
                    <p className="opacity-90">待审核课程: {courses.filter(c => c.status === 'pending').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 课程列表 */}
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">还没有报名任何课程</h3>
                <Link href="/courses" className="text-primary hover:underline">
                  去浏览课程
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onContinue={handleContinueLearning}
                    onShowStats={handleShowStats}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
      
      {/* 删除确认弹窗 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除课程？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销，删除后课程数据将无法恢复。
              {courseToDelete?.status === 'approved' && "已获得的技能点收益不会受到影响。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteCourse}
              className="bg-red-500 hover:bg-red-600"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 数据统计弹窗 */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>课程学习统计</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">课程信息</h4>
                <p className="text-muted-foreground">{selectedCourse.title}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">学习进度</h4>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${selectedCourse.progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  已完成 {selectedCourse.progress}%
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">最近学习</h4>
                <p className="text-muted-foreground">
                  {new Date(selectedCourse.lastAccessTime).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
} 