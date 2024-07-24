'''
奇点积分小程序
变量名：qdjf，多号&分割
0 2 7,8,12,18,19 * * *

有问题联系3288588344
 频道：https://pd.qq.com/s/672fku8ge

长期套餐大额流量电话卡办理地址：https://hk.yunhaoka.cn/#/pages/micro_store/index?agent_id=669709

'''




import requests
import json
import os
import random
import time

def repairBag(access_token):
    url = "https://qidian.hanhoukeji.com/index.php?s=/api/blebag/openBag"  # 每日三餐开福袋
    headers = {
        "Host": "qidian.hanhoukeji.com",
        "Connection": "keep-alive",
        "charset": "utf-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/2307 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        "content-type": "application/json",
        "access-token": access_token,
        "Accept-Encoding": "gzip,compress,br,deflate",
        "version": "1.5.19",
        "platform": "MP-WEIXIN",
        "Referer": "https://servicewechat.com/wx3aa7193831495d74/98/page-frame.html"
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    print(response.text)
    status = data['status']
    message = data['message']
    if status == 200:
        # points = data['data']['points']
        print('领福袋成功')
    else:
        print(message)

def getOrderNo(access_token):
    url = 'https://qidian.hanhoukeji.com/index.php?s=/api/seead/getOrderNo'  # 广告获取
    headers = {
        'Host': 'qidian.hanhoukeji.com',
        'Connection': 'keep-alive',
        'charset': 'utf-8',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/2307 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64 MiniProgramEnv/android',
        'content-type': 'application/json',
        'access-token': access_token,
        'Accept-Encoding': 'gzip,compress,br,deflate',
        'version': '1.5.19',
        'platform': 'MP-WEIXIN',
        'Referer': 'https://servicewechat.com/wx3aa7193831495d74/98/page-frame.html'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = json.loads(response.text)
        if data.get('status') == 200 and 'order_no' in data.get('data', {}):
            order_no = data['data']['order_no']
            print(f"广告编号:{order_no}")
            return order_no

def points(access_token, order_no):
    url = f"https://qidian.hanhoukeji.com/index.php?s=/api/seead/open&order_no={order_no}"
    headers = {
        "Host": "qidian.hanhoukeji.com",
        "Connection": "keep-alive",
        "charset": "utf-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/2307 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        "content-type": "6c074560213a22e18434c54ec77f2ba8application/json",
        "access-token": access_token,
        "Accept-Encoding": "gzip, compress, br, deflate",
        "version": "1.5.19",
        "platform": "MP-WEIXIN",
        "Referer": "https://servicewechat.com/wx3aa7193831495d74/98/page-frame.html"
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    status = data["status"]
    if status == 200:
        points = data["data"]["ponits"]
        print(f"恭喜获得积分:{points}")
    else:
        message = data["message"]
        print(f"获取积分失败，错误信息: {message}")

def ku(access_token, order_no):
    url = f"https://qidian.hanhoukeji.com/index.php?s=/api/user/info"
    headers = {
        "Host": "qidian.hanhoukeji.com",
        "Connection": "keep-alive",
        "charset": "utf-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160027 MMWEBSDK/20231105 MMWEBID/2307 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        "content-type": "6c074560213a22e18434c54ec77f2ba8application/json",
        "access-token": access_token,
        "Accept-Encoding": "gzip, compress, br, deflate",
        "version": "1.5.19",
        "platform": "MP-WEIXIN",
        "Referer": "https://servicewechat.com/wx3aa7193831495d74/98/page-frame.html"
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    status = data["status"]
    if status == 200:
        points = data["data"]["userInfo"]["points"]
        print(f"总积分为:{points}")
    else:
        message = data["message"]
        print(f"获取积分失败，错误信息: {message}")

def main():
    access_tokens = os.getenv("qdjf").split('&')
    i = 0
    for token in access_tokens:
        print(f"正在处理第 {i+1} 个账号...")
        repairBag(token)
        get = getOrderNo(token)
        points(token, get)
        ku(token, get)
        print("==============================")
        i+=1
if __name__ == "__main__":
    cks=os.getenv('qdjf')
    cks = cks.split("&")
    print(f"检测到{len(cks)}个账号,即将开始...")
    i = 1
    for ck in cks:
        token=ck
        print(f"----------第{i}个账号----------")
        i += 1
        repairBag(token)
        get = getOrderNo(token)
        points(token, get)
        ku(token, get)
        rand = random.randint(5,20)
        if i > len(cks):
          break
        print(f"\n等待{rand}s后进行下一个账号")
        time.sleep(rand)