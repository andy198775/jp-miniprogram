// 云函数 login：获取 openid 并首次建档
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  if (!OPENID) return { ok: false, msg: '缺少 openid' };

  const users = db.collection('users');
  const exist = await users.where({ _openid: OPENID }).get();
  if (!exist.data.length) {
    await users.add({ data: { _openid: OPENID, level: 1, points: 0, createdAt: Date.now() } });
    await db.collection('streaks').add({ data: { _openid: OPENID, current: 0, longest: 0, lastDate: '' } });
  }
  return { ok: true, data: { openid: OPENID } };
};
