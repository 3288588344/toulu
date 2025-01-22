"""
 * 胖乖生活
 * 设置变量 PGSH_TOKEN,多号使用&隔开，青龙直接新建变量即可 
 * ck格式1:token#备注
 * ck格式2: token
 * 代理开关变量名：pg_dl，True为开启代理模式，False为关闭，默认为False
 * 代理变量名：pg_dlurl，代理地址是动态代理api接口，一次性提取一个，选择txt格式，\r\n或者\n模式都可以
 * 并发开关变量名：pg_bf，True为开启并发模式，False为关闭，默认为False
 * 并发数量变量名：pg_bfsum，并发几个就写几个，默认为3
 * 推送开关变量名：pg_ts，True为开启推送，False为关闭，默认为False
 * 推送变量名1：WxPusher：pg_WxPusher_token是你的WxPusher的推送组的token，pg_WxPusher_uid是你的WxPusher该推送组的用户uid，推送给谁就填写谁的，填写一个即可
 * 推送变量名2：pushplus：pg_pushplus_token是你的pushplus的token
 * Top: 上面两个推送配置哪个就使用哪个推送，两个都配置的话就两个都进行推送
 * 数据库地址变量名：pg_ckurl，保证打开数据库里面是ck，并使用&隔开，或者ck#备注，并使用&隔开
 * 不填备注默认使用隐私格式手机号作为用户名，否则使用填写的备注作为用户名
 * 出现False就是任务已完成或者不可完成
 * 推荐携趣，注册实名每天免费1k，地址：https://www.xiequ.cn/
 * cron：0 * * * *    务必使用此cron，无需担心黑号
"""

##############################

ck = ""  # 本地环境ck，环境变量存在此处不生效
ckurl1 = ""  # 数据库地址，适配部分群友要求
jh = False  # 聚合ck模式，开启即所有环境模式ck都生效，都会合成为一个ck列表，关闭则优先处理环境变量，默认为True，False为关闭

#############################
# -----运行模式配置区，自行配置------

bf1 = False  # True开启并发，False关闭并发
bfsum1 = 3  # 并发数,开启并发模式生效

# -------推送配置区，自行填写-------

ts1 = False  # True开启推送，False关闭推送

# -------代理配置区，自行填写-------

dl1 = False  # True开启代理，False关闭代理
dl_url = ""  # 代理池api

# -----代理时间配置区，秒为单位------

dl_sleep = 30  # 代理切换时间
qqtime = 6  # 请求超时时间

# -----时间配置区，默认即可------

a = "6"
b = "22"  # 表示6-22点之间才执行任务

#############################
# ---------勿动区----------

# 已隐藏乾坤于此区域

###########################
# ---------代码块---------

import requests
import time
import random
import string
import os
import json
import hashlib
import threading
from functools import partial
from urllib.parse import urlparse
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib3.exceptions import InsecureRequestWarning

dl = os.environ.get('pg_dl', dl1)
proxy_api_url = os.environ.get('pg_dlurl', dl_url)
bf = os.environ.get('pg_bf', bf1)
bfsum = os.environ.get('pg_bfsum', bfsum1)
ts = os.environ.get('pg_ts', ts1)
ckurl = os.environ.get('pg_ckurl', ckurl1)
WxPusher_uid = os.environ.get('pg_WxPusher_uid')
WxPusher_token = os.environ.get('pg_WxPusher_token')
pushplus_token = os.environ.get('pg_pushplus_token')

# def check_yl():
#     lb = ['requests', 'urllib3']
#     for yl in lb:
#         try:
#             subprocess.check_call(["pip", "show", yl], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
#         except subprocess.CalledProcessError:
#             print(f"{yl} 未安装，开始安装...")
#             subprocess.check_call(["pip", "install", yl, "-i", "https://pypi.tuna.tsinghua.edu.cn/simple"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
#             print(f"{yl} 安装完成")
# check_yl()

v = '9.9.9.'

global_proxy = {
    'http': None,
    'https': None
}


def start_dlapi():
    dlstart = threading.Thread(target=get_proxy, args=(stop_event,))
    dlstart.start()


stop_event = threading.Event()



def get_proxy(stop_event):
    global global_proxy, ipp
    a = 0
    while not stop_event.is_set():
        a += 1
        response = requests.get(proxy_api_url)
        if response.status_code == 200:
            proxy1 = response.text.strip()
            if "白名单" not in proxy1:
                print(f'✅第{a}次获取代理成功: {proxy1}')
                ipp = proxy1.split(':')[0]
                global_proxy = {
                    'http': proxy1,
                    'https': proxy1,
                }
                start_time = time.time()
                while time.time() - start_time < dl_sleep:
                    if ip():
                        print("✅代理检测通过,可以使用")
                        time.sleep(2)
                    else:
                        print(f'❎当前ip不可用，第{a}次重新获取！')
                        break
                continue
            else:
                print(f"请求代理池: {proxy1}")
                print("响应中存在白名单字样，结束运行")
                os._exit(0)
        else:
            print(f'❎第{a}次获取代理失败！重新获取！')
            time.sleep(dl_sleep)
            continue


def ip():
    try:
        if global_proxy:
            r = requests.get('http://httpbin.org/ip', proxies=global_proxy, timeout=10, verify=False)
        else:
            r = requests.get('http://httpbin.org/ip')
        if r.status_code == 200:
            ip = r.json()["origin"]
            print(f"当前IP: {ip}")
            return ip
        else:
            print(f"❎查询ip失败")
            return None
    except requests.RequestException as e:
        print(f"❎查询ip错误")
        return None
    except Exception as e:
        print(f"❎查询ip错误")
        return None


def p(p):
    if len(p) == 11:
        return p[:3] + '****' + p[7:]
    else:
        return p


class PGSH:
    def __init__(self, cki):
        self.msg = None
        self.messages = []
        self.title = None
        self.phone = None
        self.token = cki.split('#')[0]
        self.cook = cki
        self.total_amount = 0
        self.id = None
        self.hd = {
            'User-Agent': "okhttp/3.14.9",
            'Accept': 'application/json, text/plain, */*',
            'Version': "1.57.2",
            'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
            'Authorization': self.token,
            'channel': "android_app"
        }
        self.hd1 = {
            'User-Agent': "okhttp/3.14.9",
            'Connection': "Keep-Alive",
            'Accept-Encoding': "gzip",
            'Authorization': self.token,
            'Version': "1.57.2",
            'channel': "android_app",
            'phoneBrand': "Redmi",
            'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8"
        }
        self.listUrl = 'https://userapi.qiekj.com/task/list'
        self.phone_url = 'https://userapi.qiekj.com/user/info'
        self.check_url = 'https://userapi.qiekj.com/user/balance'
        self.rcrw_url = 'https://userapi.qiekj.com/task/completed'
        self.sign_url = 'https://userapi.qiekj.com/signin/doUserSignIn'
        self.jrjf_url = "https://userapi.qiekj.com/integralRecord/pageList"
        self.dkbm_url = 'https://userapi.qiekj.com/markActivity/doApplyTask'
        self.dkbm_url1 = 'https://userapi.qiekj.com/markActivity/doMarkTask'
        self.shop_url = 'https://userapi.qiekj.com/integralUmp/rewardIntegral'
        self.jtjl_url = 'https://userapi.qiekj.com/ladderTask/applyLadderReward'
        self.dkbm_url2 = "https://userapi.qiekj.com/markActivity/markTaskReward"
        self.bmcodeurl = 'https://userapi.qiekj.com/markActivity/queryMarkTaskByStartTime'

    # 签名
    def sg(self, y):
        timestamp = str(int(time.time() * 1000))
        parsed_url = urlparse(y)
        path = parsed_url.path
        data = f"appSecret=nFU9pbG8YQoAe1kFh+E7eyrdlSLglwEJeA0wwHB1j5o=&channel=android_app&timestamp={timestamp}&token={self.token}&version=1.57.2&{path}"
        data1 = f"appSecret=Ew+ZSuppXZoA9YzBHgHmRvzt0Bw1CpwlQQtSl49QNhY=&channel=alipay&timestamp={timestamp}&token={self.token}&{path}"
        sign = hashlib.sha256(data.encode()).hexdigest()
        sign1 = hashlib.sha256(data1.encode()).hexdigest()
        return sign, sign1, timestamp


    # 检测token有效性
    def name(self):
        try:
            data = {'token': self.token}
            if dl:
                re = requests.post(self.phone_url, data=data, headers=self.hd, proxies=global_proxy, timeout=10,
                                   verify=False).json()
            else:
                re = requests.post(self.phone_url, data=data, headers=self.hd).json()
            code = re['code']
            if code == 0:
                try:
                    if "#" in self.cook:
                        self.phone = self.cook.split('#')[1]
                    else:
                        self.phone = p(re['data']['phone'])
                except:
                    print(f'[账号{i + 1}] Cookie异常')
                    exit(0)
                self.id = re["data"]["id"]
                sign, sign1, timestamp = self.sg(self.check_url)
                self.hd['sign'] = sign
                self.hd['timestamp'] = timestamp
                if dl:
                    r = requests.post(self.check_url, data=data, headers=self.hd, proxies=global_proxy, timeout=10,
                                      verify=False).json()
                else:
                    r = requests.post(self.check_url, data=data, headers=self.hd).json()
                coin_code = r['code']
                balance = r['data']['integral'] if coin_code == 0 else 'N/A'
                print(f"[{self.phone}] ✅登录成功！积分余额: {balance}")
                return self.phone
            else:
                msg = re["msg"]
                print(f"[账号{i + 1}] ❎登录失败==> {msg}")
                return False
        except Exception as e:
            print("❎请求出现错误")
            return False

    # 签到
    def sign(self, max_retries=3):
        retries = 0
        while retries < max_retries:
            try:
                data = {'activityId': '600001', 'token': self.token}
                sign, sign1, timestamp = self.sg(self.sign_url)
                self.hd['sign'] = sign
                self.hd['timestamp'] = timestamp
                if dl:
                    re = requests.post(self.sign_url, data=data, headers=self.hd, proxies=global_proxy, timeout=10,
                                       verify=False).json()
                else:
                    re = requests.post(self.sign_url, data=data, headers=self.hd).json()

                msg = re['msg']
                print(f"[{self.phone}] ✅签到==> {msg}")
                break
            except Exception as e:
                retries += 1
                print(f"❎签到错误,重试次数: {retries}/{max_retries}")
                if retries >= max_retries:
                    print("❎达到最大重试次数，跳过该任务")
                    break
                time.sleep(1)

    # 浏览商品
    def shop(self):
        for t in range(6):
            try:
                b1 = string.ascii_lowercase + string.digits
                item_code = ''.join(random.choice(b1) for _ in range(6))
                data = {'itemCode': item_code, 'token': self.token}
                sign, sign1, timestamp = self.sg(self.shop_url)
                self.hd['sign'] = sign
                self.hd['timestamp'] = timestamp
                if dl:
                    re = requests.post(self.shop_url, data=data, headers=self.hd, proxies=global_proxy, timeout=10,
                                       verify=False).json()
                else:
                    re = requests.post(self.shop_url, data=data, headers=self.hd).json()
                q = re["data"]
                if q is not None:
                    amount = re["data"]["rewardIntegral"]
                    print(f"[{self.phone}] ✅第{t + 1}次浏览商品成功,获得==> {amount}!")
                else:
                    print(f"[{self.phone}] ❎第{t + 1}次浏览商品失败==> {q}")
                    break
            except Exception as error:
                print("❎浏览商品出现错误")
                continue
            if dl:
                time.sleep(2)
            else:
                time.sleep(6)

    # 支付宝广告任务
    def zfbgg(self):
        for t in range(11):
            try:
                data = {'taskType': "9", 'token': self.token}
                sign, sign1, timestamp = self.sg(self.rcrw_url)
                hd1 = {
                    'User-Agent': "Dalvik/2.1.0 (Linux; U; Android 13; MEIZU 20 Build/TKQ1.221114.001) Chrome/105.0.5195.148 MYWeb/0.11.0.240407200246 UWS/3.22.2.9999 UCBS/3.22.2.9999_220000000000 Mobile Safari/537.36 NebulaSDK/1.8.100112 Nebula AlipayDefined(nt:WIFI,ws:1080|1862|2.8125) AliApp(AP/10.5.88.8000) AlipayClient/10.5.88.8000 Language/zh-Hans useStatusBar/true isConcaveScreen/true NebulaX/1.0.0 DTN/2.0",
                    'Connection': "Keep-Alive",
                    'Accept-Encoding': "gzip",
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Accept-Charset': "UTF-8",
                    'channel': "alipay",
                    'sign': sign1,
                    'x-release-type': "ONLINE",
                    'version': "",
                    'timestamp': timestamp
                }
                if dl:
                    response = requests.post(self.rcrw_url, data=data, headers=hd1, proxies=global_proxy, timeout=10,
                                             verify=False).json()
                else:
                    response = requests.post(self.rcrw_url, data=data, headers=hd1).json()
                msg = response["data"]
                if msg:
                    print(f"[{self.phone}] ✅第{t + 1}次支付宝广告==> {msg}")
                else:
                    print(f"[{self.phone}] ❎第{t + 1}次支付宝广告失败==> {msg}")
                    break
            except Exception as error:
                print("❎支付宝广告出现错误")
                continue
            if dl:
                time.sleep(2)
            else:
                time.sleep(6)

    # 看视频赚积分
    def kspzjf(self):
        for t in range(6):
            try:
                data = {'taskType': "2", 'token': self.token}
                sign, sign1, timestamp = self.sg(self.rcrw_url)
                self.hd['sign'] = sign
                self.hd['timestamp'] = timestamp
                if dl:
                    response = requests.post(self.rcrw_url, data=data, headers=self.hd, proxies=global_proxy,
                                             timeout=10, verify=False).json()
                else:
                    response = requests.post(self.rcrw_url, data=data, headers=self.hd).json()
                msg = response["data"]
                if msg:
                    print(f"[{self.phone}] ✅第{t + 1}次看视频赚积分==> {msg}")
                else:
                    print(f"[{self.phone}] ❎第{t + 1}次看视频赚积分失败==> {msg}")
                    break
            except Exception as error:
                print("❎看视频赚积分出现错误")
                continue
            if dl:
                time.sleep(2)
            else:
                time.sleep(6)

    # 看广告赚积分
    def kggzjf(self):
        for t in range(9):
            try:
                data = {'taskCode': '18893134-715b-4307-af1c-b5737c70f58d', 'token': self.token}
                sign, sign1, timestamp = self.sg(self.rcrw_url)
                self.hd['sign'] = sign
                self.hd['timestamp'] = timestamp
                if dl:
                    res = requests.post(self.rcrw_url, data=data, headers=self.hd, proxies=global_proxy, timeout=10,
                                        verify=False).json()
                else:
                    res = requests.post(self.rcrw_url, data=data, headers=self.hd).json()
                msg = res['data']
                if msg:
                    print(f'[{self.phone}] ✅第{t + 1}次看广告赚积分==> {msg}')
                else:
                    print(f'[{self.phone}] ❎第{t + 1}次看广告赚积分失败==> {msg}')
                    break
            except Exception as e:
                print("❎看广告赚积分出现错误")
                continue
            if dl:
                time.sleep(2)
            else:
                time.sleep(6)

    # 不知名任务
    def ycrw(self):
        for t in range(9):
            try:
                data = {'taskCode': '15eb1357-b2d9-442f-a19f-dbd9cdc996cb', 'token': self.token}
                sign, sign1, timestamp = self.sg(self.rcrw_url)
                self.hd['sign'] = sign
                self.hd['timestamp'] = timestamp
                if dl:
                    re = requests.post(self.rcrw_url, data=data, headers=self.hd, proxies=global_proxy, timeout=10,
                                       verify=False).json()
                else:
                    re = requests.post(self.rcrw_url, data=data, headers=self.hd).json()
                msg = re['data']
                if msg:
                    print(f'[{self.phone}] ✅第{t + 1}次看广告赚积分==> {msg}')
                else:
                    print(f'[{self.phone}] ❎第{t + 1}次看广告赚积分失败==> {msg}')
                    break
            except Exception as e:
                print("❎不知名任务出现错误")
                continue
            if dl:
                time.sleep(2)
            else:
                time.sleep(6)

    # 大鹅积分
    def dejf(self):
        for t in range(10):
            try:
                data = {'taskCode': '5', 'token': self.token}
                sign, sign1, timestamp = self.sg(self.rcrw_url)
                self.hd['sign'] = sign
                self.hd['timestamp'] = timestamp
                if dl:
                    re = requests.post(self.rcrw_url, data=data, headers=self.hd, proxies=global_proxy, timeout=10,
                                       verify=False).json()
                else:
                    re = requests.post(self.rcrw_url, data=data, headers=self.hd).json()
                msg = re['data']
                if msg:
                    print(f'[{self.phone}] ✅第{t + 1}次大鹅积分当钱花==> {msg}')
                else:
                    print(f'[{self.phone}] ❎第{t + 1}次大鹅积分当钱花==> {msg}')
                    break
            except Exception as e:
                print("❎大鹅积分当钱花出现错误")
                continue
            if dl:
                time.sleep(2)
            else:
                time.sleep(6)

    # 遍历日常
    def rcrw(self):
        try:
            data = {'token': self.token}
            sign, sign1, timestamp = self.sg(self.listUrl)
            self.hd['sign'] = sign
            self.hd['timestamp'] = timestamp
            response = requests.post(self.listUrl, data=data, headers=self.hd).json()
            code = response.get('code', -1)
            if code == 0:
                tasks = response.get('data', {}).get('items', [])
                if tasks:
                    print(f'[{self.phone}] ✅获取到{len(tasks)}个日常任务')
                    for item in tasks:
                        title = item["title"]
                        id1 = item["taskCode"]
                        data = {'taskCode': id1, 'token': self.token}
                        sign, sign1, timestamp = self.sg(self.rcrw_url)
                        self.hd['sign'] = sign
                        self.hd['timestamp'] = timestamp
                        if dl:
                            time.sleep(2)
                        else:
                            time.sleep(6)
                        if dl:
                            response1 = requests.post(self.rcrw_url, data=data, headers=self.hd, proxies=global_proxy,
                                                      timeout=10, verify=False).json()
                        else:
                            response1 = requests.post(self.rcrw_url, data=data, headers=self.hd).json()
                        data1 = response1.get("data", {})
                        if data1:
                            print(f'[{self.phone}] ✅完成日常任务[{title}]成功==> {data1}')
                        else:
                            print(f'[{self.phone}] ❎完成日常任务[{title}]失败==> {data1}')
                        if dl:
                            time.sleep(2)
                        else:
                            time.sleep(6)
                else:
                    print("❎获取任务列表为空!")
            else:
                print("❎获取任务列表失败!")
        except requests.RequestException as e:
            print(f"❎网络请求错误: {e}")
        except Exception as e:
            print(f"❎遍历日常出现错误: {e}")

    # 领取阶梯奖励
    def jtjl(self):
        try:
            url = "https://userapi.qiekj.com/ladderTask/ladderTaskForDay"
            params = {
                'token': self.token
            }
            sign, sign1, timestamp = self.sg(url)
            self.hd1['sign'] = sign
            self.hd1['timestamp'] = timestamp
            if dl:
                r = requests.get(url, params=params, headers=self.hd1, proxies=global_proxy, timeout=10,
                                 verify=False).json()
            else:
                r = requests.get(url, params=params, headers=self.hd1).json()
            if r['code'] == 0:
                reward_list = [item['rewardCode'] for item in r['data']['ladderRewardList']]
                for rewar in reward_list:
                    try:
                        url1 = "https://userapi.qiekj.com/ladderTask/applyLadderReward"
                        data = {'rewardCode': rewar, 'token': self.token}
                        sign, sign1, timestamp = self.sg(url1)
                        self.hd1['sign'] = sign
                        self.hd1['timestamp'] = timestamp
                        if dl:
                            r1 = requests.post(url1, data=data, headers=self.hd1, proxies=global_proxy, timeout=10,
                                               verify=False).json()
                        else:
                            r1 = requests.post(url1, data=data, headers=self.hd1).json()
                        if r1["code"] == 0:
                            reward = r1["data"]["reward"]
                            print(f'[{self.phone}] ✅领取任务id[{rewar}]成功==> {reward}')
                        else:
                            print(f'[{self.phone}] ❎领取任务id[{rewar}]失败==> {r1["msg"]}')
                        if dl:
                            time.sleep(2)
                        else:
                            time.sleep(6)
                    except Exception as e:
                        print("❎领取阶梯奖励出现错误")
                        continue
            else:
                print("获取任务列表失败!")
        except Exception as e:
            print("获取阶梯奖励列表出现错误")

    # 时间段奖励
    def timejl(self, max_retries=3):
        retries = 0
        while retries < max_retries:
            try:
                url = "https://userapi.qiekj.com/timedBenefit/applyRewardForTimeBenefit"
                params = {
                    'token': self.token
                }
                sign, sign1, timestamp = self.sg(url)
                self.hd1['sign'] = sign
                self.hd1['timestamp'] = timestamp

                if dl:
                    r = requests.get(url, params=params, headers=self.hd1, proxies=global_proxy, timeout=10,
                                     verify=False).json()
                else:
                    r = requests.get(url, params=params, headers=self.hd1).json()
                if r["code"] == 0:
                    print(f'[{self.phone}] ✅领取时间段奖励成功==> {r["data"]["rewardNum"]}')
                    break
                else:
                    print(f'[{self.phone}] ❎领取时间段奖励失败==> {r["msg"]}')
                    break
            except Exception as e:
                retries += 1
                print(f"❎完成时间段任务出现错误: {e}. 重试次数: {retries}/{max_retries}")
                if retries >= max_retries:
                    print("❎达到最大重试次数，跳过该任务")
                    break
                time.sleep(1)

    # 打卡报名
    def dkbm(self):
        try:
            ti = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            data = {'startTime': ti, 'token': self.token}
            sign, sign1, timestamp = self.sg(self.bmcodeurl)
            self.hd1['sign'] = sign
            self.hd1['timestamp'] = timestamp
            if dl:
                r = requests.post(self.bmcodeurl, data=data, headers=self.hd1, proxies=global_proxy, timeout=10,
                                  verify=False).json()
            else:
                r = requests.post(self.bmcodeurl, data=data, headers=self.hd1).json()
            code = r['code']
            if code == 0:
                try:
                    code1 = r['data']['taskCode']
                    data = {'taskCode': code1, 'token': self.token}
                    sign, sign1, timestamp = self.sg(self.dkbm_url)
                    self.hd1['sign'] = sign
                    self.hd1['timestamp'] = timestamp
                    time.sleep(2)
                    if dl:
                        r1 = requests.post(self.dkbm_url, data=data, headers=self.hd1, proxies=global_proxy, timeout=10,
                                           verify=False).json()
                    else:
                        r1 = requests.post(self.dkbm_url, data=data, headers=self.hd1).json()
                    code2 = r1['code']
                    data1 = r1["data"]
                    msg = r1["msg"]
                    if code2 == 0:
                        print(f"[{self.phone}] ✅打卡报名成功==> {data1}")
                    else:
                        print(f"[{self.phone}] ❎打卡报名失败==> {msg}")
                except Exception as e:
                    print("❎打卡报名出现错误")
            else:
                print(f"获取code失败!{r}")
        except Exception as e:
            print("获取打卡报名id出现错误")

    # 领取瓜分资格
    def gfjf(self):
        try:
            current_datetime = datetime.now()
            yesterday_datetime = current_datetime - timedelta(days=1)
            yesterday_now = yesterday_datetime.replace(hour=current_datetime.hour, minute=current_datetime.minute,
                                                       second=current_datetime.second,
                                                       microsecond=current_datetime.microsecond)
            k = yesterday_now.strftime("%Y-%m-%d %H:%M:%S")
            data = {"startTime": k, "token": self.token}
            sign, sign1, timestamp = self.sg(self.bmcodeurl)
            self.hd1['sign'] = sign
            self.hd1['timestamp'] = timestamp
            if dl:
                r = requests.post(self.bmcodeurl, headers=self.hd1, data=data).json()
            else:
                r = requests.post(self.bmcodeurl, headers=self.hd1, data=data).json()
            if r['code'] == 0:
                code1 = r['data']['taskCode']
                data1 = {'taskCode': code1, 'token': self.token}
                sign, sign1, timestamp = self.sg(self.dkbm_url1)
                self.hd1['sign'] = sign
                self.hd1['timestamp'] = timestamp
                time.sleep(2)
                if dl:
                    r1 = requests.post(self.dkbm_url1, headers=self.hd1, data=data1).json()
                else:
                    r1 = requests.post(self.dkbm_url1, headers=self.hd1, data=data1).json()
                print(f"[{self.phone}] 领取瓜分资格==> {r1['msg']}")
                return code1
            else:
                print(f"❎获取taskCode失败! {r}")
                return None
        except Exception as e:
            print(f"领取瓜分资格出现错误")

    # 瓜分积分
    def gfjf1(self, max_retries=3):
        retries = 0
        while retries < max_retries:
            try:
                data1 = {'taskCode': self.gfjf(), 'token': self.token}
                sign, sign1, timestamp = self.sg(self.dkbm_url2)
                self.hd1['sign'] = sign
                self.hd1['timestamp'] = timestamp
                req = requests.post(self.dkbm_url2, headers=self.hd1, data=data1).json()
                a1 = req['data']
                print(f"[{self.phone}] ✅报名瓜分成功==> {a1}")
                break
            except Exception as e:
                retries += 1
                print(f"❎报名瓜分错误,重试次数: {retries}/{max_retries}")
                if retries >= max_retries:
                    print("❎达到最大重试次数，跳过该任务")
                    break
                time.sleep(1)

    def xieru(self, rw, dk):
        try:
            new_data = {
                "pgid": str(self.id)
            }
            if not os.path.exists("./pgsh.json"):
                with open("./pgsh.json", "w") as file:
                    json.dump({}, file)
            with open("./pgsh.json", "r") as file:
                try:
                    data = json.load(file)
                except json.decoder.JSONDecodeError:
                    data = {}
            if rw == 1 and new_data["pgid"] in data and data[new_data["pgid"]]["rw"] == 1:
                print("任务记录已存在。")
                return False
            elif dk == 1 and new_data["pgid"] in data and data[new_data["pgid"]]["dk"] == 1:
                print("打卡记录已存在。")
                return False
            else:
                if rw == 1:
                    data[new_data["pgid"]] = {"rw": 1, "dk": 0}
                elif dk == 1:
                    data[new_data["pgid"]] = {"rw": 1, "dk": 1}
            with open("./pgsh.json", "w") as file:
                json.dump(data, file)
            print("✅写入记录文件成功。")
            return True
        except Exception as e:
            print(f"❎写入记录文件出现错误，初始化文件内容")
            with open("./pgsh.json", "w") as file:
                json.dump({}, file)

    # 读取指定值是否存在
    def duqu(self, aa, rw, dk):
        try:
            if not os.path.exists("./pgsh.json"):
                with open("./pgsh.json", "w") as file:
                    json.dump({}, file)

            with open("./pgsh.json", "r") as file:
                try:
                    data = json.load(file)
                except json.decoder.JSONDecodeError:
                    data = {}
            if rw == 1:
                if str(aa) in data:
                    return data[str(aa)]["rw"]
                else:
                    return False
            elif dk == 1:
                if str(aa) in data:
                    return data[str(aa)]["dk"]
                else:
                    return False
        except Exception as e:
            print(f"读取记录文件出现错误,初始化文件内容")
            with open("./pgsh.json", "w") as file:
                json.dump({}, file)

    # 今日积分
    def jrjf(self, i, token1):
        token = token1.split('#')[0]
        try:
            hd1 = {
                'User-Agent': "okhttp/3.14.9",
                'Accept': 'application/json, text/plain, */*',
                'Version': "1.57.2",
                'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
                'Authorization': token,
                'channel': "android_app"
            }
            data = {'token': token}
            sign, sign1, timestamp = self.sg(self.phone_url)
            self.hd['sign'] = sign
            self.hd['timestamp'] = timestamp
            r = requests.post(self.phone_url, data=data, headers=hd1).json()
            if r['code'] == 0:
                try:
                    sign, sign1, timestamp = self.sg(self.check_url)
                    self.hd['sign'] = sign
                    self.hd['timestamp'] = timestamp
                    r1 = requests.post(self.check_url, data=data, headers=hd1).json()
                    coin_code = r1['code']
                    balance = r1['data']['integral'] if coin_code == 0 else 'N/A'
                except Exception as e:
                    print(f"获取积分失败: {e}")
                    balance = 'N/A'

                try:
                    phone = p(r['data']['phone'])
                    data = {
                        'page': (None, '1'),
                        'pageSize': (None, '100'),
                        'type': (None, '100'),
                        'receivedStatus': (None, '1'),
                        'token': (None, token),
                    }
                    hd = {
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; 23117RK66C Build/UKQ1.230804.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 AgentWeb/5.0.0 UCBrowser/11.6.4.950 com.qiekj.QEUser',
                        'Accept': 'application/json, text/plain, */*',
                        'channel': 'android_app',
                    }
                    re_response = requests.post(self.jrjf_url, headers=hd, files=data).json()
                    current_date = datetime.now().strftime('%Y-%m-%d')
                    total_amount = 0
                    for item in re_response['data']['items']:
                        received_date = item['receivedTime'][:10]
                        if received_date == current_date:
                            total_amount += item['amount']
                    print(f"[{phone}] ✅今日获得积分: {total_amount}")
                    return {
                        '序号': i + 1,
                        '用户': phone,
                        'arg1': balance,
                        'arg2': total_amount
                    }
                except Exception as e:
                    print(f"[账号{i + 1}] ❎查询当日积分出现错误: {e}")
                    return {
                        '序号': i + 1,
                        '用户': i + 1,
                        'arg1': f"❎",
                        'arg2': f"❎"
                    }
            else:
                print(f"[账号{i + 1}] ❎登录失败: {r['msg']}")
                return {
                    '序号': i + 1,
                    '用户': i + 1,
                    'arg1': f"{r['msg']}",
                    'arg2': f"{r['msg']}"
                }
        except requests.exceptions.RequestException as e:
            print(f"[账号{i + 1}] ❎网络请求错误: {e}")
            return {
                '序号': i + 1,
                '用户': i + 1,
                'arg1': f"❎",
                'arg2': f"❎"
            }
        except Exception as e:
            print(f"[账号{i + 1}] ❎查询当日积分出现错误: {e}")
            return {
                '序号': i + 1,
                '用户': i + 1,
                'arg1': f"❎",
                'arg2': f"❎"
            }

    def jf(self):
        try:
            msg_list = []
            print(f"======开始查询所有账号当日收益======")
            for n, yy in enumerate(cookies):
                msg = self.jrjf(n, yy)
                msg_list.append(msg)
            sorted_data = sorted(msg_list, key=lambda x: x['序号'])
            table_content = ''
            for row in sorted_data:
                table_content += f"<tr><td style='border: 1px solid #ccc; padding: 6px;'>{row['序号']}</td><td style='border: 1px solid #ccc; padding: 6px;'>{row['用户']}</td><td style='border: 1px solid #ccc; padding: 6px;'>{row['arg1']}</td><td style='border: 1px solid #ccc; padding: 6px;'>{row['arg2']}</td></tr>"

            self.msg = f"<table style='border-collapse: collapse;'><tr style='background-color: #f2f2f2;'><th style='border: 1px solid #ccc; padding: 8px;'>🆔</th><th style='border: 1px solid #ccc; padding: 8px;'>用户名</th><th style='border: 1px solid #ccc; padding: 8px;'>总积分</th><th style='border: 1px solid #ccc; padding: 8px;'>今日积分</th></tr>{table_content}</table>"
            if ts:
                self.send_msg()
        except Exception as e:
            print(f"查询所有账号当日收益出现错误: {e}")
        if int(b) <= now_time or now_time <= 1:
            with open("./pgsh.json", "w") as file:
                json.dump({}, file)
            print("已重置文件内容")

    def send_msg(self):
        if 'WxPusher_token' in os.environ and os.environ['WxPusher_token'] is not None:
            self.WxPusher_ts()
        if 'PUSH_PLUS_TOKEN' in os.environ and os.environ['PUSH_PLUS_TOKEN'] is not None:
            self.pushplus_ts()
        else:
            print("❎推送失败，未配置推送")

    def WxPusher_ts(self):
        try:
            url = 'https://wxpusher.zjiecode.com/api/send/message'
            params = {
                'appToken': WxPusher_token,
                'content': self.msg,
                'summary': '胖乖生活',
                'contentType': 3,
                'uids': [WxPusher_uid]
            }
            re = requests.post(url, json=params)
            msg = re.json().get('msg', None)
            print(f'WxPusher推送结果：{msg}\\\n')
        except Exception as e:
            print(f"WxPusher推送出现错误: {e}")

    def pushplus_ts(self):
        try:
            url = 'https://www.pushplus.plus/send/'
            data = {
                "token": pushplus_token,
                "title": '胖乖生活',
                "content": self.msg
            }
            re = requests.post(url, json=data)
            msg = re.json().get('msg', None)
            print(f'pushplus推送结果：{msg}\\\n')
        except Exception as e:
            print(f"pushplus推送出现错误: {e}")

    def start(self):
        if self.name():
            print("-----执行领取时间段奖励-----")
            self.timejl()
            if int(a) <= now_time < int(b):
                print("--------滴滴车发车，坐稳了--------\\\n")
                if self.duqu(self.id, 1, 0) == 0:
                    print("-----开始执行签到-----")
                    self.sign()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----先遍历个日常，防止漏网之鱼-----")
                    self.rcrw()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行支付宝看广告-----")
                    self.zfbgg()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行赚大鹅积分-----")
                    self.dejf()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行看视频赚积分-----")
                    self.kspzjf()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行看广告赚积分-----")
                    self.kggzjf()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行浏览商品赚积分-----")
                    self.shop()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行隐藏任务-----")
                    self.ycrw()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行打卡报名-----")
                    self.dkbm()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----开始执行领取瓜分资格-----")
                    self.gfjf()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----执行领取阶梯奖励----")
                    self.jtjl()
                    if dl:
                        time.sleep(2)
                    else:
                        time.sleep(6)
                    print("-----任务执行完毕，记录id-----")
                    self.xieru(1, 0)
                else:
                    print("当前账号已执行过任务，跳过执行")
            else:
                print(f"当前时间非{int(a)}-{int(b)}，跳过今日任务")
            if 14 <= now_time <= 16:
                print("-----开始执行瓜分打卡积分-----")
                if self.duqu(self.id, 0, 1) == 0:
                    self.gfjf1()
                    self.xieru(0, 1)
                else:
                    print("当前账号已执行过任务，跳过执行")
            else:
                print(f"当前时间非14-16，跳过瓜分打卡积分")


if __name__ == '__main__':
    print(f"当前版本: {v}")
    print("TL库:https://github.com/3288588344/toulu.git")
    print("QQ频道：98do10s246")
    print("微信机器人:kckl6688")
    print("tg频道：https://t.me/TLtoulu")
    requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)
    print = partial(print, flush=True)
    if jh:
        print("当前聚合ck模式，所有模式ck生效")
        ck1 = []
        if 'PGSH_TOKEN' in os.environ:
            ck1.append(os.environ.get('PGSH_TOKEN'))
        if ckurl != "":
            r = requests.get(ckurl)
            ck1.append(r.text.strip())
        if ck != "":
            ck1.append(ck)
        if not ck1:
            print("变量为空，请设置其中一个变量后再运行")
            exit(-1)
        cookie = '&'.join(ck1)
    else:
        if 'PGSH_TOKEN' in os.environ:
            cookie = os.environ.get('PGSH_TOKEN')
        else:
            print("环境变量中不存在[PGSH_TOKEN],启用本地或数据库地址模式")
            if ckurl != "":
                r = requests.get(ckurl)
                cookie = r.text.strip()
            else:
                cookie = ck
        if cookie == "":
            print("本地及数据库地址变量为空，请设置其中一个变量后再运行")
            exit(-1)
    cookies = cookie.split("&")
    print(f"胖乖生活共获取到 {len(cookies)} 个账号")
    now_time = datetime.now().hour
    if dl:
        start_dlapi()
    i = 1
    if bf:
        print("✅开启并发模式")
        if dl:
            print("✅开启代理模式")
            with ThreadPoolExecutor(max_workers=int(bfsum)) as executor:
                futures = [executor.submit(PGSH(ck).start) for ck in cookies]
                for i, future in enumerate(as_completed(futures)):
                    print(f"======执行第{i + 1}个账号======")
                    future.result()
            stop_event.set()
            time.sleep(2)
            PGSH(ck).jf()
        else:
            print("❎未开启代理模式")
            with ThreadPoolExecutor(max_workers=int(bfsum)) as executor:
                futures = [executor.submit(PGSH(ck).start) for ck in cookies]
                for i, future in enumerate(as_completed(futures)):
                    print(f"======执行第{i + 1}个账号======")
            time.sleep(2)
            PGSH(ck).jf()
    else:
        print("✅常规运行模式")
        if dl:
            print("✅开启代理模式")
            for i, ck in enumerate(cookies):
                print(f"======开始第{i + 1}个账号======")
                now_time = datetime.now().hour
                PGSH(ck).start()
                print("2s后进行下一个账号")
                time.sleep(2)
            stop_event.set()
            time.sleep(2)
            PGSH(ck).jf()
        else:
            print("❎未开启代理模式")
            for i, ck in enumerate(cookies):
                print(f"======开始第{i + 1}个账号======")
                now_time = datetime.now().hour
                PGSH(ck).start()
                print("2s后进行下一个账号")
                time.sleep(2)
            time.sleep(2)
            PGSH(ck).jf()
