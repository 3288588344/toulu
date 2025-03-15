#入口:https://i.postimg.cc/7YjhgtCH/mmexport1742029346894.jpg
#抓包任意域名下的authorization，注意不要开头的Bearer，支持多账号
#环境变量名:NWDJG
#by:哆啦A梦




import requests
import os


tokens = os.getenv("NWDJG")
if not tokens:
    raise ValueError("环境变量 NWDJG 未设置，请确保已正确配置环境变量。")


token_list = tokens.split("&")


headers_template = {
    'xweb_xhr': '1',
    'content-type': 'application/json',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'accept-language': 'zh-CN,zh;q=0.9',
}

sign_url = 'https://stdcrm.dtmiller.com/scrm-promotion-service/promotion/sign/today'
sign_params = {
    'promotionId': 'PI67c25977540856000aac6ac0',
}

points_url = 'https://stdcrm.dtmiller.com/scrm-promotion-service/mini/wly/user/info'

def get_proclamation():
    external_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    try:
        response = requests.get(external_url)
        if response.status_code == 200:
            print(response.text)
            print("公告获取成功，开始执行任务...")
        else:
            print(f"获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}")


get_proclamation()


total_accounts = len(token_list)
success_count = 0
fail_count = 0

# 遍历每个账号，依次执行签到和查询积分任务
for index, token in enumerate(token_list, start=1):
    print(f"\n正在处理账号 {index}/{total_accounts}...")

  
    headers = headers_template.copy()
    headers['authorization'] = f"Bearer {token}"

    
    points_response = requests.get(points_url, headers=headers)
    if points_response.status_code == 200:
        points_data = points_response.json()
        if points_data['code'] == 0:
            mobile = points_data['data']['member']['mobile']
            account_name = f"{mobile[:3]}*****{mobile[-3:]}"
            print(f"账号：{account_name}")
        else:
            print(f"查询积分失败，{points_data['msg']}")
            account_name = "未知"
    else:
        print(f"查询积分网络请求异常，状态码：{points_response.status_code}，响应内容：{points_response.text}")
        account_name = "未知"

    print("正在尝试签到...")
    sign_response = requests.get(sign_url, params=sign_params, headers=headers)

    if sign_response.status_code == 200:
        sign_data = sign_response.json()
        if sign_data['code'] == 0:
            print("签到成功！")
            print(f"签到天数：{sign_data['data']['signDays']}")
            print(f"是否已领取奖励：{sign_data['data']['isReceive']}")
            print(f"奖励信息：{sign_data['data']['prize']['goodsName']}，积分：{sign_data['data']['prize']['prizePoints']}")
            success_count += 1
        else:
            print(f"签到失败,{sign_data['msg']}")
            fail_count += 1
    else:
        print(f"签到网络请求异常，状态码：{sign_response.status_code}，响应内容：{sign_response.text}")
        fail_count += 1

print(f"\n任务完成！")
print(f"总账号数量：{total_accounts}")
print(f"签到成功账号：{success_count}")
print(f"签到失败账号：{fail_count}")
