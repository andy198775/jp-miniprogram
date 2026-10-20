<#
  reset-devtools-cache.ps1
  用途：清除微信开发者工具「本地存储」中的项目列表缓存（其中把项目类型记成了 compileType:"game"，
        导致工具按小游戏解析、报「未找到 game.json」）。
  安全性：
    - 只处理 %APPDATA%\微信开发者工具\Local Storage\leveldb（UI 状态 + 最近项目列表）
    - 不触碰 Network\Cookies，因此**登录态不会丢失**
    - 操作前自动把整个 leveldb 目录复制为 leveldb.bak-<时间戳>，可随时回滚
  用法：
    1. 先完全退出微信开发者工具（关闭窗口 + 右下角托盘图标 → 退出）
    2. 右键本文件 →「使用 PowerShell 运行」，或执行：
       powershell -ExecutionPolicy Bypass -File .\reset-devtools-cache.ps1
    3. 重开开发者工具，重新导入项目（选仓库根目录 jp-miniprogram\）
#>

$ErrorActionPreference = 'Stop'

$toolData = Join-Path $env:APPDATA '微信开发者工具'
$ls = Join-Path $toolData 'Local Storage'
$leveldb = Join-Path $ls 'leveldb'

Write-Host "== 微信开发者工具缓存重置 ==" -ForegroundColor Cyan

# 1) 检查工具是否还在运行
$running = Get-Process -ErrorAction SilentlyContinue |
    Where-Object { $_.ProcessName -match 'wechatdevtools|WeChatAppEx' }
if ($running) {
    Write-Host "[X] 检测到开发者工具仍在运行（PID: $($running.Id -join ', ')）。" -ForegroundColor Red
    Write-Host "    请先完全退出（关闭窗口 + 托盘图标右键 → 退出），再重新运行本脚本。" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $leveldb)) {
    Write-Host "[!] 未找到 $leveldb，可能无需清理。" -ForegroundColor Yellow
    exit 0
}

# 2) 备份
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = "$leveldb.bak-$stamp"
Copy-Item -Path $leveldb -Destination $backup -Recurse -Force
Write-Host "[1] 已备份缓存 -> $backup" -ForegroundColor Green

# 3) 清理（只删 leveldb 本体，保留 Local Storage 目录结构）
Get-ChildItem -Path $leveldb -Force | Remove-Item -Recurse -Force
Write-Host "[2] 已清空 leveldb 缓存" -ForegroundColor Green

Write-Host ""
Write-Host "完成。请重新打开微信开发者工具，" -ForegroundColor Cyan
Write-Host "在『项目列表』中如有旧记录请先右键删除，然后重新导入：" -ForegroundColor Cyan
Write-Host "    D:\WorkBuddy\StudyBench\KidEnglish\jp-miniprogram" -ForegroundColor White
Write-Host "（选根目录，不要选里面的 miniprogram 子目录）" -ForegroundColor Yellow
Write-Host ""
Write-Host "如需回滚：把备份目录内容复制回 $leveldb 即可。" -ForegroundColor DarkGray
