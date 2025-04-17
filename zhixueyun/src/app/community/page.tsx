"use client";

import React from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// 模拟论坛帖子数据
const forumPosts = [
  {
    id: "post-001",
    title: "如何有效地学习前端技术栈？",
    author: "技术探索者",
    authorAvatar: "",
    date: "2023-06-14",
    likes: 56,
    comments: 23,
    views: 789,
    excerpt: "作为一名前端开发新手，面对React、Vue、Angular等框架感到困惑。有经验的开发者能分享一下学习路径和方法吗？",
    tags: ["前端", "学习路径", "技术选型"],
    thumbnail: "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "post-002",
    title: "分享：我的敏捷开发团队管理经验",
    author: "项目管理者",
    authorAvatar: "",
    date: "2023-06-13",
    likes: 78,
    comments: 32,
    views: 1256,
    excerpt: "过去三年，我带领团队完成了多个敏捷项目，这里分享一些实践经验和踩过的坑，希望对大家有所帮助。",
    tags: ["敏捷开发", "团队管理", "项目管理"],
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "post-003",
    title: "云原生架构在金融领域的应用案例",
    author: "架构师小王",
    authorAvatar: "",
    date: "2023-06-12",
    likes: 45,
    comments: 19,
    views: 678,
    excerpt: "本文分享我们金融科技团队如何利用云原生技术重构传统银行系统，提升系统弹性和安全性的经验。",
    tags: ["云原生", "金融科技", "系统架构"],
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "post-004",
    title: "深度学习模型部署最佳实践",
    author: "AI实践者",
    authorAvatar: "",
    date: "2023-06-11",
    likes: 67,
    comments: 28,
    views: 945,
    excerpt: "将训练好的深度学习模型部署到生产环境中有很多挑战，本文分享一些优化性能和资源使用的方法。",
    tags: ["深度学习", "模型部署", "AI工程"],
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "post-005",
    title: "设计系统如何提升产品一致性",
    author: "UI设计师",
    authorAvatar: "",
    date: "2023-06-10",
    likes: 39,
    comments: 17,
    views: 562,
    excerpt: "介绍我们如何在一个大型产品中实施设计系统，并解决多团队协作中的设计一致性问题。",
    tags: ["设计系统", "UI/UX", "产品设计"],
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "post-006",
    title: "远程工作三年的经验与挑战",
    author: "远程工作者",
    authorAvatar: "",
    date: "2023-06-09",
    likes: 89,
    comments: 41,
    views: 1325,
    excerpt: "作为一名全职远程开发者，分享我这三年来的工作方式、效率技巧和面临的挑战。",
    tags: ["远程工作", "工作效率", "职业发展"],
    thumbnail: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=800&auto=format&fit=crop"
  }
];

// 模拟问答数据
const qaData = [
  {
    id: "qa-001",
    title: "Next.js 13 App Router中如何处理API请求？",
    author: "Next新手",
    authorAvatar: "",
    date: "2023-06-14",
    likes: 12,
    answers: 3,
    views: 235,
    excerpt: "我正在使用Next.js 13的App Router，想知道是否可以在Server Components中直接调用数据库，或者应该使用API Routes？",
    tags: ["Next.js", "React", "API"],
    thumbnail: "https://images.unsplash.com/photo-1612296727716-d6c69d8deb f0?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "qa-002",
    title: "TypeScript中类型声明的最佳实践是什么？",
    author: "TS学习者",
    authorAvatar: "",
    date: "2023-06-13",
    likes: 18,
    answers: 5,
    views: 342,
    excerpt: "在大型项目中，TypeScript的类型声明应该如何组织？是集中在一个文件中还是分散在各个模块？",
    tags: ["TypeScript", "类型系统", "代码组织"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "qa-003",
    title: "微服务架构的服务发现有哪些方案？",
    author: "架构新手",
    authorAvatar: "",
    date: "2023-06-12",
    likes: 15,
    answers: 4,
    views: 289,
    excerpt: "在实施微服务架构时，不同的服务发现机制各有什么优缺点？Kubernetes、Consul和其他方案如何选择？",
    tags: ["微服务", "服务发现", "系统架构"],
    thumbnail: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=800&auto=format&fit=crop"
  }
];

// 添加 PostCard 组件
const PostCard = ({ post }: { post: any }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
          <span className="text-sm text-gray-400">·</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{post.date}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments || post.answers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 添加主页面组件
export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">技术社区</h1>
          
          <Tabs defaultValue="forum" className="mb-8">
            <TabsList>
              <TabsTrigger value="forum">技术论坛</TabsTrigger>
              <TabsTrigger value="qa">问答专区</TabsTrigger>
            </TabsList>
            
            <TabsContent value="forum">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forumPosts.map((post) => (
                  <Link key={post.id} href={`/community/post/${post.id}`}>
                    <PostCard post={post} />
                  </Link>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="qa">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qaData.map((qa) => (
                  <Link key={qa.id} href={`/community/qa/${qa.id}`}>
                    <PostCard post={qa} />
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
} 