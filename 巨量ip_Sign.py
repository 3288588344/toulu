# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""
* 仅供学习交流，请在下载后的24小时内完全删除 请勿将任何内容用于商业或非法目的，否则后果自负。
* 巨量ip签到。每日签到领取1000免费IP
* 巨量ip注册地址  https://www.juliangip.com/user/reg?inviteCode=1031551
*token获取平台：http://www.gxfc-s4.com/
*有问题联系3288588344
*频道：https://pd.qq.com/s/672fku8ge
#!/usr/bin/env python3
"""
# # # # # # # # # # # 

import json
import re

import requests
import urllib3
from urllib3.exceptions import InsecureRequestWarning

urllib3.disable_warnings(InsecureRequestWarning)
token = "填写token"
username = "填入你的巨量账号"
password = "填入你的巨量密码"

def jl_login(username, password):
    url = "https://www.juliangip.com/login/go"
    payload = f'type=password&username={username}&password={password}&sms_code='
    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://www.juliangip.com',
        'Referer': 'https://www.juliangip.com/user/login',
        'Sec-Ch-Ua': '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43',
        'X-Requested-With': 'XMLHttpRequest'
    }

    response = requests.request("POST", url, headers=headers, data=payload, verify=False)
    if response.status_code == 200:
        return "_JSID=" + response.cookies.get("_JSID")
    return None


def jl_users(tk):
    url = "https://www.juliangip.com/users/"
    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Sec-Ch-Ua': '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        "Cookie": tk,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43',
    }
    response = requests.get(url, headers=headers, verify=False)
    if response.status_code == 200:
        return re.findall("const tx =new TencentCaptcha\('(\d+)'", response.text)
    return []


def getcode(aid):
    url = "http://119.96.239.11:8888/api/getcode"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "timeout": "90",  # 超时时间 请确保http请求超时>该参数，否则识别成功但连接已断开失败
        "type": "tencent-turing",  # 类型
        "appid": aid,  # 抓包所得aid/appid/id参数  tencent[aid/appid]  netease[id]
        "token": token,  # 用户token 用于识别区分用户
        "developeraccount": ""  # 软件开发者用户名 //可空
    }
    response = requests.post(url, headers=headers, verify=False, timeout=90, data=json.dumps(data))
    if response.status_code == 200:
        if response.json()['status'] == 200:
            return response.json()
        else:
            print(response.json())
            return {}
    return {}


def getFree(tk, js):
    headers = {
        "Host": "www.juliangip.com",
        "Cookie": tk,
        "sec-ch-ua": "\"Microsoft Edge\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        "sec-ch-ua-mobile": "?0",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43",
        "sec-ch-ua-platform": "\"Windows\"",
        "origin": "https://www.juliangip.com",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": "https://www.juliangip.com/users/",
        "accept-language": "zh-CN,zh;q=0.9"
    }
    data_js = json.loads(js['data']['code'])
    data = {
        "randStr": data_js['randstr'],
        "ticket": data_js["ticket"]
    }
    url = "https://www.juliangip.com/users/getFree"
    response = requests.post(url, headers=headers, data=data,
                             verify=False)  # 注意：verify=False 用于禁用SSL验证，如果需要SSL验证，请删除这个参数
    if response.status_code == 200:
        print(response.json())
    else:
        print(response.text)


def main():
    tk = jl_login(username, password)
    if not tk:
        print("登录失败")
        return
    aid = jl_users(tk)
    if not aid:
        print("获取aid失败")
        return
    js = getcode(aid[0])
    if not js:
        print("获取打码平台失败")
        return
    getFree(tk, js)


if __name__ == '__main__':
    main()
