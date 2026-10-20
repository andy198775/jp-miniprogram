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
- [x] GitHub 远程已连接并**推送成功**：`origin=https://github.com/andy198775/jp-miniprogram.git`，分支 `main`，4 提交全部上线（`origin/main` = c8061fe）— 2026-10-19
- [x] **小游戏框架 + 本地试玩 demo**：新增 `utils/dataService.js` 统一数据层（本地 localStorage 模式默认开箱即玩，云端模式委托云函数）；6 页面全部改走 dataService；`app.js` 加 `mode` 开关；首页/我的页加本地试玩标识与重置按钮；补全局样式 — 2026-10-19
- [x] **修复开发者工具报错「未找到 game.json」**：根因是**开发者工具本地缓存把项目类型记成了 `compileType:"game"`**（初次导入时工程内层 config 误写 game 播种进缓存），工具只按缓存解析、不重读文件。修复：① 根 `project.config.json` 保持 `compileType:"miniprogram"`；② **删除 `miniprogram/` 子目录下的 project.config.json / project.private.config.json**（唯一权威留在根目录，杜绝双源打架），并加 .gitignore；③ 新增 `tools/reset-devtools-cache.ps1`（带备份、只清 UI 缓存不碰登录态）用于重置工具的项目列表缓存；④ README 补「导入前必读：项目类型必须是小程序」排障章节 — 2026-10-19
- [x] **缓存层 game 类型已实际根除（2026-10-20）**：确认工程文件 100% 正确（根 config=miniprogram、miniprogram/ 下无任何 config、project.private.config.json 无 compileType）；`WeChatAppEx.exe` 是**微信桌面版(Weixin)** 的子进程、与开发者工具无关，开发者工具主进程名为 `微信开发者工具`；已关闭开发者工具主进程并运行 `reset-devtools-cache.ps1` 清空全部 12 个 leveldb 缓存库（含时间戳自动备份，可回滚）。**待你操作：重新打开开发者工具 → 导入项目选【仓库根目录】`D:\WorkBuddy\StudyBench\KidEnglish\jp-miniprogram`（含 project.config.json 那层，勿选内层 miniprogram）→ 重扫二维码登录 → 即可正常编译，不再报 game.json**

### 进行中 / 待办（按实现顺序）
- [ ] **联调验证①**：注册个人小程序账号、后台加「微信同声传译」插件、开通云开发、填环境 ID、上传 4 个云函数、建 5 集合（users/userWords/streaks/pointsLedger/dailyLogs），编译跑通登录→背词→积分→日历
- [ ] **联调验证②**：真机测同声传译 `lang=ja_JP`（个别版本 `ja`），确认日语发音正常
- [x] **M1-5 复习页**：`pages/review` 已建，调用 getDailyTask 取 dueIds 做专注复习，复用听音选义 + SM-2（代码完成，待真机联调）— 2026-10-19
- [ ] **M1-8 成就墙**：profile 已展示成就列表，待补"解锁时弹窗/动画"增强正反馈
- [ ] **打磨**：每日新词数 NEW_PER_DAY 调参、题型手感、断签/连续边界

### 后续扩充内容（在 demo 框架上叠加，按优先级）
- [ ] 词库扩充：当前 90 词 → 增分类（身体/动作/学校/时间/自然）、增难度梯队
- [ ] 题型多样化：听音选词 / 看词选音 / 拼假名 / 例句填空，降低单调
- [ ] 关卡/地图：把"每日任务"包装成可解锁关卡，强化游戏感
- [ ] 成就解锁弹窗动画（接 M1-8）
- [ ] M2 同桌社交（绑定/排行榜/互点赞/断更提醒）
- [ ] M3 异步 PK（createPK / submitPK / 战绩）
- [ ] M4 商业化：注册个体户/公司 → 升级主体 → 微信支付 → 商城/会员

### 阻塞 / 待你决定
- [ ] 联调验证①：注册个人小程序账号、后台加「微信同声传译」插件、开通云开发、填 env、上传 4 个云函数、建 5 集合，编译跑通（demo 本地模式已可跳过此步先试玩）
- [ ] 联调验证②：真机测同声传译 `lang=ja_JP`（个别版本 `ja`），确认日语发音正常
- [ ] 词库版权：自整理 90 词仅 MVP 用，正式商用建议采购正版 N5 词库

### 阻塞 / 待你决定
- [x] GitHub 远程仓库：仓库 `jp-miniprogram`（公开）已建，remote 已加，**4 提交已成功 push 到 `origin/main`**（Clash 正确分流后推送成功）— 2026-10-19
- [ ] 词库版权：自整理 90 词仅 MVP 用，正式商用建议采购正版 N5 词库
