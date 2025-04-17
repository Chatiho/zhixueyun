@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ===================================
echo      正在检查项目依赖...
echo ===================================
echo.

REM 设置工作目录为脚本所在目录的父目录(项目根目录)
cd /d "%~dp0\.."

set PROJECT_DIR=%cd%
set ZHIXUEYUN_DIR=%PROJECT_DIR%\zhixueyun
set DEPENDENCIES_FILE=%PROJECT_DIR%\dependencies\dependencies.json

REM 检查dependencies.json文件是否存在
if not exist "%DEPENDENCIES_FILE%" (
    echo [错误] 未找到依赖配置文件: %DEPENDENCIES_FILE%
    echo 请确保文件存在并包含有效的JSON格式
    exit /b 1
)

REM 检查Node.js是否安装
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js！请先安装Node.js
    echo 下载地址: https://nodejs.org/
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set nodeVersion=%%i
    echo [信息] 检测到Node.js版本: !nodeVersion!
)

REM 从JSON文件中提取corePackages数组（使用临时文件）
node -e "const fs = require('fs'); const deps = JSON.parse(fs.readFileSync('%DEPENDENCIES_FILE%', 'utf8')); fs.writeFileSync('core_deps.txt', deps.corePackages.join('\n'));"

REM 从JSON文件中提取devPackages数组（使用临时文件）
node -e "const fs = require('fs'); const deps = JSON.parse(fs.readFileSync('%DEPENDENCIES_FILE%', 'utf8')); fs.writeFileSync('dev_deps.txt', deps.devPackages.join('\n'));"

set MISSING_DEPS=0
set MISSING_DEV_DEPS=0
set PACKAGES_TO_INSTALL=
set DEV_PACKAGES_TO_INSTALL=

echo [信息] 检查核心依赖包...
for /f "tokens=*" %%p in (core_deps.txt) do (
    set PKG=%%p
    cd "%ZHIXUEYUN_DIR%"
    call npm list !PKG! --depth=0 > nul 2>&1
    if !errorlevel! neq 0 (
        echo [警告] 缺少依赖包: !PKG!
        set /a MISSING_DEPS+=1
        if "!PACKAGES_TO_INSTALL!"=="" (
            set PACKAGES_TO_INSTALL=!PKG!
        ) else (
            set PACKAGES_TO_INSTALL=!PACKAGES_TO_INSTALL! !PKG!
        )
    ) else (
        echo [信息] 已安装: !PKG!
    )
)

echo [信息] 检查开发依赖包...
for /f "tokens=*" %%p in (dev_deps.txt) do (
    set PKG=%%p
    cd "%ZHIXUEYUN_DIR%"
    call npm list !PKG! --dev --depth=0 > nul 2>&1
    if !errorlevel! neq 0 (
        echo [警告] 缺少开发依赖包: !PKG!
        set /a MISSING_DEV_DEPS+=1
        if "!DEV_PACKAGES_TO_INSTALL!"=="" (
            set DEV_PACKAGES_TO_INSTALL=!PKG!
        ) else (
            set DEV_PACKAGES_TO_INSTALL=!DEV_PACKAGES_TO_INSTALL! !PKG!
        )
    ) else (
        echo [信息] 已安装: !PKG!
    )
)

REM 删除临时文件
del core_deps.txt
del dev_deps.txt

echo.
echo [信息] 依赖检查完成: 缺少!MISSING_DEPS!个核心依赖, !MISSING_DEV_DEPS!个开发依赖

REM 安装缺少的依赖
if !MISSING_DEPS! gtr 0 (
    echo.
    echo [信息] 安装缺少的核心依赖...
    echo 包: !PACKAGES_TO_INSTALL!
    cd "%ZHIXUEYUN_DIR%"
    call npm install !PACKAGES_TO_INSTALL! --save
    if !errorlevel! neq 0 (
        echo [错误] 安装核心依赖失败！
        exit /b 1
    ) else (
        echo [成功] 核心依赖安装完成！
    )
)

if !MISSING_DEV_DEPS! gtr 0 (
    echo.
    echo [信息] 安装缺少的开发依赖...
    echo 包: !DEV_PACKAGES_TO_INSTALL!
    cd "%ZHIXUEYUN_DIR%"
    call npm install !DEV_PACKAGES_TO_INSTALL! --save-dev
    if !errorlevel! neq 0 (
        echo [错误] 安装开发依赖失败！
        exit /b 1
    ) else (
        echo [成功] 开发依赖安装完成！
    )
)

echo.
echo [信息] 所有依赖检查和安装完成！
exit /b 0 