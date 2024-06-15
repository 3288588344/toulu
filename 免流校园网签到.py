import requests
import time

url = "http://8.137.111.254:1024/user/index.php"
params = {'act': "do_login"}
payload = "name=xxxxxx&pass=xxxxxxxxxxx"#name是账号，pass是密码
headers = {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    'Accept': "application/json, text/javascript, */*; q=0.01",
    'Accept-Encoding': "gzip, deflate",
    'X-Requested-With': "XMLHttpRequest",
    'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
    'Origin': "http://8.137.111.254:1024",
    'Referer': "http://8.137.111.254:1024/user/index.php",
    'Accept-Language': "zh-CN,zh;q=0.9",
}
response = requests.post(url, params=params, data=payload, headers=headers)

cookie_value = response.cookies.get('PHPSESSID')
print("Cookie value:", cookie_value)

time.sleep(2)

url = "http://8.137.111.254:1024/user/getline.php"
params = {'act': "sign"}
headers = {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    'Accept': "application/json, text/javascript, */*; q=0.01",
    'Accept-Encoding': "gzip, deflate",
    'X-Requested-With': "XMLHttpRequest",
    'Origin': "http://8.137.111.254:1024",
    'Referer': "http://8.137.111.254:1024/user/admin.php",
    'Accept-Language': "zh-CN,zh;q=0.9",
    'Cookie': f"PHPSESSID={cookie_value}"
}
response = requests.post(url, params=params, headers=headers)

print(response.json())
