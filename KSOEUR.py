#入口:小程序KSOEUR女装
#抓包域名smp-api.iyouke.com下Authorization值，多账号换行分割
#by:哆啦A梦


import os
import requests
from datetime import datetime

# 获取公告信息
def get_proclamation():
    primary_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    backup_url = "https://tfapi.cn/TL/tl.json"
    try:
        response = requests.get(primary_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 45)
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
            print("\n" + "=" * 45)
            print("📢 公告信息")
            print("=" * 45)
            print(response.text)
            print("=" * 45 + "\n")
            print("公告获取成功，开始执行任务...\n")
        else:
            print(f"⚠️ 获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 获取公告时发生错误: {e}, 可能是网络问题或链接无效。")


# 查询账号信息和积分，并处理返回值
def get_account_info_and_points(authorization):
    # 查询账号信息
    user_info_url = "https://smp-api.iyouke.com/dtapi/p/user/userInfo"
    user_info_headers = {
        "Host": "smp-api.iyouke.com",
        "Authorization": authorization,
        "Appid": "wx00796053aa93af0c",
        "Version": "2.9.40",
        "EnvVersion": "release",
        "Xy-Extra-Data": "appid=wx00796053aa93af0c;version=2.9.40;envVersion=release;senceId=1007",
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Encoding": "gzip, deflate, br"
    }
    try:
        user_info_response = requests.get(user_info_url, headers=user_info_headers)
        if user_info_response.status_code == 200:
            user_info = user_info_response.json()
            
        else:
            print(f"查询账号信息失败，状态码：{user_info_response.status_code}")
            print(f"返回内容：{user_info_response.text}")
            return None
    except Exception as e:
        print(f"查询账号信息时发生错误：{e}")
        print(f"返回内容：{user_info_response.text}") if 'user_info_response' in locals() else print("无法获取返回内容")
        return None

    # 查询积分
    points_url = "https://smp-api.iyouke.com/dtapi/points/user/centerInfo"
    points_headers = {
        "Host": "smp-api.iyouke.com",
        "Authorization": authorization,
        "Appid": "wx00796053aa93af0c",
        "Version": "2.9.40",
        "EnvVersion": "release",
        "Xy-Extra-Data": "appid=wx00796053aa93af0c;version=2.9.40;envVersion=release;senceId=1007",
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Encoding": "gzip, deflate, br"
    }
    try:
        points_response = requests.get(points_url, headers=points_headers)
        if points_response.status_code == 200:
            points_info = points_response.json()
            
        else:
            print(f"查询积分失败，状态码：{points_response.status_code}")
            print(f"返回内容：{points_response.text}")
            points_info = None
    except Exception as e:
        print(f"查询积分时发生错误：{e}")
        print(f"返回内容：{points_response.text}") if 'points_response' in locals() else print("无法获取返回内容")
        points_info = None

    # 处理并打印账号和积分信息
    mobile = user_info.get("userMobile", "")
    nick_name = user_info.get("nickName", "")
    print(f"账号：{mobile}（昵称：{nick_name}）")
    if points_info and points_info.get("success"):
        points_balance = points_info.get("data", {}).get("pointsBalance", 0)
        print(f"当前积分：{points_balance}")
    else:
        print("无法获取积分信息")

    return {
        "mobile": mobile,
        "nick_name": nick_name,
        "points_balance": points_info.get("data", {}).get("pointsBalance", "查询失败") if points_info else "查询失败"
    }


# 签到功能
def check_in(authorization):
    current_date = datetime.now().strftime("%Y-%m-%d")
    formatted_date = current_date.replace('-', '%2F')
    url = f"https://smp-api.iyouke.com/dtapi/pointsSign/user/sign?date={formatted_date}"
    headers = {
        "Host": "smp-api.iyouke.com",
        "Authorization": authorization,
        "Appid": "wx00796053aa93af0c",
        "Version": "2.9.40",
        "EnvVersion": "release",
        "Xy-Extra-Data": "appid=wx00796053aa93af0c;version=2.9.40;envVersion=release;senceId=1007",
        "Content-Type": "application/json; charset=utf-8",
        "Referer": "https://servicewechat.com/wx00796053aa93af0c/52/page-frame.html",
        "Accept-Encoding": "gzip, deflate, br"
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            
            return response.json()
        else:
            print(f"签到失败，状态码：{response.status_code}")
            print(f"返回内容：{response.text}")
            return None
    except Exception as e:
        print(f"签到时发生错误：{e}")
        print(f"返回内容：{response.text}") if 'response' in locals() else print("无法获取返回内容")
        return None


# 主程序
if __name__ == "__main__":
    # 获取公告
    get_proclamation()

    # 从环境变量获取 authorization 值，支持多账号（换行分割）
    tokens = os.getenv("KSOEUR", "").split("\n")
    if not tokens or all(not token.strip() for token in tokens):
        print("❌ 未找到环境变量 KSOEUR 或其值为空，任务终止。")
        exit(1)

    # 遍历每个账号执行任务
    for token in tokens:
        token = token.strip()
        if not token:
            continue

        print(f"\n{'=' * 45}")
        print(f"正在执行任务中")
        print(f"{'=' * 45}\n")

        account_data = get_account_info_and_points(token)
        if account_data:
            # 签到
            check_in_result = check_in(token)
            if check_in_result and check_in_result.get("success"):
                print(f"签到成功，获得奖励：{check_in_result.get('data', {}).get('signReward', 0)}")
            else:
                if check_in_result and check_in_result.get("errorMsg"):
                    print(f"签到失败，原因：{check_in_result.get('errorMsg')}")
                else:
                    print("签到失败")
        else:
            print("跳过该账号。")

        print(f"\n{'-' * 45}\n")

    print("所有任务执行完成！")
