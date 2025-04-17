"use client";

import React from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CreateCoursePage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理课程创建逻辑
    toast.success("课程创建成功！");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">创建新课程</h1>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">课程标题</Label>
                  <Input id="title" placeholder="输入课程标题" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">课程描述</Label>
                  <Textarea id="description" placeholder="描述你的课程内容" />
                </div>
                
                {/* 添加更多表单字段 */}
                
                <Button type="submit" className="w-full">
                  创建课程
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 