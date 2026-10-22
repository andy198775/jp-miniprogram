const dataService = require('../../utils/dataService.js');
const store = require('../../utils/store.js');
const app = getApp();
const { WORDS, NEW_PER_DAY } = require('../../data/words.js');
const { ALL } = require('../../data/kana.js');
const { PHRASES } = require('../../data/phrases.js');

const KANA_READY_COUNT = 40; // 掌握约 40 个假名（大部分清音）即解锁 N5

Page({
  data: {
    points: 0,
    streakCurrent: 0,
    streakLongest: 0,
    newCount: 0,
    reviewCount: 0,
    todayDone: false,
    learnedTotal: 0,
    mode: 'local',
    kanaMastered: 0,
    kanaTotal: ALL.length,
    kanaReady: false,
    phraseLearned: 0,
    phraseTotal: PHRASES.length
  },

  onShow() {
    this.setData({ mode: (app.globalData && app.globalData.mode) || 'local' });
    this.refresh();
  },

  refresh() {
    const openid = store.getOpenid();
    if (!openid) {
      wx.reLaunch({ url: '/pages/launch/launch' });
      return;
    }
    Promise.all([dataService.call('getProgress'), dataService.call('getDailyTask')])
      .then(([p, t]) => {
        const learnedSet = new Set(t.learnedIds || []);
        const remain = WORDS.filter((w) => !learnedSet.has(w.id)).length;
        const newCount = Math.min(NEW_PER_DAY, remain);
        const kanaProg = wx.getStorageSync('jp_kana_progress') || {};
        const kanaMastered = Object.keys(kanaProg.mastered || {}).length;
        const phraseProg = wx.getStorageSync('jp_phrase_progress') || {};
        const phraseLearned = Object.keys(phraseProg.mastered || {}).length;
        this.setData({
          points: p.points,
          streakCurrent: p.streakCurrent,
          streakLongest: p.streakLongest,
          learnedTotal: p.learnedTotal,
          todayDone: p.todayDone,
          newCount,
          reviewCount: (t.dueIds || []).length,
          kanaMastered,
          kanaReady: kanaMastered >= KANA_READY_COUNT,
          phraseLearned
        });
      })
      .catch((e) => console.error(e));
  },

  goStart() {
    if (!this.data.kanaReady) {
      wx.navigateTo({ url: '/pages/kana/kana' });
    } else {
      wx.navigateTo({ url: '/pages/learn/learn' });
    }
  },
  goKana() {
    wx.navigateTo({ url: '/pages/kana/kana' });
  },
  goPhrase() {
    wx.navigateTo({ url: '/pages/phrase/phrase' });
  },
  goSpeak() {
    wx.navigateTo({ url: '/pages/speak/speak' });
  },
  goLearn() {
    if (!this.data.kanaReady) {
      wx.showToast({ title: '建议先学完五十音图哦~', icon: 'none' });
    }
    wx.navigateTo({ url: '/pages/learn/learn' });
  },
  goReview() {
    wx.navigateTo({ url: '/pages/review/review' });
  },
  goCalendar() {
    wx.navigateTo({ url: '/pages/calendar/calendar' });
  },
  goProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  }
});
