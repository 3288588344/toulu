#抓包meishi.51baibao.com域名下的x_auth_session值填到环境变量XXBMM中，多账号用&分割
#入口:https://i.postimg.cc/8zpW5Qqg/mmexport1752655464241.jpg
import os, sys, time, requests

# -------------------- 常量 --------------------
URL = "https://meishi.51baibao.com/api/c/gold_activ/join/check_in"
HEADERS = {
    "Host": "meishi.51baibao.com",
    "accept": "application/json, text/plain, */*",
    "x-platform": "1",
    "x-api-version": "v8",
    "x-version": "1.39.1",
    "x-system": "android",
    "x-scene": "1007",
    "content-type": "application/json; charset=utf-8",
    "referer": "https://servicewechat.com/wxbd5c9bd0e45e046b/653/page-frame.html",
    "accept-encoding": "gzip, deflate, br",
}

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

# -------------------- 签到 --------------------
def check_in_all():
    sessions = [s.strip() for s in os.getenv("XXBMM", "").split("&") if s.strip()]
    if not sessions:
        sys.exit("❌ 环境变量 XXBMM 未设置或为空")

    for idx, session in enumerate(sessions, 1):
        h = dict(HEADERS)
        h["x_auth_session"] = session
        try:
            r = requests.post(URL, headers=h, json={}, timeout=10).json()
            code = r.get("code")
            if code == 100:
                print(f"账号{idx} ✅ 签到成功")
                print("=" * 45)
            elif code == 40002 and "已领取过了" in str(r):
                print(f"账号{idx} ⚠️ 今日已签到")
                print("=" * 45)
            else:
                print(f"账号{idx} ❌ 签到失败，返回：{r}")
                print("=" * 45)
        except Exception as e:
            print(f"账号{idx} ❌ 网络异常：{e}")
            print("=" * 45)
        time.sleep(1)

# -------------------- 主流程 --------------------
if __name__ == "__main__":
    get_proclamation()
    check_in_all()
