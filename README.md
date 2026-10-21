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

**为什么填了真实 AppID 后「小程序/小游戏」选不回来？**
导入弹窗里一旦填写真实 AppID，开发者工具会**立刻向微信服务器查询该 AppID 的账号类型**，
并把「小程序/小游戏」类型下拉**自动锁定**成服务端返回的类型、变灰不可手改。这属于正常机制，不是 bug——
你这个 AppID 一填就锁成「小游戏」，说明它在公众平台登记的就是**小游戏**类型，本地再怎么改 `project.config.json` 都没用。

**二选一即可打开试玩：**
- 方案 A（最快，推荐先试玩）：导入时 AppID 一栏**不要填真实 AppID**，点输入框下方的
  **「测试号」链接（或选「不使用 AppID」）**。此时类型下拉不再被服务端锁定，可手动选「小程序」，
  工具按本地 `miniprogram` 编译、直接找 `app.json`，不再报 game.json。
  本地试玩模式（`app.js` 中 `mode:'local'`）下完全够用。
- 方案 B（正式联调 / 上云函数）：到 mp.weixin.qq.com 注册或换用一个**小程序** AppID
  （小游戏 AppID 无法改成小程序，只能新建），把根 `project.config.json` 的 `appid` 改成新的再导入。
  注意：云开发、同声传译插件都要绑在**小程序** AppID 下。

**导入流程（按方案 A 试玩）**
1. 微信开发者工具 → 项目列表点「+」或「导入项目」。
2. 目录选**仓库根目录 `jp-miniprogram/`**（含 `project.config.json` 那层，**勿选 `miniprogram/` 子目录**）。
3. AppID：**点输入框下方的「测试号」**，不要填真实 AppID；类型下拉选「小程序」。
4. 若项目列表里已有 `jp-kids-learn` 旧条目（被锁成小游戏），先右键**删除项目**再走上面 1–3 步。
5. 编译 → 启动页「开始学习」→ 听音选义背词 → 看积分/连续/日历。「我的」页可重置试玩进度。

> 自查：登录 mp.weixin.qq.com，看这个 AppID 对应账号左侧的「小程序」还是「小游戏」标识。
> 若是「小游戏」，则方案 B 必须新建一个小程序 AppID；若确实是「小程序」却仍被锁，多为旧项目列表缓存，删条目重导即可。

> 发音：`audio.js` 已是**双通道**——优先用「微信同声传译」插件 `textToSpeech` 实时合成；**插件不可用时（如测试号）自动回退播放代码包内本地音频 `miniprogram/audio/<文本>.mp3`**；都没有才静音降级（学习流程不受影响）。
> 因此**没注册正式小程序、没加插件也能出声**：只要往 `miniprogram/audio/` 放进音频文件即可（见下节）。
> 想用插件合成（免准备文件）：mp 后台 → 设置 → 第三方设置 → 插件管理 → 添加「微信同声传译」(WechatSI) → 再把 `docs/启用发音插件-参考.json` 里的 `plugins` 字段合并进 `app.json` 顶层。

## 本地音频发音（测试号也能出声，无需插件）

`audio.js` 已改为双通道：**优先用同声传译插件**；插件不可用时（如测试号），自动回退播放代码包内
`miniprogram/audio/<文本>.mp3`。所以即使没注册正式小程序、没加插件，只要往 `miniprogram/audio/` 放进音频文件，测试号下也能真出声。

### 文件名规则（= 页面上显示的日语文字）
- 五十音图：平假名，如 `あ.mp3`、`か.mp3`、`が.mp3`（浊音）、`ぱ.mp3`（半浊音）、`きゃ.mp3`（拗音）
- N5 单词：单词的假名（即 `words.js` 里每条的 `kana` 字段），如 `りんご.mp3`、`ほん.mp3`
- 常用语：整句日文（含标点），如 `こんにちは。.mp3`
- 调用处也可用 `audio.speak(text, 自定义文件名)` 覆盖默认名。

### 怎么拿到这些 mp3（任选其一）
- **免费在线 TTS**：访问 ttsmp3.com（选 Japanese 语音）、ondoku3.com 等，输入对应日语文字 → 下载 mp3 → 按上面规则命名放入 `miniprogram/audio/`。
- **录屏/录音**：用任意日语朗读 APP（Google 翻译/日语学习 APP 的朗读）播放并录屏，提取出 mp3 片段。
- **真人录音**：家长/老师直接朗读对应文字录成 mp3（对孩子最亲切）。
- **同声传译插件（正式方案）**：注册正式小程序 + 后台加插件 + app.json 声明 plugins 后，`audio.js` 会自动优先用插件合成，无需准备任何文件。

### 注意
- **包体限制**：微信主包 2MB。五十音图约 70 个 + 常用语 30 个 + N5 词 90 个短音频，全放本地可能超主包。建议先放入门必需的（五十音图 + 常用语），N5 词等接插件后再用合成。
- 文件放 `miniprogram/audio/` 下即可，开发者工具编译后会随包加载。

## 切换到云端模式（上线前）
见 `docs/日语学习小程序-工程list.md` 第 5 节：注册个人小程序账号 → 加同声传译插件 → 开通云开发 → 在 `app.js` 把 `mode` 改为 `'cloud'` 并填 `env` → 上传 4 个云函数 → 建集合（users/userWords/streaks/pointsLedger/dailyLogs）。

## 开发约定
- 主分支 `main`；功能使用 `feature/<里程碑-编号>` 分支（如 `feature/M1-4`）。
- 任务状态以 `TASKS.md` 为准，改前先 `git pull`，改后 `git push`。
- 详见 `协作同步流程.md`。
