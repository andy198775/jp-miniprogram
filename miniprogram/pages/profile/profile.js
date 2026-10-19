const cloud = require('../../utils/cloud.js');

Page({
  data: {
    points: 0,
    streakCurrent: 0,
    streakLongest: 0,
    learnedTotal: 0,
    achievements: []
  },

  onShow() {
    this.load();
  },

  load() {
    cloud.call('getProgress')
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
  }
});
