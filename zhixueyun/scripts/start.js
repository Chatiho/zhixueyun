const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 控制台颜色
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// 打印带颜色的消息
function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

// 检查系统要求
async function checkSystemRequirements() {
    log('\n=== 检查系统要求 ===', 'bright');

    // 检查 Node.js 版本
    const nodeVersion = process.version;
    log(`Node.js 版本: ${nodeVersion}`, 'cyan');
    if (nodeVersion.split('.')[0] < 'v16') {
        log('警告: 建议使用 Node.js 16.0.0 或更高版本', 'yellow');
    }

    // 检查包管理器
    let packageManager = 'npm';
    try {
        execSync('pnpm --version', { stdio: 'ignore' });
        packageManager = 'pnpm';
        log('包管理器: pnpm √', 'green');
    } catch {
        log('包管理器: npm √', 'green');
    }

    return packageManager;
}

// 检查项目文件
function checkProjectFiles() {
    log('\n=== 检查项目文件 ===', 'bright');

    const requiredFiles = [
        { path: 'package.json', name: 'Package 配置' },
        { path: 'next.config.js', name: 'Next.js 配置' },
        { path: 'tsconfig.json', name: 'TypeScript 配置' },
        { path: 'tailwind.config.js', name: 'Tailwind 配置' },
        { path: 'postcss.config.js', name: 'PostCSS 配置' }
    ];

    const missingFiles = [];

    for (const file of requiredFiles) {
        const filePath = path.join(__dirname, '..', file.path);
        if (fs.existsSync(filePath)) {
            log(`${file.name}: √`, 'green');
        } else {
            log(`${file.name}: ×`, 'red');
            missingFiles.push(file);
        }
    }

    return missingFiles;
}

// 检查并安装依赖
async function checkAndInstallDependencies(packageManager) {
    log('\n=== 检查依赖 ===', 'bright');

    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

    if (!fs.existsSync(packageJsonPath)) {
        log('错误: 找不到 package.json 文件', 'red');
        process.exit(1);
    }

    const packageJson = require(packageJsonPath);
    const allDependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    const needsInstall = !fs.existsSync(nodeModulesPath) ||
        Object.keys(allDependencies).some(dep => {
            const depPath = path.join(nodeModulesPath, dep);
            return !fs.existsSync(depPath);
        });

    if (needsInstall) {
        log('检测到缺失依赖，正在安装...', 'yellow');
        try {
            const installCmd = packageManager === 'pnpm' ? 'pnpm install' : 'npm install';
            execSync(installCmd, { stdio: 'inherit' });
            log('依赖安装完成！', 'green');
        } catch (error) {
            log('安装依赖时出错: ' + error.message, 'red');
            process.exit(1);
        }
    } else {
        log('所有依赖已安装 √', 'green');
    }
}

// 检查环境变量
function checkEnvironmentVariables() {
    log('\n=== 检查环境变量 ===', 'bright');

    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', '.env.example');

    if (!fs.existsSync(envPath)) {
        if (fs.existsSync(envExamplePath)) {
            log('创建 .env 文件...', 'yellow');
            fs.copyFileSync(envExamplePath, envPath);
            log('.env 文件已创建 √', 'green');
        } else {
            log('警告: 未找到 .env.example 文件', 'yellow');
        }
    } else {
        log('.env 文件已存在 √', 'green');
    }
}

// 启动开发服务器
function startDevServer() {
    log('\n=== 启动开发服务器 ===', 'bright');
    log('正在启动 Next.js 开发服务器...', 'cyan');

    try {
        execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
        log('启动服务器时出错: ' + error.message, 'red');
        process.exit(1);
    }
}

// 二次检查
async function doubleCheck() {
    log('\n=== 二次检查 ===', 'bright');

    // 检查 node_modules
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
        log('错误: node_modules 目录不存在', 'red');
        return false;
    }

    // 检查 .next 目录
    const nextPath = path.join(__dirname, '..', '.next');
    if (fs.existsSync(nextPath)) {
        log('.next 目录已存在 √', 'green');
    }

    // 检查环境变量文件
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
        log('警告: .env 文件不存在', 'yellow');
    } else {
        log('.env 文件存在 √', 'green');
    }

    return true;
}

// 主函数
async function main() {
    log('\n🚀 智学云启动助手', 'bright');

    try {
        // 第一轮检查
        const packageManager = await checkSystemRequirements();
        const missingFiles = checkProjectFiles();

        if (missingFiles.length > 0) {
            log('\n警告: 发现缺失的配置文件，请确保项目配置完整', 'yellow');
        }

        // 安装依赖
        await checkAndInstallDependencies(packageManager);

        // 检查环境变量
        checkEnvironmentVariables();

        // 二次检查
        log('\n正在进行最终检查...', 'cyan');
        const checkResult = await doubleCheck();

        if (!checkResult) {
            log('发现错误，请解决以上问题后重试', 'red');
            process.exit(1);
        }

        // 启动服务器
        startDevServer();

    } catch (error) {
        log('\n启动过程中出现错误: ' + error.message, 'red');
        process.exit(1);
    }
}

// 运行主函数
main().catch(error => {
    log('\n发生未知错误: ' + error.message, 'red');
    process.exit(1);
});