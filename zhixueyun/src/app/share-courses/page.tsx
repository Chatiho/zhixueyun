"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  FileImage,
  ExternalLink,
  Search,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  Plus,
  Filter,
  AlertTriangle,
} from "lucide-react";

// 课程内容类型定义
type ContentType = "video" | "image" | "cloud-drive";

// 课程类型定义
interface SharedCourse {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  views: number;
  contentType: ContentType;
  thumbnailUrl?: string;
  tags: string[];
}

// 本地图片映射
const localImages = {
  "course1": "/images/shared-courses/course-1.jpg",
  "course2": "/images/shared-courses/course-2.jpg",
  "course3": "/images/shared-courses/course-3.jpg",
  "course4": "/images/shared-courses/course-4.jpg",
  "course5": "/images/shared-courses/course-5.jpg",
  "course6": "/images/shared-courses/course-6.jpg",
};

export default function ShareCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<SharedCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<SharedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  // 图片错误状态
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // 获取课程数据
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // 在实际应用中，这里会从API获取数据
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟课程数据
        const mockCourses: SharedCourse[] = [
          {
            id: "course1",
            title: "React组件设计最佳实践",
            description: "本课程详细介绍了React组件设计的最佳实践，包括组件拆分、状态管理、性能优化等多个方面。",
            author: {
              id: "user123",
              name: "张教授",
              avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user123"
            },
            createdAt: "2023-11-15T08:30:00Z",
            updatedAt: "2023-11-15T08:30:00Z",
            likes: 158,
            comments: 32,
            views: 2451,
            contentType: "video",
            thumbnailUrl: localImages["course1"],
            tags: ["React", "前端", "组件设计"]
          },
          {
            id: "course2",
            title: "Web性能优化完全指南",
            description: "从网络请求、渲染性能到运行时优化，全方位讲解Web应用性能优化策略。",
            author: {
              id: "user456",
              name: "李工程师",
              avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user456"
            },
            createdAt: "2023-11-10T10:15:00Z",
            updatedAt: "2023-11-10T10:15:00Z",
            likes: 97,
            comments: 18,
            views: 1820,
            contentType: "video",
            thumbnailUrl: localImages["course2"],
            tags: ["性能优化", "Web开发", "前端"]
          },
          {
            id: "course3",
            title: "CSS布局详解 - 从Flex到Grid",
            description: "通过实例详细讲解CSS布局技术，从基础的Flexbox到高级的Grid布局。",
            author: {
              id: "user789",
              name: "王设计师",
              avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user789"
            },
            createdAt: "2023-11-05T14:20:00Z",
            updatedAt: "2023-11-06T09:30:00Z",
            likes: 76,
            comments: 14,
            views: 1356,
            contentType: "image",
            thumbnailUrl: localImages["course3"],
            tags: ["CSS", "布局", "前端设计"]
          },
          {
            id: "course4",
            title: "TypeScript高级类型体操",
            description: "深入TypeScript类型系统，掌握复杂类型的定义和使用方法。",
            author: {
              id: "user101",
              name: "赵程序员",
              avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user101"
            },
            createdAt: "2023-10-28T11:45:00Z",
            updatedAt: "2023-10-28T11:45:00Z",
            likes: 118,
            comments: 25,
            views: 1987,
            contentType: "cloud-drive",
            thumbnailUrl: localImages["course4"],
            tags: ["TypeScript", "前端", "类型系统"]
          },
          {
            id: "course5",
            title: "Next.js 13应用路由详解",
            description: "详细介绍Next.js 13中的应用路由架构，包括服务端组件、客户端组件以及数据获取策略。",
            author: {
              id: "user202",
              name: "钱开发",
              avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user202"
            },
            createdAt: "2023-10-20T15:30:00Z",
            updatedAt: "2023-10-21T08:20:00Z",
            likes: 142,
            comments: 38,
            views: 2234,
            contentType: "video",
            thumbnailUrl: localImages["course5"],
            tags: ["Next.js", "React", "服务端渲染"]
          },
          {
            id: "course6",
            title: "UI设计基础 - 色彩搭配指南",
            description: "从色彩理论出发，讲解UI设计中的色彩搭配原则和实践技巧。",
            author: {
              id: "user303",
              name: "孙设计",
              avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user303"
            },
            createdAt: "2023-10-15T09:20:00Z",
            updatedAt: "2023-10-15T09:20:00Z",
            likes: 88,
            comments: 16,
            views: 1542,
            contentType: "image",
            thumbnailUrl: localImages["course6"],
            tags: ["UI设计", "色彩理论", "设计原则"]
          }
        ];
        
        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // 应用搜索和筛选
  useEffect(() => {
    let results = [...courses];
    
    // 按搜索词筛选
    if (searchTerm) {
      results = results.filter(
        course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 按内容类型筛选
    if (contentTypeFilter !== "all") {
      results = results.filter(course => course.contentType === contentTypeFilter);
    }
    
    // 应用排序
    if (sortOrder === "newest") {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === "oldest") {
      results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === "most-viewed") {
      results.sort((a, b) => b.views - a.views);
    } else if (sortOrder === "most-liked") {
      results.sort((a, b) => b.likes - a.likes);
    }
    
    setFilteredCourses(results);
  }, [courses, searchTerm, contentTypeFilter, sortOrder]);
  
  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // 渲染内容类型图标
  const renderContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "image":
        return <FileImage className="h-5 w-5 text-green-500" />;
      case "cloud-drive":
        return <ExternalLink className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };
  
  // 处理图片加载错误
  const handleImageError = (courseId: string) => {
    console.error(`图片加载失败: ${courseId}`);
    setImageErrors(prev => ({
      ...prev,
      [courseId]: true
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">课程分享</h1>
              <p className="text-gray-600 dark:text-gray-400">
                发现和分享优质学习资源，一起成长进步
              </p>
            </div>
            
            <Button 
              className="flex items-center"
              onClick={() => router.push("/share-courses/create")}
            >
              <Plus className="mr-2 h-4 w-4" /> 分享课程
            </Button>
          </div>
          
          {/* 搜索和筛选 */}
          <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10"
                  placeholder="搜索课程、标签或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <div className="w-full md:w-auto">
                  <Select
                    value={contentTypeFilter}
                    onValueChange={setContentTypeFilter}
                  >
                    <SelectTrigger className="h-10 flex-1 md:w-[180px]">
                      <SelectValue placeholder="内容类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="video">视频教程</SelectItem>
                      <SelectItem value="image">图片教程</SelectItem>
                      <SelectItem value="cloud-drive">网盘分享</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-auto">
                  <Select
                    value={sortOrder}
                    onValueChange={setSortOrder}
                  >
                    <SelectTrigger className="h-10 flex-1 md:w-[180px]">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">最新发布</SelectItem>
                      <SelectItem value="oldest">最早发布</SelectItem>
                      <SelectItem value="most-viewed">最多浏览</SelectItem>
                      <SelectItem value="most-liked">最多点赞</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {searchTerm || contentTypeFilter !== "all" ? (
              <div className="mt-4 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500 mr-2">筛选结果:</span>
                <span className="text-sm font-medium">{filteredCourses.length} 个课程</span>
                
                {(searchTerm || contentTypeFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-xs"
                    onClick={() => {
                      setSearchTerm("");
                      setContentTypeFilter("all");
                    }}
                  >
                    清除筛选
                  </Button>
                )}
              </div>
            ) : null}
          </div>
          
          {/* 课程列表 */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/share-courses/${course.id}`)}
                  >
                    {!imageErrors[course.id] && course.thumbnailUrl ? (
                      <Image 
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => handleImageError(course.id)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex flex-col items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-orange-500 mb-2" />
                        <span className="mt-2 text-sm text-gray-500">图片未加载</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <div className="flex justify-between items-center w-full text-white">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span className="text-sm">{course.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span className="text-sm">{course.comments}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-sm">{course.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className={`
                          ${course.contentType === 'video' ? 'bg-blue-500 hover:bg-blue-600' : 
                           course.contentType === 'image' ? 'bg-green-500 hover:bg-green-600' : 
                           'bg-purple-500 hover:bg-purple-600'}
                        `}
                      >
                        <div className="flex items-center">
                          {renderContentTypeIcon(course.contentType)}
                          <span className="ml-1">
                            {course.contentType === 'video' ? '视频' : 
                             course.contentType === 'image' ? '图片' : '网盘'}
                          </span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="p-4 pb-2">
                    <CardTitle 
                      className="text-lg cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
                      onClick={() => router.push(`/share-courses/${course.id}`)}
                    >
                      {course.title}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="text-xs">{formatDate(course.createdAt)}</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap mt-3 gap-1">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-2 flex items-center">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                        <img 
                          src={course.author.avatar} 
                          alt={course.author.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm">{course.author.name}</span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto text-xs"
                      onClick={() => router.push(`/share-courses/${course.id}`)}
                    >
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">未找到匹配的课程</h3>
              <p className="text-gray-500 mb-6">
                尝试使用不同的关键词或清除筛选条件
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setContentTypeFilter("all");
                }}
              >
                查看所有课程
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 