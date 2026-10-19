// app.js
// mode: 'local' 本地试玩（无需云开发/插件，开箱即玩，默认）
//       'cloud' 云端模式（需在 globalData.env 填云开发环境 ID 并开通云开发、加同声传译插件）
// 切换方式：把下面 mode 改为 'cloud' 并填 env 即可，页面代码无需改动（统一走 dataService）。
App({
  globalData: {
    mode: 'local',
    env: '', // 云端模式填写，例如 'jp-kids-prod'
    openid: 'demo-user',
    userInfo: null
  },

  onLaunch() {
    if (this.globalData.mode === 'cloud') {
      if (!wx.cloud) {
        console.error('当前基础库不支持云开发，请使用 2.2.3 及以上基础库，或把 mode 改回 local');
        return;
      }
      const env = this.globalData.env;
      if (env) {
        wx.cloud.init({ env, traceUser: true });
      } else {
        // 未配置环境：以默认环境初始化，方便本地调试
        wx.cloud.init({ traceUser: true });
      }
    }
    // local 模式：不初始化云开发，避免报错，demo 直接可玩
  }
});
