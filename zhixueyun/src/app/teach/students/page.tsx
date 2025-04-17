"use client";

import React from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search } from "lucide-react";

export default function StudentsManagementPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">学员管理</h1>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input placeholder="搜索学员..." />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  搜索
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>学员</TableHead>
                    <TableHead>课程</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>最后活动</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* 添加学员列表数据 */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 