// utils/dataService.js
// 统一数据服务（游戏数据骨架）：页面只依赖本模块，不关心数据存在本地还是云端。
//   - 本地模式('local')：用 wx.storage 实现，无需云开发/插件，开箱即玩（试玩 demo 默认走这里）。
//   - 云端模式('cloud')：委托 cloud.js 调云函数（需 app.js 配置 env 并开通云开发）。
// 两种模式对外提供完全一致的契约：login / getDailyTask / completeStudy / getProgress / resetAll。
const cloud = require('./cloud.js');
const srs = require('./srs.js');
const { WORDS, NEW_PER_DAY } = require('../data/words.js');
const { computeAch } = require('../data/achievements.js');

const KEY_USER = 'jp_user';
const KEY_WORDS = 'jp_userWords';
const KEY_DAYS = 'jp_dailyLogs';
const KEY_META = 'jp_meta';
const KEY_ACH = 'jp_ach'; // 成就解锁日期：{ [achId]: 'YYYY-MM-DD' }

function getMode() {
  const app = getApp();
  return (app && app.globalData && app.globalData.mode) || 'local';
}

// —— 日期工具 ——
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function todayStr(d) {
  d = d || new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return todayStr(d);
}
function daysBetween(a, b) {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / 86400000);
}

// —— 本地存储读写 ——
function ensureUser() {
  let user = wx.getStorageSync(KEY_USER);
  if (!user) {
    user = {
      openid: 'demo-user',
      points: 0,
      streakCurrent: 0,
      streakLongest: 0,
      learnedTotal: 0,
      everAllCorrect: false,
      lastStudyDate: '',
      createdAt: Date.now()
    };
    wx.setStorageSync(KEY_USER, user);
  }
  return user;
}

// —— 本地模式各操作（与云函数契约一致）——
function handleLogin() {
  const user = ensureUser();
  wx.setStorageSync('openid', user.openid);
  return { openid: user.openid };
}

function handleGetDailyTask() {
  const map = wx.getStorageSync(KEY_WORDS) || {};
  const learnedIds = Object.keys(map).map(Number);
  const today = todayStr();
  const dueIds = learnedIds.filter((id) => {
    const w = map[id];
    return w.dueDate && daysBetween(w.dueDate, today) >= 0; // dueDate <= 今天
  });
  return { learnedIds, dueIds };
}

function handleCompleteStudy(data) {
  const answers = (data && data.answers) || [];
  const map = wx.getStorageSync(KEY_WORDS) || {};
  const user = ensureUser();
  const days = wx.getStorageSync(KEY_DAYS) || {};
  const today = todayStr();

  // 快照「本次学习前」的成就状态，用于计算新解锁（避免重复弹窗）
  const before = {
    learnedTotal: user.learnedTotal || 0,
    streakCurrent: user.streakCurrent || 0,
    everAllCorrect: !!user.everAllCorrect
  };

  let earned = 0;
  let correctCount = 0;

  answers.forEach((a) => {
    const w = map[a.wordId] || { id: a.wordId, ease: 2.5, interval: 0, reps: 0, dueDate: '' };
    const q = srs.qualityFromCorrect(a.correct);
    const s = srs.schedule(w.ease, w.interval, w.reps, q);
    w.ease = s.ease;
    w.interval = s.interval;
    w.reps = s.reps;
    // 答错(interval=0) → 今天再学；答对 → 按间隔排到未来
    w.dueDate = s.interval > 0 ? addDays(today, s.interval) : today;
    w.learnedAt = w.learnedAt || today;
    map[a.wordId] = w;

    if (a.correct) {
      correctCount += 1;
      earned += 10;
    } else {
      earned += 2; // 安慰分，保持正反馈
    }
  });
  wx.setStorageSync(KEY_WORDS, map);

  // 连续打卡：今天首次学习才更新 streak
  const last = user.lastStudyDate;
  if (last !== today) {
    if (last && daysBetween(last, today) === 1) {
      user.streakCurrent += 1;
    } else {
      user.streakCurrent = 1;
    }
    user.lastStudyDate = today;
    if (user.streakCurrent > user.streakLongest) user.streakLongest = user.streakCurrent;
  }

  // 全对奖励 + 成就标志
  if (answers.length && correctCount === answers.length) {
    earned += 20;
    user.everAllCorrect = true;
  }

  user.points = (user.points || 0) + earned;
  user.learnedTotal = Object.keys(map).length;
  wx.setStorageSync(KEY_USER, user);

  // 每日记录
  const dlog = days[today] || { date: today, studied: 0, correct: 0, count: 0, earned: 0 };
  dlog.studied += answers.length;
  dlog.correct += correctCount;
  dlog.earned += earned;
  dlog.count = (dlog.count || 0) + 1;
  days[today] = dlog;
  wx.setStorageSync(KEY_DAYS, days);

  // 计算本次新解锁的成就，并持久化解锁日期（供「我的」页展示）
  const after = {
    learnedTotal: user.learnedTotal,
    streakCurrent: user.streakCurrent,
    everAllCorrect: !!user.everAllCorrect
  };
  const newAch = diffAch(before, after);
  if (newAch.length) {
    const achMap = wx.getStorageSync(KEY_ACH) || {};
    newAch.forEach((a) => { achMap[a.id] = today; });
    wx.setStorageSync(KEY_ACH, achMap);
  }

  return {
    earned,
    points: user.points,
    streakCurrent: user.streakCurrent,
    streakLongest: user.streakLongest,
    learnedTotal: user.learnedTotal,
    todayDone: true,
    newAch
  };
}

// 计算两次成就快照之间「新解锁」的成就列表
function diffAch(before, after) {
  const gotBefore = new Set(computeAch(before).filter((a) => a.got).map((a) => a.id));
  return computeAch(after).filter((a) => a.got && !gotBefore.has(a.id));
}

function handleGetProgress() {
  const user = ensureUser();
  const days = wx.getStorageSync(KEY_DAYS) || {};
  const today = todayStr();
  const todayDone = !!(days[today] && days[today].count > 0);
  return {
    points: user.points || 0,
    streakCurrent: user.streakCurrent || 0,
    streakLongest: user.streakLongest || 0,
    learnedTotal: user.learnedTotal || 0,
    everAllCorrect: !!user.everAllCorrect,
    unlockedAch: wx.getStorageSync(KEY_ACH) || {},
    days,
    todayDone
  };
}

function resetAll() {
  wx.removeStorageSync(KEY_USER);
  wx.removeStorageSync(KEY_WORDS);
  wx.removeStorageSync(KEY_DAYS);
  wx.removeStorageSync(KEY_META);
  wx.removeStorageSync(KEY_ACH);
  wx.removeStorageSync('openid');
}

function localHandler(name, data) {
  return new Promise((resolve, reject) => {
    try {
      if (name === 'login') return resolve(handleLogin());
      if (name === 'getDailyTask') return resolve(handleGetDailyTask());
      if (name === 'completeStudy') return resolve(handleCompleteStudy(data));
      if (name === 'getProgress') return resolve(handleGetProgress());
      if (name === 'resetAll') { resetAll(); return resolve({ ok: true }); }
      reject(new Error('未知操作: ' + name));
    } catch (e) {
      reject(e);
    }
  });
}

// 统一入口：云端模式走云函数，本地模式走本地实现
function call(name, data) {
  if (getMode() === 'cloud') {
    return cloud.call(name, data);
  }
  return localHandler(name, data);
}

module.exports = { call, resetAll };
