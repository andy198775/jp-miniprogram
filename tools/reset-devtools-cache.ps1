<#
  reset-devtools-cache.ps1
  Purpose: Clear WeChat DevTools project-list cache where the project type was
           stored as compileType:"game", which makes the tool look for
           game.json and fail with:
             [app.json file content error] game.json: file not found
  Safety:
    - Only touches %APPDATA%\Tencent\wechat_devtools\Local Storage\leveldb
      (UI state + recent project list)
    - Does NOT touch Network\Cookies, so login state is preserved
    - Backs up the whole leveldb dir as leveldb.bak-<timestamp> first (reversible)
  Usage:
    1. Fully exit WeChat DevTools (close window AND tray icon -> Quit)
    2. Run this script, then re-import the project from the repo ROOT:
       D:\WorkBuddy\StudyBench\KidEnglish\jp-miniprogram
#>

$ErrorActionPreference = 'Stop'

# Locate the DevTools data dir. The folder name may be Chinese
# ("wechat_devtools" in the Chinese UI), so build it from code points to keep
# this script pure ASCII (PowerShell 5.1 mis-reads UTF-8 without BOM).
$zhName = -join (@(0x5FAE, 0x4FE1, 0x5F00, 0x53D1, 0x8005, 0x5DE5, 0x5177) | ForEach-Object { [char]$_ })

$candidates = @(
    (Join-Path $env:APPDATA "Tencent\wechat_devtools\Local Storage\leveldb"),
    (Join-Path $env:APPDATA "$zhName\Local Storage\leveldb")
)
# Wildcard fallback: scan APPDATA for any devtools folder that has a leveldb.
$candidates += Get-ChildItem -Path $env:APPDATA -Directory -ErrorAction SilentlyContinue |
    Where-Object { Test-Path (Join-Path $_.FullName 'Local Storage\leveldb') } |
    ForEach-Object { Join-Path $_.FullName 'Local Storage\leveldb' }

$leveldb = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1

Write-Host "== WeChat DevTools cache reset ==" -ForegroundColor Cyan

$running = Get-Process -ErrorAction SilentlyContinue |
    Where-Object { $_.ProcessName -match 'wechatdevtools|WeChatAppEx' }
if ($running) {
    Write-Host "[X] DevTools is still running (PID: $($running.Id -join ', '))." -ForegroundColor Red
    Write-Host "    Quit it first (close window + tray icon -> Quit), then run this script again." -ForegroundColor Yellow
    exit 1
}

if (-not $leveldb) {
    Write-Host "[!] leveldb not found under %APPDATA%." -ForegroundColor Yellow
    Write-Host "    Nothing to clean. Alternatively: in the DevTools project list, right-click the" -ForegroundColor Yellow
    Write-Host "    project -> Delete, then re-import from the repo root." -ForegroundColor Yellow
    exit 0
}

Write-Host "[0] Target: $leveldb" -ForegroundColor Cyan

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = "$leveldb.bak-$stamp"
Copy-Item -Path $leveldb -Destination $backup -Recurse -Force
Write-Host "[1] Backup created -> $backup" -ForegroundColor Green

Get-ChildItem -Path $leveldb -Force | Remove-Item -Recurse -Force
Write-Host "[2] leveldb cache cleared" -ForegroundColor Green

Write-Host ""
Write-Host "Done. Reopen DevTools and re-import from the REPO ROOT:" -ForegroundColor Cyan
Write-Host "    D:\WorkBuddy\StudyBench\KidEnglish\jp-miniprogram" -ForegroundColor White
Write-Host "  (pick the root folder, NOT the inner miniprogram subfolder)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Rollback: copy the contents of $backup back into $leveldb" -ForegroundColor DarkGray
