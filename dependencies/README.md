# 智学云平台 - 依赖管理系统

本文件夹包含智学云平台的依赖管理系统，用于自动检查和安装项目所需的依赖库。

## 文件说明

- `dependencies.json`: 定义项目所需的核心依赖和开发依赖
- `check-dependencies.bat`: 自动检查和安装缺失的依赖项的批处理脚本

## 添加新依赖

如需添加新的依赖项，请按照以下步骤操作：

1. 打开 `dependencies.json` 文件
2. 根据依赖类型，在 `corePackages` 或 `devPackages` 数组中添加新的依赖包名
3. 保存文件后，下次运行 `auto-start.bat` 时将自动检查和安装新添加的依赖

## 依赖检查流程

1. 启动脚本 `auto-start.bat` 在启动前会调用 `dependencies/check-dependencies.bat`
2. 检查脚本读取 `dependencies.json` 文件中定义的所有依赖
3. 对每个依赖项执行检查，确定是否已安装
4. 自动安装所有缺失的依赖
5. 完成后继续启动应用

## 手动检查依赖

如需手动检查依赖，可以直接运行：

```
dependencies\check-dependencies.bat
```

这将检查并安装所有缺失的依赖，但不会启动应用。 