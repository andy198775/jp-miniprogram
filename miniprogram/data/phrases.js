// data/phrases.js
// 日语常用语（儿童零基础友好版）
// 字段：id 序号 | jp 假名 | roma 罗马音 | cn 中文 | cat 场景分类
// 说明：日常高频用语，适合学完五十音图后作为「开口说」的素材。首发可直接用。

const PHRASES = [
  // —— 问候 ——
  { id: 1, jp: 'こんにちは', roma: 'konnichiwa', cn: '你好', cat: '问候' },
  { id: 2, jp: 'おはよう', roma: 'ohayou', cn: '早上好', cat: '问候' },
  { id: 3, jp: 'こんばんは', roma: 'konbanwa', cn: '晚上好', cat: '问候' },
  { id: 4, jp: 'おやすみなさい', roma: 'oyasuminasai', cn: '晚安', cat: '问候' },
  { id: 5, jp: 'さようなら', roma: 'sayounara', cn: '再见', cat: '问候' },

  // —— 礼貌 ——
  { id: 6, jp: 'ありがとう', roma: 'arigatou', cn: '谢谢', cat: '礼貌' },
  { id: 7, jp: 'すみません', roma: 'sumimasen', cn: '对不起 / 打扰了', cat: '礼貌' },
  { id: 8, jp: 'どういたしまして', roma: 'douitashimashite', cn: '不客气', cat: '礼貌' },
  { id: 9, jp: 'はい', roma: 'hai', cn: '是 / 好的', cat: '礼貌' },
  { id: 10, jp: 'いいえ', roma: 'iie', cn: '不 / 不是', cat: '礼貌' },

  // —— 用餐 ——
  { id: 11, jp: 'いただきます', roma: 'itadakimasu', cn: '我开动了', cat: '用餐' },
  { id: 12, jp: 'ごちそうさま', roma: 'gochisousama', cn: '我吃好了', cat: '用餐' },
  { id: 13, jp: 'おいしい', roma: 'oishii', cn: '好吃', cat: '用餐' },
  { id: 14, jp: 'たべる', roma: 'taberu', cn: '吃', cat: '用餐' },
  { id: 15, jp: 'のむ', roma: 'nomu', cn: '喝', cat: '用餐' },

  // —— 称呼 ——
  { id: 16, jp: 'おかあさん', roma: 'okaasan', cn: '妈妈', cat: '称呼' },
  { id: 17, jp: 'おとうさん', roma: 'otousan', cn: '爸爸', cat: '称呼' },
  { id: 18, jp: 'おねえさん', roma: 'oneesan', cn: '姐姐', cat: '称呼' },
  { id: 19, jp: 'おにいさん', roma: 'oniisan', cn: '哥哥', cat: '称呼' },
  { id: 20, jp: 'せんせい', roma: 'sensei', cn: '老师', cat: '称呼' },
  { id: 21, jp: 'ともだち', roma: 'tomodachi', cn: '朋友', cat: '称呼' },

  // —— 情绪 / 状态 ——
  { id: 22, jp: 'げんき', roma: 'genki', cn: '精神 / 健康', cat: '情绪' },
  { id: 23, jp: 'たのしい', roma: 'tanoshii', cn: '开心', cat: '情绪' },
  { id: 24, jp: 'すき', roma: 'suki', cn: '喜欢', cat: '情绪' },
  { id: 25, jp: 'かなしい', roma: 'kanashii', cn: '难过', cat: '情绪' },

  // —— 常用表达 ——
  { id: 26, jp: 'なに', roma: 'nani', cn: '什么', cat: '常用' },
  { id: 27, jp: 'いま', roma: 'ima', cn: '现在', cat: '常用' },
  { id: 28, jp: 'いきます', roma: 'ikimasu', cn: '去', cat: '常用' },
  { id: 29, jp: 'ききます', roma: 'kikimasu', cn: '听 / 问', cat: '常用' },
  { id: 30, jp: 'わかります', roma: 'wakarimasu', cn: '我懂了', cat: '常用' },
  { id: 31, jp: 'だいじょうぶ', roma: 'daijoubu', cn: '没关系 / 没事', cat: '常用' },
  { id: 32, jp: 'がんばって', roma: 'ganbatte', cn: '加油', cat: '常用' }
];

module.exports = { PHRASES };
