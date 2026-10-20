<#
  reset-devtools-cache.ps1
  Purpose: Clear WeChat DevTools project-list cache where the project type was
           stored as compileType:"game", which makes the tool look for
           miniprogram/game.json and fail with:
             [app.json file content error] game.json: file not found
  Safety:
    - Backs up every leveldb directory (timestamped) before deleting; reversible.
    - Only runs when DevTools is fully closed; refuses if the process is alive
      (writing to a live leveldb corrupts it).
    - Covers all "wechat devtools" leveldb dirs under Roaming and Local.
  Usage:
    1. Fully quit WeChat DevTools (close window + right-click tray -> Quit).
    2. Run:  powershell -ExecutionPolicy Bypass -File tools/reset-devtools-cache.ps1
    3. Reopen DevTools -> Import Project -> pick the REPO ROOT:
       D:\WorkBuddy\StudyBench\KidEnglish\jp-miniprogram
       (the folder that contains project.config.json, NOT the inner miniprogram)
  Note: clearing the cache forgets the login session and project list; just
        re-scan the QR code and re-import once.
#>

$ErrorActionPreference = 'Stop'

# Build the Chinese folder name from code points so this script stays pure ASCII
# (PowerShell 5.1 mis-reads UTF-8 without BOM). 0x5FAE..0x5177 = weixin kaifa zhe gongju
$zhName = -join (@(0x5FAE, 0x4FE1, 0x5F00, 0x53D1, 0x8005, 0x5DE5, 0x5177) | ForEach-Object { [char]$_ })
$enName = 'wechat_devtools'

$roots = @($env:APPDATA, $env:LOCALAPPDATA)
$leveldbDirs = @()

foreach ($root in $roots) {
    if (-not (Test-Path $root)) { continue }
    foreach ($name in @($zhName, $enName)) {
        $base = Join-Path $root $name
        if (Test-Path $base) {
            Get-ChildItem -Path $base -Recurse -Directory -ErrorAction SilentlyContinue |
                Where-Object { $_.Name -eq 'leveldb' } |
                ForEach-Object { $leveldbDirs += $_.FullName }
        }
    }
}
$leveldbDirs = $leveldbDirs | Sort-Object -Unique

Write-Host '== WeChat DevTools cache reset ==' -ForegroundColor Cyan

# DevTools main process is named (Chinese) weixin kaifa zhe gongju.
# NOTE: WeChatAppEx.exe belongs to the WeChat DESKTOP app (Weixin), not DevTools,
# so do NOT use it to decide whether DevTools is running.
$running = Get-Process -ErrorAction SilentlyContinue |
    Where-Object { $_.ProcessName -match '微信开发者工具|wechatdevtools' }
if ($running) {
    Write-Host ('[X] DevTools still running (PID: ' + ($running.Id -join ', ') + ').') -ForegroundColor Red
    Write-Host '    Quit it first (close window + tray icon -> Quit), then run again.' -ForegroundColor Yellow
    exit 1
}

if ($leveldbDirs.Count -eq 0) {
    Write-Host '[!] No leveldb cache directory found; nothing to clean.' -ForegroundColor Yellow
    Write-Host '    Alternative: in DevTools project list, right-click the project -> Delete, then re-import the repo root.' -ForegroundColor Yellow
    exit 0
}

Write-Host ('[0] Found ' + $leveldbDirs.Count + ' cache databases:') -ForegroundColor Cyan
foreach ($d in $leveldbDirs) { Write-Host ('    - ' + $d) -ForegroundColor DarkGray }

foreach ($ldb in $leveldbDirs) {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backup = ($ldb + '.bak-' + $stamp)
    Copy-Item -Path $ldb -Destination $backup -Recurse -Force
    Get-ChildItem -Path $ldb -Force | Remove-Item -Recurse -Force
    Write-Host ('[ok] cleared + backed up: ' + $ldb) -ForegroundColor Green
    Write-Host ('     backup: ' + $backup) -ForegroundColor DarkGray
}

Write-Host ''
Write-Host 'Done. Reopen WeChat DevTools and import the REPO ROOT:' -ForegroundColor Cyan
Write-Host '    D:\WorkBuddy\StudyBench\KidEnglish\jp-miniprogram' -ForegroundColor White
Write-Host '  (the folder with project.config.json; NOT the inner miniprogram subfolder)' -ForegroundColor Yellow
Write-Host ''
Write-Host 'Rollback: copy a .bak-<timestamp> folder back into its original leveldb dir.' -ForegroundColor DarkGray
