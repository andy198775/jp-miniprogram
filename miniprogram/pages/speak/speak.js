// pages/speak/speak.js
// 「跟我读」语音评测：听示范 → 录音 → 自动/手动判断 → 下一词
// 自动判断依赖 ASR：正式账号走微信同声传译插件（getRecognitionManager）；
// 测试号可配置本地代理 tools/asr_proxy.js（recognizeByProxy）；都没有则降级为「回放 + 自判」。
const audio = require('../../utils/audio.js');
const dataService = require('../../utils/dataService.js');
const { ALL } = require('../../data/kana.js');
const { WORDS } = require('../../data/words.js');

// 跟读目标池：全部单假名 + 短词（kana 长度 ≤ 3，便于儿童开口）
const POOL = [];
const seen = new Set();
ALL.forEach((it) => {
  if (!seen.has(it.k)) { seen.add(it.k); POOL.push({ text: it.k, roma: it.r, type: '假名' }); }
});
WORDS.forEach((w) => {
  if (!seen.has(w.kana) && w.kana.length <= 3) {
    seen.add(w.kana); POOL.push({ text: w.kana, roma: w.roma, type: '单词' });
  }
});

function normalize(s) {
  return (s || '').replace(/[\s　、。.,!?！？]/g, '').toLowerCase();
}

Page({
  data: {
    target: '',
    roma: '',
    typeLabel: '',
    recording: false,
    showResult: false,
    result: null, // { ok: bool|null, heard, msg }
    attempts: 0,
    correct: 0,
    modeText: '',
    childAudio: ''
  },

  onLoad() {
    const proxy = wx.getStorageSync('jp_asr_proxy') || '';
    if (proxy) audio.setAsrProxy(proxy);
    const mgr = audio.getRecognitionManager();
    this.recogMode = mgr ? 'plugin' : (proxy ? 'proxy' : 'manual');
    this._mgr = mgr;
    this.rm = null;
    const modeText = this.recogMode === 'plugin'
      ? '自动评测（语音识别）'
      : (this.recogMode === 'proxy' ? '自动评测（本地代理）' : '练习模式（家长辅助判断）');
    this.setData({ modeText });
    // 读历史计数
    const p = wx.getStorageSync('jp_speak_local') || { attempts: 0, correct: 0 };
    this.setData({ attempts: p.attempts || 0, correct: p.correct || 0 });
    this.nextWord();
  },

  onUnload() {
    if (this.data.recording) {
      try { this.recogMode === 'plugin' ? this._mgr.stop() : this.rm && this.rm.stop(); } catch (e) {}
    }
  },

  nextWord() {
    const item = POOL[Math.floor(Math.random() * POOL.length)];
    this.setData({
      target: item.text,
      roma: item.roma,
      typeLabel: item.type,
      recording: false,
      showResult: false,
      result: null,
      childAudio: ''
    });
  },

  playDemo() {
    if (this.data.target) audio.speak(this.data.target);
  },

  toggleRecord() {
    if (this.data.recording) this.stopRecord();
    else this.startRecord();
  },

  startRecord() {
    this.setData({ recording: true, showResult: false, result: null });
    if (this.recogMode === 'plugin') {
      const mgr = this._mgr;
      mgr.onStart = () => {};
      mgr.onError = () => {
        this.setData({ recording: false });
        wx.showToast({ title: '录音出错，已切到练习模式', icon: 'none' });
        this.recogMode = 'manual';
        this.setData({ modeText: '练习模式（家长辅助判断）' });
        this.fallbackToManual();
      };
      mgr.onRecognize = () => {};
      mgr.onStop = (res) => {
        this.setData({ recording: false });
        const heard = (res && res.result) ? res.result : '';
        this.judge(heard);
      };
      mgr.start({ lang: 'ja_JP', duration: 8000 });
    } else {
      if (!this.rm) {
        this.rm = wx.getRecorderManager();
        this.rm.onStop((res) => this.onRecStop(res));
        this.rm.onError(() => {
          this.setData({ recording: false });
          wx.showToast({ title: '录音出错', icon: 'none' });
        });
      }
      this.rm.start({ duration: 8000, format: 'mp3', sampleRate: 16000, numberOfChannels: 1, encodeBitRate: 48000 });
    }
  },

  stopRecord() {
    try {
      if (this.recogMode === 'plugin') this._mgr.stop();
      else this.rm && this.rm.stop();
    } catch (e) {}
  },

  onRecStop(res) {
    this.setData({ recording: false });
    const fp = res.tempFilePath;
    if (this.recogMode === 'proxy') {
      const fs = wx.getFileSystemManager();
      fs.readFile({
        filePath: fp,
        encoding: 'base64',
        success: (r) => {
          audio.recognizeByProxy(r.data, 'mp3')
            .then((heard) => this.judge(heard))
            .catch(() => { this.setData({ childAudio: fp }); this.fallbackToManual(); });
        },
        fail: () => { this.setData({ childAudio: fp }); this.fallbackToManual(); }
      });
    } else {
      this.setData({ childAudio: fp });
      this.fallbackToManual();
    }
  },

  // 降级：无法自动识别时，回放孩子录音 + 自判按钮
  fallbackToManual() {
    if (this.data.showResult && this.data.result && this.data.result.ok !== null) return; // 已有结果则不打断
    this.setData({
      showResult: true,
      result: { ok: null, heard: '', msg: '听听你刚才读的，点下面判断一下吧~' }
    });
  },

  judge(heard) {
    const t = normalize(this.data.target);
    const h = normalize(heard);
    let ok = false;
    let msg = '';
    if (!h) {
      msg = '没听清哦，再试一次~';
    } else if (h === t) {
      ok = true;
      msg = '完璧（かんぺき）！读得真准 🎉';
    } else if (h.indexOf(t) >= 0 || t.indexOf(h) >= 0) {
      ok = true;
      msg = '很接近啦，棒棒哒 🌟';
    } else {
      msg = '听到了「' + heard + '」，再听示范跟一次试试 💪';
    }
    this.setData({ showResult: true, result: { ok, heard, msg } });
    audio.speak(ok ? 'すごい' : 'がんばって');
    this.recordResult(ok);
  },

  manualJudge(e) {
    const ok = e.currentTarget.dataset.ok === '1';
    this.setData({
      showResult: true,
      result: { ok, heard: this.data.result ? this.data.result.heard : '', msg: ok ? '你真棒 👍' : '再试一次，你可以的 💪' }
    });
    audio.speak(ok ? 'すごい' : 'がんばって');
    this.recordResult(ok);
  },

  recordResult(ok) {
    const attempts = this.data.attempts + 1;
    const correct = this.data.correct + (ok ? 1 : 0);
    this.setData({ attempts, correct });
    wx.setStorageSync('jp_speak_local', { attempts, correct });
    dataService.call('speak', { correct: ok })
      .then((p) => {
        if (p && p.newAch && p.newAch.length) {
          const pop = this.selectComponent('#achPop');
          if (pop) pop.show(p.newAch);
        }
      })
      .catch((e) => console.error(e));
  },

  playChild() {
    if (this.data.childAudio) {
      const ctx = wx.createInnerAudioContext();
      ctx.src = this.data.childAudio;
      ctx.play();
      ctx.onEnded(() => ctx.destroy());
    }
  },

  setProxy() {
    wx.showModal({
      title: '语音识别代理（选填）',
      editable: true,
      placeholderText: 'http://127.0.0.1:3000/asr',
      content: wx.getStorageSync('jp_asr_proxy') || '',
      success: (r) => {
        if (!r.confirm) return;
        const v = (r.content || '').trim();
        if (v) {
          wx.setStorageSync('jp_asr_proxy', v);
          audio.setAsrProxy(v);
          this.recogMode = 'proxy';
          this.setData({ modeText: '自动评测（本地代理）' });
          wx.showToast({ title: '已启用自动识别', icon: 'success' });
        } else {
          wx.removeStorageSync('jp_asr_proxy');
          audio.setAsrProxy('');
          this.recogMode = 'manual';
          this.setData({ modeText: '练习模式（家长辅助判断）' });
        }
      }
    });
  },

  goBack() { wx.navigateBack(); }
});
