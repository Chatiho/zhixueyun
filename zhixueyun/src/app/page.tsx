"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    智学云
                  </span>{" "}
                  - 技能共享新生态
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  教授技能获得"技能点"，消耗技能点学习他人课程，构建自我维持的学习生态系统。
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/skills"
                    className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-6 h-auto text-lg transition-all duration-300 hover:shadow-lg"
                  >
                    开始学习
                  </Link>
                  <Link 
                    href="/skill-tree"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-8 py-6 h-auto text-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    了解更多
                  </Link>
                </div>

                <div className="mt-8 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white border-2 border-white dark:border-gray-800"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span>已有超过10,000名用户加入我们的平台</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden relative">
                  {/* 装饰性元素 - 改进背景 */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 opacity-40"></div>
                  <div className="absolute top-6 left-6 w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-lg transform rotate-12 transition-transform duration-700"></div>
                  <div className="absolute bottom-6 right-6 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-lg transform -rotate-6 transition-transform duration-700"></div>
                  
                  {/* 点缀的小元素 */}
                  <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-yellow-100 dark:bg-yellow-700/30 rounded-full animate-ping opacity-70" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-purple-100 dark:bg-purple-700/30 rounded-full animate-ping opacity-70" style={{ animationDuration: '2.5s' }}></div>

                  {/* 3D Skill Tree representation - 改进版 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-72 h-72 transition-all duration-500 hover:scale-105">
                      {/* 中心节点 */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-xl transform transition-all duration-500 hover:scale-110 hover:shadow-green-400/40 border-4 border-white/20 dark:border-black/20">
                          <div className="text-center">
                            <div className="text-xl">核心技能</div>
                            <div className="text-xs mt-1 opacity-80">点击探索</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 光晕效果 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-52 h-52 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
                      </div>
                      
                      {/* 辐射线 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={`line-${i}`}
                            className="absolute bg-gradient-to-br from-green-400 to-blue-500 transform transition-all duration-300"
                            style={{
                              width: i % 2 === 0 ? '40%' : '1.5rem',
                              height: i % 2 === 0 ? '1.5rem' : '40%',
                              transform: `rotate(${i * 90}deg)`,
                              top: i === 0 ? '30%' : i === 2 ? '70%' : '50%',
                              left: i === 3 ? '30%' : i === 1 ? '70%' : '50%',
                              transformOrigin: 'center',
                              borderRadius: '4px',
                              boxShadow: '0 0 10px rgba(74, 222, 128, 0.3)'
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* 技能节点 */}
                      {[
                        { top: "0%", left: "50%", label: "编程", href: "/skills?category=programming", color: "from-blue-400 to-blue-600", icon: "💻" },
                        { top: "35%", left: "100%", label: "设计", href: "/skills?category=design", color: "from-purple-400 to-purple-600", icon: "🎨" },
                        { top: "100%", left: "50%", label: "管理", href: "/skills?category=management", color: "from-amber-400 to-amber-600", icon: "📊" },
                        { top: "35%", left: "0%", label: "语言", href: "/skills?category=language", color: "from-green-400 to-green-600", icon: "🗣️" },
                      ].map((node, i) => (
                        <Link 
                          href={node.href} 
                          key={i} 
                          className={`absolute w-24 h-24 rounded-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-110 hover:shadow-xl z-20`}
                          style={{ top: node.top, left: node.left }}
                        >
                          <div className={`text-xl mb-1 bg-gradient-to-br ${node.color} bg-clip-text text-transparent`}>{node.icon}</div>
                          <span className="text-sm font-medium">{node.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">平台核心功能</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                智学云平台提供多种功能，帮助用户更有效地学习和分享技能
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "技能点交易系统",
                  description:
                    "教授技能获得技能点，消费技能点学习课程，形成自我维持的生态系统",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "个人技能树",
                  description:
                    "可视化展示您掌握的技能和学习进度，帮助您规划学习路径",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "课程众筹",
                  description:
                    "发起您想学习的课程需求，集合社区力量共同实现",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "实时互动",
                  description:
                    "通过实时弹幕和问答系统，与讲师和其他学习者互动交流",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "多媒体课程",
                  description:
                    "支持视频、图文、直播等多种课程形式，满足不同学习需求",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "智能推荐",
                  description:
                    "基于您的技能标签和学习历史，智能推荐适合您的课程",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  ),
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-500 to-blue-500 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">准备好开始您的技能之旅了吗？</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              加入智学云平台，分享您的技能，学习新知识，与志同道合的人一起成长。
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-white text-green-600 hover:bg-gray-100 px-8 py-6 h-auto text-lg transition-all duration-300 hover:shadow-lg"
            >
              立即注册
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
