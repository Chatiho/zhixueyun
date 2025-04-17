import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="智学云 Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                智学云
              </h1>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              智学云是一个在线技能共享平台，通过技能点交易系统，用户可以教授技能获得技能点，消耗技能点学习他人课程，形成闭环学习社区。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">关于我们</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  平台介绍
                </Link>
              </li>
              <li>
                <Link
                  href="/agreement"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  用户协议
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  隐私政策
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">技能分类</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/skills/programming"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  编程开发
                </Link>
              </li>
              <li>
                <Link
                  href="/skills/design"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  设计创意
                </Link>
              </li>
              <li>
                <Link
                  href="/skills/business"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  商业管理
                </Link>
              </li>
              <li>
                <Link
                  href="/skills/language"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  语言学习
                </Link>
              </li>
              <li>
                <Link
                  href="/skills/lifestyle"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  生活技能
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">关注我们</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-500 dark:hover:text-green-400"
                aria-label="微信"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.407 5.078c.794-.184 1.603-.276 2.393-.268 1.643.028 3.233.573 4.56 1.562 1.206.94 1.88 2.043 2.144 3.452.328 1.714-.19 3.177-1.384 4.385-.757.766-1.713 1.24-2.758 1.518-.698.186-1.415.206-2.156.201.102.12.022.25.05.367.191.794.384 1.589.578 2.384.064.261.053.52-.099.756a.861.861 0 0 1-.736.422.957.957 0 0 1-.616-.311c-.626-.593-1.234-1.204-1.89-1.766a.94.94 0 0 0-.192-.143c-.333-.03-.664-.073-.993-.13-1.532-.268-2.815-.937-3.858-2.03-1.308-1.37-1.816-2.982-1.53-4.819.297-1.857 1.362-3.199 3.001-4.111a8.44 8.44 0 0 1 3.486-1.069ZM18.59 19.9c-.920.086-1.806-.017-2.663-.334-.273-.103-.53-.15-.812-.103-.115.021-.23.099-.31.176-.465.428-.925.863-1.387 1.295-.07.066-.137.137-.216.214-.01-.072-.02-.131-.028-.19-.106-.595-.25-1.183-.31-1.784-.027-.276.1-.649.271-.838 1.04-1.153 1.254-2.578.657-3.994-.663-1.57-2.054-2.21-3.619-2.32.115.267.22.523.33.78.373.915.54 1.851.397 2.84-.169 1.114-.662 2.067-1.436 2.886-1.276 1.345-2.886 1.823-4.665 1.614-.2-.025-.287.052-.375.195.708.62 1.533 1.029 2.444 1.261 1.215.31 2.42.218 3.624-.103.348-.092.609-.011.889.227.556.469 1.134.912 1.702 1.369.145.118.287.238.43.357.056.04.035.02.106.04.122-.422.245-.844.368-1.267.048-.167.11-.292.31-.371.828-.326 1.63-.704 2.313-1.261 1.137-.928 1.824-2.12 1.98-3.589ZM6.138 8.797c-.144 0-.291.01-.434-.002a1.2 1.2 0 0 1-1.17-1.184c-.015-.674.516-1.227 1.209-1.245a1.21 1.21 0 0 1 1.26 1.2c.011.686-.516 1.223-1.211 1.235a1.13 1.13 0 0 0 .346-.004ZM11.12 7.56a1.214 1.214 0 0 1-1.205-1.191c0-.672.536-1.216 1.214-1.227.66-.012 1.229.555 1.23 1.21 0 .688-.54 1.214-1.239 1.207Z" />
                </svg>
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-500 dark:hover:text-green-400"
                aria-label="微博"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.996 21.324c3.702.142 7.168-1.308 8.135-4.325.976-3.018-1.33-6.367-5.306-7.817L7.996 21.324Zm7.174-8.104c.413-1.279-.358-2.716-1.729-3.208-1.371-.493-2.827.14-3.241 1.419-.413 1.278.358 2.716 1.729 3.209 1.349.491 2.827-.142 3.241-1.42Zm-1.161 3.256c.142-.435-.115-.917-.574-1.077-.459-.159-.935.08-1.076.516-.142.435.115.917.574 1.077.459.137.935-.073 1.076-.516ZM9.52 15.307c-1.371-.494-3.176.317-4.078 1.776-.901 1.482-.508 3.235.863 3.935 1.435.721 3.435-.167 4.414-1.924.895-1.798.168-3.293-1.199-3.787Z" />
                  <path d="M13.595 7.304c.48.173.926.272 1.371.293 1.828 0 3.337-1.5 3.337-3.333v-.459c0-.23-.005-.428.01-.636a3.35 3.35 0 0 0-3.347-3.166c-1.86 0-3.348 1.49-3.348 3.333 0 .23.005.459.01.689a3.36 3.36 0 0 0 1.967 3.28Z" />
                  <path d="M19.99 7.322c-.144-.042-.288-.085-.431-.128a.834.834 0 0 0-1.02.616.84.84 0 0 0 .618 1.013c.158.043.314.084.472.128a.84.84 0 0 0 1.02-.617.837.837 0 0 0-.659-1.012Zm.932-2.36a.833.833 0 0 0-1.098.405c-.097.208-.185.422-.264.636a.84.84 0 0 0 .417 1.088.836.836 0 0 0 1.097-.404c.1-.212.18-.424.266-.636a.84.84 0 0 0-.418-1.089Zm-2.283-1.257c-.197-.26-.394-.517-.59-.775a.84.84 0 0 0-1.175-.159.83.83 0 0 0-.158 1.17c.203.265.404.53.607.795a.837.837 0 0 0 1.175.158.837.837 0 0 0 .141-1.19Z" />
                </svg>
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-500 dark:hover:text-green-400"
                aria-label="QQ"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.987 21.999c-1.667 0-3.334-.202-4.792-1.009-1.135.303-2.626.921-2.903 1.572-.202.505.505 2.323 4.751 2.12 5.055-.201 6.271-1.414 6.271-2.323-.101-.707-1.414-1.01-3.327-.36Zm6.775-10.89c-.303-3.529-1.819-5.65-1.819-5.65.212-2.222-.605-2.627-.605-2.627C15.933.617 12.2 1.727 12.1 1.727c-2.433-.202-4.549 1.718-4.549 1.718-.909 0-1.212 2.525-1.212 2.525-2.323 3.93-2.12 6.96-2.12 6.96.505 3.53 3.23 3.832 3.23 3.832 1.617 4.65 4.75 4.346 4.75 4.346.404.101 1.11.101 1.819.101.707 0 1.414 0 1.819-.101 0 0 3.03.304 4.65-4.346 0 0 2.627-.302 3.23-3.833 0 0 .204-3.03-2.018-6.959l-3.23 5.044Z" />
                </svg>
              </a>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">联系我们</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                邮箱: 3204066037@qq.com
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                电话: 18959538961
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 智学云. 保留所有权利.</p>
          <p className="mt-2 text-sm">
            浙ICP备12345678号-1 | 浙公网安备 33010802012594号
          </p>
        </div>
      </div>
    </footer>
  );
}
