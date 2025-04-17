"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, ThumbsUp, Eye, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  thumbnail: string;
}

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800));

        // 模拟帖子数据
        const mockPost = {
          id: params.id as string,
          title: "如何有效地学习前端技术栈？",
          content: `作为一名前端开发新手，面对React、Vue、Angular等框架感到困惑。有经验的开发者能分享一下学习路径和方法吗？

以下是我的一些具体问题：

1. 应该先深入学习JavaScript基础，还是直接上手框架？
2. 各个框架的优劣势是什么？如何选择适合自己的框架？
3. 有什么推荐的学习资源和项目实践方式？
4. 如何避免只是浅尝辄止，真正掌握技术要点？

希望能得到社区中经验丰富的开发者的指导和建议。`,
          author: "技术探索者",
          authorAvatar: "",
          date: "2024-03-14",
          likes: 56,
          comments: 23,
          views: 789,
          tags: ["前端", "学习路径", "技术选型"],
          thumbnail: "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?q=80&w=800&auto=format&fit=crop"
        };

        // 模拟评论数据
        const mockComments = [
          {
            id: "1",
            author: "资深前端",
            authorAvatar: "",
            content: "建议先打好JavaScript基础，包括ES6+的新特性。然后可以从React入手，因为它的生态最完善，社区资源最丰富。",
            date: "2024-03-14",
            likes: 15
          },
          {
            id: "2",
            author: "全栈工程师",
            authorAvatar: "",
            content: "框架只是工具，重要的是理解前端的核心概念。建议按这个顺序学习：HTML/CSS基础 → JavaScript深入 → 框架原理 → 实战项目。",
            date: "2024-03-14",
            likes: 12
          }
        ];

        setPost(mockPost);
        setComments(mockComments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("获取帖子信息失败");
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [params.id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("请输入评论内容");
      return;
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

      const newCommentObj = {
        id: Date.now().toString(),
        author: "当前用户",
        authorAvatar: "",
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment("");
      toast.success("评论发布成功");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("评论发布失败");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <FixedHeader />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
          <div className="container mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <FixedHeader />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
          <div className="container mx-auto text-center py-12">
            <h2 className="text-2xl font-bold mb-4">帖子不存在</h2>
            <Button onClick={() => router.push('/community')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回社区
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/community')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回社区
          </Button>

          <Card>
            <CardContent className="p-6">
              {/* 帖子头部 */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={post.authorAvatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-sm text-gray-500">{post.date}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </span>
                </div>
              </div>

              {/* 帖子内容 */}
              <div className="mb-8">
                {post.thumbnail && (
                  <div className="relative h-[400px] mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{post.content}</p>
                </div>
              </div>

              {/* 评论区 */}
              <div>
                <h3 className="text-xl font-bold mb-6">评论 ({comments.length})</h3>
                
                {/* 评论输入框 */}
                <form onSubmit={handleComment} className="mb-6">
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

                {/* 评论列表 */}
                <div className="space-y-6">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src={comment.authorAvatar} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{comment.author}</div>
                          <div className="text-sm text-gray-500">{comment.date}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          回复
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 