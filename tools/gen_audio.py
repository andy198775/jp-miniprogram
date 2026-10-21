#!/usr/bin/env python3
# tools/gen_audio.py
# 根据 tts_strings.json（由 Node 从 kana.js / words.js / phrases.js 导出的 208 个待合成字符串）
# 批量生成日语发音 mp3 到 miniprogram/audio/<文本>.mp3
# 文件名 = 日语文本，与 miniprogram/utils/audio.js 的本地兜底播放规则完全一致。
#
# 后端三选一（--backend）：
#   tencent  腾讯云 TTS（免费额度 800 万字符；需 SecretId/SecretKey；本机沙箱代理已验证端点可达）
#   edge-tts 微软神经语音（免 key、音质最好；需 aiohttp，建议在能直连微软的机器上跑）
#   gtts     Google TTS（免 key；需能直连 Google）
#
# 用法示例：
#   腾讯云：  TENCENT_SECRET_ID=xxx TENCENT_SECRET_KEY=yyy python tools/gen_audio.py --backend tencent --voice-type 101001
#   探测音色：TENCENT_SECRET_ID=xxx TENCENT_SECRET_KEY=yyy python tools/gen_audio.py --backend tencent --probe
#   edge-tts：python tools/gen_audio.py --backend edge-tts
#   gtts：    python tools/gen_audio.py --backend gtts
#
# 说明：腾讯云日语 VoiceType 在官方文档未直接列出，先用 --probe 试出可用编号再批量生成。

import os
import sys
import json
import time
import argparse
import base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "miniprogram", "audio")
STRINGS_FILE = os.path.join(ROOT, "tts_strings.json")


def load_strings():
    with open(STRINGS_FILE, encoding="utf-8") as f:
        return json.load(f)


def ensure_dir():
    os.makedirs(AUDIO_DIR, exist_ok=True)


# ---------------------------------------------------------------------------
# 腾讯云 TTS（TC3-HMAC-SHA256 签名，纯 requests，无需 SDK / aiohttp）
# ---------------------------------------------------------------------------
def _hmac_sha256(key, msg):
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def _tencent_auth(secret_id, secret_key, service, action, version, region, payload, timestamp):
    import datetime
    host = f"{service}.tencentcloudapi.com"
    date = datetime.datetime.utcfromtimestamp(timestamp).strftime("%Y-%m-%d")
    ct = "application/json; charset=utf-8"
    canonical_headers = (
        f"content-type:{ct}\n"
        f"host:{host}\n"
        f"x-tc-action:{action.lower()}\n"
        f"x-tc-timestamp:{timestamp}\n"
        f"x-tc-version:{version}\n"
    )
    signed_headers = "content-type;host;x-tc-action;x-tc-timestamp;x-tc-version"
    payload_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    canonical_request = (
        f"POST\n/\n\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    )
    credential_scope = f"{date}/{service}/tc3_request"
    string_to_sign = (
        f"TC3-HMAC-SHA256\n{timestamp}\n{credential_scope}\n"
        f"{hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()}"
    )
    secret = ("TC3" + secret_key).encode("utf-8")
    sig = hmac.new(
        hmac.new(hmac.new(secret, date, hashlib.sha256).digest(), service, hashlib.sha256).digest(),
        "tc3_request",
        hashlib.sha256,
    ).hexdigest()
    return host, {
        "Authorization": (
            f"TC3-HMAC-SHA256 Credential={secret_id}/{credential_scope}, "
            f"SignedHeaders={signed_headers}, Signature={sig}"
        ),
        "Content-Type": ct,
        "Host": host,
        "X-TC-Action": action,
        "X-TC-Version": version,
        "X-TC-Timestamp": str(timestamp),
        "X-TC-Region": region,
    }


def tencent_synthesize(text, secret_id, secret_key, voice_type, region="ap-guangzhou"):
    import datetime
    import requests
    service, action, version = "tts", "TextToVoice", "2019-08-23"
    payload = json.dumps({
        "Text": text,
        "SessionId": f"jp-{abs(hash(text))}",
        "VoiceType": int(voice_type),
        "Codec": "mp3",
        "SampleRate": 16000,
        "Speed": 0,
        "Volume": 0,
        "ProjectId": 0,
        "ModelType": 1,
    })
    timestamp = int(datetime.datetime.utcnow().timestamp())
    host, headers = _tencent_auth(secret_id, secret_key, service, action, version, region, payload, timestamp)
    r = requests.post(f"https://{host}", headers=headers, data=payload, timeout=20)
    data = r.json()
    if "Response" in data and data["Response"].get("Audio"):
        return base64.b64decode(data["Response"]["Audio"])
    err = data.get("Response", {}).get("Error", {})
    raise RuntimeError(f"Tencent TTS error: {err.get('Code')} {err.get('Message')}")


def tencent_probe(secret_id, secret_key, region="ap-guangzhou"):
    # 试探一批常见 VoiceType，返回第一个能合成日语的成功编号
    candidates = [101000, 101001, 101002, 101003, 101010, 101011, 101012,
                  101020, 101030, 101040, 101050, 101051, 101052, 101053,
                  101060, 101070, 101080, 101090, 101100, 101200, 101300]
    for vt in candidates:
        try:
            tencent_synthesize("こんにちは", secret_id, secret_key, vt, region)
            print(f"  [probe] VoiceType={vt} 可用 ✅")
            return vt
        except Exception as e:
            print(f"  [probe] VoiceType={vt} 失败: {e}")
    raise RuntimeError("未找到可用的日语 VoiceType，请手动指定 --voice-type")


# ---------------------------------------------------------------------------
# edge-tts（微软，免 key；需 aiohttp）
# ---------------------------------------------------------------------------
def edge_tts_synthesize(text, voice="ja-JP-NanamiNeural"):
    from edge_tts import Communicate
    import asyncio
    tmp = os.path.join(AUDIO_DIR, f"__tmp_{abs(hash(text))}.mp3")
    asyncio.run(Communicate(text, voice).save(tmp))
    with open(tmp, "rb") as f:
        data = f.read()
    os.remove(tmp)
    return data


# ---------------------------------------------------------------------------
# gTTS（Google，免 key；需能直连 Google）
# ---------------------------------------------------------------------------
def gtts_synthesize(text, tld="com"):
    from gtts import gTTS
    import io
    buf = io.BytesIO()
    gTTS(text=text, lang="ja", tld=tld).write_to_fp(buf)
    return buf.getvalue()


# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--backend", required=True, choices=["tencent", "edge-tts", "gtts"])
    ap.add_argument("--voice-type", type=int, help="腾讯云音色编号（tencent 用）")
    ap.add_argument("--region", default="ap-guangzhou")
    ap.add_argument("--voice", default="ja-JP-NanamiNeural", help="edge-tts 音色")
    ap.add_argument("--tld", default="com", help="gtts 域名")
    ap.add_argument("--probe", action="store_true", help="仅探测腾讯云日语音色后退出")
    ap.add_argument("--proxy", default=None, help="强制走指定代理，如 http://127.0.0.1:7890（绕过环境自带代理）")
    args = ap.parse_args()

    if args.proxy:
        for k in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy"):
            os.environ[k] = args.proxy

    ensure_dir()
    strings = load_strings()
    print(f"待合成字符串数: {len(strings)}")

    if args.backend == "tencent":
        secret_id = os.environ.get("TENCENT_SECRET_ID")
        secret_key = os.environ.get("TENCENT_SECRET_KEY")
        if not (secret_id and secret_key):
            sys.exit("错误：请设置环境变量 TENCENT_SECRET_ID / TENCENT_SECRET_KEY")
        if args.probe:
            vt = tencent_probe(secret_id, secret_key, args.region)
            print(f"可用 VoiceType={vt}，用它重新运行（去掉 --probe）")
            return
        if not args.voice_type:
            sys.exit("错误：tencent 需 --voice-type（或先 --probe 探测）")
    elif args.backend == "edge-tts":
        try:
            import edge_tts  # noqa
        except ImportError:
            sys.exit("错误：未安装 edge-tts，请先 `pip install edge-tts`")
    elif args.backend == "gtts":
        try:
            import gtts  # noqa
        except ImportError:
            sys.exit("错误：未安装 gTTS，请先 `pip install gTTS`")

    ok = skip = fail = 0
    fails = []
    for i, text in enumerate(strings, 1):
        path = os.path.join(AUDIO_DIR, text + ".mp3")
        if os.path.exists(path) and os.path.getsize(path) > 0:
            skip += 1
            continue
        try:
            if args.backend == "tencent":
                data = tencent_synthesize(text, secret_id, secret_key, args.voice_type, args.region)
            elif args.backend == "edge-tts":
                data = edge_tts_synthesize(text, args.voice)
            else:
                data = gtts_synthesize(text, args.tld)
            if not data or len(data) < 200:
                raise IOError("音频过小/为空")
            with open(path, "wb") as f:
                f.write(data)
            ok += 1
        except Exception as e:
            fails.append((text, str(e)[:80]))
            fail += 1
        if i % 25 == 0:
            print(f"[{i}/{len(strings)}] ok={ok} skip={skip} fail={fail}", flush=True)

    print(f"完成 ✅ ok={ok} skip={skip} fail={fail}")
    if fails:
        print("失败项：")
        for t, e in fails[:30]:
            print(f"  - {t!r}: {e}")


if __name__ == "__main__":
    import hmac
    import hashlib
    main()
