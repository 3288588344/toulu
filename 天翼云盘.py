#有问题联系3288588344

# cron 30 9 * * *

#频道：https://pd.qq.com/s/672fku8ge

#在我写的地方，填上账号密码就行，有问题联系上方

import notify
import time
import re
import json
import base64
import hashlib
import urllib.parse,hmac
import rsa
import requests
import random
 
BI_RM = list("0123456789abcdefghijklmnopqrstuvwxyz")
 
B64MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
 
s = requests.Session()
 
# 在下面两行的引号内贴上账号（仅支持手机号）和密码
username = "这里填上你的天翼云盘账号"
password = "这里填上你的天翼网盘密码"
 
_ = """
if(username == "" or password == ""):
    username = input("账号：")
    password = input("密码：")
# """
 
assert username and password, "在第23、24行填入有效账号和密码"

def int2char(a):
    return BI_RM[a]
 
 
def b64tohex(a):
    d = ""
    e = 0
    c = 0
    for i in range(len(a)):
        if list(a)[i] != "=":
            v = B64MAP.index(list(a)[i])
            if 0 == e:
                e = 1
                d += int2char(v >> 2)
                c = 3 & v
            elif 1 == e:
                e = 2
                d += int2char(c << 2 | v >> 4)
                c = 15 & v
            elif 2 == e:
                e = 3
                d += int2char(c)
                d += int2char(v >> 2)
                c = 3 & v
            else:
                e = 0
                d += int2char(c << 2 | v >> 4)
                d += int2char(15 & v)
    if e == 1:
        d += int2char(c << 2)
    return d
 
 
def rsa_encode(j_rsakey, string):
    rsa_key = f"-----BEGIN PUBLIC KEY-----\n{j_rsakey}\n-----END PUBLIC KEY-----"
    pubkey = rsa.PublicKey.load_pkcs1_openssl_pem(rsa_key.encode())
    result = b64tohex((base64.b64encode(rsa.encrypt(f'{string}'.encode(), pubkey))).decode())
    return result
 
 
def calculate_md5_sign(params):
    return hashlib.md5('&'.join(sorted(params.split('&'))).encode('utf-8')).hexdigest()
 
 
def login(username, password):
    #https://m.cloud.189.cn/login2014.jsp?redirectURL=https://m.cloud.189.cn/zhuanti/2021/shakeLottery/index.html
    url=""
    urlToken="https://m.cloud.189.cn/udb/udb_login.jsp?pageId=1&pageKey=default&clientType=wap&redirectURL=https://m.cloud.189.cn/zhuanti/2021/shakeLottery/index.html"
    s = requests.Session()
    r = s.get(urlToken)
    pattern = r"https?://[^\s'\"]+"  # 匹配以http或https开头的url
    match = re.search(pattern, r.text)  # 在文本中搜索匹配
    if match:  # 如果找到匹配
        url = match.group()  # 获取匹配的字符串
        # print(url)  # 打印url
    else:  # 如果没有找到匹配
        print("没有找到url")
 
    r = s.get(url)
    # print(r.text)
    pattern = r"<a id=\"j-tab-login-link\"[^>]*href=\"([^\"]+)\""  # 匹配id为j-tab-login-link的a标签，并捕获href引号内的内容
    match = re.search(pattern, r.text)  # 在文本中搜索匹配
    if match:  # 如果找到匹配
        href = match.group(1)  # 获取捕获的内容
        # print("href:" + href)  # 打印href链接
    else:  # 如果没有找到匹配
        print("没有找到href链接")
 
    r = s.get(href)
    captchaToken = re.findall(r"captchaToken' value='(.+?)'", r.text)[0]
    lt = re.findall(r'lt = "(.+?)"', r.text)[0]
    returnUrl = re.findall(r"returnUrl= '(.+?)'", r.text)[0]
    paramId = re.findall(r'paramId = "(.+?)"', r.text)[0]
    j_rsakey = re.findall(r'j_rsaKey" value="(\S+)"', r.text, re.M)[0]
    s.headers.update({"lt": lt})
 
    username = rsa_encode(j_rsakey, username)
    password = rsa_encode(j_rsakey, password)
    url = "https://open.e.189.cn/api/logbox/oauth2/loginSubmit.do"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/76.0',
        'Referer': 'https://open.e.189.cn/',
    }
    data = {
        "appKey": "cloud",
        "accountType": '01',
        "userName": f"{{RSA}}{username}",
        "password": f"{{RSA}}{password}",
        "validateCode": "",
        "captchaToken": captchaToken,
        "returnUrl": returnUrl,
        "mailSuffix": "@189.cn",
        "paramId": paramId
    }
    r = s.post(url, data=data, headers=headers, timeout=5)
    if (r.json()['result'] == 0):
        print(r.json()['msg'])
    else:
        print(r.json()['msg'])
    redirect_url = r.json()['toUrl']
    r = s.get(redirect_url)
    return s
 
 
def main():
    s=login(username, password)
    rand = str(round(time.time() * 1000))
    surl = f'https://api.cloud.189.cn/mkt/userSign.action?rand={rand}&clientType=TELEANDROID&version=8.6.3&model=SM-G930K'
    url = f'https://m.cloud.189.cn/v2/drawPrizeMarketDetails.action?taskId=TASK_SIGNIN&activityId=ACT_SIGNIN'
    url2 = f'https://m.cloud.189.cn/v2/drawPrizeMarketDetails.action?taskId=TASK_SIGNIN_PHOTOS&activityId=ACT_SIGNIN'
    url3 = f'https://m.cloud.189.cn/v2/drawPrizeMarketDetails.action?taskId=TASK_2022_FLDFS_KJ&activityId=ACT_SIGNIN'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; SM-G930K Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36 Ecloud/8.6.3 Android/22 clientId/355325117317828 clientModel/SM-G930K imsi/460071114317824 clientChannelId/qq proVersion/1.0.6',
        "Referer": "https://m.cloud.189.cn/zhuanti/2016/sign/index.jsp?albumBackupOpened=1",
        "Host": "m.cloud.189.cn",
        "Accept-Encoding": "gzip, deflate",
    }
    response = s.get(surl, headers=headers)
    netdiskBonus = response.json()['netdiskBonus']
    if (response.json()['isSign'] == "false"):
        print(f"未签到，签到获得{netdiskBonus}M空间")
        res1 = f"未签到，签到获得{netdiskBonus}M空间"
    else:
        print(f"已经签到过了，签到获得{netdiskBonus}M空间")
        res1 = f"已经签到过了，签到获得{netdiskBonus}M空间"
 
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; SM-G930K Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36 Ecloud/8.6.3 Android/22 clientId/355325117317828 clientModel/SM-G930K imsi/460071114317824 clientChannelId/qq proVersion/1.0.6',
        "Referer": "https://m.cloud.189.cn/zhuanti/2016/sign/index.jsp?albumBackupOpened=1",
        "Host": "m.cloud.189.cn",
        "Accept-Encoding": "gzip, deflate",
    }
    response = s.get(url, headers=headers)
    if ("errorCode" in response.text):
        print(response.text)
        res2 = ""
    else:
        description = response.json()['description']
        print(f"抽奖获得{description}")
        res2 = f"抽奖获得{description}"
    response = s.get(url2, headers=headers)
    if ("errorCode" in response.text):
        print(response.text)
        res3 = ""
    else:
        description = response.json()['description']
        print(f"抽奖获得{description}")
        res3 = f"抽奖获得{description}"
 
    response = s.get(url3, headers=headers)
    if ("errorCode" in response.text):
        print(response.text)
        res4 = ""
    else:
        description = response.json()['description']
        print(f"链接3抽奖获得{description}")
        res4 = f"链接3抽奖获得{description}"

    title = "天翼云签到"
    content = f"""
    {res1}
    {res2}
    {res3}
    {res4}
    """
    notify.send(title, content)

def lambda_handler(event, context):  # aws default
    main()
 
 
def main_handler(event, context):  # tencent default
    main()
 
 
def handler(event, context):  # aliyun default
    main()
 
 
if __name__ == "__main__":
    main()
    time.sleep(random.randint(5, 30))
