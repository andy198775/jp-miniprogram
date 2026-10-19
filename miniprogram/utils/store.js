// utils/store.js
// 轻量全局状态：保存 openid 与用户档案，避免重复读取。
const app = getApp();

function setOpenid(openid) {
  if (app) app.globalData.openid = openid;
  wx.setStorageSync('openid', openid);
}

function getOpenid() {
  if (app && app.globalData.openid) return app.globalData.openid;
  return wx.getStorageSync('openid') || '';
}

function setUser(user) {
  if (app) app.globalData.userInfo = user;
  wx.setStorageSync('user', user);
}

function getUser() {
  if (app && app.globalData.userInfo) return app.globalData.userInfo;
  return wx.getStorageSync('user') || null;
}

module.exports = { setOpenid, getOpenid, setUser, getUser };
