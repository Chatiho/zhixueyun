"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";

const registerSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
  code: z.string().length(6, "验证码必须是6位数字"),
  password: z.string().min(8, "密码至少需要8个字符"),
  confirmPassword: z.string(),
  agreement: z.boolean().refine((val) => val === true, {
    message: "您必须同意用户协议和隐私政策",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码输入不一致",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    code: "",
    password: "",
    confirmPassword: "",
    agreement: false,
  });
  
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // 清除该字段的错误提示
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const sendCode = () => {
    try {
      z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号").parse(formData.phone);
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
        setErrors({
          ...errors,
          phone: error.errors[0].message,
        });
      }
    }
  };

  const handleRegister = () => {
    try {
      registerSchema.parse(formData);
      
      // 模拟注册成功
      toast.success("注册成功");
      router.push("/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
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
              注册智学云
            </h1>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">验证码</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.code}
                    onChange={(e) => updateFormData("code", e.target.value)}
                    className={errors.code ? "border-red-500" : ""}
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
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请设置密码"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <Checkbox 
                  id="agreement" 
                  checked={formData.agreement}
                  onCheckedChange={(checked) => updateFormData("agreement", checked === true)}
                />
                <label
                  htmlFor="agreement"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    errors.agreement ? "text-red-500" : ""
                  }`}
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
              {errors.agreement && (
                <p className="text-red-500 text-sm mt-1">{errors.agreement}</p>
              )}

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 mt-4"
                onClick={handleRegister}
              >
                注册
              </Button>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  已有账号?{" "}
                  <Link
                    href="/login"
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    立即登录
                  </Link>
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