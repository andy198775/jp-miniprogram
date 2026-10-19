const dataService = require('../../utils/dataService.js');
const store = require('../../utils/store.js');

Page({
  start() {
    wx.showLoading({ title: '登录中' });
    dataService.call('login')
      .then((data) => {
        store.setOpenid(data.openid);
        wx.hideLoading();
        wx.reLaunch({ url: '/pages/home/home' });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({ title: '进入失败，请重试', icon: 'none' });
        console.error(err);
      });
  }
});
