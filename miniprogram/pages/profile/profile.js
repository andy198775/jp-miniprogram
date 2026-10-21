const dataService = require('../../utils/dataService.js');
const { computeAch } = require('../../data/achievements.js');
const app = getApp();

Page({
  data: {
    points: 0,
    streakCurrent: 0,
    streakLongest: 0,
    learnedTotal: 0,
    achievements: [],
    unlockedCount: 0,
    unlockedAch: {},
    mode: 'local'
  },

  onShow() {
    this.setData({ mode: (app.globalData && app.globalData.mode) || 'local' });
    this.load();
  },

  load() {
    dataService.call('getProgress')
      .then((p) => {
        const ach = this.calcAch(p);
        this.setData({
          points: p.points,
          streakCurrent: p.streakCurrent,
          streakLongest: p.streakLongest,
          learnedTotal: p.learnedTotal,
          achievements: ach,
          unlockedCount: ach.filter((a) => a.got).length,
          unlockedAch: p.unlockedAch || {}
        });
      })
      .catch((e) => console.error(e));
  },

  calcAch(p) {
    const unlocked = (p && p.unlockedAch) || {};
    return computeAch(p).map((a) => Object.assign({}, a, { unlockedAt: unlocked[a.id] || '' }));
  },

  resetProgress() {
    wx.showModal({
      title: '重置试玩进度',
      content: '会清空本地积分、连续天数、学习日历等所有试玩数据，确定吗？',
      success: (res) => {
        if (res.confirm) {
          dataService.resetAll();
          wx.showToast({ title: '已重置', icon: 'success' });
          this.load();
        }
      }
    });
  }
});
