// data/words.js
// N5 词库（儿童零基础友好版）
// 筛选原则：具体、生活化、孩子日常能接触；从数字/颜色/家人起步，逐步到动物/食物/动作/学校。
// 字段：id 序号 | kana 假名（发音用，TTS 以假名为准避免汉字误读）| kanji 汉字（可空）| roma 罗马音 | cn 中文 | cat 分类 | ex 例句(日->中)
// 说明：本词库为自行整理，首发可直接用；正式商用建议替换为采购的正版词库（避免版权风险）。
// 每日新词目标 NEW_PER_DAY，按顺序取出未学过的词；复习由 SM-2 调度。

const WORDS = [
  // —— 打招呼 ——
  { id: 1, kana: 'こんにちは', kanji: '', roma: 'konnichiwa', cn: '你好', cat: '问候', ex: 'こんにちは、ともだち。/ 你好，朋友。' },
  { id: 2, kana: 'おはよう', kanji: '', roma: 'ohayou', cn: '早上好', cat: '问候', ex: 'おはよう、おかあさん。/ 早安，妈妈。' },
  { id: 3, kana: 'ありがとう', kanji: '', roma: 'arigatou', cn: '谢谢', cat: '问候', ex: 'ありがとう、おとうさん。/ 谢谢，爸爸。' },
  { id: 4, kana: 'さようなら', kanji: '', roma: 'sayounara', cn: '再见', cat: '问候', ex: 'さようなら、ともだち。/ 再见，朋友。' },

  // —— 数字 0-10 ——
  { id: 5, kana: 'ゼロ', kanji: '0', roma: 'zero', cn: '零', cat: '数字', ex: 'ゼロです。/ 是零。' },
  { id: 6, kana: 'いち', kanji: '1', roma: 'ichi', cn: '一', cat: '数字', ex: 'いち、に、さん。/ 一、二、三。' },
  { id: 7, kana: 'に', kanji: '2', roma: 'ni', cn: '二', cat: '数字', ex: 'りんごは に こ。/ 苹果有两个。' },
  { id: 8, kana: 'さん', kanji: '3', roma: 'san', cn: '三', cat: '数字', ex: 'さん びきの ねこ。/ 三只猫。' },
  { id: 9, kana: 'よん', kanji: '4', roma: 'yon', cn: '四', cat: '数字', ex: 'よん さつ。/ 四本。' },
  { id: 10, kana: 'ご', kanji: '5', roma: 'go', cn: '五', cat: '数字', ex: 'ご こ。/ 五个。' },
  { id: 11, kana: 'ろく', kanji: '6', roma: 'roku', cn: '六', cat: '数字', ex: 'むいか / ろく。/ 六。' },
  { id: 12, kana: 'なな', kanji: '7', roma: 'nana', cn: '七', cat: '数字', ex: 'なな つ。/ 七个。' },
  { id: 13, kana: 'はち', kanji: '8', roma: 'hachi', cn: '八', cat: '数字', ex: 'はち ひき。/ 八只。' },
  { id: 14, kana: 'きゅう', kanji: '9', roma: 'kyuu', cn: '九', cat: '数字', ex: 'きゅう まい。/ 九张。' },
  { id: 15, kana: 'じゅう', kanji: '10', roma: 'juu', cn: '十', cat: '数字', ex: 'じゅう こ。/ 十个。' },

  // —— 颜色 ——
  { id: 16, kana: 'あか', kanji: '赤', roma: 'aka', cn: '红色', cat: '颜色', ex: 'あかい りんご。/ 红苹果。' },
  { id: 17, kana: 'あお', kanji: '青', roma: 'ao', cn: '蓝色', cat: '颜色', ex: 'あおい そら。/ 蓝蓝的天。' },
  { id: 18, kana: 'きいろ', kanji: '黄色', roma: 'kiiro', cn: '黄色', cat: '颜色', ex: 'きいろい バナナ。/ 黄香蕉。' },
  { id: 19, kana: 'しろ', kanji: '白', roma: 'shiro', cn: '白色', cat: '颜色', ex: 'しろい うさぎ。/ 白兔子。' },
  { id: 20, kana: 'くろ', kanji: '黒', roma: 'kuro', cn: '黑色', cat: '颜色', ex: 'くろい ねこ。/ 黑猫。' },
  { id: 21, kana: 'みどり', kanji: '緑', roma: 'midori', cn: '绿色', cat: '颜色', ex: 'みどりの き。/ 绿树。' },
  { id: 22, kana: 'ピンク', kanji: '', roma: 'pinku', cn: '粉色', cat: '颜色', ex: 'ピンクの はな。/ 粉色的花。' },

  // —— 家人 ——
  { id: 23, kana: 'わたし', kanji: '私', roma: 'watashi', cn: '我', cat: '家人', ex: 'わたしは がくせい。/ 我是学生。' },
  { id: 24, kana: 'おとうさん', kanji: 'お父さん', roma: 'otousan', cn: '爸爸', cat: '家人', ex: 'おとうさん、ありがとう。/ 爸爸，谢谢。' },
  { id: 25, kana: 'おかあさん', kanji: 'お母さん', roma: 'okaasan', cn: '妈妈', cat: '家人', ex: 'おかあさんが すき。/ 喜欢妈妈。' },
  { id: 26, kana: 'おにいさん', kanji: 'お兄さん', roma: 'oniisan', cn: '哥哥', cat: '家人', ex: 'おにいさんと あそぶ。/ 和哥哥玩。' },
  { id: 27, kana: 'おねえさん', kanji: 'お姉さん', roma: 'oneesan', cn: '姐姐', cat: '家人', ex: 'おねえさんは やさしい。/ 姐姐很温柔。' },
  { id: 28, kana: 'いもうと', kanji: '妹', roma: 'imouto', cn: '妹妹', cat: '家人', ex: 'いもうとが いる。/ 有妹妹。' },
  { id: 29, kana: 'おじいさん', kanji: '祖父', roma: 'ojiisan', cn: '爷爷', cat: '家人', ex: 'おじいさんは げんき。/ 爷爷很精神。' },
  { id: 30, kana: 'おばあさん', kanji: '祖母', roma: 'obaasan', cn: '奶奶', cat: '家人', ex: 'おばあさんの うち。/ 奶奶家。' },

  // —— 动物 ——
  { id: 31, kana: 'ねこ', kanji: '猫', roma: 'neko', cn: '猫', cat: '动物', ex: 'ねこが かわいい。/ 猫很可爱。' },
  { id: 32, kana: 'いぬ', kanji: '犬', roma: 'inu', cn: '狗', cat: '动物', ex: 'いぬと あるく。/ 和狗散步。' },
  { id: 33, kana: 'うさぎ', kanji: '', roma: 'usagi', cn: '兔子', cat: '动物', ex: 'うさぎは はやい。/ 兔子很快。' },
  { id: 34, kana: 'とり', kanji: '鳥', roma: 'tori', cn: '鸟', cat: '动物', ex: 'とりが うたう。/ 鸟在唱歌。' },
  { id: 35, kana: 'さかな', kanji: '魚', roma: 'sakana', cn: '鱼', cat: '动物', ex: 'さかなを みる。/ 看鱼。' },
  { id: 36, kana: 'ぞう', kanji: '象', roma: 'zou', cn: '大象', cat: '动物', ex: 'ぞうは おおきい。/ 大象很大。' },
  { id: 37, kana: 'きりん', kanji: '', roma: 'kirin', cn: '长颈鹿', cat: '动物', ex: 'きりんの くび。/ 长颈鹿的脖子。' },
  { id: 38, kana: 'らいおん', kanji: '', roma: 'raion', cn: '狮子', cat: '动物', ex: 'らいおんは つよい。/ 狮子很强。' },
  { id: 39, kana: 'ぱんだ', kanji: '', roma: 'panda', cn: '熊猫', cat: '动物', ex: 'ぱんだが すき。/ 喜欢熊猫。' },
  { id: 40, kana: 'くま', kanji: '熊', roma: 'kuma', cn: '熊', cat: '动物', ex: 'くまは ふとる。/ 熊会变胖。' },

  // —— 食物 ——
  { id: 41, kana: 'りんご', kanji: '', roma: 'ringo', cn: '苹果', cat: '食物', ex: 'りんごを たべる。/ 吃苹果。' },
  { id: 42, kana: 'みかん', kanji: '', roma: 'mikan', cn: '橘子', cat: '食物', ex: 'みかんは あまい。/ 橘子很甜。' },
  { id: 43, kana: 'バナナ', kanji: '', roma: 'banana', cn: '香蕉', cat: '食物', ex: 'バナナを たべる。/ 吃香蕉。' },
  { id: 44, kana: 'ごはん', kanji: 'ご飯', roma: 'gohan', cn: '饭', cat: '食物', ex: 'ごはんを たべる。/ 吃饭。' },
  { id: 45, kana: 'パン', kanji: '', roma: 'pan', cn: '面包', cat: '食物', ex: 'パンが すき。/ 喜欢面包。' },
  { id: 46, kana: 'たまご', kanji: '卵', roma: 'tamago', cn: '蛋', cat: '食物', ex: 'たまごを たべる。/ 吃蛋。' },
  { id: 47, kana: 'みず', kanji: '水', roma: 'mizu', cn: '水', cat: '食物', ex: 'みずを のむ。/ 喝水。' },
  { id: 48, kana: 'おちゃ', kanji: 'お茶', roma: 'ocha', cn: '茶', cat: '食物', ex: 'おちゃを のむ。/ 喝茶。' },
  { id: 49, kana: 'あいす', kanji: 'アイス', roma: 'aisu', cn: '冰激凌', cat: '食物', ex: 'あいすを たべる。/ 吃冰激凌。' },

  // —— 身体 ——
  { id: 50, kana: 'あたま', kanji: '頭', roma: 'atama', cn: '头', cat: '身体', ex: 'あたまが いたい。/ 头疼。' },
  { id: 51, kana: 'め', kanji: '目', roma: 'me', cn: '眼睛', cat: '身体', ex: 'めを とじる。/ 闭上眼睛。' },
  { id: 52, kana: 'みみ', kanji: '耳', roma: 'mimi', cn: '耳朵', cat: '身体', ex: 'みみで きく。/ 用耳朵听。' },
  { id: 53, kana: 'はな', kanji: '鼻', roma: 'hana', cn: '鼻子', cat: '身体', ex: 'はなが つまる。/ 鼻子堵了。' },
  { id: 54, kana: 'くち', kanji: '口', roma: 'kuchi', cn: '嘴', cat: '身体', ex: 'くちを あける。/ 张开嘴。' },
  { id: 55, kana: 'て', kanji: '手', roma: 'te', cn: '手', cat: '身体', ex: 'てで かく。/ 用手写。' },
  { id: 56, kana: 'あし', kanji: '足', roma: 'ashi', cn: '脚', cat: '身体', ex: 'あしで あるく。/ 用脚走。' },

  // —— 动作动词（辞书形） ——
  { id: 57, kana: 'たべる', kanji: '食べる', roma: 'taberu', cn: '吃', cat: '动词', ex: 'りんごを たべる。/ 吃苹果。' },
  { id: 58, kana: 'のむ', kanji: '飲む', roma: 'nomu', cn: '喝', cat: '动词', ex: 'みずを のむ。/ 喝水。' },
  { id: 59, kana: 'みる', kanji: '見る', roma: 'miru', cn: '看', cat: '动词', ex: 'ほんを みる。/ 看书。' },
  { id: 60, kana: 'きく', kanji: '聞く', roma: 'kiku', cn: '听', cat: '动词', ex: 'おんがくを きく。/ 听音乐。' },
  { id: 61, kana: 'いく', kanji: '行く', roma: 'iku', cn: '去', cat: '动词', ex: 'がっこうへ いく。/ 去学校。' },
  { id: 62, kana: 'くる', kanji: '来る', roma: 'kuru', cn: '来', cat: '动词', ex: 'ともだちが くる。/ 朋友来。' },
  { id: 63, kana: 'ねる', kanji: '寝る', roma: 'neru', cn: '睡', cat: '动词', ex: 'はやく ねる。/ 早点睡。' },
  { id: 64, kana: 'おきる', kanji: '起きる', roma: 'okiru', cn: '起床', cat: '动词', ex: 'あさ おきる。/ 早上起床。' },
  { id: 65, kana: 'あそぶ', kanji: '遊ぶ', roma: 'asobu', cn: '玩', cat: '动词', ex: 'こうえんて あそぶ。/ 在公园玩。' },
  { id: 66, kana: 'はなす', kanji: '話す', roma: 'hanasu', cn: '说', cat: '动词', ex: 'にほんごで はなす。/ 用日语说。' },
  { id: 67, kana: 'よむ', kanji: '読む', roma: 'yomu', cn: '读', cat: '动词', ex: 'ほんを よむ。/ 读书。' },
  { id: 68, kana: 'かく', kanji: '書く', roma: 'kaku', cn: '写', cat: '动词', ex: 'じを かく。/ 写字。' },

  // —— 形容词 ——
  { id: 69, kana: 'おおきい', kanji: '大きい', roma: 'ookii', cn: '大的', cat: '形容词', ex: 'おおきい いぬ。/ 大狗。' },
  { id: 70, kana: 'ちいさい', kanji: '小さい', roma: 'chiisai', cn: '小的', cat: '形容词', ex: 'ちいさい ねこ。/ 小猫。' },
  { id: 71, kana: 'あたらしい', kanji: '新しい', roma: 'atarashii', cn: '新的', cat: '形容词', ex: 'あたらしい ほん。/ 新书。' },
  { id: 72, kana: 'ふるい', kanji: '古い', roma: 'furui', cn: '旧的', cat: '形容词', ex: 'ふるい えんぴつ。/ 旧铅笔。' },
  { id: 73, kana: 'あつい', kanji: '暑い', roma: 'atsui', cn: '热', cat: '形容词', ex: 'なつは あつい。/ 夏天热。' },
  { id: 74, kana: 'さむい', kanji: '寒い', roma: 'samui', cn: '冷', cat: '形容词', ex: 'ふゆは さむい。/ 冬天冷。' },
  { id: 75, kana: 'おいしい', kanji: '', roma: 'oishii', cn: '好吃', cat: '形容词', ex: 'ごはんが おいしい。/ 饭很好吃。' },
  { id: 76, kana: 'すき', kanji: '好き', roma: 'suki', cn: '喜欢', cat: '形容词', ex: 'ねこが すき。/ 喜欢猫。' },

  // —— 学校 / 时间 ——
  { id: 77, kana: 'ほん', kanji: '本', roma: 'hon', cn: '书', cat: '学校', ex: 'ほんを よむ。/ 读书。' },
  { id: 78, kana: 'えんぴつ', kanji: '鉛筆', roma: 'enpitsu', cn: '铅笔', cat: '学校', ex: 'えんぴつで かく。/ 用铅笔写。' },
  { id: 79, kana: 'がっこう', kanji: '学校', roma: 'gakkou', cn: '学校', cat: '学校', ex: 'がっこうへ いく。/ 去学校。' },
  { id: 80, kana: 'せんせい', kanji: '先生', roma: 'sensei', cn: '老师', cat: '学校', ex: 'せんせいが いい。/ 老师很好。' },
  { id: 81, kana: 'ともだち', kanji: '友達', roma: 'tomodachi', cn: '朋友', cat: '学校', ex: 'ともだちと あそぶ。/ 和朋友玩。' },
  { id: 82, kana: 'きょう', kanji: '今日', roma: 'kyou', cn: '今天', cat: '时间', ex: 'きょうは いいてんき。/ 今天天气好。' },
  { id: 83, kana: 'あした', kanji: '明日', roma: 'ashita', cn: '明天', cat: '时间', ex: 'あした がっこう。/ 明天上学。' },
  { id: 84, kana: 'あさ', kanji: '朝', roma: 'asa', cn: '早上', cat: '时间', ex: 'あさ おきる。/ 早上起床。' },
  { id: 85, kana: 'ばん', kanji: '晩', roma: 'ban', cn: '晚上', cat: '时间', ex: 'ばん ねる。/ 晚上睡。' },

  // —— 常用物品 ——
  { id: 86, kana: 'つくえ', kanji: '机', roma: 'tsukue', cn: '桌子', cat: '物品', ex: 'つくえで かく。/ 在桌上写。' },
  { id: 87, kana: 'いす', kanji: '椅子', roma: 'isu', cn: '椅子', cat: '物品', ex: 'いすに すわる。/ 坐在椅子上。' },
  { id: 88, kana: 'どあ', kanji: 'ドア', roma: 'doa', cn: '门', cat: '物品', ex: 'どあを しめる。/ 关门。' },
  { id: 89, kana: 'まど', kanji: '窓', roma: 'mado', cn: '窗户', cat: '物品', ex: 'まどを あける。/ 开窗。' },
  { id: 90, kana: 'えんそう', kanji: '', roma: 'ensou', cn: '演奏/音乐', cat: '物品', ex: 'おんがくを きく。/ 听音乐。' }
];

// 每日新学词数量
const NEW_PER_DAY = 8;

module.exports = { WORDS, NEW_PER_DAY };
