"use client";

import { useState, useEffect } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { ArrowUpRight, ArrowDown, ArrowUp, Filter, TrendingUp, Clock, Search, Plus, Users, Award } from "lucide-react";

// 分类和子分类类型定义
type Category = "编程开发" | "设计创意" | "商业管理" | string;
type SubCategory = "区块链" | "云计算" | "Web3" | "AI绘画" | "3D设计" | "产品增长" | "系统架构" | string;

// 众筹项目类型定义
interface CrowdfundingProject {
  id: string;
  title: string;
  category: Category;
  subCategory: SubCategory;
  initiator: string;
  initiatorTitle: string;
  initiatorAvatar: string;
  targetPoints: number;
  currentPoints: number;
  supportersCount: number;
  daysLeft: number;
  status: string;
  createdAt: string;
  description: string;
  skills: string[];
  popularity: number;
  outcomes?: string;  // 预期成果
  prerequisites?: string;  // 前置要求
  updates?: Array<{
    date: string;
    content: string;
  }>;  // 项目更新记录
  supporters?: Array<{
    userId: string;
    points: number;
    date: string;
  }>;  // 支持者信息
}

export default function CrowdfundingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ongoing");
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [sortBy, setSortBy] = useState("popular"); // popular, newest, mostFunded
  const [minSkillPoints, setMinSkillPoints] = useState(0); 
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [proposalForm, setProposalForm] = useState({
    title: "",
    category: "",
    targetPoints: "",
    description: "",
    outcomes: "",
    prerequisites: "",
  });

  // 模拟众筹课程数据
  const crowdfundingProjects = [
    {
      id: "cf-001",
      title: "区块链技术与应用开发实战",
      category: "编程开发",
      subCategory: "区块链",
      initiator: "赵强",
      initiatorTitle: "区块链技术专家",
      initiatorAvatar: "",
      targetPoints: 1000,
      currentPoints: 650,
      supportersCount: 48,
      daysLeft: 12,
      status: "ongoing",
      createdAt: "2025-01-15",
      description: "本课程将深入讲解区块链核心原理与应用开发，从技术基础到实战项目，帮助开发者掌握这一前沿技术。",
      skills: ["区块链", "智能合约", "DApp开发", "以太坊"],
      popularity: 85,
    },
    {
      id: "cf-002",
      title: "AI绘画技术精通：从入门到专业",
      category: "设计创意",
      subCategory: "AI绘画",
      initiator: "王芳",
      initiatorTitle: "资深设计师",
      initiatorAvatar: "",
      targetPoints: 800,
      currentPoints: 720,
      supportersCount: 65,
      daysLeft: 5,
      status: "ongoing",
      createdAt: "2025-02-03",
      description: "探索AI绘画的艺术与技术，学习如何利用最新的AI工具创作专业级别的绘画作品，适合设计师和艺术爱好者。",
      skills: ["AI绘画", "Midjourney", "Stable Diffusion", "数字艺术"],
      popularity: 92,
    },
    {
      id: "cf-003",
      title: "云原生架构与微服务设计",
      category: "编程开发",
      subCategory: "云计算",
      initiator: "张伟",
      initiatorTitle: "高级架构师",
      initiatorAvatar: "",
      targetPoints: 1200,
      currentPoints: 1200,
      supportersCount: 78,
      daysLeft: 0,
      status: "completed",
      createdAt: "2024-11-20",
      description: "深入学习云原生应用开发、容器化技术、微服务架构设计与实现，以及DevOps最佳实践，全面提升架构设计能力。",
      skills: ["微服务", "Docker", "Kubernetes", "DevOps"],
      popularity: 88,
    },
    {
      id: "cf-004",
      title: "元宇宙交互设计进阶",
      category: "设计创意",
      subCategory: "3D设计",
      initiator: "李明",
      initiatorTitle: "交互设计总监",
      initiatorAvatar: "",
      targetPoints: 900,
      currentPoints: 450,
      supportersCount: 32,
      daysLeft: 15,
      status: "ongoing",
      createdAt: "2025-02-15",
      description: "探索元宇宙空间的交互设计原则与实践，学习3D环境中的用户体验设计，掌握最新的VR/AR交互技术。",
      skills: ["元宇宙", "交互设计", "3D建模", "VR/AR"],
      popularity: 76,
    },
    {
      id: "cf-005",
      title: "大规模分布式系统设计与实现",
      category: "编程开发",
      subCategory: "系统架构",
      initiator: "陈静",
      initiatorTitle: "技术总监",
      initiatorAvatar: "",
      targetPoints: 1500,
      currentPoints: 300,
      supportersCount: 20,
      daysLeft: 25,
      status: "ongoing",
      createdAt: "2025-02-10",
      description: "从理论到实践，系统讲解大规模分布式系统的设计原则、架构模式、数据一致性、容错机制及性能优化。",
      skills: ["分布式系统", "高并发", "系统架构", "容错设计"],
      popularity: 65,
    },
    {
      id: "cf-006",
      title: "产品增长黑客实战指南",
      category: "商业管理",
      subCategory: "产品增长",
      initiator: "刘红",
      initiatorTitle: "产品增长顾问",
      initiatorAvatar: "",
      targetPoints: 600,
      currentPoints: 600,
      supportersCount: 42,
      daysLeft: 0,
      status: "completed",
      createdAt: "2024-12-05",
      description: "学习增长黑客的核心理念和方法论，通过数据驱动的方式设计和执行产品增长策略，提升用户获取与留存。",
      skills: ["增长黑客", "用户获取", "数据分析", "产品运营"],
      popularity: 79,
    },
    {
      id: "cf-007",
      title: "Web3.0与去中心化应用开发",
      category: "编程开发",
      subCategory: "Web3",
      initiator: "孙明",
      initiatorTitle: "Web3开发者",
      initiatorAvatar: "",
      targetPoints: 850,
      currentPoints: 520,
      supportersCount: 38,
      daysLeft: 18,
      status: "ongoing",
      createdAt: "2025-02-18",
      description: "探索Web3.0生态系统，学习去中心化应用开发、智能合约编程和区块链集成，掌握未来互联网技术。",
      skills: ["Web3", "以太坊", "Solidity", "DApp"],
      popularity: 82,
    },
  ];

  // 根据筛选条件和排序获取课程列表
  const getFilteredAndSortedProjects = () => {
    // 首先按照基本条件筛选
    let filtered = crowdfundingProjects.filter((project) => {
      // 按状态筛选
      if (activeTab !== "all" && project.status !== activeTab) {
        return false;
      }
      
      // 按分类筛选
      if (selectedCategory !== "all" && project.category !== selectedCategory) {
        return false;
      }
      
      // 按最小技能点筛选
      if (project.targetPoints < minSkillPoints) {
        return false;
      }
      
      // 按搜索关键词筛选
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.subCategory.toLowerCase().includes(query) ||
          project.skills.some((skill) => skill.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
    
    // 然后按选定的排序方式排序
    return filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "mostFunded") {
        return (b.currentPoints / b.targetPoints) - (a.currentPoints / a.targetPoints);
      } else {
        // 默认按人气排序
        return b.popularity - a.popularity;
      }
    });
  };

  const filteredProjects = getFilteredAndSortedProjects();

  // 获取众筹状态信息
  const getCrowdfundingStatusInfo = (project: CrowdfundingProject) => {
    // 计算众筹进度百分比
    const progressPercent = Math.round((project.currentPoints / project.targetPoints) * 100);
    
    if (project.status === "completed") {
      return {
        color: "bg-green-500",
        text: "已达成",
        textColor: "text-green-500",
        progressColor: "bg-green-500"
      };
    } else if (progressPercent >= 75) {
      return {
        color: "bg-teal-500",
        text: `${project.daysLeft}天 · 即将达成`,
        textColor: "text-teal-500",
        progressColor: "bg-teal-500"
      };
    } else if (project.daysLeft <= 7) {
      return {
        color: "bg-orange-500",
        text: `剩余${project.daysLeft}天`,
        textColor: "text-orange-500",
        progressColor: "bg-orange-500"
      };
    } else {
      return {
        color: "bg-blue-500",
        text: "众筹中",
        textColor: "text-blue-500",
        progressColor: "bg-blue-500"
      };
    }
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!proposalForm.title || !proposalForm.category || !proposalForm.targetPoints || !proposalForm.description) {
      toast.error("请填写所有必填字段");
      return;
    }
    
    // 模拟提交成功
    toast.success("课程众筹提案已成功提交，等待审核");
    setShowProposalForm(false);
    setProposalForm({
      title: "",
      category: "",
      targetPoints: "",
      description: "",
      outcomes: "",
      prerequisites: "",
    });
  };

  const handleSupportProject = (projectId: string, projectTitle: string) => {
    toast.success(`已成功支持《${projectTitle}》，贡献10技能点`);
  };

  // 类别列表
  const categories = [
    { value: "all", label: "全部分类" },
    { value: "编程开发", label: "编程开发" },
    { value: "设计创意", label: "设计创意" },
    { value: "商业管理", label: "商业管理" },
    { value: "语言学习", label: "语言学习" },
    { value: "生活技能", label: "生活技能" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 页面头部 */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">课程众筹</h1>
              <p className="text-gray-600 dark:text-gray-400">
                支持您感兴趣的课程提案，共同促成优质内容的创作
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-md"
              onClick={() => setShowProposalForm(!showProposalForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showProposalForm ? "取消" : "发起课程众筹"}
            </Button>
          </div>

          {/* 创建课程众筹表单 */}
          {showProposalForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-500" />
                创建课程众筹提案
              </h2>
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">课程标题 <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      placeholder="请输入课程标题"
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">课程分类 <span className="text-red-500">*</span></Label>
                    <Select
                      value={proposalForm.category}
                      onValueChange={(value) => setProposalForm({ ...proposalForm, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="选择课程分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="编程开发">编程开发</SelectItem>
                        <SelectItem value="设计创意">设计创意</SelectItem>
                        <SelectItem value="商业管理">商业管理</SelectItem>
                        <SelectItem value="语言学习">语言学习</SelectItem>
                        <SelectItem value="生活技能">生活技能</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetPoints">目标技能点 <span className="text-red-500">*</span></Label>
                    <Input
                      id="targetPoints"
                      type="number"
                      placeholder="设置众筹目标技能点数量"
                      value={proposalForm.targetPoints}
                      onChange={(e) => setProposalForm({ ...proposalForm, targetPoints: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">课程描述 <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="详细描述课程内容、目标和特色"
                    rows={4}
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcomes">学习收获</Label>
                  <Textarea
                    id="outcomes"
                    placeholder="学员完成课程后将获得哪些技能和知识"
                    rows={3}
                    value={proposalForm.outcomes}
                    onChange={(e) => setProposalForm({ ...proposalForm, outcomes: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">先修知识</Label>
                  <Textarea
                    id="prerequisites"
                    placeholder="学习本课程需要哪些基础知识或技能"
                    rows={3}
                    value={proposalForm.prerequisites}
                    onChange={(e) => setProposalForm({ ...proposalForm, prerequisites: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowProposalForm(false)}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    提交提案
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* 搜索和过滤 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search
                    className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    placeholder="搜索课程众筹..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs 
                  defaultValue="ongoing" 
                  className="w-full md:w-auto"
                  onValueChange={(value) => setActiveTab(value)}
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="ongoing">进行中</TabsTrigger>
                    <TabsTrigger value="completed">已完成</TabsTrigger>
                    <TabsTrigger value="all">全部</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="md:w-auto w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  高级筛选
                </Button>
              </div>
              
              {/* 高级筛选选项 */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <Label>课程分类</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>最低目标技能点: {minSkillPoints}</Label>
                    <Slider
                      value={[minSkillPoints]}
                      min={0}
                      max={2000}
                      step={100}
                      onValueChange={(value) => setMinSkillPoints(value[0])}
                      className="py-4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>排序方式</Label>
                    <Select
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="排序方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            热门程度
                          </div>
                        </SelectItem>
                        <SelectItem value="newest">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            最新发布
                          </div>
                        </SelectItem>
                        <SelectItem value="mostFunded">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            众筹进度
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 众筹项目列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const statusInfo = getCrowdfundingStatusInfo(project);
                const progressPercent = Math.round((project.currentPoints / project.targetPoints) * 100);
                
                return (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={`${statusInfo.color} shadow-sm`}>
                          {statusInfo.text}
                        </Badge>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2 border-2 border-gray-100 dark:border-gray-700">
                            <AvatarImage src={project.initiatorAvatar} />
                            <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                              {project.initiator.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{project.initiator}</div>
                            <div className="text-xs text-gray-500">{project.initiatorTitle}</div>
                          </div>
                        </div>
                      </div>

                      <Link href={`/crowdfunding/${project.id}`} className="block group">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex items-center">
                          {project.title}
                          <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </Link>

                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-900">{project.category}</Badge>
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-900">{project.subCategory}</Badge>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={statusInfo.textColor}>
                              众筹进度: {progressPercent}%
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {project.currentPoints}/{project.targetPoints} 技能点
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${statusInfo.progressColor} transition-all duration-500 ease-out`} 
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{project.supportersCount} 人支持</span>
                          </div>
                          {project.status === "ongoing" && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>剩余 {project.daysLeft} 天</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {project.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {skill}
                            </Badge>
                          ))}
                          {project.skills.length > 3 && (
                            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              +{project.skills.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="pt-2">
                          {project.status === "ongoing" ? (
                            <Button
                              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-md"
                              onClick={() => handleSupportProject(project.id, project.title)}
                            >
                              支持此课程
                            </Button>
                          ) : (
                            <Button
                              className="w-full"
                              variant="outline"
                            >
                              查看详情
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">未找到相关众筹项目</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  尝试使用其他关键词搜索，或者发起一个新的课程众筹
                </p>
                <Button
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={() => {
                    setShowProposalForm(true);
                    setSearchQuery("");
                  }}
                >
                  发起课程众筹
                </Button>
              </div>
            )}
          </div>

          {/* 众筹指南 */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">众筹指南</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-bold">发起众筹</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  提交您希望学习的课程主题和详细需求，设定技能点目标和众筹期限。
                </p>
              </div>
              <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-bold">支持众筹</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  浏览众筹课程，为您感兴趣的课程贡献技能点，每个支持都会带来课程实现的可能。
                </p>
              </div>
              <div className="space-y-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-bold">课程制作</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  众筹成功后，平台将邀请相关领域专家制作课程，支持者可优先参与课程内容规划。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 