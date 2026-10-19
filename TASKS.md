# 任务看板（跨机同步 · 状态唯一来源）

> 规则：每项完成勾选 `[x]` 并标注完成日期；进行中写 `[~]`；改完 `TASKS.md` 记得 `git add TASKS.md && git commit && git push`。
> 详细拆解见 `docs/日语学习小程序-工程list.md`。本看板只跟踪**当前正在做**的 MVP 进度。

## 当前阶段：M1 MVP 单机闭环

### 已完成
- [x] M0-4 工程脚手架（app.json/js/wxss、5 页面骨架、utils、data）— 2026-10-19
- [x] 词库 N5 90 词（儿童零基础友好）落地 `data/words.js` — 2026-10-19
- [x] 云函数 login / getDailyTask / completeStudy / getProgress 初版 — 2026-10-19
- [x] 页面 launch / home / learn / calendar / profile 初版 — 2026-10-19
- [x] 发音封装（微信同声传译插件，假名合成）— 2026-10-19
- [x] Git 仓库初始化 + 两机同步规范 + 本看板 — 2026-10-19

### 进行中 / 待办（按实现顺序）
- [ ] **联调验证①**：注册个人小程序账号、后台加「微信同声传译」插件、开通云开发、填环境 ID、上传 4 个云函数、建 5 集合（users/userWords/streaks/pointsLedger/dailyLogs），编译跑通登录→背词→积分→日历
- [ ] **联调验证②**：真机测同声传译 `lang=ja_JP`（个别版本 `ja`），确认日语发音正常
- [x] **M1-5 复习页**：`pages/review` 已建，调用 getDailyTask 取 dueIds 做专注复习，复用听音选义 + SM-2（代码完成，待真机联调）— 2026-10-19
- [ ] **M1-8 成就墙**：profile 已有基础，补 `achOwned` 解锁弹窗
- [ ] **打磨**：每日新词数 NEW_PER_DAY 调参、题型手感、断签/连续边界

### 后续里程碑（待 M1 真机验证后启动）
- [ ] M2 同桌社交（绑定/排行榜/互点赞/断更提醒）
- [ ] M3 异步 PK（createPK / submitPK / 战绩）
- [ ] M4 商业化：注册个体户/公司 → 升级主体 → 微信支付 → 商城/会员

### 阻塞 / 待你决定
- [x] GitHub 远程仓库：已定名 `jp-study-miniprogram`（公开）；待你在 github.com 建空仓库后把 URL 发我，我 `git remote add` + `push`（2026-10-19 决定）
- [ ] 词库版权：自整理 90 词仅 MVP 用，正式商用建议采购正版 N5 词库
