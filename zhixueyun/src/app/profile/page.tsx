"use client";

import { useState } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "用户名",
    avatar: "",
    email: "user@example.com",
    phone: "13800138000",
    bio: "这里是个人简介，可以介绍自己的技能特长和学习兴趣。",
    occupation: "职业/学生",
    location: "城市",
    website: "",
    notifications: {
      email: true,
      sms: true,
      wechat: false,
    },
  });

  const [skillTags, setSkillTags] = useState([
    { id: "web", name: "Web开发", selected: true },
    { id: "mobile", name: "移动开发", selected: false },
    { id: "design", name: "UI设计", selected: true },
    { id: "product", name: "产品管理", selected: false },
    { id: "marketing", name: "市场营销", selected: true },
    { id: "language", name: "语言学习", selected: false },
    { id: "data", name: "数据分析", selected: true },
    { id: "ai", name: "人工智能", selected: false },
  ]);

  const [newTag, setNewTag] = useState("");

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfileData(prev => {
      if (typeof value === 'boolean' && field.includes('.')) {
        const [category, key] = field.split('.');
        return {
          ...prev,
          [category]: {
            ...prev[category as keyof typeof prev] as Record<string, boolean>,
            [key]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const toggleSkillTag = (id: string) => {
    setSkillTags(prev =>
      prev.map(tag =>
        tag.id === id ? { ...tag, selected: !tag.selected } : tag
      )
    );
  };

  const addNewSkillTag = () => {
    if (newTag.trim() === "") return;
    const id = newTag.toLowerCase().replace(/\s+/g, '-');
    
    // 检查是否已存在相同的tag
    if (skillTags.some(tag => tag.id === id)) {
      toast.error("该技能标签已存在");
      return;
    }
    
    setSkillTags(prev => [...prev, { id, name: newTag, selected: true }]);
    setNewTag("");
    toast.success("添加技能标签成功");
  };

  const handleSaveProfile = () => {
    toast.success("个人资料已更新");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">个人资料设置</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            管理您的账户信息和偏好设置
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <Tabs defaultValue="basic" className="w-full">
              <div className="border-b px-6 py-3">
                <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex h-auto gap-4 bg-transparent p-0">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md px-4 py-2"
                  >
                    基本信息
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md px-4 py-2"
                  >
                    技能偏好
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md px-4 py-2"
                  >
                    账号设置
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="basic" className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="mb-4">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src="/avatar.jpg" alt="用户头像" />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-green-400 to-blue-500 text-white">
                          {profileData.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Button variant="outline" className="mb-2">
                      上传新头像
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      推荐使用正方形图片，<br />大小不超过2MB
                    </p>
                  </div>

                  <div className="w-full md:w-2/3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">用户名</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange("name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">手机号</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation">职业</Label>
                        <Input
                          id="occupation"
                          value={profileData.occupation}
                          onChange={(e) => handleProfileChange("occupation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">所在地</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleProfileChange("location", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">个人网站</Label>
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => handleProfileChange("website", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">个人简介</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => handleProfileChange("bio", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">我的技能标签</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      选择您感兴趣或擅长的技能，这将帮助我们为您推荐更合适的课程
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {skillTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={tag.selected ? "default" : "outline"}
                          className={`cursor-pointer ${
                            tag.selected
                              ? "bg-gradient-to-r from-green-500 to-blue-500"
                              : ""
                          }`}
                          onClick={() => toggleSkillTag(tag.id)}
                        >
                          {tag.name}
                          {tag.selected && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="ml-1 h-3 w-3"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="添加自定义技能标签"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addNewSkillTag();
                          }
                        }}
                      />
                      <Button onClick={addNewSkillTag}>添加</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">推荐设置</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      根据您的技能标签和学习历史，我们将为您推荐相关内容
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">根据我的技能自动推荐课程</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            您将收到与您技能相关的课程推荐
                          </p>
                        </div>
                        <Switch
                          checked={true}
                          onCheckedChange={() => {}}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">接收学习路径建议</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            根据您的技能树，推荐个性化学习路径
                          </p>
                        </div>
                        <Switch
                          checked={true}
                          onCheckedChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">通知设置</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">邮件通知</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            接收课程更新、技能点变动等邮件通知
                          </p>
                        </div>
                        <Switch
                          checked={profileData.notifications.email}
                          onCheckedChange={(checked) =>
                            handleProfileChange("notifications.email", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">短信通知</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            接收重要事件的短信提醒
                          </p>
                        </div>
                        <Switch
                          checked={profileData.notifications.sms}
                          onCheckedChange={(checked) =>
                            handleProfileChange("notifications.sms", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">微信通知</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            通过微信接收平台通知
                          </p>
                        </div>
                        <Switch
                          checked={profileData.notifications.wechat}
                          onCheckedChange={(checked) =>
                            handleProfileChange("notifications.wechat", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">账户安全</h3>
                    <div className="space-y-4">
                      <div>
                        <Button variant="outline">修改密码</Button>
                      </div>
                      <div>
                        <Button variant="outline">绑定微信账号</Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      onClick={handleSaveProfile}
                    >
                      保存所有更改
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 