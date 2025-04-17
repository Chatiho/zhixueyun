"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号");
const codeSchema = z.string().length(6, "验证码必须是6位数字");

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLogging, setIsLogging] = useState(false);

  // 如果已经登录，重定向到首页
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const sendCode = () => {
    try {
      phoneSchema.parse(phone);
      setIsCodeSent(true);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast.success("验证码已发送至您的手机");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };

  const handleLogin = async () => {
    try {
      phoneSchema.parse(phone);
      codeSchema.parse(code);
      
      setIsLogging(true);
      
      // 使用上下文的登录函数
      await login(phone, code);
      
      toast.success("登录成功");
      router.push("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("登录失败，请重试");
        console.error(error);
      }
    } finally {
      setIsLogging(false);
    }
  };

  const handleWechatLogin = () => {
    toast.info("微信登录功能暂未实现");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-8 h-8"
                >
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              登录智学云
            </h1>

            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone">手机号登录</TabsTrigger>
                <TabsTrigger value="wechat">微信登录</TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      type="text"
                      placeholder="请输入验证码"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={sendCode}
                      disabled={countdown > 0}
                      className="whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}秒后重发` : "获取验证码"}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 my-4">
                  <Checkbox id="agree" />
                  <label
                    htmlFor="agree"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    我已阅读并同意
                    <Link href="/terms" className="text-blue-500 ml-1">
                      用户协议
                    </Link>
                    和
                    <Link href="/privacy" className="text-blue-500 ml-1">
                      隐私政策
                    </Link>
                  </label>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={handleLogin}
                  disabled={isLogging}
                >
                  {isLogging ? "登录中..." : "登录"}
                </Button>
              </TabsContent>

              <TabsContent value="wechat" className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg mb-4">
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
                      className="h-12 w-12 text-gray-400"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M9 12h6" />
                      <path d="M12 9v6" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    请使用微信扫描二维码登录
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleWechatLogin}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.407 5.078c.794-.184 1.603-.276 2.393-.268 1.643.028 3.233.573 4.56 1.562 1.206.94 1.88 2.043 2.144 3.452.328 1.714-.19 3.177-1.384 4.385-.757.766-1.713 1.24-2.758 1.518-.698.186-1.415.206-2.156.201.102.12.022.25.05.367.191.794.384 1.589.578 2.384.064.261.053.52-.099.756a.861.861 0 0 1-.736.422.957.957 0 0 1-.616-.311c-.626-.593-1.234-1.204-1.89-1.766a.94.94 0 0 0-.192-.143c-.333-.03-.664-.073-.993-.13-1.532-.268-2.815-.937-3.858-2.03-1.308-1.37-1.816-2.982-1.53-4.819.297-1.857 1.362-3.199 3.001-4.111a8.44 8.44 0 0 1 3.486-1.069Z" />
                    </svg>
                    使用微信登录
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                还没有账号?{" "}
                <Link
                  href="/register"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 