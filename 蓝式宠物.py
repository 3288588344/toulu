#入口:蓝氏宠物微信小程序
#抓包api.vshop.hchiv.cn域名下的authorization值（去掉开头的Bearer）放到环境变量LSCW
import os
import requests
import json
import time

# 定义获取公告的函数
def get_proclamation():
    primary_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    backup_url = "https://tfapi.cn/TL/tl.json"
    
    try:
        response = requests.get(primary_url, timeout=10)
        if response.status_code == 200:
            print("📢 公告信息")
            print("=" * 45)
            print(response.text)
            print("=" * 45 + "\n")
            print("公告获取成功，开始执行任务...\n")
            return
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}, 尝试备用链接...")

    try:
        response = requests.get(backup_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 14)
            print("📢 公告信息")
            print("=" * 45)
            print(response.text)
            print("=" * 45 + "\n")
            print("公告获取成功，开始执行任务...\n")
        else:
            print(f"⚠️ 获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 获取公告时发生错误: {e}, 可能是网络问题或链接无效。")

# 从环境变量获取 authorization 值，多账号用 & 分割
def main():
    authorization_values = os.getenv('LSCW')
    if authorization_values is None:
        print("❌ 未设置账号信息，请添加LSCW环境变量")
        return

    authorization_list = authorization_values.split('&')

    # 设置请求的 URL 和参数
    url = "https://api.vshop.hchiv.cn/jfmb/api/play-default/sign/add-sign-new.do"
    params = {
        "sideType": "3",
        "appId": "wxb7a9c0dd9a2fcc53",
        "shopNick": "wxb7a9c0dd9a2fcc53",
        "guideNo": "",
        "securePlatId": "8d8dd596f26a3c933c9f587fe7188228e9fa6b1d10508bad562285ebfb7ee442"
    }

    # 设置请求头模板
    headers_template = {
        "Host": "api.vshop.hchiv.cn",
        "content-type": "application/json",
        "appenv": "test",
        "charset": "utf-8",
        "accept-encoding": "gzip, deflate, br"
    }

    # 设置请求体模板
    payload_template = {
        "appId": "wxb7a9c0dd9a2fcc53",
        "openId": True,
        "shopNick": "",
        "interfaceSource": 0,
        "activityId": "158245"
    }

    # 初始化一个计数器，用于给账号编号
    account_counter = 1

    # 获取当前时间戳（毫秒级别）
    current_timestamp = int(time.time() * 1000)

    # 打印开始分隔线
    print('=' * 45)
    print(f"开始签到任务，共 {len(authorization_list)} 个账号")
    print('=' * 45)

    # 遍历每个账号的 authorization 值
    for auth_value in authorization_list:
        print(f"\n🚀 正在处理账号{account_counter}...")
        print('=' * 45)
        
        # 构造请求头
        headers = headers_template.copy()
        headers["authorization"] = f"Bearer {auth_value}"
        
        # 构造请求体，包含动态生成的时间戳
        payload = payload_template.copy()
        payload["timestamp"] = current_timestamp  # 将当前时间戳添加到请求体
        
        # 发送 POST 请求
        try:
            response = requests.post(url, params=params, headers=headers, data=json.dumps(payload))
            
            # 检查响应状态码
            if response.status_code == 200:
                # 解析返回的 JSON 数据
                response_data = response.json()
                
                # 根据返回的 JSON 数据判断签到结果
                if response_data.get('success') is True:
                    if response_data.get('data', {}).get('result') == 'success':
                        # 签到成功，获取能量值
                        integral = response_data.get('data', {}).get('integral', 0)
                        integral_alias = response_data.get('data', {}).get('integralAlias', '')
                        print(f"🎉 账号{account_counter}签到成功！获得{integral}{integral_alias}")
                    elif response_data.get('data', {}).get('result') == 'error' and response_data.get('data', {}).get('message') == '已签到':
                        # 已经签到过
                        print(f"🎯 账号{account_counter}今日已签到")
                    else:
                        # 其他成功但需要关注的情况
                        print(f"⚠️ 账号{account_counter}签到状态不明，请检查返回数据：{response.text}")
                else:
                    # 服务器返回成功为 false
                    error_message = response_data.get('errorMessage', '未知错误')
                    print(f"❌ 账号{account_counter}签到失败，错误信息：{error_message}")
            
            else:
                # 服务器返回非 200 状态码
                print(f"❌ 账号{account_counter}签到失败，状态码：{response.status_code}")
                print(f"服务器响应内容：{response.text}")
            
        except requests.exceptions.RequestException as e:
            # 捕获请求异常
            print(f"❌ 账号{account_counter}签到失败，错误信息：{e}")
        
        # 增加计数器
        account_counter += 1

    # 打印结束分隔线
    print('\n' + '=' * 45)
    print("签到任务完成")
    print('=' * 45)

# 执行公告获取函数，再执行签到任务
get_proclamation()
main()
