"use client";

import { useState } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      wechat: false,
    },
    privacy: {
      showOnlineStatus: true,
      showLearningProgress: true,
      allowMessageFromStranger: false,
    },
  });

  const [securityInfo, setSecurityInfo] = useState({
    email: "3204066037@qq.com",
    phone: "18959538961",
    lastLoginTime: "2024-03-20 15:30:00",
    lastLoginIP: "192.168.1.1",
  });

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    toast.success("设置已保存");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">设置</h1>
        
        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications">通知设置</TabsTrigger>
            <TabsTrigger value="privacy">隐私设置</TabsTrigger>
            <TabsTrigger value="security">安全设置</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">邮件通知</h4>
                  <p className="text-sm text-gray-500">接收课程更新、技能点变动等邮件通知</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">短信通知</h4>
                  <p className="text-sm text-gray-500">接收重要事件的短信提醒</p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "sms", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">微信通知</h4>
                  <p className="text-sm text-gray-500">通过微信接收平台通知</p>
                </div>
                <Switch
                  checked={settings.notifications.wechat}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "wechat", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">显示在线状态</h4>
                  <p className="text-sm text-gray-500">让其他用户看到你是否在线</p>
                </div>
                <Switch
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => handleSettingChange("privacy", "showOnlineStatus", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">显示学习进度</h4>
                  <p className="text-sm text-gray-500">公开展示你的技能学习进度</p>
                </div>
                <Switch
                  checked={settings.privacy.showLearningProgress}
                  onCheckedChange={(checked) => handleSettingChange("privacy", "showLearningProgress", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">允许陌生人私信</h4>
                  <p className="text-sm text-gray-500">是否接收非好友的私信</p>
                </div>
                <Switch
                  checked={settings.privacy.allowMessageFromStranger}
                  onCheckedChange={(checked) => handleSettingChange("privacy", "allowMessageFromStranger", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>绑定邮箱</Label>
                <div className="flex items-center gap-2">
                  <Input value={securityInfo.email} readOnly className="bg-gray-50" />
                  <Button variant="outline">修改</Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>绑定手机</Label>
                <div className="flex items-center gap-2">
                  <Input value={securityInfo.phone} readOnly className="bg-gray-50" />
                  <Button variant="outline">修改</Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>最近登录</Label>
                <div className="text-sm text-gray-500">
                  <p>时间：{securityInfo.lastLoginTime}</p>
                  <p>IP地址：{securityInfo.lastLoginIP}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Button variant="outline">修改密码</Button>
                <Button variant="outline">设置支付密码</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button onClick={handleSaveSettings}>保存设置</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 