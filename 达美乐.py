'''
达美乐,开一把游戏抓取openid的值。
一定要在我的奖品那绑定好手机号！
变量名1：dmlck，多账号用@隔开。备注信息用#隔开 如openid的值#大帅比
变量名2：pzid 填活动id这次是volcano（活动ID自己抓）


TL库:https://github.com/3288588344/toulu.git
  tg频道:https://t.me/TLtoulu
  QQ频道:https://pd.qq.com/s/672fku8ge
  

'''
import os
import time
import requests
import json
import notify
message = ''
# from dotenv import load_dotenv
# load_dotenv()
accounts = os.getenv('dmlck')
pzid = os.getenv('pzid')
if accounts is None:
    print('你没有填入ck，咋运行？')
else:
    accounts_list = os.environ.get('dmlck').split('@')

    num_of_accounts = len(accounts_list)

    print(f"获取到 {num_of_accounts} 个账号")

    for i, account in enumerate(accounts_list, start=1):

        values = account.split('#')
        Cookie = values[0]
        account_no = values[1] if len(values) > 1 else ""
        print(f"\n=======开始执行账号{i} {account_no}=======")
        url = f"https://game.dominos.com.cn/{pzid}/game/gameDone"
        payload = f"openid={Cookie}&score=t5%2Bhzvt2h6jpwH7D%2BJkNWvT%2Fb6J2mWDStIgcC4ZSrhkqPEqXtcDrCC9LVFvQLRtGkeVQ7z0W6RYqcXxmeXi9596r4HZ1Pt0E5PpRLYWZZL%2BXQXEpyc0WX8c4ewMqQymjBgGMcSRFp3aaLTDNaRLvLcnnh2t5PpL70pW%2B7LcM8tnhtP1J2rLaTe0Dno7%2B9Qf32LuHUS%2BUXCgQ6YbCJwj%2BWrmhP1zbFvGthkH6HB9lkI9mS%2F%2BY9582WQeFREMF9OflJpRVjgPd1%2FPWFRWKWrl%2F7VGztrHpQLZvLQ9HRINK99cN4FBBvPVkkHxyACadINkuFwxgC9ODPYInHXXpn5iElg%3D%3D"
        headers = {
            'User-Agent': "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2 like Mac OS X; sd-PK) AppleWebKit/535.42.7 (KHTML, like Gecko) Version/4.0.5 Mobile/8B111 Safari/6535.42.7",
            'Accept-Encoding': "gzip,compress,br,deflate",
            'Content-Type': "application/x-www-form-urlencoded",
            'charset': "utf-8",
            'Referer': "https://servicewechat.com/wx887bf6ad752ca2f3/63/page-frame.html"
        }

        while True:
            shrurl = f"https://game.dominos.com.cn/{pzid}/game/sharingDone"
            payload2 = f"openid={Cookie}&from=1&target=0"
            res = requests.post(shrurl, data=payload2, headers=headers).json()
            if res['errorMessage'] == "今日分享已用完，请明日再来":
                print(f'账号{i}分享已达上限，开始抽奖')
                break
        message +=f"账号{i}"
        while True:
            response = requests.post(url, data=payload, headers=headers)
            response = response.json()
            if response["statusCode"] == 0:
                prize = response['content']['name']
                print(f"\n{prize}")
                message += f"\n {prize}"
                time.sleep(1)

            if response["statusCode"] != 0:
                print(response)
                err = response['errorMessage']
                message += f'\n账号{i}\n {err}'
                break
try:
    notify.send('达美乐',message)
except Exception as e:
    print(e)
    print('推送失败')