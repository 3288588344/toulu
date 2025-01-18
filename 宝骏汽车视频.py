"""
  TL库:https://github.com/3288588344/toulu.git
  tg频道:https://t.me/TLtoulu
  QQ频道:https://pd.qq.com/s/672fku8ge
  
单点登录，会被顶号；体现公众号手动绑定，绑定链接打不开则用浏览器打开绑定即可；提现次日到账
"""
import requests, json, re, os, sys, time, random, datetime, hashlib
response = requests.get("https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt")
response.encoding = 'utf-8'
txt = response.text
print(txt)
environ = "bjsp"
name = "宝骏༒视频"
session = requests.session()
#---------------------主代码区块---------------------

def lookVideo(accessToken,postid):
    timestamp = int(time.time() * 1000)
    oauthConsumerKey = "20200113181123916714"
    nonce = "4857289347289375"
    other = f"{nonce}JNWSY6RXYGXIWR2YCI2HOAGYG9LVQXYZ8d33d72c27994bdc9a9e9fdda2545690"
    md5_str = f"{accessToken}{oauthConsumerKey}{timestamp}{other}"
    signatrue = hashlib.md5(md5_str.encode('utf-8')).hexdigest()
    url = 'https://hapi.baojun.net/base/activity/fission/lookVideo'
    header = {
        "Host": "hapi.baojun.net",
        "Connection": "keep-alive",
        "Content-Length": "17",
        "accessToken": accessToken,
        "nonce": nonce,
        "signatrue": signatrue,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11581",
        "oauthConsumerKey": oauthConsumerKey,
        "Content-Type": "application/json",
        "timestamp": str(timestamp),
        "xweb_xhr": "1",
        "platformNo": "Wx_mini",
        "Accept": "*/*",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://servicewechat.com/wx58774bbe5cd15ebb/409/page-frame.html",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9"
    }
    data = {"postId":postid}
    try:
        response = session.post(url=url, headers=header, json=data)
    except Exception as e:
        print(e)

def money(accessToken):
    timestamp = int(time.time() * 1000)
    oauthConsumerKey = "20200113181123916714"
    nonce = "1736572213106_5833612"
    other = f"{nonce}JNWSY6RXYGXIWR2YCI2HOAGYG9LVQXYZ8d33d72c27994bdc9a9e9fdda2545690"
    md5_str = f"{accessToken}{oauthConsumerKey}{timestamp}{other}"
    signatrue = hashlib.md5(md5_str.encode('utf-8')).hexdigest()
    url = 'https://hapi.baojun.net/base/account/pocket/money/draw'
    header = {
        "Host": "hapi.baojun.net",
        "Connection": "keep-alive",
        "Content-Length": "2",
        "sec-ch-ua-platform": "Android",
        "timestamp": str(timestamp),
        "accessToken": accessToken,
        "nonce": nonce,
        "signatrue": signatrue,
        "sec-ch-ua": 'Chromium";v="130", "Android WebView";v="130", "Not?A_Brand";v="99',
        "sec-ch-ua-mobile": "?1",
        "platformNo": "Wx_mini",
        "deviceType": "html5",
        "oauthConsumerKey": oauthConsumerKey,
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://m.baojun.net",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11581",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "X-Requested-With": "com.tencent.mm",
    }
    data = {}
    try:
        response = session.post(url=url, headers=header, json=data).json()
        if "核查" in response["errorMessage"]:
            print(f'🌈提现：已提交，待核查后发放')
        elif "没有余额" in response["errorMessage"]:
            print(f'⭕余额不足，无法提现')
        else:
            print(f'{response["errorMessage"]}')
    except Exception as e:
        print(e)

def info(accessToken):
    timestamp = int(time.time() * 1000)
    nonce = "1736560276274_7143758"
    other = f"{nonce}JNWSY6RXYGXIWR2YCI2HOAGYG9LVQXYZ8d33d72c27994bdc9a9e9fdda2545690"
    oauthConsumerKey = "20200113181123916714"
    md5_str = f"{accessToken}{oauthConsumerKey}{timestamp}{other}"
    signatrue = hashlib.md5(md5_str.encode('utf-8')).hexdigest()
    url = 'https://hapi.baojun.net/base/account/pocket/draw/info'
    header = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Host": "hapi.baojun.net",
        "deviceType": "html5",
        "Connection": "keep-alive",
        "accessToken": accessToken,
        "nonce": nonce,
        "signatrue": signatrue,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11581",
        "oauthConsumerKey": oauthConsumerKey,
        "timestamp": str(timestamp),
        "platformNo": "Wx_mini",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://m.baojun.net/",
    }
    try:
        response = session.get(url=url, headers=header)
        response = json.loads(response.text)
        coin = response['data']['noDrawMoney']

        timestamp = int(time.time() * 1000)
        nonce = "1736638919609_4282954"
        other = f"{nonce}JNWSY6RXYGXIWR2YCI2HOAGYG9LVQXYZ8d33d72c27994bdc9a9e9fdda2545690"
        oauthConsumerKey = "20200113181123916714"
        md5_str = f"{accessToken}{oauthConsumerKey}{timestamp}{other}"
        signatrue = hashlib.md5(md5_str.encode('utf-8')).hexdigest()
        url = 'https://hapi.baojun.net/base/ucenter/user/wallet/detail/v2?pocketClassType=1&pageNo=1&pageSize=40'
        header = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Host": "hapi.baojun.net",
            "deviceType": "html5",
            "Connection": "keep-alive",
            "accessToken": accessToken,
            "nonce": nonce,
            "signatrue": signatrue,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11581",
            "oauthConsumerKey": oauthConsumerKey,
            "timestamp": str(timestamp),
            "platformNo": "Wx_mini",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://m.baojun.net/",
        }
        response = session.get(url=url, headers=header)
        response = json.loads(response.text)
        count = 0
        for tc in response['data']:
            date_time3 = datetime.datetime.strptime(tc["expireDateStr"], "%Y-%m-%d %H:%M:%S").day
            today_date3 = datetime.datetime.now().day - 1
            if date_time3 == today_date3:
                count = count + 1


        timestamp = int(time.time() * 1000)
        nonce = "1736566937191_1825450"
        other = f"{nonce}JNWSY6RXYGXIWR2YCI2HOAGYG9LVQXYZ8d33d72c27994bdc9a9e9fdda2545690"
        oauthConsumerKey = "20200113181123916714"
        md5_str = f"{accessToken}{oauthConsumerKey}{timestamp}{other}"
        signatrue = hashlib.md5(md5_str.encode('utf-8')).hexdigest()
        url = 'https://hapi.baojun.net/base/ucenter/user/wallet/detail/v2?pocketClassType=2&pageNo=2&pageSize=20'
        header = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Host": "hapi.baojun.net",
            "deviceType": "html5",
            "Connection": "keep-alive",
            "accessToken": accessToken,
            "nonce": nonce,
            "signatrue": signatrue,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11581",
            "oauthConsumerKey": oauthConsumerKey,
            "timestamp": str(timestamp),
            "platformNo": "Wx_mini",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://m.baojun.net/",
        }
        response = session.get(url=url, headers=header)
        response = json.loads(response.text)
        txall = 0
        for t2 in response['data']:
            date_time2 = datetime.datetime.strptime(t2["expireDateStr"], "%Y-%m-%d %H:%M:%S").day
            today_date2 = datetime.datetime.now().day - 1
            if date_time2 == today_date2:
                txall = 1
                break
        return txall, coin, count
    except:
        e = 2
        return e, e, e

def getpostid(accessToken):
    txall, coin, count = info(accessToken)
    if txall == 2:
        print(f"accessToken失效")
        return
    if txall == 1:
        print(f"☁️刷前：提现判定")
    elif coin == 0:
        print(f"☁️刷前：0 元，已刷{count}/30")
    else:
        print(f"☁️刷前：{coin / 100}元，已刷{count}/30次")
    for mm in range(10000):
        if count >= 30 or txall == 1:
            if txall == 1:
                print(f"☁️判定：今日已提现，中止")
            else:
                print(f"☁️刷后：{coin / 100}元，已刷{count}/30次")
                money(accessToken)
            break
        else:
            timestamp = int(time.time() * 1000)
            oauthConsumerKey = "20200113181123916714"
            nonce = "4857289347289375"
            other = f"{nonce}JNWSY6RXYGXIWR2YCI2HOAGYG9LVQXYZ8d33d72c27994bdc9a9e9fdda2545690"
            md5_str = f"{accessToken}{oauthConsumerKey}{timestamp}{other}"
            signatrue = hashlib.md5(md5_str.encode('utf-8')).hexdigest()
            url = f'https://hapi.baojun.net/base/community/post/postList?postTypeId=1&postClassifyId=61&publishSmallProgram=2&pageNo={mm}&pageSize=35 '
            header = {
                "Host": "hapi.baojun.net",
                "Connection": "keep-alive",
                "accessToken": accessToken,
                "nonce": nonce,
                "signatrue": signatrue,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11581",
                "oauthConsumerKey": oauthConsumerKey,
                "Content-Type": "application/json",
                "timestamp": str(timestamp),
                "xweb_xhr": "1",
                "platformNo": "Wx_mini",
                "Accept": "*/*",
                "Sec-Fetch-Site": "cross-site",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                "Referer": "https://servicewechat.com/wx58774bbe5cd15ebb/409/page-frame.html",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9"
            }
            try:
                response = session.get(url=url, headers=header)
                response = json.loads(response.text)
                for i in response["data"]:
                    postid = i["postId"]
                    postTitle = i["postTitle"]
                    txall, coin, count = info(accessToken)
                    if count >= 30 or txall == 1:
                        break
                    lookVideo(accessToken, postid)
                    txallb, coinb, countb = info(accessToken)
                    if int(coinb)-int(coin)==0:
                        continue
                    time.sleep(0.1)
            except Exception as e:
                print(e)

def main():
    if os.environ.get(environ):
        ck = os.environ.get(environ)
    else:
        ck = ""
        if ck == "":
            print("请设置变量")
            sys.exit()
    ck_run = ck.split('\n')
    ck_run = [item for item in ck_run if item]
    print(f"{' ' * 10}꧁༺ {name} ༻꧂\n")
    for i, ck_run_n in enumerate(ck_run):
        print(f'\n----------- 🍺账号【{i + 1}/{len(ck_run)}】执行🍺 -----------')
        try:
            id,two = ck_run_n.split('#',2)
            #id = id[:3] + "*****" + id[-3:]
            print(f"📱：{id}")
            getpostid(two)
            time.sleep(random.randint(1, 2))
        except Exception as e:
            print(e)
            #notify.send('title', 'message')
    print(f'\n----------- 🎊 执 行  结 束 🎊 -----------')

if __name__ == '__main__':
    main()