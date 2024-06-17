import hashlib
import math
import time
import requests
import datetime
import os
from urllib.parse import urlparse, parse_qs
import random
print('''
1. 抓取url中的accountId，sessionId
2. 环境变量为 wc，值为 accountId&sessionId两个抓取数据，多账户以&分隔
3. 20240615修复抽奖抽奖
''')


wc = os.getenv('wc')
cks = wc.split('&')
headers = {
    'Host': 'xmt.taizhou.com.cn',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.101 Mobile Safari/537.36;xsb_wangchao;xsb_wangchao;6.0.2;native_app;6.10.0',
    'Accept': '*/*',
    'X-Requested-With': 'com.shangc.tiennews.taizhou',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://xmt.taizhou.com.cn/readingAward-v7-3/?gaze_control=01',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
}

def get_current_date():
    now = datetime.datetime.now()
    year_str = str(now.year)
    month_str = f"0{now.month}" if now.month < 10 else str(now.month)
    day_str = f"0{now.day}" if now.day < 10 else str(now.day)
    print(f"当前日期{year_str}{month_str}{day_str}")
    return year_str + month_str + day_str

def generate_md5(input_str):
    md5_obj = hashlib.md5()
    input_str_encoded = input_str.encode('utf-8')
    md5_obj.update(input_str_encoded)
    return md5_obj.hexdigest()

def fetch_article_list():
    response = requests.get(f'https://xmt.taizhou.com.cn/prod-api/user-read/list/{get_current_date()}', headers=headers)
    msg = response.json()['msg']
    print(msg)
    return response.json()

def mark_article_as_read(article_id):
    timestamp_str = str(math.floor(time.time() * 1000))
    signature = generate_md5('&&' + article_id + '&&TlGFQAOlCIVxnKopQnW&&' + timestamp_str)
    url = f'https://xmt.taizhou.com.cn/prod-api/already-read/article?articid={article_id}&timestamp={timestamp_str}&signature={signature}'
    response = requests.get(url, headers=headers)
    print(response.text)

def participate_in_draw(cookie_value):
    draw_headers = {
        'Host': 'srv-app.taizhou.com.cn',
        'User-Agent': headers['User-Agent'],
        'Content-type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'Origin': 'https://srv-app.taizhou.com.cn',
        'X-Requested-With': 'com.shangc.tiennews.taizhou',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://srv-app.taizhou.com.cn/luckdraw-awsc-ra-1/',
        'Cookie': cookie_value,
    }
    login_url = f'https://srv-app.taizhou.com.cn/tzrb/user/loginWC?accountId={account_id}&sessionId={session_id}'
    response = requests.get(login_url, headers=draw_headers)
    print('res:',response.headers)
    set_cookie = response.headers['Set-Cookie'].split(';')[0]+';'
    print('ck:',set_cookie)
    draw_headers['Cookie'] = set_cookie
    post_data = {'activityId': '67', 'sessionId': 'undefined', 'sig': 'undefined', 'token': 'undefined'}
    time.sleep(2)
    draw_response = requests.post('https://srv-app.taizhou.com.cn/tzrb/userAwardRecordUpgrade/saveUpdate', headers=draw_headers, data=post_data)
    print(draw_response.text)
    display_draw_results(set_cookie)

def get_special_cookie():
    special_cookie_url = f'https://xmt.taizhou.com.cn/prod-api/user-read/app/login?id={account_id}&sessionId={session_id}&deviceId=00000000-67f6-d0c4-0000-000059418bd5'
    response = requests.get(special_cookie_url, headers=headers)
    print('获取jsesesionid:',response.headers)
    return response.headers

def display_draw_results(cookies):
    draw_result_headers = {
        'Host': 'srv-app.taizhou.com.cn',
        'Connection': 'keep-alive',
        'User-Agent': headers['User-Agent'],
        'Accept': '*/*',
        'X-Requested-With': 'com.shangc.tiennews.taizhou',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://srv-app.taizhou.com.cn/luckdraw-awsc-231023/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie': '',
    }
    draw_result_headers['Cookie'] = cookies
    result_url = 'https://srv-app.taizhou.com.cn/tzrb/userAwardRecordUpgrade/pageList?pageSize=10&pageNum=1&activityId=67'
    result_data = requests.get(result_url, headers=draw_result_headers).json()["data"]["records"]
    for record in result_data:
        create_time_str = str(record["createTime"])
        award_name_str = str(record["awardName"])
        print(f"{create_time_str}---------{award_name_str}")

if __name__ == '__main__':

   for ck_parts in cks:
       ck = ck_parts.split("#")
       account_id = ck[0]
       session_id = ck[1]
       print(f"账号{account_id}开始执行")
       special_cookie = get_special_cookie()['Set-Cookie']
       headers['Cookie'] = special_cookie
       print('去获取文章列表')
       json_data = fetch_article_list()
       for article in json_data['data']['articleIsReadList']:
           article_id = article['id']
           article_title = article['title']
           if article['isRead'] == True:
              print(f"文章{article_title}已读")
           else:
              print(f"文章{article_title}未读")
              time.sleep(random.randint(3, 5))
              mark_article_as_read(str(article_id))
       time.sleep(random.randint(3, 5))
       participate_in_draw(special_cookie)
       print('休息半分钟，开始下一个账号')
       time.sleep(random.randint(30, 40))

