// data/kana.js
// 五十音图数据（儿童零基础入门用）
// 字段：k 平假名 | h 片假名 | r 罗马音 | type 类型（清音/浊音/半浊音/拗音）
// GROUPS 用于「图表浏览」；ALL 为扁平数组，用于「拼读练习」随机出题。
// 说明：本数据为公开日语基础知识整理，无版权风险，可直接使用。

const GROUPS = [
  {
    type: '清音',
    rows: [
      { label: 'あ', items: [
        { k: 'あ', h: 'ア', r: 'a' }, { k: 'い', h: 'イ', r: 'i' }, { k: 'う', h: 'ウ', r: 'u' }, { k: 'え', h: 'エ', r: 'e' }, { k: 'お', h: 'オ', r: 'o' }
      ] },
      { label: 'か', items: [
        { k: 'か', h: 'カ', r: 'ka' }, { k: 'き', h: 'キ', r: 'ki' }, { k: 'く', h: 'ク', r: 'ku' }, { k: 'け', h: 'ケ', r: 'ke' }, { k: 'こ', h: 'コ', r: 'ko' }
      ] },
      { label: 'さ', items: [
        { k: 'さ', h: 'サ', r: 'sa' }, { k: 'し', h: 'シ', r: 'shi' }, { k: 'す', h: 'ス', r: 'su' }, { k: 'せ', h: 'セ', r: 'se' }, { k: 'そ', h: 'ソ', r: 'so' }
      ] },
      { label: 'た', items: [
        { k: 'た', h: 'タ', r: 'ta' }, { k: 'ち', h: 'チ', r: 'chi' }, { k: 'つ', h: 'ツ', r: 'tsu' }, { k: 'て', h: 'テ', r: 'te' }, { k: 'と', h: 'ト', r: 'to' }
      ] },
      { label: 'な', items: [
        { k: 'な', h: 'ナ', r: 'na' }, { k: 'に', h: 'ニ', r: 'ni' }, { k: 'ぬ', h: 'ヌ', r: 'nu' }, { k: 'ね', h: 'ネ', r: 'ne' }, { k: 'の', h: 'ノ', r: 'no' }
      ] },
      { label: 'は', items: [
        { k: 'は', h: 'ハ', r: 'ha' }, { k: 'ひ', h: 'ヒ', r: 'hi' }, { k: 'ふ', h: 'フ', r: 'fu' }, { k: 'へ', h: 'ヘ', r: 'he' }, { k: 'ほ', h: 'ホ', r: 'ho' }
      ] },
      { label: 'ま', items: [
        { k: 'ま', h: 'マ', r: 'ma' }, { k: 'み', h: 'ミ', r: 'mi' }, { k: 'む', h: 'ム', r: 'mu' }, { k: 'め', h: 'メ', r: 'me' }, { k: 'も', h: 'モ', r: 'mo' }
      ] },
      { label: 'や', items: [
        { k: 'や', h: 'ヤ', r: 'ya' }, { empty: true }, { k: 'ゆ', h: 'ユ', r: 'yu' }, { empty: true }, { k: 'よ', h: 'ヨ', r: 'yo' }
      ] },
      { label: 'ら', items: [
        { k: 'ら', h: 'ラ', r: 'ra' }, { k: 'り', h: 'リ', r: 'ri' }, { k: 'る', h: 'ル', r: 'ru' }, { k: 'れ', h: 'レ', r: 're' }, { k: 'ろ', h: 'ロ', r: 'ro' }
      ] },
      { label: 'わ', items: [
        { k: 'わ', h: 'ワ', r: 'wa' }, { empty: true }, { empty: true }, { empty: true }, { k: 'を', h: 'ヲ', r: 'wo' }
      ] },
      { label: 'ん', items: [
        { k: 'ん', h: 'ン', r: 'n' }, { empty: true }, { empty: true }, { empty: true }, { empty: true }
      ] }
    ]
  },
  {
    type: '浊音',
    rows: [
      { label: 'か', items: [
        { k: 'が', h: 'ガ', r: 'ga' }, { k: 'ぎ', h: 'ギ', r: 'gi' }, { k: 'ぐ', h: 'グ', r: 'gu' }, { k: 'げ', h: 'ゲ', r: 'ge' }, { k: 'ご', h: 'ゴ', r: 'go' }
      ] },
      { label: 'さ', items: [
        { k: 'ざ', h: 'ザ', r: 'za' }, { k: 'じ', h: 'ジ', r: 'ji' }, { k: 'ず', h: 'ズ', r: 'zu' }, { k: 'ぜ', h: 'ゼ', r: 'ze' }, { k: 'ぞ', h: 'ゾ', r: 'zo' }
      ] },
      { label: 'た', items: [
        { k: 'だ', h: 'ダ', r: 'da' }, { k: 'ぢ', h: 'ヂ', r: 'ji' }, { k: 'づ', h: 'ヅ', r: 'zu' }, { k: 'で', h: 'デ', r: 'de' }, { k: 'ど', h: 'ド', r: 'do' }
      ] },
      { label: 'は', items: [
        { k: 'ば', h: 'バ', r: 'ba' }, { k: 'び', h: 'ビ', r: 'bi' }, { k: 'ぶ', h: 'ブ', r: 'bu' }, { k: 'べ', h: 'ベ', r: 'be' }, { k: 'ぼ', h: 'ボ', r: 'bo' }
      ] }
    ]
  },
  {
    type: '半浊音',
    rows: [
      { label: 'は', items: [
        { k: 'ぱ', h: 'パ', r: 'pa' }, { k: 'ぴ', h: 'ピ', r: 'pi' }, { k: 'ぷ', h: 'プ', r: 'pu' }, { k: 'ぺ', h: 'ペ', r: 'pe' }, { k: 'ぽ', h: 'ポ', r: 'po' }
      ] }
    ]
  },
  {
    type: '拗音',
    rows: [
      { label: 'き', items: [
        { k: 'きゃ', h: 'キャ', r: 'kya' }, { k: 'きゅ', h: 'キュ', r: 'kyu' }, { k: 'きょ', h: 'キョ', r: 'kyo' }
      ] },
      { label: 'し', items: [
        { k: 'しゃ', h: 'シャ', r: 'sha' }, { k: 'しゅ', h: 'シュ', r: 'shu' }, { k: 'しょ', h: 'ショ', r: 'sho' }
      ] },
      { label: 'ち', items: [
        { k: 'ちゃ', h: 'チャ', r: 'cha' }, { k: 'ちゅ', h: 'チュ', r: 'chu' }, { k: 'ちょ', h: 'チョ', r: 'cho' }
      ] },
      { label: 'に', items: [
        { k: 'にゃ', h: 'ニャ', r: 'nya' }, { k: 'にゅ', h: 'ニュ', r: 'nyu' }, { k: 'にょ', h: 'ニョ', r: 'nyo' }
      ] },
      { label: 'ひ', items: [
        { k: 'ひゃ', h: 'ヒャ', r: 'hya' }, { k: 'ひゅ', h: 'ヒュ', r: 'hyu' }, { k: 'ひょ', h: 'ヒョ', r: 'hyo' }
      ] },
      { label: 'み', items: [
        { k: 'みゃ', h: 'ミャ', r: 'mya' }, { k: 'みゅ', h: 'ミュ', r: 'myu' }, { k: 'みょ', h: 'ミョ', r: 'myo' }
      ] },
      { label: 'り', items: [
        { k: 'りゃ', h: 'リャ', r: 'rya' }, { k: 'りゅ', h: 'リュ', r: 'ryu' }, { k: 'りょ', h: 'リョ', r: 'ryo' }
      ] },
      { label: 'ぎ', items: [
        { k: 'ぎゃ', h: 'ギャ', r: 'gya' }, { k: 'ぎゅ', h: 'ギュ', r: 'gyu' }, { k: 'ぎょ', h: 'ギョ', r: 'gyo' }
      ] },
      { label: 'じ', items: [
        { k: 'じゃ', h: 'ジャ', r: 'ja' }, { k: 'じゅ', h: 'ジュ', r: 'ju' }, { k: 'じょ', h: 'ジョ', r: 'jo' }
      ] },
      { label: 'び', items: [
        { k: 'びゃ', h: 'ビャ', r: 'bya' }, { k: 'びゅ', h: 'ビュ', r: 'byu' }, { k: 'びょ', h: 'ビョ', r: 'byo' }
      ] },
      { label: 'ぴ', items: [
        { k: 'ぴゃ', h: 'ピャ', r: 'pya' }, { k: 'ぴゅ', h: 'ピュ', r: 'pyu' }, { k: 'ぴょ', h: 'ピョ', r: 'pyo' }
      ] }
    ]
  }
];

// 扁平化（用于测验随机出题）
const ALL = [];
GROUPS.forEach((g) => {
  g.rows.forEach((row) => {
    row.items.forEach((it) => {
      if (!it.empty) ALL.push({ k: it.k, h: it.h, r: it.r, type: g.type });
    });
  });
});

module.exports = { GROUPS, ALL };
