import os
import requests
import json


#cookie在https://account.xiaomi.com/pass/sns/wxapp/v2/tokenLogin链接下
#变量名xmsq，多账号使用&分割
def get_cookies_from_env():
    """
    从环境变量中获取cookie值，多账号使用&分割
    """
    xmsq = os.getenv("xmsq")
    if not xmsq:
        raise ValueError("环境变量中未找到xmsq，请确保已正确设置环境变量。")
    return xmsq.split("&")

def get_login_data(cookie):
    """
    发送登录请求，获取签到所需的参数
    """
    url = "https://account.xiaomi.com/pass/sns/wxapp/v2/tokenLogin"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookie,
        "Referer": "https://servicewechat.com/wx240a4a764023c444/3/page-frame.html",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.103 Mobile Safari/537.36 XWEB/1300333 MMWEBSDK/20241202 MMWEBID/3628 MicroMessenger/8.0.56.2800(0x28003858) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        "Accept-Encoding": "gzip, deflate, br"
    }
    data = {
        "appid": "wx240a4a764023c444",
        "sid": "miui_vip",
        "authType": "0",
        "callback": ""
    }
    
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"登录请求失败，状态码：{response.status_code}")

def checkin(miui_vip_ph, serviceToken, userId):
    """
    执行签到操作
    """
    url = "https://api.vip.miui.com/mtop/planet/vip/member/addCommunityGrowUpPointByActionV2"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c25)XWEB/11581",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "xweb_xhr": "1",
        "Origin": "https://servicewechat.com",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://servicewechat.com/wx240a4a764023c444/3/page-frame.html",
        "Accept-Language": "zh-CN,zh;q=0.9"
    }
    cookies = {
        "serviceToken": serviceToken,
        "miui_vip_ph": miui_vip_ph,
        "userId": str(userId)
    }
    params = {"miui_vip_ph": miui_vip_ph}
    data = {"action": "WECHAT_CHECKIN_TASK"}
    
    response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)
    return response.json()

def handle_checkin_result(phone, result):
    """
    处理签到结果并输出通知
    """
    if result.get("status") == 200:
        print(f"{phone} 签到成功！")
    elif result.get("status") == -1 and result.get("message") == "加分失败":
        print(f"{phone} 签到失败：今天已经签到过了。")
    elif result.get("code") == 401:
        print(f"{phone} 签到失败：参数错误或登录信息失效。")
    else:
        print(f"{phone} 签到失败：未知错误。返回结果：{result}")

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

def main():
    try:
        # 获取公告
        get_announcement()
        
        # 获取环境变量中的cookie
        cookies = get_cookies_from_env()
        for cookie in cookies:
            login_data = get_login_data(cookie)
            miui_vip_ph = login_data["miui_vip_ph"]
            serviceToken = login_data["serviceToken"]
            userId = login_data["passportProfile"]["userId"]
            phone = login_data["passportProfile"]["phone"]  # 获取 phone 值
            
            # 执行签到
            checkin_response = checkin(miui_vip_ph, serviceToken, userId)
            handle_checkin_result(phone, checkin_response)
    except Exception as e:
        print(f"发生错误: {e}")

if __name__ == "__main__":
    main()
