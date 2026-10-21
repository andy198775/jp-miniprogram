const dataService = require('../../utils/dataService.js');
const audio = require('../../utils/audio.js');
const { WORDS, NEW_PER_DAY } = require('../../data/words.js');

function buildSession(learnedIds, dueIds) {
  const learnedSet = new Set(learnedIds || []);
  const dueSet = new Set(dueIds || []);
  const newWords = WORDS.filter((w) => !learnedSet.has(w.id)).slice(0, NEW_PER_DAY);
  const reviewWords = WORDS.filter((w) => dueSet.has(w.id));
  return newWords.concat(reviewWords);
}

Page({
  data: {
    list: [],
    idx: 0,
    total: 0,
    cur: null,
    options: [],
    answered: false,
    correct: false,
    picked: '',
    answers: [],
    result: null,
    startTime: 0
  },

  onLoad() {
    dataService.call('getDailyTask')
      .then((t) => {
        const list = buildSession(t.learnedIds, t.dueIds);
        if (!list.length) {
          this.setData({ result: { empty: true } });
          return;
        }
        this.setData({ list, total: list.length, startTime: Date.now() }, () => this.showWord());
      })
      .catch((e) => {
        wx.showToast({ title: '加载失败', icon: 'none' });
        console.error(e);
      });
  },

  showWord() {
    const cur = this.data.list[this.data.idx];
    if (!cur) {
      this.finish();
      return;
    }
    const others = WORDS.filter((w) => w.id !== cur.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.cn);
    const options = others.concat(cur.cn).sort(() => Math.random() - 0.5);
    this.setData({ cur, options, answered: false, correct: false, picked: '' });
    audio.speak(cur.kana);
  },

  playAudio() {
    if (this.data.cur) audio.speak(this.data.cur.kana);
  },

  choose(e) {
    if (this.data.answered) return;
    const picked = e.currentTarget.dataset.cn;
    const correct = picked === this.data.cur.cn;
    const answers = this.data.answers.concat([{ wordId: this.data.cur.id, correct }]);
    this.setData({ answered: true, correct, picked, answers });
  },

  next() {
    if (!this.data.correct) {
      audio.speak(this.data.cur.kana);
      this.setData({ answered: false, picked: '' });
      return;
    }
    const idx = this.data.idx + 1;
    if (idx >= this.data.total) {
      this.finish();
      return;
    }
    this.setData({ idx }, () => this.showWord());
  },

  finish() {
    const durationSec = Math.round((Date.now() - this.data.startTime) / 1000);
    const answers = this.data.answers;
    if (!answers.length) {
      this.setData({ result: { empty: true } });
      return;
    }
    wx.showLoading({ title: '保存中' });
    dataService.call('completeStudy', { answers, durationSec })
      .then((p) => {
        wx.hideLoading();
        const correctCount = answers.filter((a) => a.correct).length;
        this.setData({
          result: {
            studied: answers.length,
            correct: correctCount,
            earned: p.earned,
            points: p.points,
            streakCurrent: p.streakCurrent,
            learnedTotal: p.learnedTotal
          }
        });
        if (p.newAch && p.newAch.length) {
          const pop = this.selectComponent('#achPop');
          if (pop) pop.show(p.newAch);
          const cheers = ['すごい', 'やった', 'がんばって'];
          audio.speak(cheers[Math.floor(Math.random() * cheers.length)]);
        }
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: '保存失败', icon: 'none' });
        console.error(err);
      });
  },

  backHome() {
    wx.reLaunch({ url: '/pages/home/home' });
  }
});
