#入口:微信搜索小紫有约
#多个变量名用#分割
#变量名xzyy
#抓包sxkyziqidonglai.cn域名下的一整段cookie

import requests
import json
import os

# 获取环境变量中的多个 cookie，多个 cookie 通过 # 分割
xzyy = os.environ.get('xzyy', '')  # 例如: 'cookie1#cookie2#cookie3'
# 如果 xzyy 为空，则使用空列表，否则分割为多个 cookie
cookies = xzyy.split('#') if xzyy else []

# wxpusher 推送的配置信息
push_token = 'UID_Rj**********'  # wxpusher的UID
push_title = '小紫有约'  # 推送标题
push_content = '小紫有约签到通知\n\n'  # 推送内容
wxapp_token = 'AT_aTsJ*********'  # wxpusher的APPToken

def wxpusher_send():
    """
    发送消息到wxpusher
    """
    headers = {'Content-Type': 'application/json;charset=utf-8'}
    data = {
        "appToken": wxapp_token,
        "uids": [push_token],
        "topicIds": [],
        "summary": push_title,
        "content": push_content,
        "contentType": 1,
        "verifyPay": False
    }

    try:
        response = requests.post('https://wxpusher.zjiecode.com/api/send/message', headers=headers, data=json.dumps(data))
        
        # 获取响应的 JSON 数据
        response_json = response.json()
        
        print(f"wxpusher 推送: {response_json.get('msg', '没有返回 msg 字段')}")
        
    except requests.exceptions.RequestException as e:
        print(f"wxpusher 推送失败: {e}")

def get_announcement():
    """
    获取公告信息
    """
    external_url = 'https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt'
    try:
        response = requests.get(external_url)
        if response.status_code == 200:
            print( response.text)
            print("公告获取成功，开始执行签到请求...")
        else:
            print(f"获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}")

def sign_in(cookie_xz):
    """
    执行签到请求
    """
    url = "https://sxkyziqidonglai.cn/api/mobile/activity-v2/activity/launchByValidater"
    
    headers = {
        "Host": "sxkyziqidonglai.cn",
        "Content-Length": "75",  
        "Sec-CH-UA-Platform": '"Android"',
        "User-Agent": 'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.103 Mobile Safari/537.36 XWEB/1300333 MMWEBSDK/20241202 MMWEBID/3628 MicroMessenger/8.0.56.2800(0x2800383A) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64',
        "Accept": "application/json, text/plain, */*",
        "Sec-CH-UA": '"Chromium";v="130", "Android WebView";v="130", "Not?A_Brand";v="99"',
        "Content-Type": "application/json",
        "Sec-CH-UA-Mobile": "?1",
        "Origin": "https://sxkyziqidonglai.cn",
        "X-Requested-With": "com.tencent.mm",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://sxkyziqidonglai.cn/activity/signIn?siteId=SITE_33254242630091515087&channelCode=WXjxriol8e8293wezu&actCode=SIGNIN202501201006598253",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cookie": cookie_xz
    }

    data = {
        "actCode": "SIGNIN202501201006598253",
        "siteId": "SITE_33254242630091515087"
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))

        # 处理响应
        if response.status_code == 200:
            response_json = response.json()
            if 'msg' in response_json:
                print(f"{response_json['msg']}")
                wxpusher_send()  # 签到成功后发送推送
            else:
                print("请求成功，但未找到 'msg' 字段")
        else:
            response_json = response.json()
            print(f"请求失败，状态码: {response.status_code}")
            print(f"错误信息: {response_json.get('msg', '没有返回 msg 字段')}")
    except requests.exceptions.RequestException as e:
        print(f"签到请求失败: {e}")
if __name__ == "__main__":
    # 获取公告
    get_announcement()

    if cookies:
        # 循环遍历多个账号，进行签到
        for index, cookie in enumerate(cookies, start=1):
            print(f"正在为账号 {index} 执行签到...")
            sign_in(cookie)  # 执行签到
    else:
        print("没有找到任何可用的账号cookie，程序退出。")