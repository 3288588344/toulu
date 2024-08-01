#需要填的值在最下面
#蜜雪冰城抢券 填场次时间即可 比如11:00 拉到最下面自己填token进去 卡着58 59秒跑 跑之前开飞行或者挂爱加速  避免405黑ip 有叼毛已经用这个抢到了  
import hashlib
import time
import requests
import datetime
response = requests.get("https://raw.githubusercontent.com/3288588344/toulu/main/tl.txt")
response.encoding = 'utf-8'
txt = response.text
print(txt)
def ts():
    return str(int(time.time()*1000))
def wait(sleepTime):
    nowTine = time.strftime('%H', time.localtime())
    nextTime = str(int(nowTine) + 1).zfill(2)
    print('脚本提前', sleepTime, f'活动开始时间{nextTime}:00:00')
    timeArray = time.strptime(time.strftime('%Y%m%d') + f'{nextTime}0000', "%Y%m%d%H%M%S")
    timeStamp = int(time.mktime(timeArray))
    while True:
        reduce_time = time.time() + sleepTime - timeStamp  # 差值秒
        if time.time() + sleepTime - timeStamp > 0:
            print(
                f"当前时间{time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))},，提前结束{sleepTime}s")
            break
        else:
            if abs(reduce_time) > 2:  # 如果剩余时间大于2s，则睡眠剩余的一半时间
                print(
                    f"当前时间{time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))}，睡眠{abs(reduce_time) / 2}s")
                time.sleep(abs(reduce_time) / 2)
class MXMS:
    def __init__(self,atoken):
        self.headers={
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b19)XWEB/9193',
            'Origin': 'https://mxsa-h5.mxbc.net',
            'Referer': 'https://mxsa-h5.mxbc.net/',
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Token': atoken
        }
    def mkpayload(self,params):
        params.update({'stamp':ts()})
        sorted_items = sorted(params.items())
        formatted_string = '&'.join([f'{k}={v}' for k, v in sorted_items])+'c274bac6493544b89d9c4f9d8d542b84'
        params.update({'sign':hashlib.md5(formatted_string.encode()).hexdigest()})
        return params
    def info(self):
        u='https://mxsa.mxbc.net/api/v1/h5/marketing/secretword/info'
        p={
            'marketingId': marketingId,
            's': '2',
        }
        p=self.mkpayload(p)
        r=requests.get(u,headers=self.headers,params=p)
        if 'marketingId' in r.text:
            rj=r.json()
            print('请确定一下参数是否你填写的一致')
            print('marketingId：',rj['data']['marketingId'])
            print(rj['data']['hintWord'])
            print('-'*50)
        else:
            print(r.text)
            print('信息获取异常')
    def confirm(self):
        try:
            u='https://mxsa.mxbc.net/api/v1/h5/marketing/secretword/confirm'
            p={"marketingId":marketingId,"round":round,'s':'2',"secretword":secretword}
            p = self.mkpayload(p)
            r=requests.post(u,headers=self.headers,json=p,timeout=0.75)
            print(r.text)
            if '已达领取上限' in r.text:
                return True
        except Exception as e:
            print(e)
    def run(self):
        self.info()
        wait(0.005)
        print(datetime.datetime.now())
        for i in range(fb_cont):
            if self.confirm()==True:
                return True
            time.sleep(0.75)
        print(datetime.datetime.now())
if __name__ == '__main__':
    atoken='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUx'#填token
    marketingId='1816854086004391938'
    secretword = "好一朵美丽的茉莉花"#口令
    fb_cont = 300
    nowTine0 = time.strftime('%H', time.localtime())
    nextTime0 = str(int(nowTine0) + 1).zfill(2)
    round=nextTime0+":00"
    api=MXMS(atoken)
    api.run()
