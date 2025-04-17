import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp,
  BarChart,
  Shield,
  Clock,
  Zap
} from "lucide-react";

export default function PlatformPage() {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "丰富的课程资源",
      description: "提供多领域、多层次的优质课程，满足不同学习者的需求"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "活跃的学习社区",
      description: "与志同道合的学习者交流互动，分享学习经验和心得"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "专业的技能认证",
      description: "完成课程后获得认可的技能证书，提升职业竞争力"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "个性化学习路径",
      description: "根据个人目标和水平，定制专属的学习计划"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "学习数据分析",
      description: "实时跟踪学习进度，科学评估学习效果"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "优质内容保障",
      description: "严格的内容审核机制，确保课程质量"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "灵活的学习时间",
      description: "随时随地学习，自主掌控学习节奏"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "智能学习助手",
      description: "AI辅助学习，提供个性化的学习建议"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1">
        {/* 平台介绍 */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">智学云学习平台</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                智学云是一个专注于技能提升和职业发展的在线学习平台，
                通过创新的学习方式和优质的课程内容，帮助学习者实现个人成长。
              </p>
            </div>
          </div>
        </section>

        {/* 平台特色 */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">平台特色</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 学习流程 */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">学习流程</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
                <div className="space-y-12">
                  {[
                    { step: "选择课程", desc: "根据兴趣和目标选择适合的课程" },
                    { step: "制定计划", desc: "设置学习目标，规划学习时间" },
                    { step: "开始学习", desc: "观看课程视频，完成课后练习" },
                    { step: "互动交流", desc: "参与讨论，与其他学习者交流" },
                    { step: "技能认证", desc: "完成考核，获得技能证书" }
                  ].map((item, index) => (
                    <div key={index} className="relative flex items-center">
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="w-1/2 pr-8 text-right">
                        <h3 className="text-xl font-semibold mb-2">{item.step}</h3>
                      </div>
                      <div className="w-1/2 pl-8">
                        <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 平台数据 */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">平台数据</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "1000+", label: "优质课程" },
                { number: "50000+", label: "注册用户" },
                { number: "200+", label: "认证讲师" },
                { number: "98%", label: "学员好评" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 