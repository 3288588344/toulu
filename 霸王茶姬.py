"""
TL库
QQ频道：https://pd.qq.com/s/672fku8ge
tg频道：https://t.me/TLtoulu
new Env("霸王茶姬签到")
cron: 20 20,7 * * *
打开微信小程序抓webapi.qmai.cn里面的qm-user-token(一般在请求头里)填到变量bwcjck里面即可

支持多用户运行

多用户用&或者@隔开
例如账号1：hv1 账号2：hv2
则变量为hv1&1hv2
export bwcjck=""



"""
import requests
import re
import os
import time



#分割变量
if 'bwcjck' in os.environ:
    bwcjck = re.split("@|&",os.environ.get("bwcjck"))
    print(f'查找到{len(bwcjck)}个账号')
else:
    bwcjck = ''
    print('无bwcjck变量')



def yx(ck):
    headers = {'qm-user-token': ck,'User-Agent': 'Mozilla/5.0 (Linux; Android 14; 2201122C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/2247 MicroMessenger/8.0.47.2560(0x28002F30) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64 MiniProgramEnv/android','qm-from': 'wechat'}
    dl = requests.get(url='https://webapi.qmai.cn/web/catering/crm/personal-info',headers=headers).json()
    if dl['message'] == 'ok':
        print(f"账号：{dl['data']['mobilePhone']}登录成功")
        data = {"activityId":"947079313798000641","appid":"10086"}
        lq = requests.post(url='https://webapi.qmai.cn/web/cmk-center/sign/takePartInSign',data=data,headers=headers).json()
        if lq['message'] == 'ok':
            print(f"签到情况：获得{lq['data']['rewardDetailList'][0]['rewardName']}：{lq['data']['rewardDetailList'][0]['sendNum']}")
        else:
            print(f"签到情况：{lq['message']}")
def point(ck):
    headers = {'qm-user-token': ck,'User-Agent': 'Mozilla/5.0 (Linux; Android 14; 2201122C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160065 MMWEBSDK/20231202 MMWEBID/2247 MicroMessenger/8.0.47.2560(0x28002F30) WeChat/arm64 Weixin NetType/5G Language/zh_CN ABI/arm64 MiniProgramEnv/android','qm-from': 'wechat'}
    dl = requests.post(url='https://webapi.qmai.cn/web/catering/crm/points-info',headers=headers).json()
    # print(f"账号：{dl}")
    if dl['message'] == 'ok':
        totalPoints=dl['data'] ['totalPoints'] 
        soonExpiredPoints=dl['data'] ['soonExpiredPoints'] 
        expiredTime=dl['data'] ['expiredTime'] 
        print(f"积分：{totalPoints} 其中有 {soonExpiredPoints }积分将于{ expiredTime }过期")  


def main():
    z = 1
    for ck in bwcjck:
        try:
            print(f'登录第{z}个账号')
            print('----------------------')
            yx(ck)
            point(ck)
            print('----------------------')
            z = z + 1
        except Exception as e:
            print(e)
            print('未知错误1')

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('未知错误')
