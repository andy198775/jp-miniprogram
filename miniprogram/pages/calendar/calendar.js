const cloud = require('../../utils/cloud.js');

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function fmt(y, m, d) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

Page({
  data: {
    year: 0,
    month: 0,
    cells: [],
    days: {},
    monthLabel: '',
    selected: '',
    detail: null,
    weekdays: ['日', '一', '二', '三', '四', '五', '六']
  },

  onLoad() {
    const d = new Date();
    this.setData({ year: d.getFullYear(), month: d.getMonth() + 1 });
    this.load();
  },

  load() {
    cloud.call('getProgress')
      .then((p) => {
        const { year, month } = this.data;
        const first = new Date(year, month - 1, 1);
        const startWeek = first.getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const cells = [];
        for (let i = 0; i < startWeek; i++) cells.push({ empty: true });
        for (let d = 1; d <= daysInMonth; d++) {
          const key = fmt(year, month, d);
          const info = p.days[key];
          cells.push({ day: d, key, count: info ? info.count : 0 });
        }
        this.setData({
          cells,
          days: p.days,
          monthLabel: `${year}年${month}月`,
          learnedTotal: p.learnedTotal
        });
      })
      .catch((e) => console.error(e));
  },

  tapDay(e) {
    const key = e.currentTarget.dataset.key;
    const info = this.data.days[key];
    this.setData({ selected: key, detail: info || null });
  },

  prev() {
    let { year, month } = this.data;
    month -= 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    this.setData({ year, month });
    this.load();
  },

  next() {
    let { year, month } = this.data;
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    this.setData({ year, month });
    this.load();
  }
});
