# 日语学习小程序（对标百词斩）· jp-study-miniprogram

对标「百词斩」的日语（N5）每日打卡 + 积分 + 同桌社交 PK 微信小程序。
当前阶段：**单机 MVP**（学习 + 每日打卡 + 积分 + 连续天数 + 学习日历 + 同声传译发音）。

## 仓库结构
```
jp-miniprogram/
├─ miniprogram/          前端（微信小程序原生）
│  ├─ app.js/json/wxss
│  ├─ pages/             launch / home / learn / calendar / profile
│  ├─ utils/             cloud · audio · srs(SM-2) · store
│  └─ data/words.js       N5 词库（儿童零基础友好，90 词）
├─ cloudfunctions/       云函数（微信云开发）
│  ├─ login / getDailyTask / completeStudy / getProgress
├─ docs/                 规划与工程清单（同步留存）
├─ TASKS.md              任务看板（跨机同步，状态唯一来源）
└─ 协作同步流程.md        两机协作 + git 同步规范
```

## 快速开始
见 `docs/日语学习小程序-工程list.md` 第 5 节：注册个人小程序账号 → 开通云开发 → 填环境 ID → 导入工程 → 上传云函数 → 建集合。

## 开发约定
- 主分支 `main`；功能使用 `feature/<里程碑-编号>` 分支（如 `feature/M1-4`）。
- 任务状态以 `TASKS.md` 为准，改前先 `git pull`，改后 `git push`。
- 详见 `协作同步流程.md`。
