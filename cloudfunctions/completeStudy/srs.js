// 简化版 SM-2 间隔重复算法（与前端 utils/srs.js 同构）
function schedule(ease, interval, reps, quality) {
  let nEase = ease || 2.5;
  let nInterval = interval || 0;
  let nReps = reps || 0;

  if (quality < 3) {
    nReps = 0;
    nInterval = 0;
  } else {
    nReps += 1;
    if (nReps === 1) nInterval = 1;
    else if (nReps === 2) nInterval = 6;
    else nInterval = Math.round(nInterval * nEase);
  }

  nEase = nEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nEase < 1.3) nEase = 1.3;

  return { ease: nEase, interval: nInterval, reps: nReps };
}

module.exports = { schedule };
