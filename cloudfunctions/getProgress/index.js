// 云函数 getProgress：返回积分、连续、已学会数、今日状态、本月每日记录
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function dateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function monthStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();

  const u = await db.collection('users').where({ _openid: OPENID }).get();
  const points = u.data.length ? u.data[0].points : 0;

  const st = await db.collection('streaks').where({ _openid: OPENID }).get();
  const current = st.data.length ? st.data[0].current : 0;
  const longest = st.data.length ? st.data[0].longest : 0;

  const today = dateStr(new Date());
  const log = await db.collection('dailyLogs').where({ _openid: OPENID, date: today }).get();
  const todayDone = !!(log.data && log.data.length);

  const learned = await db.collection('userWords').where({ _openid: OPENID, reps: _.gte(1) }).count();
  const learnedTotal = learned.total;

  const m = monthStr(new Date());
  const logs = await db
    .collection('dailyLogs')
    .where({ _openid: OPENID, date: _.gte(m + '-01').and(_.lte(m + '-31')) })
    .get();
  const days = {};
  logs.data.forEach((l) => {
    days[l.date] = { count: l.studiedCount, correct: l.correctCount, duration: l.durationSec };
  });

  return {
    ok: true,
    data: { points, streakCurrent: current, streakLongest: longest, todayDone, learnedTotal, month: m, days }
  };
};
