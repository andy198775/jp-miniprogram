// utils/srs.js
// 简化版 SM-2 间隔重复算法，用于安排单词复习。
// 输入：当前 ease(难度系数,默认2.5)、interval(天)、reps(连续答对次数)、quality(0-5)
// 输出：新的 { ease, interval, reps, dueDate(距今天数) }
function schedule(ease, interval, reps, quality) {
  let nEase = ease || 2.5;
  let nInterval = interval || 0;
  let nReps = reps || 0;

  if (quality < 3) {
    // 答错：重置连对，进入重新学习
    nReps = 0;
    nInterval = 0;
  } else {
    nReps += 1;
    if (nReps === 1) nInterval = 1;
    else if (nReps === 2) nInterval = 6;
    else nInterval = Math.round(nInterval * nEase);
  }

  // 更新难度系数
  nEase = nEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nEase < 1.3) nEase = 1.3;

  return { ease: nEase, interval: nInterval, reps: nReps };
}

// quality 映射：答对=5，答错=2（既不苛责也不放水）
function qualityFromCorrect(isCorrect) {
  return isCorrect ? 5 : 2;
}

module.exports = { schedule, qualityFromCorrect };
