// data/achievements.js
// 成就定义 + 计算，与数据层解耦：只接收 progress 快照计算 got。
// 触发与持久化在 utils/dataService.js 的 completeStudy 中完成（基于 learnedTotal / streakCurrent / everAllCorrect 累计值）。
const ACHIEVEMENTS = [
  { id: 'first',    name: '初次启程', desc: '完成第一次学习',   icon: '🌱' },
  { id: 'ten',      name: '初学乍练', desc: '学会 10 个词',      icon: '📘' },
  { id: 'fifty',    name: '小有积累', desc: '学会 50 个词',      icon: '📗' },
  { id: 'ninety',   name: '百词达成', desc: '学会 90 个词',      icon: '🏆' },
  { id: 'perfect',  name: '全对王',   desc: '一次学习全部答对', icon: '⭐' },
  { id: 'streak3',  name: '坚持 3 天', desc: '连续打卡 3 天',    icon: '🔥' },
  { id: 'streak7',  name: '一周不断', desc: '连续打卡 7 天',    icon: '🌟' },
  { id: 'streak15', name: '半月达人', desc: '连续打卡 15 天',   icon: '💎' },
  { id: 'streak30', name: '月度之星', desc: '连续打卡 30 天',   icon: '👑' },
  { id: 'speak1',  name: '勇敢开口', desc: '完成第一次跟读',   icon: '🎤' },
  { id: 'speak10', name: '小百灵',   desc: '跟读读对 10 次',   icon: '🐦' }
];

function computeAch(p) {
  p = p || {};
  const learned = p.learnedTotal || 0;
  const streak = p.streakCurrent || 0;
  const everPerfect = !!p.everAllCorrect;
  const speakAttempts = p.speakAttempts || 0;
  const speakCorrect = p.speakCorrect || 0;
  return ACHIEVEMENTS.map((a) => {
    let got = false;
    switch (a.id) {
      case 'first':    got = learned >= 1; break;
      case 'ten':      got = learned >= 10; break;
      case 'fifty':    got = learned >= 50; break;
      case 'ninety':   got = learned >= 90; break;
      case 'perfect':  got = everPerfect; break;
      case 'streak3':  got = streak >= 3; break;
      case 'streak7':  got = streak >= 7; break;
      case 'streak15': got = streak >= 15; break;
      case 'streak30': got = streak >= 30; break;
      case 'speak1':   got = speakAttempts >= 1; break;
      case 'speak10':  got = speakCorrect >= 10; break;
    }
    return Object.assign({}, a, { got });
  });
}

module.exports = { ACHIEVEMENTS, computeAch };
