@echo off
echo 此脚本将修复GitHub相关的hosts文件设置
echo 需要以管理员权限运行

echo 创建临时hosts文件...
type C:\Windows\System32\drivers\etc\hosts | findstr /v github > %temp%\hosts.tmp

echo 备份原hosts文件...
copy C:\Windows\System32\drivers\etc\hosts C:\Windows\System32\drivers\etc\hosts.bak

echo 更新hosts文件...
copy %temp%\hosts.tmp C:\Windows\System32\drivers\etc\hosts

echo 删除临时文件...
del %temp%\hosts.tmp

echo 完成!
echo 如果需要恢复原始设置，请运行:
echo copy C:\Windows\System32\drivers\etc\hosts.bak C:\Windows\System32\drivers\etc\hosts

pause 