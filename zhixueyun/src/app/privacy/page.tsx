import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 信息收集",
      content: [
        "1.1 基本信息：我们收集您的用户名、电子邮件地址、手机号码等基本信息。",
        "1.2 学习数据：包括您的学习进度、考试成绩、技能认证等相关信息。",
        "1.3 使用数据：我们会收集您使用平台的频率、时长、互动记录等数据。"
      ]
    },
    {
      title: "2. 信息使用",
      content: [
        "2.1 提供服务：我们使用收集的信息来提供、维护和改进平台服务。",
        "2.2 个性化体验：根据您的学习习惯和偏好提供个性化的学习建议和内容推荐。",
        "2.3 安全保护：用于验证身份、预防欺诈等安全保护措施。"
      ]
    },
    {
      title: "3. 信息共享",
      content: [
        "3.1 经您同意的共享：只有在获得您的明确同意后，我们才会与第三方共享您的个人信息。",
        "3.2 法律要求：根据法律法规、法律程序或政府主管部门的强制性要求提供您的个人信息。",
        "3.3 统计分析：我们可能会共享不含身份识别信息的统计数据，用于分析和研究。"
      ]
    },
    {
      title: "4. 信息安全",
      content: [
        "4.1 数据加密：采用业界标准的加密技术保护您的个人信息。",
        "4.2 访问控制：严格限制内部人员对用户数据的访问权限。",
        "4.3 安全存储：数据存储于安全的服务器，并定期进行安全评估和升级。"
      ]
    },
    {
      title: "5. 用户权利",
      content: [
        "5.1 访问权：您有权访问、更正或删除您的个人信息。",
        "5.2 选择权：您可以选择是否接受某些可选服务或功能。",
        "5.3 注销权：您可以申请注销账号，我们将依法处理您的个人信息。"
      ]
    },
    {
      title: "6. Cookie使用",
      content: [
        "6.1 我们使用Cookie来提升您的使用体验，包括记住您的登录状态和偏好设置。",
        "6.2 您可以通过浏览器设置管理Cookie。",
        "6.3 禁用Cookie可能会影响某些功能的正常使用。"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8">隐私政策</h1>
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              <p>智学云平台重视用户的隐私保护，本政策说明了我们如何收集、使用和保护您的个人信息。请在使用我们的服务前仔细阅读本隐私政策。</p>
            </div>
            
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  <div className="space-y-3">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-600 dark:text-gray-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 text-center">
                最后更新时间：2024年3月1日
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 