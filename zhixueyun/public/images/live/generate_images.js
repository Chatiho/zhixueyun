const fs = require('fs');
const path = require('path');

// 确保images/live目录存在
const imagesDir = path.join(__dirname);
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// 定义直播课程主题（与localImages对象对应）
const topics = [
    { id: 'frontend', title: '前端开发技术', color: '#4299e1' },
    { id: 'backend', title: '后端架构设计', color: '#48bb78' },
    { id: 'design', title: 'UI/UX设计原则', color: '#ed8936' },
    { id: 'ai', title: '人工智能与机器学习', color: '#805ad5' },
    { id: 'cloud', title: '云计算与微服务', color: '#38b2ac' },
    { id: 'security', title: '网络安全防护', color: '#e53e3e' },
    { id: 'blockchain', title: '区块链技术', color: '#d69e2e' },
    { id: 'mobile', title: '移动应用开发', color: '#667eea' }
];

// HTML模板，用于生成图片占位符
function createPlaceholderHtml(topic) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${topic.title} - 直播课程</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
      font-family: Arial, sans-serif;
    }
    .placeholder {
      width: 800px;
      height: 450px;
      background-color: ${topic.color};
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    }
    .placeholder::before {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background-color: rgba(255,255,255,0.1);
      border-radius: 50%;
      top: -150px;
      right: -100px;
    }
    .placeholder::after {
      content: '';
      position: absolute;
      width: 200px;
      height: 200px;
      background-color: rgba(255,255,255,0.1);
      border-radius: 50%;
      bottom: -100px;
      left: -50px;
    }
    .title {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      z-index: 1;
    }
    .subtitle {
      font-size: 24px;
      opacity: 0.9;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="placeholder">
    <h1 class="title">${topic.title}</h1>
    <div class="subtitle">直播课程</div>
  </div>
</body>
</html>
  `;
}

// 为每个主题生成HTML文件
topics.forEach(topic => {
    const html = createPlaceholderHtml(topic);
    const filePath = path.join(imagesDir, `${topic.id}.html`);
    fs.writeFileSync(filePath, html);
    console.log(`已生成 ${topic.id}.html`);
});

console.log(`
生成完成！请按照以下步骤手动将HTML转换为图片：
1. 在浏览器中打开每个HTML文件
2. 使用浏览器的截图功能或开发者工具的截图功能
3. 将截图保存为对应的jpg文件 (例如: frontend.jpg)
4. 将所有jpg文件保存在此目录下

你也可以使用在线HTML到图片转换工具，如 https://www.screenshotapi.io/ 等
`);

// 创建一个readme文件说明使用方法
const readmePath = path.join(imagesDir, 'readme.txt');
fs.writeFileSync(readmePath, `直播课程图片生成指南

此目录应包含以下图片文件，对应于各个直播课程主题：
${topics.map(topic => `- ${topic.id}.jpg - ${topic.title}`).join('\n')}

如果没有看到这些文件，请使用以下方法生成：
1. 运行 node generate_images.js 脚本生成HTML文件
2. 在浏览器中打开HTML文件
3. 截图并保存为对应的JPG文件
4. 将JPG文件放在此目录下

图片推荐尺寸：800x450像素
`);

console.log(`已创建readme.txt文件`);