const cloud = require('../../utils/cloud.js');
const store = require('../../utils/store.js');
const { WORDS, NEW_PER_DAY } = require('../../data/words.js');

Page({
  data: {
    points: 0,
    streakCurrent: 0,
    streakLongest: 0,
    newCount: 0,
    reviewCount: 0,
    todayDone: false,
    learnedTotal: 0
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const openid = store.getOpenid();
    if (!openid) {
      wx.reLaunch({ url: '/pages/launch/launch' });
      return;
    }
    Promise.all([cloud.call('getProgress'), cloud.call('getDailyTask')])
      .then(([p, t]) => {
        const learnedSet = new Set(t.learnedIds || []);
        const remain = WORDS.filter((w) => !learnedSet.has(w.id)).length;
        const newCount = Math.min(NEW_PER_DAY, remain);
        this.setData({
          points: p.points,
          streakCurrent: p.streakCurrent,
          streakLongest: p.streakLongest,
          learnedTotal: p.learnedTotal,
          todayDone: p.todayDone,
          newCount,
          reviewCount: (t.dueIds || []).length
        });
      })
      .catch((e) => console.error(e));
  },

  goLearn() {
    wx.navigateTo({ url: '/pages/learn/learn' });
  },
  goCalendar() {
    wx.navigateTo({ url: '/pages/calendar/calendar' });
  },
  goProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  }
});
