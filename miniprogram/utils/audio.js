// utils/audio.js
// 日语发音：双通道
//   1) 优先用「微信同声传译」插件 textToSpeech（需正式小程序 AppID + 后台加插件 + app.json 声明 plugins）
//   2) 插件不可用时，回退播放代码包内本地音频 /audio/<文本>.mp3（测试号也能用，无需插件）
//   3) 都没有则静音（不影响学习流程）
// 调用方式不变：audio.speak(text) 或 audio.speak(text, 自定义文件名)
let plugin = null;
try {
  plugin = requirePlugin('WechatSI');
} catch (e) {
  plugin = null;
}

// 播放代码包内本地音频；文件不存在时静默失败（不报错、不阻塞）
function playLocal(name) {
  return new Promise((resolve) => {
    if (!name) { resolve(false); return; }
    const ctx = wx.createInnerAudioContext();
    ctx.src = '/audio/' + name + '.mp3';
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      try { ctx.destroy(); } catch (e) { /* ignore */ }
      resolve(ok);
    };
    ctx.onEnded(() => finish(true));
    ctx.onError(() => finish(false));
    ctx.play();
    // 文件不存在时部分平台不触发 onError，加超时兜底，避免一直 pending
    setTimeout(() => finish(false), 1500);
  });
}

function speak(text, file) {
  const name = file || text || '';
  return new Promise((resolve) => {
    if (plugin && plugin.textToSpeech) {
      // 插件可用：优先合成（句子也能读），失败再回退本地音频
      plugin.textToSpeech({
        lang: 'ja_JP', // 日语；个别基础库版本用 'ja'，以插件文档为准
        content: text,
        success: (res) => {
          if (res && res.filename) {
            const inner = wx.createInnerAudioContext();
            inner.src = res.filename;
            inner.play();
            inner.onEnded(() => inner.destroy());
            resolve(true);
          } else {
            playLocal(name).then(resolve);
          }
        },
        fail: () => playLocal(name).then(resolve)
      });
      return;
    }
    // 插件不可用：直接播本地音频文件
    playLocal(name).then(resolve);
  });
}

// —— 语音识别（跟读评测用）——
// 自动判断发音需要 ASR。提供两条路径：
//   1) 优先用「微信同声传译」插件的录音识别管理器（正式小程序 AppID + 后台加插件后自动可用）
//   2) 测试号/无插件时，可配置一个本地代理（tools/asr_proxy.js）走腾讯云 ASR，实现真·自动判断
//   3) 两者皆无 → 调用方降级为「录下来回放 + 孩子/家长自判」
let asrProxy = '';
function setAsrProxy(url) { asrProxy = (url || '').trim(); }

// 返回插件录音识别管理器；插件不存在时返回 null
function getRecognitionManager() {
  try {
    if (plugin && plugin.getRecordRecognitionManager) {
      return plugin.getRecordRecognitionManager();
    }
  } catch (e) { /* ignore */ }
  return null;
}

// 走本地代理做识别：把录音 base64 发给代理，代理调腾讯云 ASR 返回文本
function recognizeByProxy(base64Audio, format) {
  return new Promise((resolve, reject) => {
    if (!asrProxy) { reject(new Error('未配置 ASR 代理')); return; }
    wx.request({
      url: asrProxy,
      method: 'POST',
      timeout: 15000,
      data: { audio: base64Audio, format: format || 'mp3' },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.text) {
          resolve(res.data.text);
        } else {
          reject(new Error('ASR 返回异常: ' + JSON.stringify(res.data)));
        }
      },
      fail: (e) => reject(e)
    });
  });
}

module.exports = { speak, setAsrProxy, getRecognitionManager, recognizeByProxy };
