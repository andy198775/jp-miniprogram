// pages/kana/kana.js
// 五十音图：图表浏览（点假名听音）+ 拼读练习（听音选罗马音）+ 掌握进度（本地存储）
const audio = require('../../utils/audio.js');
const { GROUPS, ALL } = require('../../data/kana.js');

const PROGRESS_KEY = 'jp_kana_progress';
const PER_ROUND = 12;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Page({
  data: {
    mode: 'local',
    tab: 'chart',
    groups: GROUPS,
    // 拼读练习
    queue: [],
    idx: 0,
    cur: null,
    options: [],
    answered: false,
    picked: '',
    correct: false,
    score: 0,
    roundTotal: PER_ROUND,
    masteredCount: 0,
    totalAll: ALL.length,
    quizDone: false
  },

  onLoad() {
    const app = getApp();
    this.setData({ mode: (app.globalData && app.globalData.mode) || 'local' });
    this._mastered = (wx.getStorageSync(PROGRESS_KEY) || {}).mastered || {};
    this.setData({ masteredCount: Object.keys(this._mastered).length });
    this.startRound();
  },

  startRound() {
    const queue = shuffle(ALL).slice(0, PER_ROUND);
    this.setData(
      { queue, idx: 0, score: 0, quizDone: false, answered: false, picked: '', correct: false, cur: null, options: [] },
      () => this.buildQuestion()
    );
  },

  buildQuestion() {
    const q = this.data.queue[this.data.idx];
    if (!q) {
      this.finishRound();
      return;
    }
    const pool = ALL.filter((x) => x.r !== q.r).map((x) => x.r);
    const opts = shuffle([q.r, ...shuffle(pool).slice(0, 3)]);
    this.setData({ cur: q, options: opts, answered: false, picked: '', correct: false });
  },

  playKana(e) {
    const k = e.currentTarget.dataset.k;
    if (k) audio.speak(k);
  },

  playCur() {
    if (this.data.cur) audio.speak(this.data.cur.k);
  },

  choose(e) {
    if (this.data.answered) return;
    const picked = e.currentTarget.dataset.r;
    const correct = picked === this.data.cur.r;
    if (correct) {
      this._mastered[this.data.cur.k] = 1;
      this.setData({ masteredCount: Object.keys(this._mastered).length });
    }
    this.setData({ answered: true, picked, correct, score: this.data.score + (correct ? 10 : 2) });
  },

  next() {
    this.saveProgress();
    const idx = this.data.idx + 1;
    if (idx >= this.data.queue.length) {
      this.finishRound();
      return;
    }
    this.setData({ idx }, () => this.buildQuestion());
  },

  finishRound() {
    this.saveProgress();
    this.setData({ quizDone: true });
  },

  saveProgress() {
    wx.setStorageSync(PROGRESS_KEY, { mastered: this._mastered, updatedAt: Date.now() });
  },

  switchTab(e) {
    this.setData({ tab: e.currentTarget.dataset.tab });
  },

  again() {
    this.startRound();
  },

  backHome() {
    wx.navigateBack({ delta: 1, fail: () => wx.reLaunch({ url: '/pages/home/home' }) });
  }
});
