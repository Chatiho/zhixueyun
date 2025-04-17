"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/loading";

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 等待认证状态加载完成
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // 显示加载状态或渲染子组件
  if (isLoading) {
    return <Loading />;
  }

  // 如果已认证，渲染子组件
  return isAuthenticated ? <>{children}</> : null;
} 