"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Heart,
  MessageSquare,
  Share2,
  ArrowLeft,
  ThumbsUp,
  Video,
  FileImage,
  ExternalLink,
  Calendar,
  Eye,
  Copy,
  CheckCheck,
} from "lucide-react";

// 模拟类型定义
type ContentType = "video" | "image" | "cloud-drive";

type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
};

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
  videoUrl?: string;
  imageUrls?: string[];
  cloudDriveLink?: string;
  cloudDrivePassword?: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<SharedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentTab, setCurrentTab] = useState("content");
  const [copied, setCopied] = useState(false);
  
  // 获取课程详情
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        
        // 在实际应用中，这里会从API获取数据
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟课程数据
        const mockCourse: SharedCourse = {
          id: courseId,
          title: "React组件设计最佳实践",
          description: "本课程详细介绍了React组件设计的最佳实践，包括组件拆分、状态管理、性能优化等多个方面。适合有一定React基础，想要提升组件设计能力的开发者。",
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
          tags: ["React", "前端", "组件设计"],
          videoUrl: "https://www.example.com/videos/react-components.mp4"
        };
        
        // 模拟评论数据
        const mockComments: Comment[] = [
          {
            id: "comment1",
            authorId: "user456",
            authorName: "李同学",
            authorAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user456",
            content: "非常实用的课程，讲解很清晰，学到了很多组件设计的技巧！",
            createdAt: "2023-11-16T10:15:00Z",
            likes: 12
          },
          {
            id: "comment2",
            authorId: "user789",
            authorName: "王工程师",
            authorAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user789",
            content: "对性能优化部分讲解得特别好，已经在项目中应用了，效果显著。",
            createdAt: "2023-11-17T14:30:00Z",
            likes: 8
          },
          {
            id: "comment3",
            authorId: "user101",
            authorName: "赵开发",
            authorAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=user101",
            content: "希望能有更多关于Hooks的内容，期待后续更新！",
            createdAt: "2023-11-18T09:45:00Z",
            likes: 5
          }
        ];
        
        setCourse(mockCourse);
        setComments(mockComments);
        setLoading(false);
      } catch (err) {
        setError("获取课程信息失败，请稍后重试");
        setLoading(false);
        console.error("Error fetching course:", err);
      }
    };
    
    fetchCourseDetails();
  }, [courseId]);
  
  // 处理评论提交
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("评论内容不能为空");
      return;
    }
    
    try {
      // 模拟提交评论
      // 在实际应用中，这里会调用API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        authorId: "current-user",
        authorName: "我",
        authorAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=current-user",
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment("");
      
      // 更新评论数
      if (course) {
        setCourse({
          ...course,
          comments: course.comments + 1
        });
      }
      
      toast.success("评论发布成功");
    } catch (err) {
      toast.error("评论发布失败，请重试");
      console.error("Error posting comment:", err);
    }
  };
  
  // 处理点赞
  const handleLike = async () => {
    if (!course) return;
    
    try {
      // 模拟点赞API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCourse({
        ...course,
        likes: course.likes + 1
      });
      
      toast.success("点赞成功");
    } catch (err) {
      toast.error("点赞失败，请重试");
      console.error("Error liking course:", err);
    }
  };
  
  // 复制分享链接
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("链接已复制到剪贴板");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast.error("复制失败，请手动复制");
        console.error("Error copying to clipboard:", err);
      });
  };
  
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
  
  // 渲染课程内容
  const renderCourseContent = () => {
    if (!course) return null;
    
    switch (course.contentType) {
      case "video":
        return (
          <div className="mt-6 rounded-lg overflow-hidden">
            {course.videoUrl ? (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src={course.videoUrl}
                  allowFullScreen
                  title={course.title}
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
                <Video className="h-16 w-16 opacity-50 mb-4" />
                <p>视频加载失败，请刷新页面重试</p>
              </div>
            )}
          </div>
        );
        
      case "image":
        return (
          <div className="mt-6 space-y-6">
            {course.imageUrls && course.imageUrls.length > 0 ? (
              course.imageUrls.map((url, index) => (
                <div key={index} className="rounded-lg overflow-hidden border">
                  <img
                    src={url}
                    alt={`${course.title} - 图片 ${index + 1}`}
                    className="w-full object-contain"
                  />
                </div>
              ))
            ) : (
              <div className="py-12 border rounded-lg flex flex-col items-center justify-center text-gray-500">
                <FileImage className="h-16 w-16 opacity-50 mb-4" />
                <p>暂无图片内容</p>
              </div>
            )}
          </div>
        );
        
      case "cloud-drive":
        return (
          <div className="mt-6 p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <ExternalLink className="h-5 w-5 mr-2 text-purple-500" />
              <h3 className="font-medium text-lg">网盘资源</h3>
            </div>
            
            {course.cloudDriveLink ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  课程资源已上传至网盘，点击下方链接访问
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <a
                    href={course.cloudDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded flex-1 flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    打开网盘链接
                  </a>
                  
                  {course.cloudDrivePassword && (
                    <div className="relative flex items-center">
                      <div className="px-4 py-2 border rounded bg-gray-50 dark:bg-gray-800 flex items-center">
                        <span className="text-sm mr-2">提取码:</span>
                        <span className="font-medium">{course.cloudDrivePassword}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => {
                            navigator.clipboard.writeText(course.cloudDrivePassword || "");
                            toast.success("提取码已复制");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  提示：如果链接失效，请在评论区留言告知作者
                </p>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                <p>网盘链接暂未提供</p>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="mt-6 py-12 border rounded-lg flex flex-col items-center justify-center text-gray-500">
            <p>暂无内容</p>
          </div>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-4xl text-center py-12">
            <h2 className="text-2xl font-bold mb-4">课程加载失败</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">{error || "找不到该课程信息"}</p>
            <Button onClick={() => router.push("/share-courses")}>
              返回课程列表
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => router.push("/share-courses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回课程列表
          </Button>
          
          {/* 课程标题和信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {renderContentTypeIcon(course.contentType)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course.contentType === "video" ? "视频教程" : 
                     course.contentType === "image" ? "图片教程" : "网盘分享"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <img src={course.author.avatar} alt={course.author.name} />
                    </Avatar>
                    <span className="text-sm">{course.author.name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(course.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{course.views} 次查看</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={handleLike}
                >
                  <Heart className="h-4 w-4 mr-1" fill="#ef4444" stroke="#ef4444" />
                  <span>{course.likes}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={handleShare}
                >
                  {copied ? (
                    <CheckCheck className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-1" />
                  )}
                  <span>分享</span>
                </Button>
              </div>
            </div>
            
            {/* 课程内容和评论选项卡 */}
            <Tabs 
              defaultValue="content" 
              value={currentTab}
              onValueChange={setCurrentTab}
              className="mt-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">课程内容</TabsTrigger>
                <TabsTrigger value="comments">评论 ({comments.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{course.description}</p>
                </div>
                
                {renderCourseContent()}
              </TabsContent>
              
              <TabsContent value="comments" className="mt-4">
                <form className="mb-6" onSubmit={handleCommentSubmit}>
                  <div className="flex gap-2">
                    <Input
                      placeholder="发表你的评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">发布</Button>
                  </div>
                </form>
                
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              <img src={comment.authorAvatar} alt={comment.authorName} />
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {comment.authorName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(comment.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm mt-2">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>暂无评论</p>
                      <p className="text-xs mt-1">成为第一个评论的人吧！</p>
                    </div>
                  )}
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