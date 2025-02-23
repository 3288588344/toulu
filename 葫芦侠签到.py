"""
Description：葫芦侠签到板块自动化脚本
* cron "30 6 * * *"
账号密码填在最下方，不需要变量
TL库：https://pd.qq.com/s/btv4bw7av 
TG频道：https://t.me/TLtoulu
长期套餐大额流量电话卡办理地址：https://hk.yunhaoka.cn/#/pages/micro_store/index?agent_id=669709
微信机器人:kckl6688
公众号:哆啦A梦的藏宝箱


"""
import requests
import json
import hashlib
import time
import re

def get_categoryid_list(url):
    headers = {
        "Host": "floor.huluxia.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.text
    else:
        return False

def send_sign_post(url, post_data):
    headers = {
        "Connection": "close",
        "Content-Length": "37",
        "Accept-Encoding": "gzip",
        "Host": "floor.huluxia.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "okhttp/3.8.1"
    }
    response = requests.post(url, headers=headers, data=post_data.encode('utf-8'))
    if response.status_code == 200:
        return response.text
    else:
        return False

def get_login_sign():
    password_encode = hashlib.md5(password.encode()).hexdigest()
    encode_text = f"account{account}device_code[d]7f659db3-9ffb-41ec-80c3-fbf0db5691a9password{password_encode}voice_codefa1c28a5b62e79c3e63d9030b6142e4b"
    account_sign = hashlib.md5(encode_text.encode()).hexdigest()
    account_upper = account_sign.upper()
    url= "http://floor.huluxia.com/account/login/ANDROID/4.1.8?platform=2&gkey=000000&app_version=4.2.1.7&versioncode=371&market_id=tool_huluxia&_key=&device_code=%5Bd%5D7f659db3-9ffb-41ec-80c3-fbf0db5691a9&phone_brand_type=UN"
    data = {
        "account" : str(account),
        "login_type" : "2",
        "password" : str(password_encode),
        "sign" : str(account_upper)
    }
    headers = {
        "Host": "floor.huluxia.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "okhttp/3.8.1"
    }
    response_login = requests.post(url,headers=headers,data=data)
    if response_login.status_code == 200:
        login_json = response_login.json()
        login_status = login_json['status']
        if login_status == 1:
            login_username = login_json['user']['nick']
            login_uid = login_json['user']['userID']
            login_key = login_json['_key']
            print("——"*20+f"\n当前状态:登陆成功\n用户ID:{login_uid}\n用户名:{login_username}\n"+"——"*20)
            return login_key
        else:
            return False
    else:
        return False

def process_run(loginkey):
    url = "http://floor.huluxia.com/category/list/ANDROID/2.0"
    getiddata = get_categoryid_list(url)
    categoryids = re.findall('"categoryID":(.*?),',getiddata)
    titles = re.findall('"title":"(.*?)",',getiddata)
    print(f"板块数量:{len(categoryids)}")
    sign_counts = 0
    success_category_ids = []
    for title, categoryid in zip(titles,categoryids):
        timestamp = str(int(time.time() * 1000))
        encode_text = f"cat_id{categoryid}time{timestamp}fa1c28a5b62e79c3e63d9030b6142e4b"
        md5_encode = hashlib.md5(encode_text.encode()).hexdigest()
        post_data = f"sign={md5_encode.upper()}"
        sign_url = f"http://floor.huluxia.com/user/signin/ANDROID/4.1.8?platform=2&gkey=000000&app_version=4.2.1.7&versioncode=371&market_id=tool_huluxia&_key={loginkey}&phone_brand_type=UN&cat_id={categoryid}&time={timestamp}"
        signdata = send_sign_post(sign_url, post_data)
        signjson = json.loads(signdata)
        signstatus = signjson['status']
        if signstatus == 1:
            print(f"板块:{title}\t状态:签到成功!")
            sign_counts += 1
            success_category_ids.append(categoryid)
    errorsign = len(categoryids) - sign_counts
    text = f"签到成功：{sign_counts}个板块"
    print("——"*20+f"\n{text}\n"+"——"*20)
        
if __name__ == "__main__":
    account = "" # 这里填葫芦侠绑定手机号
    password = "" # 这里填葫芦侠的密码
    loginkey = get_login_sign()
    process_run(loginkey)