// 云函数 completeStudy：结算一次学习（更新 SM-2、积分、连续天数、每日记录）
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;
const { schedule } = require('./srs');

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function dateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(str, n) {
  const [y, m, d] = str.split('-').map(Number);
  return dateStr(new Date(y, m - 1, d + n));
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const answers = event.answers || [];
  const durationSec = event.durationSec || 0;
  if (!answers.length) return { ok: false, msg: '无作答' };

  const userWords = db.collection('userWords');
  const today = dateStr(new Date());
  let earned = 0;

  for (const a of answers) {
    const q = a.correct ? 5 : 2;
    const rec = await userWords.where({ _openid: OPENID, wordId: a.wordId }).get();
    let ease = 2.5;
    let interval = 0;
    let reps = 0;
    if (rec.data.length) {
      ease = rec.data[0].ease;
      interval = rec.data[0].interval;
      reps = rec.data[0].reps;
    }
    const s = schedule(ease, interval, reps, q);
    const dueDate = addDays(today, s.interval);
    if (rec.data.length) {
      await userWords.doc(rec.data[0]._id).update({
        data: { ease: s.ease, interval: s.interval, reps: s.reps, dueDate, lastReviewed: today }
      });
    } else {
      await userWords.add({
        data: { _openid: OPENID, wordId: a.wordId, ease: s.ease, interval: s.interval, reps: s.reps, dueDate, lastReviewed: today }
      });
    }
    earned += a.correct ? 2 : 0;
  }

  // 连续天数
  const streaks = db.collection('streaks');
  const st = await streaks.where({ _openid: OPENID }).get();
  let current = 0;
  let longest = 0;
  let lastDate = '';
  if (st.data.length) {
    current = st.data[0].current;
    longest = st.data[0].longest;
    lastDate = st.data[0].lastDate;
  }
  let streakBonus = 0;
  if (lastDate !== today) {
    const yest = addDays(today, -1);
    current = lastDate === yest ? current + 1 : 1;
    if (current % 7 === 0) streakBonus = 10; // 每满 7 天里程碑 +10
    longest = Math.max(longest, current);
    const data = { current, longest, lastDate: today };
    if (st.data.length) await streaks.doc(st.data[0]._id).update({ data });
    else await streaks.add({ data: Object.assign({ _openid: OPENID }, data) });
    earned += current + streakBonus;
  }

  // 积分账本 + 用户积分
  if (earned > 0) {
    await db.collection('pointsLedger').add({
      data: { _openid: OPENID, delta: earned, reason: 'study', date: today, createdAt: Date.now() }
    });
    await db.collection('users').where({ _openid: OPENID }).update({ data: { points: _.inc(earned) } });
  }

  // 每日记录
  const logs = db.collection('dailyLogs');
  const exist = await logs.where({ _openid: OPENID, date: today }).get();
  const correctCount = answers.filter((a) => a.correct).length;
  if (exist.data.length) {
    await logs.doc(exist.data[0]._id).update({
      data: {
        studiedCount: _.inc(answers.length),
        correctCount: _.inc(correctCount),
        durationSec: _.inc(durationSec),
        wordIds: _.push(answers.map((a) => a.wordId))
      }
    });
  } else {
    await logs.add({
      data: {
        _openid: OPENID,
        date: today,
        studiedCount: answers.length,
        correctCount,
        durationSec,
        wordIds: answers.map((a) => a.wordId)
      }
    });
  }

  // 返回最新状态
  const u = await db.collection('users').where({ _openid: OPENID }).get();
  const learned = await userWords.where({ _openid: OPENID, reps: _.gte(1) }).count();
  return {
    ok: true,
    data: {
      points: u.data.length ? u.data[0].points : 0,
      earned,
      streakCurrent: current,
      learnedTotal: learned.total
    }
  };
};
