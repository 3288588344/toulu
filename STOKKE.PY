#抓包www.stokkeshop.cn域名下的Authori-zation值填到环境变量STOKKE中，多账号用&分割
#入口:http://mx.qrurl.net/h5/wxa/link?sid=25726gMa4HG


import os
import re
import requests
from typing import List, Dict, Tuple

# ---------- 通用请求头 ----------
_BASE_HEADERS = {
    "Host": "www.stokkeshop.cn",
    "Connection": "keep-alive",
    "content-type": "application/json",
    "charset": "utf-8",
    "Referer": "https://servicewechat.com/wxe232c36aaca3dc1a/34/page-frame.html",
    "Accept-Encoding": "gzip, deflate, br"
}

# ---------- 获取用户信息 ----------
def _get_user_info(token: str) -> Dict[str, str]:
  
    url = "https://www.stokkeshop.cn/api/front/user"
    headers = _BASE_HEADERS.copy()
    headers["Authori-zation"] = token
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if data.get("code") != 200:
            return {}
        d = data["data"]
        raw_phone = d["phone"]
        masked = re.sub(r"(\d{3})\d{4}(\d{4})", r"\1****\2", raw_phone)
        return {"nick": d["nickname"], "phone": masked, "integral": str(d["integral"])}
    except Exception:
        return {}

# ---------- 签到 ----------
def week_sign_all() -> None:
    tokens = os.getenv("STOKKE", "").split("&")
    if not tokens or tokens == [""]:
        print("⚠️  环境变量 STOKKE 为空，未配置任何 账号信息。")
       
        return

    url = "https://www.stokkeshop.cn/api/front/integral-task/finishWeekSign"
    payload = {}

    for token in tokens:
        token = token.strip()
        if not token:
            continue

        user = _get_user_info(token)
        if not user:
            print("❌ 获取用户信息失败，跳过当前账号。")
            print("=" * 45)
            continue

        headers = _BASE_HEADERS.copy()
        headers["Authori-zation"] = token
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            ok = data.get("code") == 200
            print(
                f"{'✅' if ok else '❌'} "
                f"{user['nick']}({user['phone']}) 签到{'成功' if ok else '失败'}，"
                f"当前积分 {user['integral']}"               
            )
            print("=" * 45)
        except Exception as e:
            print(
                f"❗ 网络异常：{user['nick']}({user['phone']}) 签到失败，当前积分 {user['integral']} "
                f"({e})"
            )

# -------------------- 公告 --------------------
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

# ---------- 示例 ----------
if __name__ == "__main__":
    get_proclamation()
    week_sign_all()
