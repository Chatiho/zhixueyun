import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "客服电话",
      content: "400-123-4567",
      description: "周一至周日 9:00-21:00"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "电子邮箱",
      content: "support@zhixueyun.com",
      description: "24小时内回复"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "公司地址",
      content: "北京市海淀区中关村科技园",
      description: "邮编：100080"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "工作时间",
      content: "周一至周五 9:00-18:00",
      description: "节假日以公告为准"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">联系我们</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 bg-white dark:bg-gray-800">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                      <p className="text-gray-900 dark:text-gray-100 mb-1">{info.content}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{info.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">在线留言</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">姓名</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">邮箱</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">留言内容</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={4}
                    placeholder="请输入您的留言内容"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  提交留言
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 