"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  supportAmount: number;
}

export default function CrowdfundingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [supportAmount, setSupportAmount] = useState(100);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      userId: "user1",
      userName: "张三",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content: "这个课程非常有前景，期待上线！",
      createdAt: "2024-03-15",
      supportAmount: 200
    },
    {
      id: "2",
      userId: "user2",
      userName: "李四",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      content: "课程大纲很专业，已经支持了",
      createdAt: "2024-03-14",
      supportAmount: 150
    }
  ]);

  const handleSupport = () => {
    if (supportAmount < 10) {
      toast.error("支持金额不能小于10技能点");
      return;
    }
    toast.success(`成功支持${supportAmount}技能点`);
  };

  const handleComment = () => {
    if (!comment.trim()) {
      toast.error("请输入评论内容");
      return;
    }
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: "currentUser",
      userName: "当前用户",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      content: comment,
      createdAt: new Date().toISOString().split('T')[0],
      supportAmount: supportAmount
    };
    setComments([newComment, ...comments]);
    setComment("");
    toast.success("评论发布成功");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/skills/crowdfunding')}
            className="mb-6"
          >
            ← 返回众筹列表
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧主要内容 */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h1 className="text-3xl font-bold mb-4">区块链技术与应用开发</h1>
                <div className="aspect-video rounded-lg overflow-hidden mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a"
                    alt="课程封面"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar>
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                    <AvatarFallback>讲师</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">张教授</h3>
                    <p className="text-sm text-gray-500">区块链技术专家</p>
                  </div>
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">课程详情</TabsTrigger>
                    <TabsTrigger value="syllabus" className="flex-1">课程大纲</TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1">支持记录</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <h3>课程介绍</h3>
                      <p>从零开始学习区块链技术，掌握智能合约开发，构建去中心化应用（DApp）。本课程将带你深入了解区块链技术的核心概念和实践应用。</p>
                      <h3>学习目标</h3>
                      <ul>
                        <li>理解区块链技术的基本原理和应用场景</li>
                        <li>掌握智能合约开发的核心技能</li>
                        <li>能够独立开发和部署DApp应用</li>
                        <li>了解区块链项目开发的最佳实践</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="syllabus" className="mt-4">
                    <div className="space-y-4">
                      {["区块链基础理论", "密码学与共识机制", "智能合约开发", "DApp实战项目"].map((chapter, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-semibold">第{index + 1}章：{chapter}</h3>
                          <p className="text-sm text-gray-500 mt-2">预计课时：10小时</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="comments" className="mt-4">
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar>
                              <AvatarImage src={comment.userAvatar} />
                              <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{comment.userName}</p>
                              <p className="text-sm text-gray-500">支持了 {comment.supportAmount} 技能点</p>
                            </div>
                            <span className="text-sm text-gray-500 ml-auto">{comment.createdAt}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* 右侧支持面板 */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">支持项目</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>众筹进度</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="bg-green-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">目标金额</p>
                      <p className="font-semibold">10000 技能点</p>
                    </div>
                    <div>
                      <p className="text-gray-500">已筹金额</p>
                      <p className="font-semibold">6800 技能点</p>
                    </div>
                    <div>
                      <p className="text-gray-500">支持人数</p>
                      <p className="font-semibold">168 人</p>
                    </div>
                    <div>
                      <p className="text-gray-500">剩余时间</p>
                      <p className="font-semibold">15 天</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">支持金额</label>
                    <Input
                      type="number"
                      value={supportAmount}
                      onChange={(e) => setSupportAmount(Number(e.target.value))}
                      min={10}
                      placeholder="最低支持10技能点"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">评论（选填）</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="说说你对这个课程的看法..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    onClick={handleSupport}
                  >
                    立即支持
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">支持权益</h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge>权益1</Badge>
                    <span>课程正式发布后可免费学习</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge>权益2</Badge>
                    <span>获得专属技能徽章</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge>权益3</Badge>
                    <span>优先参与课程内测</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge>权益4</Badge>
                    <span>专属社群交流机会</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 