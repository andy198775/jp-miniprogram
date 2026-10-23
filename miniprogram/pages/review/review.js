// pages/review/review.js
// M1-5 复习页：只拉「待复习」词（completeStudy 写入的 dueDate <= 今天），专注复习。
// 题型多样化：与 learn 页共用 utils/quiz.js 生成器（听音选义/看词选义/听音选词/看词选罗马音/拼假名/例句填空）。
const dataService = require('../../utils/dataService.js');
const audio = require('../../utils/audio.js');
const quiz = require('../../utils/quiz.js');
const { WORDS } = require('../../data/words.js');

Page({
  data: {
    list: [],
    idx: 0,
    total: 0,
    types: [],
    q: null,
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
        const dueSet = new Set(t.dueIds || []);
        const list = WORDS.filter((w) => dueSet.has(w.id));
        if (!list.length) {
          this.setData({ result: { empty: true } });
          return;
        }
        const types = quiz.assignTypes(list);
        this.setData({ list, total: list.length, types, startTime: Date.now() }, () => this.showWord());
      })
      .catch((e) => {
        wx.showToast({ title: '加载失败', icon: 'none' });
        console.error(e);
      });
  },

  showWord() {
    const word = this.data.list[this.data.idx];
    if (!word) {
      this.finish();
      return;
    }
    const q = quiz.buildQuestion(word, this.data.types[this.data.idx]);
    this.setData({ q, answered: false, correct: false, picked: '' }, () => {
      if (q.audioText) audio.speak(q.audioText);
    });
  },

  playAudio() {
    if (this.data.q && this.data.q.audioText) audio.speak(this.data.q.audioText);
    else if (this.data.q) audio.speak(this.data.q.word.kana);
  },

  choose(e) {
    if (this.data.answered) return;
    const picked = e.currentTarget.dataset.val;
    const correct = picked === this.data.q.answer;
    const answers = this.data.answers.concat([{ wordId: this.data.q.word.id, correct }]);
    this.setData({ answered: true, correct, picked, answers });
  },

  next() {
    if (!this.data.correct) {
      // 零失败：答错不惩罚，重听/重试，答对才过关
      if (this.data.q && this.data.q.audioText) audio.speak(this.data.q.audioText);
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
