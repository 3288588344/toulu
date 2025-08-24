#环境变量名：TOI 格式:access_token#sid#uuid
#抓包h5.youzan.com域名下的以上值填到环境变量TOI中，多账号用&分割
#入口:微信小程序:toi图益官方商城
import os
import json
import time
import requests

# ====== 常量 ======
KDT_ID      = "97827637"
APP_ID      = "wxbb5a91aacbab57f2"
CHECKIN_ID  = "2163238"

# ====== 通用请求头工厂 ======
def _headers(sid: str, uuid: str) -> dict:
    return {
        "Host": "h5.youzan.com",
        "content-type": "application/json",
        "charset": "utf-8",
        "referer": "https://servicewechat.com/wxbb5a91aacbab57f2/38/page-frame.html",
        "extra-data": json.dumps(
            {
                "is_weapp": 1,
                "sid": sid,
                "version": "3.165.8.103",
                "client": "weapp",
                "bizEnv": "retail",
                "uuid": uuid,
                "ftime": int(time.time() * 1000),
            },
            separators=(",", ":"),
        ),
    }

# ====== 获取用户信息 ======
def get_user_info(access_token: str, sid: str, uuid: str) -> tuple[str, str]:
    
    url = "https://h5.youzan.com/wscaccount/api/authorize/data.json"
    params = {
        "kdt_id": KDT_ID,
        "app_id": APP_ID,
        "access_token": access_token,
        "kdtId": KDT_ID,
    }
    try:
        r = requests.get(url, params=params, headers=_headers(sid, uuid), timeout=5)
        data = r.json()
        info = data.get("data", {}).get("userInfo", {})
        nick = info.get("nickname", "")
        mobile = info.get("mobile", "")
        if mobile and len(mobile) >= 11:
            mobile = mobile[:3] + "****" + mobile[-4:]
        return nick, mobile
    except Exception:
        return "", ""

# ====== 签到 ======
def do_checkin(access_token: str, sid: str, uuid: str) -> str:
    url = "https://h5.youzan.com/wscump/checkin/checkinV2.json"
    params = {
        "checkinId": CHECKIN_ID,
        "app_id": APP_ID,
        "kdt_id": KDT_ID,
        "access_token": access_token,
    }
    try:
        r = requests.get(url, params=params, headers=_headers(sid, uuid), timeout=10)
        data = r.json()
        code = data.get("code")
        if code == 0:
            return "签到成功"
        if code == 1000030071:
            return "今日已签到"
        return data.get("msg") or f"未知错误({code})"
    except Exception as e:
        return str(e)

#--------------- 公告 ---------------
def get_proclamation():
    primary_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    backup_url   = "https://tfapi.cn/TL/tl.json"

    for url in (primary_url, backup_url):
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                print("📢 公告信息")
                print("=" * 45)
                print(r.text)
                print("=" * 45 + "\n")
                return
        except Exception as e:
            continue
    print("⚠️ 获取公告失败，跳过公告直接执行签到...\n")
    
# ====== 主流程 ======
def main() -> None:
    raw = os.getenv("TOI", "").strip()
    if not raw:
        print("环境变量 TOI 为空")
        return

    for idx, item in enumerate(raw.split("&"), 1):
        parts = item.strip().split("#")
        if len(parts) != 3:
            print(f"#{idx} 格式错误")
            continue
        token, sid, uuid = parts
        nick, mobile = get_user_info(token, sid, uuid)
        account_desc = f"{nick} {mobile}" if nick and mobile else uuid
        result = do_checkin(token, sid, uuid)
        print(f"{account_desc} {result}")

if __name__ == "__main__":
    get_proclamation()
    main()
