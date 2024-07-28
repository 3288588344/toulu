# cron: 10 */2 * * *
# new Env('更新IP代理白名单');
#有问题联系3288588344
#频道：https://pd.qq.com/s/672fku8ge

#长期套餐大额流量电话卡办理地址：https://hk.yunhaoka.cn/#/pages/micro_store/index?agent_id=669709


import requests
import hashlib
import urllib.parse


JULIANG_KEY = ''  # 填入巨量的 Key
JULIANG_TRADE_NO = ''  # 填入巨量的 Trade No
XK_APIKEY = ''  # 填入星空的 API Key
XK_SIGN = ''  # 填入星空的 Sign
XIEQU_UID = ''  # 填入携趣的 UID
XIEQU_UKEY = ''  # 填入携趣的 UKEY


class SignKit:

    @staticmethod
    def md5_sign(params, secret):
        sign_content = SignKit.get_sign_content(params)
        return hashlib.md5((sign_content + '&key=' + secret).encode('utf-8')).hexdigest()

    @staticmethod
    def get_sign_content(params):
        params.pop('sign', None)  # 删除 sign
        sorted_params = sorted(params.items())
        sign_content = '&'.join([f"{k}={str(v)}" for k, v in sorted_params if str(v) is not None and not str(v).startswith('@')])
        return sign_content

def get_current_ip():
    response = requests.get('https://myip.ipip.net/json')
    data = response.json()
    return data['data']['ip']

def update_juliang_white_list(ip, JULIANG_KEY, JULIANG_TRADE_NO):
    if JULIANG_KEY and JULIANG_TRADE_NO:
        params = {
            'new_ip': ip,
            'reset': '1',
            'trade_no': JULIANG_TRADE_NO
        }
        sign = SignKit.md5_sign(params, JULIANG_KEY)
        query_string = urllib.parse.urlencode(params) + "&sign=" + sign

        url = f'http://v2.api.juliangip.com/dynamic/replaceWhiteIp?{query_string}'
        response = requests.get(url)
        return response.text

def update_xk_white_list(ip, XK_APIKEY, XK_SIGN):
    if XK_APIKEY and XK_SIGN:
        url = f'http://api2.xkdaili.com/tools/XApi.ashx?apikey={XK_APIKEY}&type=addwhiteip&sign={XK_SIGN}&flag=8&ip={ip}'
        response = requests.get(url)
        return response.text

def update_xiequ_white_list(ip, XIEQU_UID, XIEQU_UKEY):
    if XIEQU_UID and XIEQU_UKEY:
        url = f'http://op.xiequ.cn/IpWhiteList.aspx?uid={XIEQU_UID}&ukey={XIEQU_UKEY}&act=get'
        response = requests.get(url)
        data = response.text
        arr = data.split(',')
        if ip not in arr:
            requests.get(f'http://op.xiequ.cn/IpWhiteList.aspx?uid={XIEQU_UID}&ukey={XIEQU_UKEY}&act=del&ip=all')
            response = requests.get(f'http://op.xiequ.cn/IpWhiteList.aspx?uid={XIEQU_UID}&ukey={XIEQU_UKEY}&act=add&ip={ip}')
            return '更新xiequ白名单成功' if response.status_code == 200 else '更新xiequ白名单出错'
        else:
            return '携趣白名单ip未变化'


def main():
    ip = get_current_ip()
    print('当前ip地址：', ip)

    print('更新巨量白名单结果：', update_juliang_white_list(ip, JULIANG_KEY, JULIANG_TRADE_NO))
    print('更新星空白名单结果：', update_xk_white_list(ip, XK_APIKEY, XK_SIGN))
    print('更新携趣白名单结果：', update_xiequ_white_list(ip, XIEQU_UID, XIEQU_UKEY))

if __name__ == "__main__":
    main()
