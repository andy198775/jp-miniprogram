// 云函数 getDailyTask：返回已学会词 ID、待复习词 ID、今日是否已完成
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  const learned = await db
    .collection('userWords')
    .where({ _openid: OPENID, reps: _.gte(1) })
    .field({ wordId: true })
    .get();
  const learnedIds = learned.data.map((x) => x.wordId);

  const due = await db
    .collection('userWords')
    .where({ _openid: OPENID, dueDate: _.lte(todayStr()) })
    .field({ wordId: true })
    .get();
  const dueIds = due.data.map((x) => x.wordId);

  const t = todayStr();
  const log = await db.collection('dailyLogs').where({ _openid: OPENID, date: t }).get();
  const todayDone = !!(log.data && log.data.length);

  return { ok: true, data: { learnedIds, dueIds, todayDone } };
};
