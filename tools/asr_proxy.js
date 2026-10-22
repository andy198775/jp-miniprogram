// tools/asr_proxy.js
// 本地语音识别代理（可选，仅用于「测试号 / 无插件」阶段在开发者工具里体验自动评测）
//
// 作用：小程序把录音 base64 发给本代理 → 代理用腾讯云 ASR（日语）识别 → 返回文本。
// 这样无需正式小程序账号 + 微信同声传译插件，也能让「跟我读」页自动判断发音。
//
// 使用：
//   1) 设置环境变量（你的腾讯云密钥，语音识别有免费额度）：
//        Windows:  set TENCENT_SECRET_ID=xxx
//                  set TENCENT_SECRET_KEY=xxx
//        Mac/Linux: export TENCENT_SECRET_ID=xxx
//                   export TENCENT_SECRET_KEY=xxx
//   2) 启动： node tools/asr_proxy.js        （默认监听 3000 端口）
//   3) 微信开发者工具里：勾选「不校验合法域名、TLS 版本以及 HTTPS 证书」
//   4) 在「跟我读」页点右上角 ⚙️，填 http://127.0.0.1:3000/asr 启用自动识别
//
// 注意：开发者工具「模拟器」可访问 127.0.0.1；真机预览需改成电脑局域网 IP（如 http://192.168.x.x:3000/asr）。

const http = require('http');
const https = require('https');
const crypto = require('crypto');

const SECRET_ID = process.env.TENCENT_SECRET_ID || '';
const SECRET_KEY = process.env.TENCENT_SECRET_KEY || '';
const PORT = process.env.ASR_PORT || 3000;
const HOST = 'asr.tencentcloudapi.com';
const SERVICE = 'asr';
const ACTION = 'SentenceRecognition';
const VERSION = '2019-06-14';

function sha256(data, key) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}
function hashHex(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

// 腾讯云 API v3 TC3-HMAC-SHA256 签名
function buildAuth(payload, timestamp) {
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const hashedPayload = hashHex(payload);
  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${HOST}\n`;
  const signedHeaders = 'content-type;host';
  const canonicalRequest = ['POST', '/', '', canonicalHeaders, signedHeaders, hashedPayload].join('\n');
  const credentialScope = `${date}/${SERVICE}/tc3_request`;
  const stringToSign = ['TC3-HMAC-SHA256', timestamp, credentialScope, hashHex(canonicalRequest)].join('\n');
  const secretDate = sha256(date, 'TC3' + SECRET_KEY);
  const secretService = sha256(SERVICE, secretDate);
  const secretSigning = sha256('tc3_request', secretService);
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign, 'utf8').digest('hex');
  return `TC3-HMAC-SHA256 Credential=${SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

function recognize(audioBase64, format) {
  return new Promise((resolve, reject) => {
    const payloadObj = {
      ProjectId: 0,
      SubServiceType: 0,        // 0 = 非电话 16k
      EngSerViceType: 'ja',     // 日语
      SourceType: 1,            // 1 = 用户上传音频（Data）
      VoiceFormat: format || 'mp3',
      Data: audioBase64,
      UsrAudioKey: 'jp_speak_' + Date.now()
    };
    const payload = JSON.stringify(payloadObj);
    const timestamp = Math.floor(Date.now() / 1000);
    const auth = buildAuth(payload, timestamp);
    const body = Buffer.from(payload, 'utf8');

    const options = {
      hostname: HOST,
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Host': HOST,
        'X-TC-Action': ACTION,
        'X-TC-Version': VERSION,
        'X-TC-Timestamp': timestamp,
        'X-TC-Region': 'ap-guangzhou',
        'Authorization': auth
      }
    };

    const req = https.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(chunks);
          if (json.Response && json.Response.Result) {
            resolve(json.Response.Result.trim());
          } else if (json.Response && json.Response.Error) {
            reject(new Error(json.Response.Error.Message));
          } else {
            reject(new Error('unknown response: ' + chunks.slice(0, 200)));
          }
        } catch (e) {
          reject(new Error('parse error: ' + chunks.slice(0, 200)));
        }
      });
    });
    req.on('error', (e) => reject(e));
    req.write(body);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') { res.writeHead(405); res.end(JSON.stringify({ error: 'method not allowed' })); return; }
  let buf = '';
  req.on('data', (c) => (buf += c));
  req.on('end', () => {
    if (!SECRET_ID || !SECRET_KEY) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: '未设置 TENCENT_SECRET_ID / TENCENT_SECRET_KEY' }));
      return;
    }
    let parsed;
    try { parsed = JSON.parse(buf); } catch (e) {
      res.writeHead(400); res.end(JSON.stringify({ error: 'bad json' })); return;
    }
    recognize(parsed.audio, parsed.format)
      .then((text) => { res.writeHead(200); res.end(JSON.stringify({ text })); })
      .catch((e) => { res.writeHead(200); res.end(JSON.stringify({ text: '', error: e.message })); });
  });
});

server.listen(PORT, () => {
  console.log(`[asr_proxy] 监听 http://127.0.0.1:${PORT}/asr  (腾讯云日语 ASR)`);
  if (!SECRET_ID || !SECRET_KEY) {
    console.warn('[asr_proxy] 警告：未设置 TENCENT_SECRET_ID / TENCENT_SECRET_KEY，识别会失败。');
  }
});
