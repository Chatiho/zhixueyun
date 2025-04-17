"use client";

import React, { useState, useRef, useEffect } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageSquare,
  BookOpen,
  BookmarkIcon,
  ThumbsUp,
  Settings,
  MoreVertical,
  Download,
  Heart,
} from "lucide-react";
import { use } from "react";

// 讨论区回复接口
interface Reply {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  // 兼容性字段
  timestamp?: string;
}

// 讨论区评论接口
interface Discussion {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  replies: Reply[];
}

// 课时接口
interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  current?: boolean;
}

// 章节接口
interface Chapter {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  progress?: number;
  lessons: Lesson[];
}

// 课程接口
interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  category: string;
  subCategory: string;
  skillPointsCost: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  level: string;
  duration: string;
  updatedAt: string;
  thumbnail: string;
  videoUrl: string;
  featured: boolean;
  progress: number;
  currentChapter: number;
  currentLesson: number;
  tags: string[];
  description: string;
  chapters: Chapter[];
  discussions: Discussion[];
  realDuration?: string;
}

interface PageParams {
  id: string;
}

export default function CourseLearnPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const { id: courseId } = use(params);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("chapters");
  const [showDescription, setShowDescription] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Array<{id: string, timestamp: number, text: string, createdAt: Date}>>([]);
  const [comment, setComment] = useState("");
  const [current, setCurrent] = useState<{ chapterId: string; lessonId: string }>({
    chapterId: "",
    lessonId: "",
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // 课程数据可以根据courseId加载
  useEffect(() => {
    // 这里可以从API加载课程数据
    console.log("当前加载课程ID:", courseId);
    
    // 调试信息：检查课程ID是否在映射中
    const availableCourses = Object.keys(getCourseContentById("any").contentMapping || {});
    console.log("可用课程ID:", availableCourses);
    console.log("当前课程ID是否匹配:", availableCourses.includes(courseId));
  }, [courseId]);

  // 根据课程ID获取对应的视频URL
  const getVideoUrlByCourseId = (id: string): any => {
    const videoMapping: Record<string, string> = {
      // 替换为可直接访问的视频链接
      "course-001": "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // React高级组件设计
      "course-002": "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // UI/UX设计原则与实践
      "course-003": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // 云原生应用架构
      "course-004": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // 数据可视化高级技巧
      "course-005": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // 敏捷项目管理实战
      "course-006": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // 机器学习模型部署与优化
      "course-007": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", // 前端框架对比与实践
      "course-008": "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", // 设计系统构建与维护
      "course-009": "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", // Python数据分析入门
      "course-010": "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", // JavaScript全栈开发
      "course-011": "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4", // HTML/CSS网页设计基础
      "course-012": "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", // 区块链技术与应用
      "course-013": "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", // 网络安全基础与实践
      "course-014": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // 移动应用UI设计
      "course-015": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // 产品管理方法论
      "course-016": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // DevOps实践与工具
    };
    
    // 如果是"any"，则返回整个映射表
    if (id === "any") {
      return { videoMapping };
    }
    
    return videoMapping[id] || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // 默认视频
  };

  // 根据课程ID获取章节内容
  const getCourseContentById = (id: string) => {
    // 课程内容映射表
    const contentMapping: Record<string, any> = {
      "course-001": {
        title: "React高级组件设计",
        chapters: [
          {
            id: "ch-1",
            title: "组件设计原则",
            duration: "45分钟",
            completed: true,
            lessons: [
              { id: "l-1-1", title: "组件设计基础", duration: "15分钟", completed: true },
              { id: "l-1-2", title: "组件重用策略", duration: "15分钟", completed: true },
              { id: "l-1-3", title: "组件分层设计", duration: "15分钟", completed: true }
            ]
          },
          {
            id: "ch-2",
            title: "高级组件模式",
            duration: "60分钟",
            completed: false,
            lessons: [
              { id: "l-2-1", title: "复合组件模式", duration: "20分钟", completed: false },
              { id: "l-2-2", title: "控制反转", duration: "20分钟", completed: false },
              { id: "l-2-3", title: "Props代理和继承", duration: "20分钟", completed: false }
            ]
          },
          {
            id: "ch-3",
            title: "性能优化策略",
            duration: "50分钟",
            completed: false,
            lessons: [
              { id: "l-3-1", title: "React性能优化原则", duration: "15分钟", completed: false },
              { id: "l-3-2", title: "记忆化与缓存", duration: "20分钟", completed: false },
              { id: "l-3-3", title: "组件拆分与代码分割", duration: "15分钟", completed: false }
            ]
          }
        ],
        description: "本课程深入探讨React组件设计的高级概念与模式，助您构建可维护、高性能的React应用。"
      },
      "course-002": {
        title: "UI/UX设计原则与实践",
        chapters: [
          {
            id: "ch-1",
            title: "设计基础",
            duration: "40分钟",
            completed: true,
            lessons: [
              { id: "l-1-1", title: "设计思维介绍", duration: "15分钟", completed: true },
              { id: "l-1-2", title: "用户研究方法", duration: "15分钟", completed: true },
              { id: "l-1-3", title: "设计系统概念", duration: "10分钟", completed: true }
            ]
          },
          {
            id: "ch-2",
            title: "交互设计原则",
            duration: "55分钟",
            completed: false,
            lessons: [
              { id: "l-2-1", title: "可用性原则", duration: "20分钟", completed: false },
              { id: "l-2-2", title: "信息架构", duration: "15分钟", completed: false },
              { id: "l-2-3", title: "导航模式设计", duration: "20分钟", completed: false }
            ]
          },
          {
            id: "ch-3",
            title: "视觉设计与品牌",
            duration: "45分钟",
            completed: false,
            lessons: [
              { id: "l-3-1", title: "色彩理论与应用", duration: "15分钟", completed: false },
              { id: "l-3-2", title: "排版与可读性", duration: "15分钟", completed: false },
              { id: "l-3-3", title: "品牌一致性", duration: "15分钟", completed: false }
            ]
          }
        ],
        description: "学习现代UI/UX设计原则，掌握从用户研究到高保真原型的完整设计流程。"
      },
      "course-003": {
        title: "云原生应用架构",
        chapters: [
          {
            id: "ch-1",
            title: "云原生基础",
            duration: "50分钟",
            completed: false,
            lessons: [
              { id: "l-1-1", title: "云原生概念介绍", duration: "20分钟", completed: false },
              { id: "l-1-2", title: "微服务架构", duration: "15分钟", completed: false },
              { id: "l-1-3", title: "容器化技术", duration: "15分钟", completed: false }
            ]
          },
          {
            id: "ch-2",
            title: "Kubernetes基础",
            duration: "60分钟",
            completed: false,
            lessons: [
              { id: "l-2-1", title: "K8s架构与组件", duration: "20分钟", completed: false },
              { id: "l-2-2", title: "Pod与容器编排", duration: "20分钟", completed: false },
              { id: "l-2-3", title: "服务发现与负载均衡", duration: "20分钟", completed: false }
            ]
          },
          {
            id: "ch-3",
            title: "持续集成与部署",
            duration: "45分钟",
            completed: false,
            lessons: [
              { id: "l-3-1", title: "CI/CD工作流", duration: "15分钟", completed: false },
              { id: "l-3-2", title: "GitOps实践", duration: "15分钟", completed: false },
              { id: "l-3-3", title: "自动化测试策略", duration: "15分钟", completed: false }
            ]
          }
        ],
        description: "掌握云原生应用架构设计与实现，包括微服务、容器化、Kubernetes编排等核心技术。"
      },
      "course-004": {
        title: "数据可视化高级技巧",
        chapters: [
          {
            id: "ch-1",
            title: "数据可视化基础",
            duration: "40分钟",
            completed: false,
            lessons: [
              { id: "l-1-1", title: "可视化设计原则", duration: "15分钟", completed: false },
              { id: "l-1-2", title: "数据类型与图表选择", duration: "15分钟", completed: false },
              { id: "l-1-3", title: "交互式可视化", duration: "10分钟", completed: false }
            ]
          },
          {
            id: "ch-2",
            title: "D3.js高级技术",
            duration: "55分钟",
            completed: false,
            lessons: [
              { id: "l-2-1", title: "数据绑定与更新模式", duration: "20分钟", completed: false },
              { id: "l-2-2", title: "自定义图表创建", duration: "20分钟", completed: false },
              { id: "l-2-3", title: "动画与过渡效果", duration: "15分钟", completed: false }
            ]
          },
          {
            id: "ch-3",
            title: "大数据可视化策略",
            duration: "50分钟",
            completed: false,
            lessons: [
              { id: "l-3-1", title: "大规模数据处理", duration: "15分钟", completed: false },
              { id: "l-3-2", title: "性能优化技术", duration: "20分钟", completed: false },
              { id: "l-3-3", title: "数据聚合与抽样", duration: "15分钟", completed: false }
            ]
          }
        ],
        description: "深入学习数据可视化高级技巧，掌握D3.js等工具创建交互式、高性能的数据可视化应用。"
      },
      "course-005": {
        title: "敏捷项目管理实战",
        chapters: [
          {
            id: "ch-1",
            title: "敏捷方法论基础",
            duration: "45分钟",
            completed: false,
            lessons: [
              { id: "l-1-1", title: "敏捷宣言与原则", duration: "15分钟", completed: false },
              { id: "l-1-2", title: "Scrum框架介绍", duration: "15分钟", completed: false },
              { id: "l-1-3", title: "Kanban方法论", duration: "15分钟", completed: false }
            ]
          },
          {
            id: "ch-2",
            title: "敏捷团队管理",
            duration: "50分钟",
            completed: false,
            lessons: [
              { id: "l-2-1", title: "团队组建与角色", duration: "15分钟", completed: false },
              { id: "l-2-2", title: "有效的站会", duration: "15分钟", completed: false },
              { id: "l-2-3", title: "迭代计划与回顾", duration: "20分钟", completed: false }
            ]
          },
          {
            id: "ch-3",
            title: "敏捷实践工具",
            duration: "40分钟",
            completed: false,
            lessons: [
              { id: "l-3-1", title: "用户故事编写", duration: "15分钟", completed: false },
              { id: "l-3-2", title: "估算与规划", duration: "15分钟", completed: false },
              { id: "l-3-3", title: "敏捷项目工具", duration: "10分钟", completed: false }
            ]
          }
        ],
        description: "学习敏捷项目管理实战技巧，掌握Scrum和Kanban等敏捷方法论，提高团队协作效率。"
      }
    };
    
    // 如果是调试请求，返回映射表和默认内容
    if (id === "any") {
      return { 
        contentMapping,
        defaultContent: {
          title: "默认课程内容",
          chapters: [
            {
              id: "default-ch-1",
              title: "入门知识基础",
              duration: "45分钟",
              completed: false,
              lessons: [
                { id: "default-l-1-1", title: "课程概述与学习路径", duration: "15分钟", completed: false },
                { id: "default-l-1-2", title: "开发环境配置", duration: "15分钟", completed: false },
                { id: "default-l-1-3", title: "基础概念介绍", duration: "15分钟", completed: false }
              ]
            },
            {
              id: "default-ch-2",
              title: "核心功能开发",
              duration: "60分钟",
              completed: false,
              lessons: [
                { id: "default-l-2-1", title: "功能模块设计", duration: "20分钟", completed: false },
                { id: "default-l-2-2", title: "数据交互实现", duration: "20分钟", completed: false },
                { id: "default-l-2-3", title: "性能优化技巧", duration: "20分钟", completed: false }
              ]
            },
            {
              id: "default-ch-3",
              title: "项目实战与部署",
              duration: "50分钟", 
              completed: false,
              lessons: [
                { id: "default-l-3-1", title: "实战项目开发", duration: "20分钟", completed: false },
                { id: "default-l-3-2", title: "测试与调试", duration: "15分钟", completed: false },
                { id: "default-l-3-3", title: "部署与发布", duration: "15分钟", completed: false }
              ]
            }
          ],
          description: "这是一个综合性课程，涵盖了从基础知识到项目实战的完整学习路径。"
        }
      };
    }
    
    // 打印匹配结果，便于调试
    console.log("查找课程内容:", id, "找到:", !!contentMapping[id]);
    
    // 返回找到的课程内容或默认内容
    return contentMapping[id] || {
      title: "默认课程内容",
      chapters: [
        {
          id: "default-ch-1",
          title: "入门知识基础",
          duration: "45分钟",
          completed: false,
          lessons: [
            { id: "default-l-1-1", title: "课程概述与学习路径", duration: "15分钟", completed: false },
            { id: "default-l-1-2", title: "开发环境配置", duration: "15分钟", completed: false },
            { id: "default-l-1-3", title: "基础概念介绍", duration: "15分钟", completed: false }
          ]
        },
        {
          id: "default-ch-2",
          title: "核心功能开发",
          duration: "60分钟",
          completed: false,
          lessons: [
            { id: "default-l-2-1", title: "功能模块设计", duration: "20分钟", completed: false },
            { id: "default-l-2-2", title: "数据交互实现", duration: "20分钟", completed: false },
            { id: "default-l-2-3", title: "性能优化技巧", duration: "20分钟", completed: false }
          ]
        },
        {
          id: "default-ch-3",
          title: "项目实战与部署",
          duration: "50分钟", 
          completed: false,
          lessons: [
            { id: "default-l-3-1", title: "实战项目开发", duration: "20分钟", completed: false },
            { id: "default-l-3-2", title: "测试与调试", duration: "15分钟", completed: false },
            { id: "default-l-3-3", title: "部署与发布", duration: "15分钟", completed: false }
          ]
        }
      ],
      description: "这是一个综合性课程，涵盖了从基础知识到项目实战的完整学习路径。"
    };
  };

  // 获取当前课程内容
  const courseContent = getCourseContentById(courseId);

  // 模拟其他课程数据
  const course = {
    id: courseId,
    instructor: "李明",
    instructorTitle: "资深前端架构师",
    instructorAvatar: "",
    category: "编程开发",
    subCategory: "前端开发",
    skillPointsCost: 30,
    rating: 4.8,
    reviewCount: 246,
    studentCount: 1245,
    level: "中级",
    duration: "8小时35分钟",
    updatedAt: "2025-03-15",
    thumbnail: "https://ext.same-assets.com/2250287466/3598345224.jpeg",
    videoUrl: getVideoUrlByCourseId(courseId), // 根据课程ID获取对应视频
    featured: true,
    progress: 35, // 默认进度值，将在播放时动态更新
    currentChapter: 2,
    currentLesson: 1,
    tags: ["React", "组件设计", "前端", "架构"],
    discussions: [], // 添加默认空数组
    ...courseContent, // 合并课程内容
  };
  
  // 调试视频加载
  useEffect(() => {
    console.log("当前加载的课程视频URL:", course.videoUrl);
    console.log("课程ID:", courseId);
    
    // 预加载视频并设置初始进度
    if (videoRef.current) {
      videoRef.current.src = course.videoUrl;
      videoRef.current.load();
    }
  }, [courseId, course.videoUrl]);

  // 计算视频播放进度百分比
  const calcVideoProgress = () => {
    if (!duration) return 0;
    return Math.floor((currentTime / duration) * 100);
  };

  // 视频控制函数
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      console.log("视频元数据加载完成，总时长:", videoRef.current.duration);
    }
  };

  const handleSeek = (values: number[]) => {
    const seekTime = values[0];
    if (videoRef.current && seekTime >= 0 && seekTime <= duration) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume / 100;
      } else {
        videoRef.current.volume = 0;
      }
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  // 时间格式化，支持小时显示
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const addNote = () => {
    if (note.trim()) {
      const newNote = {
        id: `note-${Date.now()}`,
        timestamp: currentTime,
        text: note,
        createdAt: new Date()
      };
      setNotes([newNote, ...notes]);
      setNote("");
    }
  };

  // 播放指定章节
  const playLesson = (chapterId: string, lessonId: string) => {
    // 创建一个基于章节和课程ID的唯一标识
    const videoId = `${courseId}-${chapterId}-${lessonId}`;
    console.log(`播放课程: ${videoId}`);
    
    // 更新当前状态
    setCurrent({ chapterId, lessonId });
    
    // 如果有视频元素，设置新的视频源并播放
    if (videoRef.current) {
      const videoUrl = course.videoUrl;
      videoRef.current.src = videoUrl;
      videoRef.current.currentTime = 0; // 重置到开头
      videoRef.current.play().catch(err => console.error("播放失败:", err));
      setIsPlaying(true);
      
      console.log(`正在播放视频: ${videoUrl}, 章节ID: ${chapterId}, 课时ID: ${lessonId}`);
    } else {
      console.warn("视频元素不存在或视频URL无效");
    }
  };

  const addComment = () => {
    if (comment.trim()) {
      // 模拟添加评论
      console.log("添加评论:", comment);
      setComment("");
    }
  };

  // 讨论区渲染函数
  const renderDiscussion = (discussion: Discussion) => {
    return (
      <div key={discussion.id} className="mb-6 border-b pb-4">
        <div className="flex items-start space-x-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={discussion.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
              {discussion.user.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">{discussion.user}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{discussion.time}</div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{discussion.content}</p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Heart className="h-4 w-4 mr-1" />
                点赞
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <MessageSquare className="h-4 w-4 mr-1" />
                回复
              </Button>
            </div>
          </div>
        </div>
        {discussion.replies && discussion.replies.length > 0 && (
          <div className="ml-12 mt-2 space-y-3">
            {(discussion.replies || []).map((reply: Reply) => renderReply(reply))}
          </div>
        )}
      </div>
    );
  };

  // 回复渲染函数
  const renderReply = (reply: Reply) => {
    return (
      <div key={reply.id} className="ml-12 mt-3 border-t border-gray-100 pt-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={reply.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
              {reply.user.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">{reply.user}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{reply.time}</div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
          </div>
        </div>
      </div>
    );
  };

  // 计算章节总时长
  const calculateTotalDuration = (total: number, chapter: { duration: string }) => {
    // 从"45分钟"这样的字符串中提取数字
    const minutes = parseInt(chapter.duration.replace(/[^0-9]/g, ''));
    return total + minutes;
  };

  // 渲染章节
  const renderChapter = (chapter: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      completed: boolean;
    }>;
  }, chapterIndex: number) => {
    return (
      <div key={chapter.id} className="mb-4">
        <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
          <div>
            <div className="font-medium">第{chapterIndex + 1}章：{chapter.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{chapter.duration} · {chapter.lessons.length}课时</div>
          </div>
          {chapter.completed ? (
            <Badge variant="secondary">已完成</Badge>
          ) : (
            <Badge variant="outline">进行中</Badge>
          )}
        </div>
        <div className="pl-4 mt-2 space-y-2">
          {chapter.lessons.map((lesson, lessonIndex) => (
            <div 
              key={lesson.id}
              className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => playLesson(chapter.id, lesson.id)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                  lesson.completed 
                    ? "bg-green-500 text-white" 
                    : "border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                }`}>
                  {lesson.completed ? "✓" : (chapterIndex + 1) + "." + (lessonIndex + 1)}
                </div>
                <div className="text-sm">{lesson.title}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <FixedHeader />
      <main className="flex-grow">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
            <Button 
              variant="ghost" 
              className="h-8 px-2"
              onClick={() => router.push(`/skills/${use(params).id}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回课程详情
            </Button>
            <span className="mx-2">•</span>
            <span>{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 视频播放区域 */}
            <div className="lg:col-span-8">
              <div 
                ref={videoContainerRef}
                className="bg-black rounded-xl overflow-hidden relative mb-6"
              >
                <video
                  ref={videoRef}
                  className="w-full aspect-video"
                  src={course.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  onError={(e) => console.error("视频加载错误:", e)}
                  preload="metadata"
                  poster={course.thumbnail}
                  controls={false}
                  playsInline
                >
                  <source src={course.videoUrl} type="video/mp4" />
                  <p className="text-white text-center p-4">您的浏览器不支持HTML5视频，请升级或使用其他浏览器。</p>
                </video>
                
                {/* 视频播放提示 */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/40 rounded-full p-5 cursor-pointer" onClick={togglePlay}>
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                )}

                {/* 视频加载提示 */}
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded text-white text-xs">
                  {course.id.replace('course-', '课程 ')}
                </div>
                
                {/* 视频信息显示 - 时间、进度条等 */}
                <div className="w-full bg-gray-800 px-4 py-2 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        onClick={togglePlay}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                      
                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 w-24">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleVolumeChange}
                          className="w-20 video-slider"
                        />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? (
                          <Minimize className="h-5 w-5" />
                        ) : (
                          <Maximize className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-full px-1 py-1">
                    <style jsx global>{`
                      .video-slider .absolute.h-full {
                        background-color: #10b981 !important; /* Green-500 */
                      }
                      .video-slider:hover .block.h-5.w-5 {
                        border-color: #10b981 !important;
                      }
                    `}</style>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full cursor-pointer video-slider"
                    />
                  </div>
                </div>
              </div>
              
              {/* 课程信息 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">
                      {course.currentChapter}.{course.currentLesson} {course.title}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                      <span className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={course.instructorAvatar} />
                          <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                            {course.instructor.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        {course.instructor}
                      </span>
                      <span className="mx-2">•</span>
                      <span>更新于 {course.updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <BookmarkIcon className="h-4 w-4 mr-2" />
                      收藏
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full h-2 video-slider"
                    disabled={false}
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>已完成 {calcVideoProgress()}%</span>
                    <span>总时长: {formatTime(duration)}</span>
                  </div>
                </div>
                
                <div className={`${showDescription ? "" : "line-clamp-2"} text-gray-700 dark:text-gray-300`}>
                  {course.description}
                </div>
                {course.description.length > 100 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-green-600 dark:text-green-400 p-0 h-auto"
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    {showDescription ? "收起" : "展开更多"}
                  </Button>
                )}
              </div>
              
              {/* 笔记和讨论 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <Tabs defaultValue="notes" onValueChange={(value) => setActiveTab(value)}>
                  <TabsList className="bg-gray-100 dark:bg-gray-700 p-0 h-auto border-b border-gray-200 dark:border-gray-700 w-full rounded-none">
                    <TabsTrigger
                      value="notes"
                      className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      我的笔记
                    </TabsTrigger>
                    <TabsTrigger
                      value="discussions"
                      className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      讨论区
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* 笔记 */}
                  <TabsContent value="notes" className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">添加笔记</h3>
                      <div className="flex flex-col space-y-3">
                        <Textarea
                          placeholder="在此处记录你的想法、问题或重要信息..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            当前视频时间点: {formatTime(currentTime)}
                          </div>
                          <Button onClick={addNote}>保存笔记</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">我的笔记列表</h3>
                      {notes.length > 0 ? (
                        <div className="space-y-4">
                          {notes.map((note) => (
                            <div key={note.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  视频时间点: {formatTime(note.timestamp)}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">{note.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>你还没有添加任何笔记</p>
                          <p className="text-sm">边学习边记录，提高学习效率</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* 讨论区 */}
                  <TabsContent value="discussions" className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">参与讨论</h3>
                      <div className="flex flex-col space-y-3">
                        <Textarea
                          placeholder="分享你的问题、想法或经验..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end">
                          <Button onClick={addComment}>发布评论</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">讨论区</h3>
                      <div className="space-y-6">
                        {(course.discussions || []).map((discussion: Discussion) => (
                          <div key={discussion.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                            <div className="flex items-start space-x-3 mb-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={discussion.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                                  {discussion.user.slice(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="font-medium">{discussion.user}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{discussion.time}</div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-2">{discussion.content}</p>
                                <div className="flex items-center space-x-4">
                                  <button className="text-sm flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    <span>{discussion.likes}</span>
                                  </button>
                                  <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    回复
                                  </button>
                                </div>
                                
                                {/* 回复 */}
                                {discussion.replies && discussion.replies.length > 0 && (
                                  <div className="mt-3 ml-6 space-y-3">
                                    {(discussion.replies || []).map((reply: Reply) => (
                                      <div key={reply.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage src={reply.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                                              {reply.user.slice(0, 1)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                              <div className="font-medium text-sm">{reply.user}</div>
                                              <div className="text-xs text-gray-500 dark:text-gray-400">{reply.time}</div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                                            <div className="flex items-center space-x-4 mt-1">
                                              <button className="text-xs flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                <span>{reply.likes}</span>
                                              </button>
                                              <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                                回复
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* 章节与课时列表 */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold">课程目录</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    共{course.chapters.length}章 · 
                    {course.chapters.reduce((total: number, chapter: Chapter) => total + chapter.lessons.length, 0)}节 · 
                    {course.duration}
                  </p>
                </div>
                
                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  {course.chapters.map((chapter: Chapter, chapterIndex: number) => (
                    <div key={chapter.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">第{chapterIndex + 1}章：{chapter.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{chapter.duration} · {chapter.lessons.length}节</div>
                          </div>
                          <Badge variant={chapter.progress && chapter.progress === 100 ? "secondary" : "outline"} className="ml-2">
                            {chapter.progress && chapter.progress === 100 ? "已完成" : `${chapter.progress || 0}%`}
                          </Badge>
                        </div>
                        {chapter.progress && chapter.progress > 0 && chapter.progress < 100 && (
                          <Progress value={chapter.progress} className="h-1 mt-2" />
                        )}
                      </div>
                      
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {chapter.lessons.map((lesson: Lesson, lessonIndex: number) => (
                          <div 
                            key={lesson.id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                              lesson.current ? "bg-green-50 dark:bg-green-900/20" : ""
                            }`}
                            onClick={() => playLesson(chapter.id, lesson.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                                  lesson.completed 
                                    ? "bg-green-500 text-white" 
                                    : lesson.current 
                                      ? "border-2 border-green-500 text-green-500" 
                                      : "border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                                }`}>
                                  {lesson.completed ? "✓" : lessonIndex + 1}
                                </div>
                                <div>
                                  <div className={`${
                                    lesson.current ? "font-medium text-green-600 dark:text-green-400" : ""
                                  }`}>
                                    {lesson.title}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {lesson.duration}
                                  </div>
                                </div>
                              </div>
                              
                              {lesson.current && (
                                <Badge className="bg-green-500">进行中</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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