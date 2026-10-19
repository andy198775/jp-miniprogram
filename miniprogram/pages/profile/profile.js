const dataService = require('../../utils/dataService.js');
const app = getApp();

Page({
  data: {
    points: 0,
    streakCurrent: 0,
    streakLongest: 0,
    learnedTotal: 0,
    achievements: [],
    mode: 'local'
  },

  onShow() {
    this.setData({ mode: (app.globalData && app.globalData.mode) || 'local' });
    this.load();
  },

  load() {
    dataService.call('getProgress')
      .then((p) => {
        this.setData({
          points: p.points,
          streakCurrent: p.streakCurrent,
          streakLongest: p.streakLongest,
          learnedTotal: p.learnedTotal,
          achievements: this.calcAch(p)
        });
      })
      .catch((e) => console.error(e));
  },

  calcAch(p) {
    return [
      { name: '初学乍练', desc: '学会 10 个词', got: p.learnedTotal >= 10 },
      { name: '小有积累', desc: '学会 50 个词', got: p.learnedTotal >= 50 },
      { name: '百词达成', desc: '学会 90 个词', got: p.learnedTotal >= 90 },
      { name: '坚持 3 天', desc: '连续打卡 3 天', got: p.streakCurrent >= 3 },
      { name: '一周不断', desc: '连续打卡 7 天', got: p.streakCurrent >= 7 },
      { name: '半月达人', desc: '连续打卡 15 天', got: p.streakCurrent >= 15 },
      { name: '月度之星', desc: '连续打卡 30 天', got: p.streakCurrent >= 30 }
    ];
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
