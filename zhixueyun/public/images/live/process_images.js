/**
 * 直播课程图片处理脚本
 * 
 * 该脚本用于：
 * 1. 检查下载目录中的直播课程图片
 * 2. 重命名并移动图片到正确的位置
 * 3. 创建备份
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 配置
const config = {
    // 根据操作系统确定下载目录
    downloadDir: path.join(os.homedir(), 'Downloads'),
    // 目标目录
    targetDir: path.resolve(__dirname),
    // 需要的图片文件名
    imageNames: [
        'frontend.jpg',
        'backend.jpg',
        'design.jpg',
        'data-science.jpg',
        'mobile.jpg',
        'devops.jpg',
        'general.jpg',
        'algorithms.jpg'
    ]
};

// 创建备份目录
const backupDir = path.join(config.targetDir, 'backup');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
    console.log(`✅ 创建备份目录: ${backupDir}`);
}

// 检查并处理图片
let processedCount = 0;
let skippedCount = 0;

console.log('🔍 开始检查下载的图片...');
console.log(`📂 下载目录: ${config.downloadDir}`);
console.log(`📂 目标目录: ${config.targetDir}`);

// 获取下载目录中的所有文件
fs.readdir(config.downloadDir, (err, files) => {
    if (err) {
        console.error(`❌ 无法读取下载目录: ${err.message}`);
        return;
    }

    // 过滤出我们需要的图片文件
    const imageFiles = files.filter(file => {
        return config.imageNames.includes(file);
    });

    if (imageFiles.length === 0) {
        console.log('❌ 未在下载目录中找到任何所需图片');
        console.log('💡 提示: 请先使用generate_images.html生成并下载图片');
        return;
    }

    // 处理每个图片文件
    imageFiles.forEach(file => {
        const sourcePath = path.join(config.downloadDir, file);
        const targetPath = path.join(config.targetDir, file);

        // 如果目标位置已存在同名文件，先备份
        if (fs.existsSync(targetPath)) {
            const backupPath = path.join(backupDir, `${file}.bak`);
            fs.copyFileSync(targetPath, backupPath);
            console.log(`📦 备份文件: ${file} -> ${path.relative(config.targetDir, backupPath)}`);
        }

        // 移动文件
        try {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`✅ 成功处理: ${file}`);
            processedCount++;
        } catch (err) {
            console.error(`❌ 处理文件时出错 ${file}: ${err.message}`);
            skippedCount++;
        }
    });

    // 输出处理结果
    console.log('\n📊 处理结果汇总:');
    console.log(`✅ 成功处理: ${processedCount} 个文件`);
    console.log(`⏭️ 跳过处理: ${skippedCount} 个文件`);

    // 检查还缺少哪些图片
    const missingImages = config.imageNames.filter(name => {
        return !fs.existsSync(path.join(config.targetDir, name));
    });

    if (missingImages.length > 0) {
        console.log('\n⚠️ 警告: 以下图片文件仍然缺失:');
        missingImages.forEach(name => {
            console.log(`  - ${name}`);
        });
        console.log('💡 提示: 请使用generate_images.html生成并下载这些图片');
    } else {
        console.log('\n🎉 所有图片文件已准备就绪!');
    }
});