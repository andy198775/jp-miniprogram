// utils/quiz.js
// 题型多样化：学习(learn) / 复习(review) 共用的题目生成器。
// 零失败设计延续：答错只能"再试一次"（不惩罚、不扣分），答对才进入下一题。
//
// 题型一览（每个 session 由 assignTypes 打乱后轮转分配，覆盖均匀、相邻题不同型）：
//   listen-cn    听音选义      播放发音 → 选中文释义
//   word-cn      看词选义      显示假名/汉字 → 选中文释义
//   listen-kana  听音选词      播放发音 → 选出听到的假名
//   word-roma    看词选罗马音  显示假名 → 选正确罗马音
//   kana-blank   拼假名        单词缺一个假名 → 选出缺的假名
//   ex-blank     例句填空      例句中目标词挖空 → 选词补全
//
// 兼容性：个别词不适合某题型时自动回退（单假名词不挖空、例句不含本词不填空），
// 保证任何词都能出题。
const { WORDS } = require('../data/words.js');

const TYPES = ['listen-cn', 'word-cn', 'listen-kana', 'word-roma', 'kana-blank', 'ex-blank'];

// 题型问句（孩子能看懂的说法）
const ASK = {
  'listen-cn': '听发音，选意思',
  'word-cn': '选一选它的意思',
  'listen-kana': '听到哪个词？点一点',
  'word-roma': '选出正确的读音（罗马音）',
  'kana-blank': '补上缺少的假名',
  'ex-blank': '选出括号里的词'
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 全部假名用到过的单字（拼假名题的干扰项池）
const ALL_CHARS = (() => {
  const set = new Set();
  WORDS.forEach((w) => Array.from(w.kana).forEach((c) => set.add(c)));
  return Array.from(set);
})();

// 从词库取 n 个与 value 不同的干扰值（去重）
function distract(field, value, n) {
  const seen = new Set([value]);
  const out = [];
  for (const w of shuffle(WORDS)) {
    const v = w[field];
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
      if (out.length >= n) break;
    }
  }
  return out;
}

// 取 n 个与 ch 不同的单假名干扰字
function distractChar(ch, n) {
  return shuffle(ALL_CHARS.filter((c) => c !== ch)).slice(0, n);
}

// 例句日语句部分：'日文。/ 中文。' → '日文。'
function jpSentence(ex) {
  if (!ex) return '';
  const i = ex.indexOf('/ ');
  return i >= 0 ? ex.slice(0, i + 1) : ex;
}

// 某词是否适合出某种题型（不适合则回退）
function typeOk(word, type) {
  if (type === 'kana-blank') return Array.from(word.kana).length >= 2;
  if (type === 'ex-blank') {
    const s = jpSentence(word.ex);
    return s.indexOf(word.kana) >= 0 && s.indexOf('。') >= 0;
  }
  return true;
}

// 为一个 session 的词序列分配题型：打乱后轮转，无效题型回退到随机可用题型
function assignTypes(words) {
  const seq = [];
  while (seq.length < words.length) seq.push(...shuffle(TYPES));
  return words.map((w, i) => {
    let t = seq[i];
    if (!typeOk(w, t)) {
      const valid = TYPES.filter((x) => typeOk(w, x));
      t = valid[Math.floor(Math.random() * valid.length)] || 'word-cn';
    }
    return t;
  });
}

// 生成一道题。返回：
//   { word, type, ask, options, answer, audioText, showWord, blankKana, sentence }
//   audioText 非空 → 页面应自动播放；showWord → 卡片显示假名/汉字
function buildQuestion(word, type) {
  const q = {
    word,
    type,
    ask: ASK[type] || ASK['word-cn'],
    options: [],
    answer: '',
    audioText: '',
    showWord: false,
    blankKana: '',
    sentence: ''
  };

  if (type === 'listen-cn') {
    q.audioText = word.kana;
    q.options = shuffle([word.cn].concat(distract('cn', word.cn, 3)));
    q.answer = word.cn;
  } else if (type === 'word-cn') {
    q.showWord = true;
    q.options = shuffle([word.cn].concat(distract('cn', word.cn, 3)));
    q.answer = word.cn;
  } else if (type === 'listen-kana') {
    q.audioText = word.kana;
    q.options = shuffle([word.kana].concat(distract('kana', word.kana, 3)));
    q.answer = word.kana;
  } else if (type === 'word-roma') {
    q.showWord = true;
    q.options = shuffle([word.roma].concat(distract('roma', word.roma, 3)));
    q.answer = word.roma;
  } else if (type === 'kana-blank') {
    const chars = Array.from(word.kana);
    const pos = Math.floor(Math.random() * chars.length);
    const miss = chars[pos];
    q.blankKana = chars.map((c, i) => (i === pos ? '＿' : c)).join('');
    q.options = shuffle([miss].concat(distractChar(miss, 3)));
    q.answer = miss;
  } else if (type === 'ex-blank') {
    q.sentence = jpSentence(word.ex).replace(word.kana, '＿＿＿');
    q.options = shuffle([word.kana].concat(distract('kana', word.kana, 3)));
    q.answer = word.kana;
  } else {
    // 未知题型兜底：看词选义
    q.type = 'word-cn';
    q.showWord = true;
    q.options = shuffle([word.cn].concat(distract('cn', word.cn, 3)));
    q.answer = word.cn;
  }
  return q;
}

module.exports = { TYPES, ASK, assignTypes, buildQuestion, typeOk };
