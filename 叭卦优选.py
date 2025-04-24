#by:哆啦A梦
#TL库
#入口:http://api.0vsp.com/h5/wxa/link?sid=25423TwvStj
#抓包slb1.bg19.cn域名下的token填到环境变量BGYX就行
#多账号换行分割
import requests
import os

# 获取公告信息
def get_proclamation():
    primary_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    backup_url = "https://tfapi.cn/TL/tl.json"
    try:
        response = requests.get(primary_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 50)
            print("📢 公告信息")
            print("=" * 35)
            print(response.text)
            print("=" * 35 + "\n")
            print("公告获取成功，开始执行任务...\n")
            return
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}, 尝试备用链接...")

    try:
        response = requests.get(backup_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 50)
            print("📢 公告信息")
            print("=" * 35)
            print(response.text)
            print("=" * 35 + "\n")
            print("公告获取成功，开始执行任务...\n")
        else:
            print(f"⚠️ 获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 获取公告时发生错误: {e}, 可能是网络问题或链接无效。")

# 获取随机 User-Agent
def get_random_ua():
    ua_api_url = "http://ck.tfapi.cn/ua.php"
    try:
        response = requests.get(ua_api_url)
        response.raise_for_status()
        data = response.json()
        return data.get('user_agent', '')
    except requests.exceptions.RequestException as e:
        print(f"获取 User-Agent 失败：{e}")
        return ''

# 获取环境变量中的 token
def get_tokens_from_env():
    tokens = os.environ.get('BGYX', '')
    if not tokens:
        print("未找到环境变量 BGYX 或其值为空")
        return []
    return [token.strip() for token in tokens.split('\n') if token.strip()]

# 签到函数
def sign_in(token):
    url = "https://slb1.bg19.cn/api/wanlshop/Punch/click"
    headers = {
        "Host": "slb1.bg19.cn",
        "Connection": "keep-alive",
        "content-type": "application/json;charset=UTF-8",
        "token": token,
        "App-Client": "mp-wanlshop",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "charset": "utf-8",
        "User-Agent": get_random_ua(),
        "Accept-Encoding": "gzip, deflate, br"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        result = response.json()
        if result.get("code") == 1 and "您打过卡了" in result.get("data", {}).get("msg", ""):
            print("今日已签到，无需重复签到。")
        else:
            print("签到成功！")
    except requests.exceptions.RequestException as e:
        print(f"签到失败：{e}")

# 主函数
def main():
    get_proclamation()  # 获取公告
    tokens = get_tokens_from_env()
    if not tokens:
        return
    for token in tokens:
        sign_in(token)

if __name__ == "__main__":
    main()
