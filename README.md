# 日语学习小程序（对标百词斩）· jp-miniprogram

对标「百词斩」的日语（N5）每日打卡 + 积分 + 同桌社交 PK 微信小程序。
当前阶段：**单机 MVP**（学习 + 每日打卡 + 积分 + 连续天数 + 学习日历 + 同声传译发音）。

## 两种运行模式（数据骨架 dataService）
所有页面统一通过 `utils/dataService.js` 读写数据，无需关心存在本地还是云端：
- **🧪 本地试玩模式（默认，`app.js` 中 `mode:'local'`）**：用 `wx.storage` 落地，无需云开发、无需插件、无需联网，导入开发者工具即可直接玩。适合先体验完整流程、验证玩法。
- **☁️ 云端模式（`mode:'cloud'`）**：委托云函数读写云数据库，需配置 `env`、开通云开发、加同声传译插件。上线时使用。

切换：只改 `app.js` 的 `mode` 与 `env`，页面代码无需改动。

## 仓库结构
```
jp-miniprogram/
├─ miniprogram/          前端（微信小程序原生）
│  ├─ app.js/json/wxss    app.js 含 mode 开关；app.wxss 含全局样式
│  ├─ pages/             launch / home / learn / review / calendar / profile
│  ├─ utils/             dataService(统一数据层) · cloud · audio · srs(SM-2) · store
│  └─ data/words.js       N5 词库（儿童零基础友好，90 词）
├─ cloudfunctions/       云函数（微信云开发，云端模式使用）
│  ├─ login / getDailyTask / completeStudy / getProgress
├─ docs/                 规划与工程清单（同步留存）
├─ TASKS.md              任务看板（跨机同步，状态唯一来源）
└─ 协作同步流程.md        两机协作 + git 同步规范
```

## 快速开始（本地试玩，0 配置）
1. 微信开发者工具 → 导入项目 → 选择本仓库 `miniprogram/` 目录。
2. 填一个**个人小程序 AppID**（或用测试号，但测试号不支持同声传译插件发音）。
3. 直接编译运行：启动页点「开始学习」→ 背词（听音选义）→ 看积分/连续/日历。
4. 「我的」页可一键「重置试玩进度」。

> 发音：默认依赖「微信同声传译」插件（后台添加 WechatSI）。未加插件时自动降级为静音，学习流程不受影响，方便先试玩。

## 切换到云端模式（上线前）
见 `docs/日语学习小程序-工程list.md` 第 5 节：注册个人小程序账号 → 加同声传译插件 → 开通云开发 → 在 `app.js` 把 `mode` 改为 `'cloud'` 并填 `env` → 上传 4 个云函数 → 建集合（users/userWords/streaks/pointsLedger/dailyLogs）。

## 开发约定
- 主分支 `main`；功能使用 `feature/<里程碑-编号>` 分支（如 `feature/M1-4`）。
- 任务状态以 `TASKS.md` 为准，改前先 `git pull`，改后 `git push`。
- 详见 `协作同步流程.md`。
