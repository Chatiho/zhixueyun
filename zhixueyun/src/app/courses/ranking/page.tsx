"use client";

import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// 排行榜数据
const rankingData = [
  {
    id: "course-001",
    title: "React高级组件设计与性能优化",
    instructor: "李明",
    instructorTitle: "资深前端架构师",
    instructorCompany: "字节跳动",
    studentCount: 12859,
    rating: 4.9,
    reviewCount: 2468,
    completionRate: 92,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=800&auto=format&fit=crop",
    tags: ["React", "组件设计", "性能优化", "前端开发"],
    description: "深入学习React组件设计模式、状态管理、性能优化技巧，掌握大规模应用开发的核心技能。课程包含50+个实战案例，涵盖组件封装、性能调优、工程化等重要主题。",
    skillPointsCost: 80,
    weeklyGrowth: 456,
    totalHours: 32,
    lessonsCount: 48,
    lastUpdated: "2024-03-15",
    difficulty: "高级",
    achievements: ["React专家认证", "性能优化达人"],
    prerequisites: ["React基础", "JavaScript高级特性", "TypeScript基础"],
  },
  {
    id: "course-002",
    title: "微服务架构设计与实践",
    instructor: "张伟",
    instructorTitle: "技术架构总监",
    instructorCompany: "阿里云",
    studentCount: 10567,
    rating: 4.8,
    reviewCount: 1893,
    completionRate: 88,
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
    tags: ["微服务", "系统架构", "云原生", "DevOps"],
    description: "从零开始构建企业级微服务架构，涵盖服务拆分、容器化部署、服务治理、监控告警等完整技术栈。结合真实项目案例，掌握大规模分布式系统开发经验。",
    skillPointsCost: 100,
    weeklyGrowth: 389,
    totalHours: 45,
    lessonsCount: 56,
    lastUpdated: "2024-03-10",
    difficulty: "高级",
    achievements: ["架构师认证", "微服务专家"],
    prerequisites: ["Java/Go/Node.js任一语言", "分布式系统基础", "Docker基础"],
  },
  {
    id: "course-003",
    title: "AI算法工程师进阶课程",
    instructor: "王智",
    instructorTitle: "AI研究科学家",
    instructorCompany: "腾讯AI Lab",
    studentCount: 8965,
    rating: 4.9,
    reviewCount: 1567,
    completionRate: 85,
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    tags: ["人工智能", "机器学习", "深度学习", "算法优化"],
    description: "深入讲解AI算法原理与工程实践，覆盖机器学习、深度学习、强化学习等核心领域。通过实战项目，掌握模型设计、训练优化、部署等全流程技能。",
    skillPointsCost: 120,
    weeklyGrowth: 345,
    totalHours: 60,
    lessonsCount: 72,
    lastUpdated: "2024-03-18",
    difficulty: "高级",
    achievements: ["AI算法专家", "模型优化达人"],
    prerequisites: ["Python高级特性", "机器学习基础", "数学基础扎实"],
  },
  {
    id: "course-004",
    title: "大数据分析与商业智能",
    instructor: "陈雪",
    instructorTitle: "数据科学主管",
    instructorCompany: "京东科技",
    studentCount: 7856,
    rating: 4.7,
    reviewCount: 1289,
    completionRate: 90,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    tags: ["大数据", "数据分析", "商业智能", "数据可视化"],
    description: "系统学习大数据分析技术栈，包括数据采集、清洗、建模、可视化等环节。结合电商、金融等行业案例，培养数据驱动决策能力。",
    skillPointsCost: 90,
    weeklyGrowth: 278,
    totalHours: 40,
    lessonsCount: 52,
    lastUpdated: "2024-03-12",
    difficulty: "中级到高级",
    achievements: ["数据分析专家", "BI工具达人"],
    prerequisites: ["SQL基础", "统计学基础", "Python基础"],
  },
  {
    id: "course-005",
    title: "高并发系统设计实战",
    instructor: "刘强",
    instructorTitle: "技术专家",
    instructorCompany: "蚂蚁集团",
    studentCount: 6893,
    rating: 4.8,
    reviewCount: 1156,
    completionRate: 87,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    tags: ["高并发", "分布式系统", "性能优化", "系统设计"],
    description: "深入探讨高并发系统设计原理与实践，包括缓存架构、消息队列、分库分表等核心技术。通过实际案例，掌握大规模系统优化方法。",
    skillPointsCost: 100,
    weeklyGrowth: 234,
    totalHours: 36,
    lessonsCount: 45,
    lastUpdated: "2024-03-08",
    difficulty: "高级",
    achievements: ["系统设计专家", "性能优化专家"],
    prerequisites: ["Java/Go编程基础", "计算机网络", "数据库原理"],
  }
];

export default function RankingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">技能课程排行榜</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              精选行业顶尖讲师打造的优质课程，基于学习效果、市场需求、讲师资历等维度综合排名，
              助你找到最适合的进阶学习路径。
            </p>
          </div>

          {/* 排行榜 */}
          <div className="space-y-6">
            {rankingData.map((course, index) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* 排名标记 */}
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500">
                        热门
                      </Badge>
                    </div>
                  </div>

                  {/* 课程信息 */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">{course.instructor}</span>
                      <span className="text-xs text-gray-500">|</span>
                      <span className="text-sm text-gray-600">{course.instructorTitle}</span>
                      <span className="text-xs text-gray-500">|</span>
                      <span className="text-sm text-blue-600">{course.instructorCompany}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {course.description}
                    </p>

                    {/* 课程详情 */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">课程时长</div>
                          <div className="font-medium">{course.totalHours}小时</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">课程难度</div>
                          <div className="font-medium">{course.difficulty}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">课时数量</div>
                          <div className="font-medium">{course.lessonsCount}节</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">最近更新</div>
                          <div className="font-medium">{course.lastUpdated}</div>
                        </div>
                      </div>
                    </div>

                    {/* 统计数据 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">学习人数</div>
                        <div className="font-bold text-lg">{course.studentCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">完课率</div>
                        <div className="font-bold text-lg">{course.completionRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">课程评分</div>
                        <div className="font-bold text-lg flex items-center">
                          {course.rating}
                          <span className="text-xs text-gray-400 ml-1">({course.reviewCount})</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">周增长</div>
                        <div className="font-bold text-lg text-green-500">+{course.weeklyGrowth}</div>
                      </div>
                    </div>

                    {/* 技能要求与认证 */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        <div className="text-sm text-gray-500">技能要求：</div>
                        {course.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="text-sm text-gray-500">可获认证：</div>
                        {course.achievements.map((achievement, index) => (
                          <Badge key={index} variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-green-600 dark:text-green-400 font-bold text-xl">
                            {course.skillPointsCost} 技能点
                          </div>
                          <div className="text-xs text-gray-500">
                            完课返还 {Math.floor(course.skillPointsCost * 0.3)} 技能点
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline">
                          加入学习计划
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          onClick={() => router.push(`/courses/${course.id}`)}
                        >
                          立即学习
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 