"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ChapterInput {
  title: string;
  duration: string;
}

export default function CreateCrowdfundingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState(1000);
  const [duration, setDuration] = useState(30);
  const [coverImage, setCoverImage] = useState("");
  const [chapters, setChapters] = useState<ChapterInput[]>([
    { title: "", duration: "" }
  ]);

  const handleAddChapter = () => {
    setChapters([...chapters, { title: "", duration: "" }]);
  };

  const handleChapterChange = (index: number, field: keyof ChapterInput, value: string) => {
    const newChapters = [...chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setChapters(newChapters);
  };

  const handleRemoveChapter = (index: number) => {
    if (chapters.length > 1) {
      const newChapters = chapters.filter((_, i) => i !== index);
      setChapters(newChapters);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!title.trim()) {
      toast.error("请输入课程标题");
      return;
    }
    if (!description.trim()) {
      toast.error("请输入课程描述");
      return;
    }
    if (targetAmount < 100) {
      toast.error("目标金额不能小于100技能点");
      return;
    }
    if (duration < 1 || duration > 90) {
      toast.error("众筹时长需在1-90天之间");
      return;
    }
    if (chapters.some(chapter => !chapter.title.trim() || !chapter.duration.trim())) {
      toast.error("请完善所有章节信息");
      return;
    }

    // 提交表单
    toast.success("众筹课程创建成功！");
    router.push("/skills/crowdfunding");
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

          <Card className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">发起课程众筹</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">课程标题</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入课程标题"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">课程描述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="详细描述课程内容、目标受众和学习收获"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">目标金额（技能点）</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    min={100}
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">众筹时长（天）</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    max={90}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">课程封面图片链接</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="输入图片URL"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>课程大纲</Label>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleAddChapter}
                  >
                    添加章节
                  </Button>
                </div>

                {chapters.map((chapter, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">第 {index + 1} 章</h3>
                      {chapters.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveChapter(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          删除
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>章节标题</Label>
                        <Input
                          value={chapter.title}
                          onChange={(e) => handleChapterChange(index, "title", e.target.value)}
                          placeholder="输入章节标题"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>预计时长</Label>
                        <Input
                          value={chapter.duration}
                          onChange={(e) => handleChapterChange(index, "duration", e.target.value)}
                          placeholder="如：2小时"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                提交众筹申请
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 