"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  LogInIcon,
  UserPlusIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { motion, AnimatePresence } from "framer-motion";

// 导航项类型定义
interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  children?: {
    title: string;
    href: string;
    description?: string;
    icon?: string;
  }[];
}

const navItems: NavItem[] = [
  {
    title: "技能市场",
    href: "/courses",
    description: "探索丰富的技能课程，开启你的学习之旅",
    children: [
      {
        title: "浏览课程",
        href: "/courses",
        description: "查看所有可用的技能课程",
        icon: "🎓"
      },
      {
        title: "课程众筹",
        href: "/skills/crowdfunding",
        description: "支持优质课程提案，用技能点投资未来",
        icon: "💡"
      },
      {
        title: "技能排行",
        href: "/courses/ranking",
        description: "发现最受欢迎的技能课程",
        icon: "📊"
      },
      {
        title: "新课推荐",
        href: "/courses/new",
        description: "最新上线的精品课程",
        icon: "✨"
      }
    ]
  },
  {
    title: "技能树",
    href: "/skill-tree",
    description: "可视化你的学习进度，规划专属成长路径",
    children: [
      {
        title: "我的技能树",
        href: "/skill-tree/my",
        description: "查看个人技能成长图谱",
        icon: "🌳"
      },
      {
        title: "学习路径",
        href: "/skill-tree/paths",
        description: "推荐的职业技能提升路径",
        icon: "🛣️"
      },
      {
        title: "技能认证",
        href: "/skill-tree/certifications",
        description: "获取专业技能等级认证",
        icon: "📜"
      },
      {
        title: "成就中心",
        href: "/skill-tree/achievements",
        description: "解锁的技能徽章和成就",
        icon: "🏆"
      }
    ]
  },
  {
    title: "教学中心",
    href: "/teach",
    children: [
      {
        title: "我的课程",
        href: "/teach/courses",
        description: "管理您创建的课程",
        icon: "📚",
      },
      {
        title: "创建课程",
        href: "/teach/create",
        description: "分享您的技能知识",
        icon: "✨",
      },
      {
        title: "教学数据",
        href: "/teach/analytics",
        description: "查看课程数据分析",
        icon: "📈",
      },
      {
        title: "学员管理",
        href: "/teach/students",
        description: "管理课程学员",
        icon: "👥",
      },
    ],
  },
  {
    title: "社区",
    href: "/community",
    icon: "🤝",
  },
];

const skillsSubmenu = [
  {
    title: "技能课程",
    href: "/skills",
    description: "浏览所有技能课程",
  },
  {
    title: "课程众筹",
    href: "/skills/crowdfunding",
    description: "支持优质课程提案",
  },
  {
    title: "技能认证",
    href: "/skill-tree/certifications",
    description: "获取技能认证证书",
  },
  {
    title: "学习路径",
    href: "/skill-tree/paths",
    description: "系统化的学习计划",
  },
];

export function FixedHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  // 在客户端挂载后设置 mounted 状态
  React.useEffect(() => {
    setMounted(true);
  }, []);

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
        duration: 0.6,  // 稍微加快动画速度
        ease: "easeInOut",
        repeat: unreadCount > 0 ? 1 : 0,
        repeatDelay: 5  // 增加重复延迟以减少干扰
      }
    },
    hover: { 
      scale: 1.1, 
      transition: { 
        type: "spring", 
        stiffness: 500,
        damping: 15 
      } 
    },
    tap: { scale: 0.95 }
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

  // 主题切换按钮动画
  const themeButtonAnimation = {
    initial: { scale: 1 },
    animate: { scale: [1, 0.9, 1.1, 1], rotate: [0, -30, 30, 0] },
    transition: { duration: 0.4 }
  };

  // 导航菜单动画优化
  const menuItemAnimation = {
    initial: { opacity: 0.9, y: -5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    whileHover: { 
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/logo.svg" alt="智学云" width={32} height={32} />
          <span className="hidden font-bold sm:inline-block">智学云</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {item.children ? (
                  <NavigationMenuTrigger
                    className={cn(
                      "h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground",
                      isActive(item.href) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.title}
                    </span>
                  </NavigationMenuTrigger>
                ) : (
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground",
                      isActive(item.href) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      <span className="flex items-center">
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.title}
                      </span>
                    </Link>
                  </NavigationMenuLink>
                )}

                {item.children && (
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive(child.href) && "bg-accent text-accent-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{child.icon}</span>
                                <span className="text-sm font-medium leading-none">{child.title}</span>
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
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-2">
          {/* 通知图标 */}
          <div className="relative">
            <div
              onClick={() => router.push("/notifications")}
              className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
              aria-label={`通知 ${unreadCount > 0 ? `，有 ${unreadCount} 条未读` : ''}`}
              role="button"
              tabIndex={0}
            >
              <motion.div
                initial="initial"
                animate={unreadCount > 0 ? "ring" : "initial"}
                whileHover="hover"
                whileTap="tap"
                variants={bellAnimation}
                className="relative"
              >
                <BellIcon className="h-5 w-5" />
              </motion.div>
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={badgeAnimation}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 主题切换 */}
          <div
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors relative"
            aria-label="切换主题"
            role="button"
            tabIndex={0}
          >
            {mounted && (
              <div className="relative w-5 h-5">
                <SunIcon className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </div>
            )}
          </div>

          {/* 语言切换 */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="切换语言"
            className="hidden md:flex"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <GlobeIcon className="h-full w-full" />
            </div>
          </Button>

          {/* 用户菜单 */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="relative h-8 w-8 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="用户菜单"
              >
                <Image
                  src={user?.avatar || "/avatars/default.svg"}
                  alt={user?.name || "用户头像"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover transition-transform hover:scale-110"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 transition-colors hover:bg-accent"
                >
                  <UserIcon className="h-4 w-4" />
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => router.push("/settings")}
                  className="flex items-center gap-2 transition-colors hover:bg-accent"
                >
                  <SettingsIcon className="h-4 w-4" />
                  设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-2 transition-colors hover:bg-accent text-red-500 hover:text-red-600"
                >
                  <LogOutIcon className="h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="inline-flex"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:scale-105 transition-transform duration-200 inline-flex items-center gap-2"
                >
                  <LogInIcon className="h-4 w-4" />
                  登录
                </Button>
              </Link>
              
              <Link 
                href="/register" 
                className="inline-flex"
              >
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  注册
                </Button>
              </Link>
            </div>
          )}

          {/* 移动端菜单按钮 */}
          <div
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            aria-label="打开菜单"
            aria-expanded={mobileMenuOpen}
            role="button"
            tabIndex={0}
          >
            <MenuIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent 
          side="left" 
          className="w-[300px] sm:w-[400px]"
          aria-label="导航菜单"
        >
          <SheetHeader>
            <SheetTitle className="text-lg font-bold">导航菜单</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-4">
            {navItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <Collapsible
                    title={item.title}
                    isActive={isActive(item.href)}
                  >
                    <div className="pl-4 flex flex-col gap-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          className={cn(
                            "flex items-center py-2 px-3 rounded-md transition-colors",
                            isActive(child.href)
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </Collapsible>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center h-9 px-4 rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
}

function Collapsible({ title, children, isActive = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button
        className={cn(
          "flex items-center justify-between w-full h-9 px-4 rounded-md transition-colors",
          isActive || isOpen
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FixedHeader; 