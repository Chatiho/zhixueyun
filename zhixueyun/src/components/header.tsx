"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  MenuIcon,
  GlobeIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { useState, HTMLAttributes } from "react";

const navItems = [
  {
    title: "首页",
    href: "/",
  },
  {
    title: "课程",
    href: "/courses",
    children: [
      {
        title: "推荐课程",
        href: "/courses/recommended",
        description: "查看热门推荐的课程",
      },
      {
        title: "最新课程",
        href: "/courses/new",
        description: "浏览最新上线的课程内容",
      },
      {
        title: "我的课程",
        href: "/my-courses",
        description: "管理您已购买和收藏的课程",
      },
      {
        title: "分享课程",
        href: "/share-courses",
        description: "发现用户分享的优质课程内容",
      },
    ],
  },
  {
    title: "直播",
    href: "/live",
  },
  {
    title: "社区",
    href: "/community",
  },
  {
    title: "资源",
    href: "/resources",
  },
];

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  // ... existing code ...
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 通知按钮动画变量
  const bellAnimation = {
    initial: { rotate: 0 },
    ring: { 
      rotate: [0, 15, -15, 10, -10, 5, -5, 0],
      transition: { 
        duration: 0.8, 
        ease: "easeInOut",
        repeat: unreadCount > 0 ? 1 : 0,
        repeatDelay: 4
      }
    },
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 400 } },
    tap: { scale: 0.9 }
  };

  // 通知徽章动画变量
  const badgeAnimation = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 500, delay: 0.1 } 
    },
    pulse: { 
      scale: [1, 1.2, 1],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        repeatDelay: 1,
        ease: "easeInOut" 
      } 
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // 全局链接动画
  const linkAnimation = {
    whileHover: { y: -2, transition: { type: "spring", stiffness: 300 } },
    whileTap: { y: 0, scale: 0.98 }
  };

  // 导航菜单动画
  const menuItemAnimation = {
    initial: { opacity: 0.9, y: -5 },
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.02 }
  };

  // 定期触发铃铛动画
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (unreadCount > 0) {
      interval = setInterval(() => {
        // 强制重新渲染通知图标以触发动画
        const bellIcon = document.querySelector('.bell-icon-container') as HTMLElement;
        if (bellIcon) {
          bellIcon.classList.remove('animate-bell');
          // 触发重排以重置动画
          void bellIcon.getBoundingClientRect();
          bellIcon.classList.add('animate-bell');
        }
      }, 10000); // 每10秒触发一次动画
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [unreadCount]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="智学云 Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl hidden sm:inline-block">
              智学云
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.title}>
                    <motion.div
                      variants={menuItemAnimation}
                      initial="initial"
                      animate="animate"
                      whileHover="whileHover"
                    >
                      <NavigationMenuTrigger
                        className={cn(
                          "text-base",
                          isActive(item.href) &&
                            "font-medium text-primary bg-accent"
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                    </motion.div>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-102"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {child.title}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {child.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.title}>
                    <motion.div
                      variants={menuItemAnimation}
                      initial="initial"
                      animate="animate"
                      whileHover="whileHover"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-base",
                          isActive(item.href) &&
                            "font-medium text-primary bg-accent"
                        )}
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-auto md:flex-1 mx-4 hidden sm:block">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="搜索课程、直播或资源..."
              className="w-full md:w-[250px] lg:w-[300px] h-9 rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {isAuthenticated ? (
            <>
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 rounded-full p-2 transition-colors hover:bg-accent cursor-pointer">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="用户头像"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name || "用户"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex w-full items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>个人中心</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex w-full items-center">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>账号设置</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={logout}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  注册
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span className="sr-only">切换主题</span>
            <div className="relative w-5 h-5">
              <SunIcon className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
          </Button>

          <Button variant="ghost" size="icon">
            <span className="sr-only">切换语言</span>
            <GlobeIcon className="h-5 w-5" />
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="菜单"
                className="md:hidden"
              >
                <span>
                  <MenuIcon className="h-5 w-5" />
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <Image
                    src="/logo.svg"
                    alt="智学云 Logo"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  智学云
                </SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-1">
                  {navItems.map((item) =>
                    item.children ? (
                      <div key={item.title} className="py-1">
                        <Collapsible
                          title={item.title}
                          isActive={isActive(item.href)}
                        >
                          <div className="ml-4 space-y-1">
                            {item.children.map((child) => (
                              <SheetClose key={child.title} asChild>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "block rounded-md px-3 py-2 text-sm hover:bg-accent",
                                    isActive(child.href) &&
                                      "font-medium text-primary bg-accent"
                                  )}
                                >
                                  {child.title}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </Collapsible>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm hover:bg-accent",
                            isActive(item.href) &&
                              "font-medium text-primary bg-accent"
                          )}
                        >
                          {item.title}
                        </Link>
                      </SheetClose>
                    )
                  )}
                </div>
              </div>
              <SheetFooter className="flex-col items-start sm:flex-col sm:items-start sm:space-x-0">
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="切换主题"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <div className="relative w-5 h-5">
                      <SunIcon className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <MoonIcon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                  </Button>
                  <Button variant="outline" size="icon" aria-label="切换语言">
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <GlobeIcon className="h-full w-full" />
                    </div>
                  </Button>
                </div>
                {!isAuthenticated && (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" className="flex items-center justify-center w-full">
                          登录
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="w-full" asChild>
                        <Link href="/register" className="flex items-center justify-center w-full">
                          注册
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  isActive = false,
}) => {
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: isActive ? "var(--accent)" : "transparent" }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent",
          isActive && "font-medium text-primary"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {title}
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUpIcon className="h-4 w-4" />
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NotificationBell = () => {
  const { unreadCount } = useNotifications()
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={unreadCount > 0 ? {
        rotate: [0, 15, -15, 0],
        transition: {
          duration: 0.5,
          repeat: 1,
        }
      } : {}}
    >
      <Button variant="ghost" className="relative p-2">
        <BellIcon className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

// 添加默认导出，保持向后兼容性
export default Header;
