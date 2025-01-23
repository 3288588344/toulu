#每天签到积分，可以换实物
#抓包找miniapi.linkkids.cn域名，请求头含cookie的，_platform_num=开头的
#推送自己看着写，wxpusher的
#入口:微信小程序好宝贝母婴生活
#环境变量名hbbck

import os
import requests
import json

# 获取并处理环境变量 hbbck
hbbck = os.environ.get('hbbck', '')  # 获取环境变量

# 如果 hbbck 是多个 cookie 用逗号分隔，将它们合并成一个适合 Cookie 格式的字符串
cookie_str = hbbck if not hbbck else "; ".join(hbbck.split(','))

push_token = 'UID_Rj**********'  # wxpusher的UID
push_title = '好宝贝'  # 推送标题
push_content = 'TL库\n\n'
wxapp_token = 'AT_aTsJ*********'  # wxpusher的APPToken

def wxpusher_send():
    """
    发送消息到wxpusher
    """
    headers = {'Content-Type': 'application/json;charset=utf-8'}
    data = {
        "appToken": wxapp_token,
        "uids": [push_token],
        "topicIds": [],
        "summary": push_title,
        "content": push_content,
        "contentType": 1,
        "verifyPay": False
    }

    try:
        response = requests.post('https://wxpusher.zjiecode.com/api/send/message', headers=headers, data=json.dumps(data))
        
        # 获取响应的 JSON 数据
        response_json = response.json()
        
        print(f"wxpusher 推送: {response_json.get('msg', '没有返回 msg 字段')}")
        
    except requests.exceptions.RequestException as e:
        print(f"wxpusher 推送失败: {e}")

# 获取公告信息
def get_announcement():
    try:
        external_url = 'https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt'
        response = requests.get(external_url)
        if response.status_code == 200:
            print("公告:", response.text)
            print("公告获取成功，开始执行签到请求...")
        else:
            print(f"获取公告失败，状态码: {response.status_code}")
    except Exception as e:
        print(f"获取公告时发生错误: {e}")

# 获取并处理签到请求
def sign_in():
    url = "https://miniapi.linkkids.cn/common/coc/do/sign"
    params = {
        '_platform_num': "156537",
        'appid': "wx46d990aaf4b05faf",
        'apptype': "3",
        'bsharekey': "17366635121380080655",
        'shareCode': "17366635121380080655",
        'cids': "23,24"
    }
    headers = {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b19)XWEB/11581",
        'xweb_xhr': "1",
        'X-Request-With': "XMLHttpRequest",
        'Content-Type': "application/json; charset=utf-8",
        'Sec-Fetch-Site': "cross-site",
        'Sec-Fetch-Mode': "cors",
        'Sec-Fetch-Dest': "empty",
        'Referer': "https://servicewechat.com/wx46d990aaf4b05faf/2/page-frame.html",
        'Accept-Language': "zh-CN,zh;q=0.9",
        'Cookie': cookie_str  # 使用拼接后的 cookie 字符串
    }

    response = requests.get(url, params=params, headers=headers)
    aaa = json.loads(response.text)
    if aaa['message'] == 'success':
        push_content = f"签到成功，获得{aaa['data']['rewards'][0]['info']}"
    else:
        push_content = f"签到失败，{aaa['message']}"
    
    print(push_content)
    wxpusher_send()

def main():
    get_announcement()  
    sign_in()  

if __name__ == "__main__":
    main()
