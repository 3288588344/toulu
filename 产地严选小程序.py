'''
产地严选小程序
可以在浏览器打开https://c.hanhoukeji.com/h5/#/网页获取Access-Token
也可以在微信小程序获取Access-Token
变量名：cdyxck，多号&分割
TL库
每天一次
有问题联系3288588344
频道：https://pd.qq.com/s/672fku8ge

长期套餐大额流量电话卡办理地址：https://hk.yunhaoka.cn/#/pages/micro_store/index?agent_id=669709


'''


import requests
import json
import os
import time
import random


def main(token):
    url = "https://c.hanhoukeji.com/index.php?s=/api/points/taskComplete"
    list=[10,20,30,40,50,70,80]
    for i in list:
        payload = json.dumps({
            "source": i
        })
        headers = {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13) XWEB/9129",
            'Content-Type': "application/json",
            'access-token': token
        }
        response = requests.post(url, data=payload, headers=headers)
        data = json.loads(response.text)
        status = data['status']
        message=data["message"]
        print('获取任务中..................')
        if message == '没有找到用户信息':
            print(message)
            break
        time.sleep(1)
        print(message)
        rand = random.randint(5,20)
        print('等待'+str(int(rand))+'秒后继续运行')
        time.sleep(rand)
def user_points(token):
    url = "https://c.hanhoukeji.com/index.php?s=/api/points/userPointsLog"
    headers = {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13) XWEB/9129",
        'access-token': token
    }
    response = requests.get(url, headers=headers)
    data = json.loads(response.text)
    status = data['status']
    message = data['message']
    if status == 200:
        user_points=data["data"]["user_points"]
        print('当前积分:'+str(user_points))
    else:
        print('')
    time.sleep(1)

if __name__ == "__main__":
    cks=os.getenv('cdyxck')
    cks = cks.split("&")
    print(f"检测到{len(cks)}个账号,即将开始...")
    i = 1
    for ck in cks:
        token=ck
        print(f"----------第{i}个账号----------")
        i += 1
        main(token)
        user_points(token)
        rand = random.randint(5,20)
        if i > len(cks):
          break
        print(f"\n等待{rand}s后进行下一个账号")
        time.sleep(rand)