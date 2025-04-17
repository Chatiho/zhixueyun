"use client";

import { useState } from "react";
import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "@/components/protected-route";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

// 错误回退组件
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">页面加载出错</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
        <Button onClick={resetErrorBoundary}>重试</Button>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 重置应用状态
        window.location.reload();
      }}
    >
      <ProtectedRoute>
        <WalletPageContent />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

function WalletPageContent() {
  const router = useRouter();
  // 状态管理
  const [activeTab, setActiveTab] = useState("transactions");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isGetPointsOpen, setIsGetPointsOpen] = useState(false);
  const [showMoreTransactions, setShowMoreTransactions] = useState(false);
  
  // Sample data for the wallet page
  const walletData = {
    skillPoints: 128,
    pendingPoints: 12,
    transactions: [
      {
        id: "tx-001",
        type: "earned",
        description: "课程《React高级组件设计》教学",
        amount: 20,
        date: "2025-04-10",
        status: "completed",
      },
      {
        id: "tx-002",
        type: "spent",
        description: "参与《Flutter移动应用开发》学习",
        amount: 15,
        date: "2025-04-08",
        status: "completed",
      },
      {
        id: "tx-003",
        type: "earned",
        description: "回答技术问题",
        amount: 3,
        date: "2025-04-05",
        status: "completed",
      },
      {
        id: "tx-004",
        type: "pending",
        description: "课程《UI设计原则》教学",
        amount: 12,
        date: "2025-04-12",
        status: "pending",
      },
      // 额外的交易记录，初始隐藏
      {
        id: "tx-005",
        type: "earned",
        description: "发布技术博客文章",
        amount: 8,
        date: "2025-04-01",
        status: "completed",
      },
      {
        id: "tx-006",
        type: "spent",
        description: "兑换《Python数据分析》课程",
        amount: 25,
        date: "2025-03-25",
        status: "completed",
      },
    ],
    bonuses: [
      {
        id: "bonus-001",
        title: "连续学习7天",
        description: "连续7天在平台学习可获得额外奖励",
        amount: 10,
        progress: 5,
        total: 7,
        expires: "2025-04-16",
      },
      {
        id: "bonus-002",
        title: "技能分享达人",
        description: "分享3门技能课程获得额外奖励",
        amount: 30,
        progress: 1,
        total: 3,
        expires: "2025-05-01",
      },
    ],
    rewards: [
      {
        id: "reward-001",
        title: "精品课程折扣券",
        description: "使用20技能点兑换任意精品课程50%折扣",
        cost: 20,
        category: "discount",
      },
      {
        id: "reward-002",
        title: "1对1导师指导",
        description: "使用50技能点兑换30分钟1对1导师指导",
        cost: 50,
        category: "mentorship",
      },
      {
        id: "reward-003",
        title: "定制学习路径",
        description: "使用35技能点获取专业导师定制的学习路径",
        cost: 35,
        category: "personalized",
      },
    ],
  };

  // 函数：查看钱包详情
  const handleViewDetails = () => {
    setIsDetailsOpen(true);
  };

  // 函数：验证交易记录
  const handleVerifyTransactions = () => {
    toast.success("正在验证交易记录，请稍候...");
    setTimeout(() => {
      toast.success("交易记录验证成功，所有记录已在区块链上确认");
    }, 2000);
  };

  // 函数：获取技能点
  const handleGetSkillPoints = () => {
    setIsGetPointsOpen(true);
  };

  // 函数：转赠技能点
  const handleTransferPoints = () => {
    setIsTransferOpen(true);
  };

  // 函数：执行转赠
  const handleTransferSubmit = () => {
    if (!recipientId.trim()) {
      toast.error("请输入接收者ID");
      return;
    }
    
    if (!transferAmount.trim() || isNaN(Number(transferAmount)) || Number(transferAmount) <= 0) {
      toast.error("请输入有效的技能点数量");
      return;
    }
    
    if (Number(transferAmount) > walletData.skillPoints) {
      toast.error("技能点余额不足");
      return;
    }
    
    toast.success(`成功转赠 ${transferAmount} 技能点给用户 ${recipientId}`);
    setIsTransferOpen(false);
    setRecipientId("");
    setTransferAmount("");
  };

  // 函数：兑换奖励
  const handleRedeemPoints = () => {
    setIsRedeemOpen(true);
  };

  // 函数：查看技能点明细
  const handleViewTransactions = () => {
    setIsHistoryOpen(true);
  };

  // 函数：查看更多交易记录
  const handleViewMoreTransactions = () => {
    setShowMoreTransactions(true);
  };

  // 函数：继续完成活动
  const handleContinueActivity = (activityId: string) => {
    // 根据活动类型导航到不同页面
    if (activityId === "bonus-001") {
      router.push("/skills");
      toast.info("继续学习以完成连续学习挑战");
    } else if (activityId === "bonus-002") {
      router.push("/skills/create");
      toast.info("创建新课程分享您的技能");
    }
  };

  // 函数：兑换奖励
  const handleRedeemReward = (rewardId: string, cost: number) => {
    if (walletData.skillPoints < cost) {
      toast.error("技能点不足，无法兑换");
      return;
    }
    
    toast.success("奖励兑换成功！");
    
    // 根据奖励类型执行不同操作
    if (rewardId === "reward-001") {
      toast.info("折扣券已添加到您的账户，下次购买课程时自动使用");
    } else if (rewardId === "reward-002") {
      toast.info("导师指导预约界面将在5秒后打开");
      setTimeout(() => router.push("/mentorship"), 5000);
    } else if (rewardId === "reward-003") {
      toast.info("学习路径将在24小时内由专业导师定制并发送给您");
    }
  };

  // 获取适合显示的交易记录
  const displayedTransactions = showMoreTransactions 
    ? walletData.transactions 
    : walletData.transactions.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">技能点钱包</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            管理您的技能点，跟踪收支明细，兑换奖励
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Skill Points Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">技能点余额</CardTitle>
                  <CardDescription className="text-white/80">
                    您的当前可用技能点
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold">{walletData.skillPoints}</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm">
                    <span className="opacity-80">待结算: </span>
                    <span className="font-medium">{walletData.pendingPoints}</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="text-gray-800"
                    onClick={handleViewDetails}
                  >
                    查看详情
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Blockchain Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">区块链技能点交易记录</CardTitle>
                  <CardDescription>
                    所有技能点交易都安全记录在区块链上
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-mono text-gray-500 dark:text-gray-400 overflow-hidden overflow-ellipsis mb-2">
                    区块地址: 0x7a3bc7e5f7ab1d33e2e8cab5dd61c0b1f3e34a8d
                  </div>
                  <div className="flex gap-3">
                    <Badge variant="outline">安全透明</Badge>
                    <Badge variant="outline">不可篡改</Badge>
                    <Badge variant="outline">永久记录</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleVerifyTransactions}
                  >
                    验证交易记录
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">快速操作</CardTitle>
                  <CardDescription>
                    常用功能快速访问
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Dialog open={isGetPointsOpen} onOpenChange={setIsGetPointsOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full"
                      >
                        获取技能点
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>获取技能点</DialogTitle>
                        <DialogDescription>
                          选择获取技能点的方式
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Button asChild className="w-full justify-start">
                          <Link href="/teach/create">
                            创建课程
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/tasks">
                            完成任务
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/store">
                            购买技能点
                          </Link>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        转赠技能点
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>转赠技能点</DialogTitle>
                        <DialogDescription>
                          将技能点转赠给其他用户
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>接收用户</Label>
                          <Input 
                            placeholder="请输入用户ID或手机号"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>转赠数量</Label>
                          <Input 
                            type="number"
                            placeholder="请输入转赠数量"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleTransferSubmit}>确认转赠</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isRedeemOpen} onOpenChange={setIsRedeemOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        兑换奖励
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>兑换奖励</DialogTitle>
                        <DialogDescription>
                          使用技能点兑换各种奖励
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Button asChild className="w-full justify-start">
                          <Link href="/store/courses">
                            兑换课程
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/store/gifts">
                            兑换礼品
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/store/certificates">
                            兑换证书
                          </Link>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                        技能点明细
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>技能点明细</SheetTitle>
                        <SheetDescription>
                          查看技能点的收支记录
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <Tabs defaultValue="all" className="w-full">
                          <TabsList className="w-full">
                            <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
                            <TabsTrigger value="income" className="flex-1">收入</TabsTrigger>
                            <TabsTrigger value="expense" className="flex-1">支出</TabsTrigger>
                          </TabsList>
                          <TabsContent value="all">
                            <div className="space-y-4">
                              {displayedTransactions.map((transaction) => (
                                <motion.div
                                  key={transaction.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center justify-between py-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                  <div>
                                    <div className="font-medium">{transaction.description}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {transaction.date} · {transaction.status === 'pending' ? '处理中' : '已完成'}
                                    </div>
                                  </div>
                                  <div className={`text-lg font-bold ${
                                    transaction.type === 'earned' || transaction.type === 'pending'
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    {transaction.type === 'earned' || transaction.type === 'pending'
                                      ? `+${transaction.amount}`
                                      : `-${transaction.amount}`
                                    }
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="income">
                            <div className="space-y-4">
                              {walletData.bonuses.map((bonus) => (
                                <motion.div
                                  key={bonus.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center justify-between py-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                  <div>
                                    <div className="font-medium">{bonus.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {bonus.description}
                                    </div>
                                  </div>
                                  <div className="text-green-600">+{bonus.amount} 技能点</div>
                                </motion.div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="expense">
                            <div className="space-y-4">
                              {walletData.transactions.map((transaction) => (
                                <motion.div
                                  key={transaction.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center justify-between py-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                  <div>
                                    <div className="font-medium">{transaction.description}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {transaction.date} · {transaction.status === 'pending' ? '处理中' : '已完成'}
                                    </div>
                                  </div>
                                  <div className={`text-red-600`}>-{transaction.amount} 技能点</div>
                                </motion.div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 w-full md:w-auto">
              <TabsTrigger value="transactions">交易记录</TabsTrigger>
              <TabsTrigger value="bonuses">活动奖励</TabsTrigger>
              <TabsTrigger value="rewards">技能点兑换</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>技能点交易记录</CardTitle>
                  <CardDescription>
                    查看您的技能点收支明细
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayedTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start gap-3 mb-3 sm:mb-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'earned'
                              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                              : transaction.type === 'spent'
                              ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {transaction.type === 'earned' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                            {transaction.type === 'spent' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                              </svg>
                            )}
                            {transaction.type === 'pending' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.date} · {transaction.status === 'pending' ? '处理中' : '已完成'}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${
                          transaction.type === 'earned' || transaction.type === 'pending'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'earned' || transaction.type === 'pending'
                            ? `+${transaction.amount}`
                            : `-${transaction.amount}`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  {!showMoreTransactions ? (
                    <Button 
                      variant="outline"
                      onClick={handleViewMoreTransactions}
                    >
                      查看更多交易记录
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => setShowMoreTransactions(false)}
                    >
                      收起交易记录
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Bonuses Tab */}
            <TabsContent value="bonuses">
              <Card>
                <CardHeader>
                  <CardTitle>活动奖励</CardTitle>
                  <CardDescription>
                    完成特定活动获得额外技能点奖励
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {walletData.bonuses.map((bonus) => (
                      <div
                        key={bonus.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-5"
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-bold">{bonus.title}</h3>
                          <Badge className="bg-gradient-to-r from-green-500 to-blue-500">{bonus.amount} 技能点</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {bonus.description}
                        </p>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>进度: {bonus.progress}/{bonus.total}</span>
                            <span>截止日期: {bonus.expires}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                              style={{ width: `${(bonus.progress / bonus.total) * 100}%` }}
                            />
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          onClick={() => handleContinueActivity(bonus.id)}
                        >
                          继续完成
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards">
              <Card>
                <CardHeader>
                  <CardTitle>技能点兑换</CardTitle>
                  <CardDescription>
                    使用积累的技能点兑换各种奖励
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {walletData.rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col"
                      >
                        <div className="mb-2">
                          <Badge
                            className={`${
                              reward.category === 'discount'
                                ? 'bg-blue-500'
                                : reward.category === 'mentorship'
                                ? 'bg-purple-500'
                                : 'bg-yellow-500'
                            }`}
                          >
                            {reward.category === 'discount' && '优惠'}
                            {reward.category === 'mentorship' && '指导'}
                            {reward.category === 'personalized' && '定制'}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{reward.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                          {reward.description}
                        </p>
                        <div className="mt-auto">
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {reward.cost} 技能点
                            </div>
                            <div className={`text-sm ${walletData.skillPoints >= reward.cost ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {walletData.skillPoints >= reward.cost ? '可兑换' : '技能点不足'}
                            </div>
                          </div>
                          <Button
                            disabled={walletData.skillPoints < reward.cost}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
                            onClick={() => handleRedeemReward(reward.id, reward.cost)}
                          >
                            立即兑换
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />

      {/* 技能点详情弹窗 */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>技能点详情</DialogTitle>
            <DialogDescription>
              您的技能点账户信息
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">可用技能点</span>
              <span className="font-bold text-green-600">{walletData.skillPoints}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">待结算技能点</span>
              <span className="text-yellow-600">{walletData.pendingPoints}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">累计获得技能点</span>
              <span>246</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">累计消费技能点</span>
              <span>118</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">账户等级</span>
              <span className="text-blue-600">专家级 (Lv.4)</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 获取技能点弹窗 */}
      <Dialog open={isGetPointsOpen} onOpenChange={setIsGetPointsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>获取技能点</DialogTitle>
            <DialogDescription>
              选择获取技能点的方式
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button 
              className="flex justify-between items-center w-full p-4 h-auto"
              onClick={() => {
                router.push("/skills/create");
                setIsGetPointsOpen(false);
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg">分享技能课程</span>
                <span className="text-sm opacity-90">创建并分享您的专业知识</span>
              </div>
              <Badge>最高可得 150 点</Badge>
            </Button>
            <Button 
              className="flex justify-between items-center w-full p-4 h-auto"
              variant="outline"
              onClick={() => {
                router.push("/community");
                setIsGetPointsOpen(false);
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg">社区互动</span>
                <span className="text-sm opacity-90">回答问题、发布文章、参与讨论</span>
              </div>
              <Badge variant="outline">每次 1-10 点</Badge>
            </Button>
            <Button 
              className="flex justify-between items-center w-full p-4 h-auto"
              variant="outline"
              onClick={() => {
                router.push("/live");
                setIsGetPointsOpen(false);
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg">举办直播</span>
                <span className="text-sm opacity-90">分享您的知识、答疑解惑</span>
              </div>
              <Badge variant="outline">每小时 15-30 点</Badge>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGetPointsOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 转赠技能点侧边栏 */}
      <Sheet open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>转赠技能点</SheetTitle>
            <SheetDescription>
              将您的技能点转赠给其他用户
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div>
              <Label htmlFor="recipient">接收者ID</Label>
              <Input 
                id="recipient" 
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="输入用户ID或邮箱"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="amount">技能点数量</Label>
              <Input 
                id="amount" 
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                type="number"
                min="1"
                max={walletData.skillPoints.toString()}
                placeholder="输入转赠数量"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                可用技能点: {walletData.skillPoints}
              </p>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">取消</Button>
            </SheetClose>
            <Button onClick={handleTransferSubmit}>确认转赠</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
