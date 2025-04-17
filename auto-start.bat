@echo off
chcp 65001 >nul
title 智学云平台一键启动脚本
color 0A

echo ===================================
echo      智学云平台 - 一键启动脚本
echo ===================================
echo.

REM 检查工作目录
if not exist zhixueyun (
    echo [错误] 未找到zhixueyun目录！
    echo 请确保在正确的位置运行此脚本
    echo.
    pause
    exit /b 1
)

REM 检查Node.js是否安装
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js！请先安装Node.js
    echo 下载地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set nodeVersion=%%i
    echo [信息] 检测到Node.js版本: %nodeVersion%
)
echo.

REM 调用依赖检查脚本
if exist dependencies\check-dependencies.bat (
    echo [信息] 正在检查项目依赖...
    call dependencies\check-dependencies.bat
    if %errorlevel% neq 0 (
        echo [错误] 依赖检查或安装失败！请查看上方错误信息
        echo.
        pause
        exit /b 1
    )
) else (
    echo [警告] 未找到依赖检查脚本，将使用传统方式检查依赖
    
    REM 检查依赖是否安装
    cd zhixueyun
    if not exist node_modules (
        echo [警告] 未检测到node_modules目录，将自动安装依赖...
        echo.
        call npm install
        if %errorlevel% neq 0 (
            echo [错误] 依赖安装失败！请检查网络连接或手动运行npm install
            echo.
            pause
            exit /b 1
        ) else (
            echo [成功] 依赖安装完成！
            echo.
        )
    ) else (
        echo [信息] 依赖已安装
        echo.
    )
    
    REM 切回根目录
    cd ..
)

REM 创建启动浏览器的辅助批处理文件
echo @echo off > open_browser.bat
echo timeout /t 8 /nobreak > nul >> open_browser.bat
echo start http://localhost:3000 >> open_browser.bat
echo exit >> open_browser.bat

REM 启动浏览器脚本（在后台运行）
start /b "" cmd /c open_browser.bat

REM 开发环境
echo [信息] 正在启动智学云平台开发环境...
echo [信息] 将在几秒后自动打开浏览器访问: http://localhost:3000
echo [信息] 按Ctrl+C可停止服务
echo.

REM 切换到项目目录
cd zhixueyun

REM 启动开发服务器
call npm run dev

REM 如果开发服务器异常退出
if %errorlevel% neq 0 (
    echo.
    echo [错误] 开发服务器启动失败，错误代码：%errorlevel%
    echo 请检查控制台输出的错误信息
)

goto cleanup

:cleanup
REM 切回根目录
cd ..

REM 清理临时文件
if exist open_browser.bat del /f /q open_browser.bat

:exit
echo.
echo 感谢使用智学云平台启动脚本!
echo.
timeout /t 3 > nul 