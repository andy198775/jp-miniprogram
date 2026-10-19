// utils/cloud.js
// 云函数调用封装。所有页面通过本模块访问后端，便于统一错误处理与未来切换。
// 注意：需要在 app.js 配置 env（云开发环境 ID）。未配置或纯测试号下无法调用云函数。
function call(name, data = {}) {
  return new Promise((resolve, reject) => {
    if (!wx.cloud || !wx.cloud.callFunction) {
      reject(new Error('云开发未初始化，请在 app.js 配置 env 并开通云开发'));
      return;
    }
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        if (res && res.result && res.result.ok) {
          resolve(res.result.data);
        } else {
          reject(new Error((res && res.result && res.result.msg) || '云函数返回异常'));
        }
      },
      fail: (err) => reject(err)
    });
  });
}

module.exports = { call };
