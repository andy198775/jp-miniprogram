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

### ⚠️ 导入前必读：AppID 必须是「小程序」类型（否则报 game.json）

报错 `[app.json 文件内容错误] game.json: 未找到...` 的根因**不是**本地配置、也不是缓存，
而是 **AppID 在微信公众平台被登记成了「小游戏」**。开发者工具会向服务端拉取 AppID 的类型，
小游戏类型会强制按 `miniprogram/game.json` 解析（小游戏的入口文件），与本地
`project.config.json` 的 `"compileType":"miniprogram"` 无关——所以清缓存、重导、改文件都无效。

本仓库 `project.config.json` 的 `compileType` 已固定为 `miniprogram`，结构正确无需改动。

**二选一即可打开试玩：**
- 方案 A（最快，推荐先试玩）：导入时 AppID 一栏选 **「测试号 / 不使用 AppID」**。
  这会绕过服务端 AppID 类型校验，工具按本地 `miniprogram` 编译、直接找 `app.json`，不再报 game.json。
  本地试玩模式（`app.js` 中 `mode:'local'`）下完全够用。
- 方案 B（正式联调 / 上云函数）：到 mp.weixin.qq.com 注册或换用一个**小程序** AppID
  （小游戏 AppID 无法改成小程序，只能新建），把根 `project.config.json` 的 `appid` 改成新的再导入。
  注意：云开发、同声传译插件都要绑在**小程序** AppID 下。

**导入流程**
1. 微信开发者工具 → 导入项目 → 选**仓库根目录 `jp-miniprogram/`**（含 `project.config.json` 那层，勿选 `miniprogram/` 子目录）。
2. AppID 填「测试号」或你的小程序 AppID。
3. 编译 → 启动页「开始学习」→ 听音选义背词 → 看积分/连续/日历。「我的」页可重置试玩进度。

> 发音：默认依赖「微信同声传译」插件。为保证未申请插件时也能编译通过，`app.json` **默认不声明** plugins，
> `audio.js` 以 `requirePlugin` 动态加载、失败自动降级为静音，学习流程不受影响。
> 想开启发音：mp 后台 → 设置 → 第三方设置 → 插件管理 → 添加「微信同声传译」(WechatSI) → 再把 `docs/启用发音插件-参考.json` 里的 `plugins` 字段合并进 `app.json` 顶层。

## 切换到云端模式（上线前）
见 `docs/日语学习小程序-工程list.md` 第 5 节：注册个人小程序账号 → 加同声传译插件 → 开通云开发 → 在 `app.js` 把 `mode` 改为 `'cloud'` 并填 `env` → 上传 4 个云函数 → 建集合（users/userWords/streaks/pointsLedger/dailyLogs）。

## 开发约定
- 主分支 `main`；功能使用 `feature/<里程碑-编号>` 分支（如 `feature/M1-4`）。
- 任务状态以 `TASKS.md` 为准，改前先 `git pull`，改后 `git push`。
- 详见 `协作同步流程.md`。
