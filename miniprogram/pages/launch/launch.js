const cloud = require('../../utils/cloud.js');
const store = require('../../utils/store.js');

Page({
  start() {
    wx.showLoading({ title: '登录中' });
    cloud.call('login')
      .then((data) => {
        store.setOpenid(data.openid);
        wx.hideLoading();
        wx.reLaunch({ url: '/pages/home/home' });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: '请先在 app.js 配置云开发环境', icon: 'none' });
        console.error(err);
      });
  }
});
