'''
功能：中兴商城任务
一天5毛买东西可抵扣
抓手机端签到请求链接里面的accessToken=后面的字符串（如dc487xxxx9d67）填到环境变量'zxscck'里，多账号&连接，网页版签到抓到的accessToken没有测试，有可能能用
cron: 3 0 * * *
new Env('中兴商城');
'''
import requests
import os
try:
    from notify import send
except:
    pass

url = "https://www.ztemall.com/index.php/topapi"
headers = {
    "Accept": "*/*",
    "platform": "android",
    "C-Version": "5.2.32.2308151406",
    "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; MI 5 Build/OPR1.170623.032; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36",
    "model": "MI 5",
    "Accept-Encoding": "gzip",
    "Host": "www.ztemall.com",
    "Connection": "Keep-Alive"
}
accounts = os.getenv('zxscck')

if accounts is None:
    print('未检测到zxscck')
    exit(1)

accounts_list = accounts.split('&')
print(f"获取到 {len(accounts_list)} 个账号\n")
result = []

for i, account in enumerate(accounts_list, start=1):
    print(f"=======开始执行账号{i}=======\n")
    params = {
        "method": "member.checkIn.add",
        "format": "json",
        "v": "v1",
        "accessToken": account
    }

    response = requests.get(url, headers=headers, params=params).json()
    if response['errorcode'] == 0:
        currentCheckInPoint = response['data']['currentCheckInPoint']
        point = response['data']['point']
        print(f"账号{i}签到成功，获得{currentCheckInPoint}积分，当前积分：{point}\n")
        result.append(f"账号{i}签到成功，获得{currentCheckInPoint}积分，当前积分：{point}\n")
    else:
        msg = response['msg']
        print(f"账号{i}签到失败，{msg}\n")
        result.append(f"账号{i}签到失败，{msg}\n")

try:
    send("中兴商城签到",f"{''.join(result)}")
except Exception as e:
    print(f"消息推送失败：{e}！\n{result}\n")