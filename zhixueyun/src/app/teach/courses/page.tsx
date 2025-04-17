"use client";

import React from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { PlusCircle, BookOpen, Users, Clock } from "lucide-react";

export default function TeachCoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">我的课程</h1>
            <Link href="/teach/create">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                创建新课程
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="published" className="mb-8">
            <TabsList>
              <TabsTrigger value="published">已发布</TabsTrigger>
              <TabsTrigger value="draft">草稿</TabsTrigger>
              <TabsTrigger value="review">审核中</TabsTrigger>
            </TabsList>

            <TabsContent value="published">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">React 高级开发实战</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          深入学习 React 的高级特性和最佳实践
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>123 名学员</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>8 小时</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="draft">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 这里添加草稿课程列表 */}
              </div>
            </TabsContent>

            <TabsContent value="review">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 这里添加审核中的课程列表 */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
} 