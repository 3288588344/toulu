#by:哆啦A梦
#TL库:https://github.com/3288588344/toulu.git
#抓包midea.com域名中的imUserId和uid，格式:imUserId#uid
#将抓到的值填在环境变量XTE中，多账号换行分割
#入口:微信小程序:全心全意小天鹅


#公众号:哆啦A梦的藏宝箱
import os
import requests
import json
import random
import time
#公众号:哆啦A梦的藏宝箱
def check_environment_variable():
    """检查环境变量并解析账号信息"""
    xte_env = os.environ.get("XTE")
    if not xte_env:
        print("错误：未设置 XTE 环境变量")
        return None

    accounts = []
    for account_info in xte_env.split("\n"):
        account_info = account_info.strip()
        if not account_info:
            continue
        parts = account_info.split("#")
        if len(parts) < 2:
            print(f"错误：XTE 环境变量格式不正确，应为 imUserId#uid，当前值为：{account_info}")
            return None
        imUserId = parts[0]
        uid = parts[1]
        accounts.append((imUserId, uid))
    
    if not accounts:
        print("错误：未找到有效的账号信息")
        return None
    
    return accounts

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


def send_sign_request(imUserId, uid):
    """发送签到请求"""
    url = "https://weixin.midea.com/mscp_mscp/api/cms_api/activity-center-im-service/im-svr/im/game/page/sign"
    
    headers = {
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "appId": "QLZZ9Fr7w2to",
        "apiKey": "3660663068894a0d9fea574c2673f3c0",
        "vcode": "107da4f1bb8b63c7d4ea9c5537207086",
        "Origin": "https://weixin.midea.com",
        "X-Requested-With": "com.tencent.mm",
        "Referer": "https://weixin.midea.com/apps/h5-pro-wx-interaction-marketing/",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    }

    data = {
        "headParams": {
            "language": "CN",
            "originSystem": "MCSP",
            "timeZone": "",
            "userCode": "",
            "tenantCode": "",
            "userKey": "TEST_",
            "transactionId": ""
        },
        "pagination": None,
        "restParams": {
            "gameId": 9,
            "actvId": "401668349848950807",
            "rootCode": "XTE",
            "appCode": "XTE_SHG",
            "imUserId": imUserId,
            "uid": uid,
            "openId": "oOqmz4uVK1_2cXwnsVHDp1vicNNY",
            "unionId": "o9wX6jllxZJZxZsI0awpJS1aC8W0"
        }
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        return response
    except requests.exceptions.RequestException as e:
        print(f"请求异常: {e}")
        return None

def process_response(index, imUserId, response):
    """处理签到响应"""
    if response is None:
        print(f"账号 {index}: {imUserId} - 请求失败")
        return

    if response.status_code != 200:
        print(f"账号 {index}: {imUserId} - 请求失败，状态码: {response.status_code}")
        print("响应内容:", response.text)
        return

    try:
        response_json = response.json()
    except json.JSONDecodeError:
        print(f"账号 {index}: {imUserId} - 响应内容不是 JSON 格式")
        print("响应内容:", response.text)
        return

    if response_json.get("code") != "000000":
        error_msg = response_json.get("msg", "未知错误")
        print(f"账号 {index}: {imUserId} - 签到失败: {error_msg}")
        return

    data_content = response_json.get("data")
    if not data_content:
        print(f"账号 {index}: {imUserId} - 响应数据中未找到 data 字段")
        return

    sign_result = data_content.get("result")
    if sign_result:
        print(f"账号 {index}: {imUserId} - 签到成功！")
        prize_dto = data_content.get("prizeDto")
        prize_name = prize_dto.get("name", "未知奖励") if prize_dto else "未知奖励"
        print(f"获得奖励: {prize_name}")
    else:
        print(f"账号 {index}: {imUserId} - 今日已签到")

    consecutive_days = data_content.get("consecutiveDays", "1")
    print(f"连续签到天数: {consecutive_days}")

def main():
    # 获取公告
    get_proclamation()

    # 获取账号列表
    accounts = check_environment_variable()
    if not accounts:
        return

    # 对账号进行排序并标注序号
    accounts.sort()
    if not accounts:
        print("错误：未找到有效的账号信息")
        return

    # 执行签到任务
    for index, (imUserId, uid) in enumerate(accounts, start=1):
        print(f"正在处理账号 {index}: ")
        response = send_sign_request(imUserId, uid)
        process_response(index, imUserId, response)
        print("-" * 50)
#公众号:哆啦A梦的藏宝箱
        # 添加随机延迟
        delay = random.randint(3, 10)  # 随机延迟3到10秒
        if index < len(accounts):
            print(f"随机延迟 {delay} 秒后处理下一个账号...")
            time.sleep(delay)

if __name__ == "__main__":
    main()
#公众号:哆啦A梦的藏宝箱