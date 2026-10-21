// components/ach-pop/ach-pop.js
// 全局成就解锁弹窗：暴露 show(list) 方法，多个成就排队依次弹出（带进场动画，自动消失）。
Component({
  data: {
    queue: [],
    current: null,
    visible: false
  },
  methods: {
    show(list) {
      if (!list || !list.length) return;
      const queue = this.data.queue.concat(list);
      this.setData({ queue });
      if (!this.data.visible) this._next();
    },
    _next() {
      const queue = this.data.queue;
      if (!queue.length) {
        this.setData({ visible: false, current: null });
        return;
      }
      const current = queue[0];
      this.setData({ current, visible: true });
      if (this._timer) clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        const q = this.data.queue.slice(1);
        this.setData({ queue: q, visible: false });
        setTimeout(() => this._next(), 320); // 退出后稍候再弹下一个
      }, 1900);
    }
  }
});
