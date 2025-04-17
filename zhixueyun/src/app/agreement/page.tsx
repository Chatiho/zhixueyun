import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";

export default function AgreementPage() {
  const sections = [
    {
      title: "1. 协议的接受与修改",
      content: [
        "1.1 本协议是您与智学云平台之间关于使用智学云平台服务所订立的协议。",
        "1.2 您在使用智学云平台服务之前，应当仔细阅读本协议，如您不同意本协议的任何内容，请勿注册或使用本平台的服务。",
        "1.3 智学云平台保留在必要时修改本协议条款的权利。您可以在相关服务页面查阅最新版本的协议条款。"
      ]
    },
    {
      title: "2. 账号注册与安全",
      content: [
        "2.1 您承诺在注册时提供真实、准确、完整的个人资料。",
        "2.2 您有责任维护账号的安全性，并对使用该账号的所有活动负责。",
        "2.3 如发现任何未经授权使用您账号的情况，您应立即通知智学云平台。"
      ]
    },
    {
      title: "3. 用户行为规范",
      content: [
        "3.1 您同意遵守中华人民共和国相关法律法规的规定。",
        "3.2 您不得利用智学云平台服务从事违法违规活动。",
        "3.3 您不得干扰智学云平台的正常运营，不得侵犯其他用户的合法权益。"
      ]
    },
    {
      title: "4. 知识产权保护",
      content: [
        "4.1 智学云平台的所有内容，包括但不限于课程、文字、图片、音频、视频等均受著作权法保护。",
        "4.2 未经智学云平台或相关权利人书面许可，您不得复制、修改、传播或以其他方式使用上述内容。",
        "4.3 您在平台上发布的原创内容，其著作权归您所有。"
      ]
    },
    {
      title: "5. 服务的变更、中断与终止",
      content: [
        "5.1 智学云平台保留随时变更、中断或终止服务的权利。",
        "5.2 如您违反本协议的规定，智学云平台有权暂停或终止向您提供服务。",
        "5.3 服务终止后，智学云平台没有义务为您保留或向您转发任何未曾阅读或发送的信息。"
      ]
    },
    {
      title: "6. 免责声明",
      content: [
        "6.1 智学云平台不对因网络连接故障、系统故障等不可抗力因素导致的服务中断或数据丢失承担责任。",
        "6.2 您理解并同意使用智学云平台服务的风险由您自行承担。",
        "6.3 智学云平台不对用户间因线上交流产生的纠纷承担责任。"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8">用户协议</h1>
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              <p>欢迎使用智学云平台！为了保护您的权益，请您在使用我们的服务前仔细阅读本用户协议。</p>
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