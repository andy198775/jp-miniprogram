// app.js
// 云开发环境 ID：在微信开发者工具开通云开发后，把环境 ID 填到这里。
// 留空字符串时，utils/cloud.js 会提示先配置环境（纯测试号不支持云开发，请用免费个人小程序账号）。
App({
  globalData: {
    env: '', // 例如 'jp-kids-prod'
    openid: '',
    userInfo: null
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('当前基础库不支持云开发，请使用 2.2.3 及以上基础库');
      return;
    }
    const env = this.globalData.env;
    if (env) {
      wx.cloud.init({ env, traceUser: true });
    } else {
      // 未配置环境：仍以默认环境初始化，方便本地调试（开发者工具会提示选择环境）
      wx.cloud.init({ traceUser: true });
    }
  }
});
