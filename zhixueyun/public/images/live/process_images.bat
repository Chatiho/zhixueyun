@echo off
echo 直播课程图片处理工具
echo ================================
echo.

:: 检查Node.js是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未检测到Node.js
    echo 请先安装Node.js，然后再运行此脚本
    echo 您可以从 https://nodejs.org 下载安装
    echo.
    pause
    exit /b 1
)

:: 执行处理脚本
echo 开始处理图片...
echo.
node process_images.js

echo.
echo 处理完成！按任意键退出...
pause >nul 