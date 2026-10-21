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

module.exports = { speak };
