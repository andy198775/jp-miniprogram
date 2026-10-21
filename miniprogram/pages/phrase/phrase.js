// pages/phrase/phrase.js
// 常用语：学习（点句听音 + 标记已会）+ 测验（听音选中文）
const audio = require('../../utils/audio.js');
const { PHRASES } = require('../../data/phrases.js');

const PROGRESS_KEY = 'jp_phrase_progress';
const PER_ROUND = 10;

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
    tab: 'study',
    phrases: PHRASES,
    learnedMap: {},
    learnedCount: 0,
    total: PHRASES.length,
    // 测验
    queue: [],
    idx: 0,
    cur: null,
    options: [],
    answered: false,
    picked: '',
    correct: false,
    score: 0,
    roundTotal: PER_ROUND,
    quizDone: false
  },

  onLoad() {
    const app = getApp();
    this.setData({ mode: (app.globalData && app.globalData.mode) || 'local' });
    this._learned = (wx.getStorageSync(PROGRESS_KEY) || {}).mastered || {};
    this.setData({ learnedMap: this._learned, learnedCount: Object.keys(this._learned).length });
  },

  playPhrase(e) {
    const jp = e.currentTarget.dataset.jp;
    if (jp) audio.speak(jp);
  },

  toggleLearned(e) {
    const id = e.currentTarget.dataset.id;
    if (this._learned[id]) delete this._learned[id];
    else this._learned[id] = 1;
    wx.setStorageSync(PROGRESS_KEY, { mastered: this._learned, updatedAt: Date.now() });
    this.setData({ learnedMap: Object.assign({}, this._learned), learnedCount: Object.keys(this._learned).length });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ tab });
    if (tab === 'quiz') this.startRound();
  },

  startRound() {
    const qn = Math.min(PER_ROUND, PHRASES.length);
    const queue = shuffle(PHRASES).slice(0, qn);
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
    const pool = PHRASES.filter((x) => x.cn !== q.cn).map((x) => x.cn);
    const opts = shuffle([q.cn, ...shuffle(pool).slice(0, 3)]);
    this.setData({ cur: q, options: opts, answered: false, picked: '', correct: false });
  },

  playCur() {
    if (this.data.cur) audio.speak(this.data.cur.jp);
  },

  choose(e) {
    if (this.data.answered) return;
    const picked = e.currentTarget.dataset.cn;
    const correct = picked === this.data.cur.cn;
    if (correct) {
      this._learned[this.data.cur.id] = 1;
      wx.setStorageSync(PROGRESS_KEY, { mastered: this._learned, updatedAt: Date.now() });
      this.setData({ learnedMap: Object.assign({}, this._learned), learnedCount: Object.keys(this._learned).length });
    }
    this.setData({ answered: true, picked, correct, score: this.data.score + (correct ? 10 : 2) });
  },

  next() {
    const idx = this.data.idx + 1;
    if (idx >= this.data.queue.length) {
      this.finishRound();
      return;
    }
    this.setData({ idx }, () => this.buildQuestion());
  },

  finishRound() {
    this.setData({ quizDone: true });
  },

  again() {
    this.startRound();
  },

  backHome() {
    wx.navigateBack({ delta: 1, fail: () => wx.reLaunch({ url: '/pages/home/home' }) });
  }
});
