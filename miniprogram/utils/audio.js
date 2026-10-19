// utils/audio.js
// 日语发音：使用「微信同声传译」插件 textToSpeech 实时合成（无需预录音频）。
// 插件需在 mp 后台「设置-第三方设置-插件」中添加 WechatSI（provider: wx069ba97219f66d99）。
// 仅支持真机/开发者工具预览；如插件不可用，自动降级为静音并提示。
let plugin = null;
try {
  plugin = requirePlugin('WechatSI');
} catch (e) {
  plugin = null;
}

function speak(text) {
  return new Promise((resolve) => {
    if (!plugin || !plugin.textToSpeech) {
      console.warn('同声传译插件不可用，跳过发音');
      resolve(false);
      return;
    }
    plugin.textToSpeech({
      lang: 'ja_JP', // 日语；部分基础库版本用 'ja'，以插件文档为准
      content: text,
      success: (res) => {
        if (res && res.filename) {
          const innerAudioContext = wx.createInnerAudioContext();
          innerAudioContext.src = res.filename;
          innerAudioContext.play();
          innerAudioContext.onEnded(() => innerAudioContext.destroy());
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: () => resolve(false)
    });
  });
}

module.exports = { speak };
