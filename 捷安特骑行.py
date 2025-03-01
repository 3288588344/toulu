
#抓包域名opo.giant.com.cn下的user_id就行
#多账号使用&分割
#by:哆啦A梦

import os
import requests
import json

# 定义请求的公共头部
COMMON_HEADERS = {
    "Host": "opo.giant.com.cn",
    "Content-Length": "23",
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.101 Mobile Safari/537.36 AgentWeb/5.0.0 UCBrowser/11.6.4.950 _giantapp/4.1.9",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://found.giant.com.cn",
    "X-Requested-With": "com.giantkunshan.giant",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://found.giant.com.cn/",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
}

# 定义请求的URL
API_URL = "https://opo.giant.com.cn/opo/index.php/day_pic/do_app_pic"

def get_announcement():
    """
    获取公告信息
    """
    external_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    try:
        response = requests.get(external_url)
        if response.status_code == 200:
            print(response.text.strip())  # 打印公告内容
            print("公告获取成功，开始执行签到请求...")
        else:
            print(f"获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}")

def check_in(user_id):
    """
    模拟签到操作。
    """
    data = {"type": "1", "user_id": user_id}
    return send_request(data)

def share_task(user_id):
    """
    模拟分享任务。
    """
    data = {"type": "2", "user_id": user_id}
    return send_request(data)

def claim_share_reward(user_id):
    """
    模拟领取分享任务积分。
    """
    data = {"type": "3", "user_id": user_id}
    return send_request(data)

def send_request(data):
    """
    发送请求的通用函数。
    """
    try:
        response = requests.post(API_URL, headers=COMMON_HEADERS, data=data)
        if response.status_code == 200:
            response_data = response.json()
            if response_data.get("status") == 1 and response_data.get("msg") == "ok":
                return f"操作成功！"
            else:
                return f"操作失败，返回信息：{response_data.get('msg', '未知错误')}"
        else:
            return f"请求失败，状态码：{response.status_code}"
    except Exception as e:
        return f"请求时发生错误：{e}"

def main():
    # 先获取公告
    get_announcement()

    user_ids_str = os.getenv("JATQX")
    if not user_ids_str:
        print("错误：未设置环境变量 JATQX，请确保已正确配置。")
        return

    user_ids = user_ids_str.split("&")
    for user_id in user_ids:
        user_id = user_id.strip()
        if user_id:
            print(f"用户 {user_id}：开始执行任务")
            print(f"用户 {user_id}：签到结果：{check_in(user_id)}")
            print(f"用户 {user_id}：分享结果：{share_task(user_id)}")
            print(f"用户 {user_id}：领取积分结果：{claim_share_reward(user_id)}")
            print(f"用户 {user_id}：任务完成\n")

if __name__ == "__main__":
    main()
