"use client";

import { useState, useEffect, useCallback } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  MessageSquare, 
  ThumbsUp, 
  Send,
  Users,
  CalendarClock,
  Clock,
  Play,
  Gift,
  Code,
  Paintbrush,
  Cloud,
  BarChart,
  Smartphone,
  Blocks,
  Brain,
  Image as ImageIcon,
  AlertTriangle
} from "lucide-react";

// 定义直播项数据类型
interface LiveStream {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  viewers: number;
  startTime: string;
  duration: string;
  icon: React.ReactNode;
  bgColor: string;
  tags: string[];
  description: string;
  thumbnail?: string;
}

// 聊天消息类型
interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  isInstructor?: boolean;
}

// 修改本地图片映射，添加备用图片
const localImages = {
  "live-001": "/images/live/frontend.jpg",
  "live-002": "/images/live/design.jpg",
  "live-003": "/images/live/cloud.jpg",
  "live-004": "/images/live/data-vis.jpg",
  "live-005": "/images/live/mobile.jpg",
  "live-006": "/images/live/blockchain.jpg",
  "live-007": "/images/live/ai-coding.jpg",
  "fallback": "/images/live/placeholder.jpg"  // 添加一个通用的占位图
};

// 添加备用图标映射，在图片加载失败时使用
const iconBackgrounds = {
  "live-001": "bg-blue-100 dark:bg-blue-900/30",
  "live-002": "bg-purple-100 dark:bg-purple-900/30",
  "live-003": "bg-teal-100 dark:bg-teal-900/30",
  "live-004": "bg-green-100 dark:bg-green-900/30",
  "live-005": "bg-orange-100 dark:bg-orange-900/30",
  "live-006": "bg-indigo-100 dark:bg-indigo-900/30", 
  "live-007": "bg-red-100 dark:bg-red-900/30",
};

export default function LivePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedLiveStream, setSelectedLiveStream] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  // 添加图片错误状态追踪和错误计数
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [errorLogs, setErrorLogs] = useState<Record<string, number>>({});

  // 模拟直播数据
  const liveStreams = {
    ongoing: [
      {
        id: "live-001",
        title: "前端框架对比与选择",
        instructor: "李明",
        instructorAvatar: "",
        viewers: 865,
        startTime: "2023-06-15 19:30",
        duration: "120分钟",
        icon: <Code className="h-12 w-12 text-blue-500" />,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        tags: ["前端", "框架", "技术选型"],
        description: "本次直播将深入分析React、Vue、Angular等主流前端框架的优缺点，帮助开发者根据项目需求做出最佳选择。",
        thumbnail: localImages["live-001"]
      },
      {
        id: "live-002",
        title: "设计系统实战工作坊",
        instructor: "王芳",
        instructorAvatar: "",
        viewers: 436,
        startTime: "2023-06-15 20:00",
        duration: "90分钟",
        icon: <Paintbrush className="h-12 w-12 text-purple-500" />,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        tags: ["设计", "UI/UX", "设计系统"],
        description: "从零开始构建一个完整的设计系统，包括组件库、设计规范和设计工具集成。",
        thumbnail: localImages["live-002"]
      }
    ],
    upcoming: [
      {
        id: "live-003",
        title: "云原生应用开发入门",
        instructor: "张伟",
        instructorAvatar: "",
        viewers: 0,
        startTime: "2023-06-18 19:00",
        duration: "120分钟",
        icon: <Cloud className="h-12 w-12 text-teal-500" />,
        bgColor: "bg-teal-100 dark:bg-teal-900/30",
        tags: ["云原生", "Kubernetes", "微服务"],
        description: "了解云原生的核心概念，学习如何设计和部署云原生应用。",
        thumbnail: localImages["live-003"]
      },
      {
        id: "live-004",
        title: "数据可视化最佳实践",
        instructor: "赵强",
        instructorAvatar: "",
        viewers: 0,
        startTime: "2023-06-20 20:00",
        duration: "90分钟",
        icon: <BarChart className="h-12 w-12 text-green-500" />,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        tags: ["数据可视化", "D3.js", "数据分析"],
        description: "探索数据可视化的设计原则和实现技术，掌握有效传达数据洞察的方法。",
        thumbnail: localImages["live-004"]
      },
      {
        id: "live-005",
        title: "移动端性能优化策略",
        instructor: "陈静",
        instructorAvatar: "",
        viewers: 0,
        startTime: "2023-06-22 19:30",
        duration: "120分钟", 
        icon: <Smartphone className="h-12 w-12 text-orange-500" />,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        tags: ["移动开发", "性能优化", "用户体验"],
        description: "深入分析移动应用的性能瓶颈，学习实用的优化技巧和工具。",
        thumbnail: localImages["live-005"]
      }
    ],
    past: [
      {
        id: "live-006",
        title: "Web 3.0与区块链应用",
        instructor: "刘红",
        instructorAvatar: "",
        viewers: 752,
        startTime: "2023-06-10 19:00",
        duration: "150分钟",
        icon: <Blocks className="h-12 w-12 text-indigo-500" />,
        bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
        tags: ["Web3", "区块链", "智能合约"],
        description: "探索Web 3.0的新范式，了解区块链技术如何改变互联网应用的开发方式。",
        thumbnail: localImages["live-006"]
      },
      {
        id: "live-007",
        title: "AI辅助编程实战",
        instructor: "李明",
        instructorAvatar: "",
        viewers: 1024,
        startTime: "2023-06-08 20:00",
        duration: "120分钟",
        icon: <Brain className="h-12 w-12 text-red-500" />,
        bgColor: "bg-red-100 dark:bg-red-900/30",
        tags: ["AI", "编程效率", "开发工具"],
        description: "学习如何利用AI工具提升编程效率，包括代码生成、代码补全和代码优化等方面的应用。",
        thumbnail: localImages["live-007"]
      }
    ]
  };

  // 模拟聊天数据
  const chatMessages: ChatMessage[] = [
    { id: "msg1", user: "张小明", avatar: "", content: "讲得很好，请问React Hooks和Vue Composition API有什么本质区别？", time: "19:45" },
    { id: "msg2", user: "李明", avatar: "", content: "好问题！两者都是为了解决逻辑复用问题，但实现机制不同。React Hooks使用闭包保存状态，而Vue Composition API基于Vue的响应式系统。详细差异我们稍后会讲到。", time: "19:47", isInstructor: true },
    { id: "msg3", user: "王丽", avatar: "", content: "老师能分享一下幻灯片吗？", time: "19:50" },
    { id: "msg4", user: "李明", avatar: "", content: "课程结束后会上传到课程资料区，大家可以去下载", time: "19:51", isInstructor: true },
    { id: "msg5", user: "刘强", avatar: "", content: "请问Angular适合什么类型的项目？", time: "19:55" },
  ];

  // 处理图片加载错误
  const handleImageError = (liveId: string) => {
    // 检查是否已经记录了这个错误
    if (errorLogs[liveId] && errorLogs[liveId] > 2) {
      // 如果已经记录超过3次，不再打印错误信息
      return;
    }
    
    // 记录错误次数
    setErrorLogs(prev => ({
      ...prev,
      [liveId]: (prev[liveId] || 0) + 1
    }));
    
    // 只在首次错误或偶尔打印
    if (!errorLogs[liveId] || errorLogs[liveId] <= 2) {
      console.error(`图片加载失败: ${liveId}`);
    }
    
    // 立即更新图片错误状态
    setImageErrors(prev => ({
      ...prev,
      [liveId]: true
    }));
    
    // 避免React严格模式下的多次渲染问题
    setTimeout(() => {
      setImageErrors(prev => ({
        ...prev,
        [liveId]: true
      }));
    }, 0);
  };

  // 修改 LiveThumbnail 组件
  const LiveThumbnail = ({ live }: { live: LiveStream }) => {
    const [imgSrc, setImgSrc] = useState(live.thumbnail || localImages.fallback);
    const [hasError, setHasError] = useState(false);
    
    const handleError = () => {
      setHasError(true);
      // 如果加载失败，显示备用内容
      return (
        <div className={`w-full h-full flex items-center justify-center ${live.bgColor}`}>
          <div className="flex flex-col items-center justify-center">
            {live.icon}
            <span className="text-sm mt-2 font-medium text-center max-w-[80%]">{live.title}</span>
          </div>
        </div>
      );
    };

    if (!live.thumbnail) {
      return handleError();
    }

    return (
      <div className="relative w-full h-full">
        <Image 
          src={imgSrc}
          alt={live.title}
          fill
          className="object-cover"
          onError={() => handleError()}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}  // 对于首屏内容添加优先加载
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center p-4">
              {live.icon}
              <span className="text-sm mt-2 font-medium text-center">{live.title}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 功能处理函数
  const handleJoinLive = (liveId: string) => {
    setSelectedLiveStream(liveId);
  };

  const handleSubscribe = (liveId: string) => {
    toast.success("直播预约成功，开播前将通过APP通知提醒您");
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      toast.success("消息已发送");
      setChatMessage("");
    }
  };

  const handleReplay = (liveId: string) => {
    toast.info("回放功能正在开发中");
  };

  const getLiveStreamById = (liveId: string): LiveStream | undefined => {
    return [...liveStreams.ongoing, ...liveStreams.upcoming, ...liveStreams.past].find(live => live.id === liveId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          
          {selectedLiveStream ? (
            // 直播详情视图
            <div>
              <Button 
                variant="ghost" 
                className="mb-6"
                onClick={() => setSelectedLiveStream(null)}
              >
                ← 返回直播列表
              </Button>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video relative">
                    {getLiveStreamById(selectedLiveStream) && (
                      <LiveThumbnail live={getLiveStreamById(selectedLiveStream)!} />
                    )}
                    <div className="absolute top-4 left-4 z-20">
                      <Badge variant="destructive" className="bg-red-600">
                        直播中
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded-md text-white text-sm flex items-center z-20">
                      <Users size={16} className="mr-1" />
                      {getLiveStreamById(selectedLiveStream)?.viewers} 人观看
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <Button size="lg" className="rounded-full w-16 h-16">
                        <Play size={30} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      {getLiveStreamById(selectedLiveStream)?.title}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center mr-4">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={getLiveStreamById(selectedLiveStream)?.instructorAvatar} />
                          <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                            {getLiveStreamById(selectedLiveStream)?.instructor.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{getLiveStreamById(selectedLiveStream)?.instructor}</span>
                      </div>
                      <div className="flex items-center mr-4">
                        <CalendarClock size={16} className="mr-1" />
                        <span>{getLiveStreamById(selectedLiveStream)?.startTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{getLiveStreamById(selectedLiveStream)?.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getLiveStreamById(selectedLiveStream)?.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                      {getLiveStreamById(selectedLiveStream)?.description}
                    </p>
                  </div>
                </div>
                
                <div className="lg:col-span-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden h-[600px] flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="font-bold">直播互动</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-violet-500 text-white text-xs">
                              {message.user.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`font-medium text-sm ${message.isInstructor ? "text-orange-500" : ""}`}>
                                {message.user}
                                {message.isInstructor && <Badge variant="outline" className="ml-1 text-xs py-0 h-4">讲师</Badge>}
                              </span>
                              <span className="text-gray-500 text-xs ml-2">{message.time}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="发送消息..." 
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="icon" onClick={handleSendMessage}>
                          <Send size={16} />
                        </Button>
                      </div>
                      <div className="flex justify-between mt-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ThumbsUp size={14} className="mr-1" />
                          点赞
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Gift size={14} className="mr-1" />
                          打赏
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 直播列表视图
            <div>
              <h1 className="text-3xl font-bold mb-8">直播平台</h1>
              
              <Tabs defaultValue="ongoing" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="ongoing">正在直播</TabsTrigger>
                  <TabsTrigger value="upcoming">即将开播</TabsTrigger>
                  <TabsTrigger value="past">历史直播</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ongoing">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveStreams.ongoing.map((live) => (
                      <div key={live.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video">
                          <LiveThumbnail live={live} />
                          <div className="absolute top-3 left-3 z-20">
                            <Badge variant="destructive" className="bg-red-600">
                              直播中
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs flex items-center z-20">
                            <Users size={14} className="mr-1" />
                            {live.viewers}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-2 line-clamp-1">{live.title}</h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarImage src={live.instructorAvatar} />
                              <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                                {live.instructor.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{live.instructor}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                            {live.description}
                          </p>
                          <Button 
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            onClick={() => handleJoinLive(live.id)}
                          >
                            进入直播间
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {liveStreams.ongoing.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 mb-4">当前没有正在进行的直播</p>
                        <Button onClick={() => setActiveTab("upcoming")}>
                          查看即将开播
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveStreams.upcoming.map((live) => (
                      <div key={live.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video">
                          <LiveThumbnail live={live} />
                          <div className="absolute top-3 left-3 z-20">
                            <Badge variant="outline" className="bg-white dark:bg-gray-800">
                              即将开播
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-2 line-clamp-1">{live.title}</h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarImage src={live.instructorAvatar} />
                              <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                                {live.instructor.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{live.instructor}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <CalendarClock size={14} className="mr-1" />
                            <span>{live.startTime}</span>
                            <span className="mx-1">·</span>
                            <Clock size={14} className="mr-1" />
                            <span>{live.duration}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                            {live.description}
                          </p>
                          <Button 
                            variant="outline"
                            className="w-full"
                            onClick={() => handleSubscribe(live.id)}
                          >
                            预约直播
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="past">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveStreams.past.map((live) => (
                      <div key={live.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video">
                          <LiveThumbnail live={live} />
                          <div className="absolute top-3 left-3 z-20">
                            <Badge variant="secondary">
                              回放
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs flex items-center z-20">
                            <Users size={14} className="mr-1" />
                            {live.viewers} 次观看
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-2 line-clamp-1">{live.title}</h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarImage src={live.instructorAvatar} />
                              <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                                {live.instructor.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{live.instructor}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <CalendarClock size={14} className="mr-1" />
                            <span>{live.startTime}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                            {live.description}
                          </p>
                          <Button 
                            className="w-full"
                            onClick={() => handleReplay(live.id)}
                          >
                            观看回放
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
        </div>
      </main>
      <Footer />
    </div>
  );
} 