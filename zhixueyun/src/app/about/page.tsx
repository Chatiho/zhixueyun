import { FixedHeader } from "@/components/fixed-header";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FixedHeader />
      <main className="flex-1 py-12 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">关于我们</h1>
          
          <div className="space-y-8 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">平台愿景</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                智学云致力于打造一个开放、共享、创新的在线学习平台，让每个人都能便捷地获取优质的教育资源，
                实现终身学习和技能提升。我们相信，教育应该是平等、高效且充满乐趣的。
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">我们的使命</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                通过技术创新和优质内容，为学习者提供个性化的学习体验，帮助他们实现职业发展和个人成长。
                我们致力于：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>提供高质量的在线课程和学习资源</li>
                <li>打造互动性强的学习社区</li>
                <li>推动教育资源的开放共享</li>
                <li>促进教育创新和技术发展</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">核心价值观</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">开放共享</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    倡导知识的自由传播和共享，让优质教育资源惠及更多人。
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">创新进取</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    持续探索教育创新，运用先进技术提升学习体验。
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">用户至上</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    以用户需求为中心，提供优质的服务和支持。
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">品质保证</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    严格把控课程质量，确保学习效果。
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 