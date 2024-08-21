#环境变量 chmlck 取url请求头中的token
#变量格式 token#备注，多账号换行
#微信扫码打开：https://i.postimg.cc/kGQrQ79B/Screenshot-2024-08-21-17-17-34-718-com-tencent-mm-edit.jpg
或者复制打开：#小程序://长虹美菱会员服务/4Tyqa3BKqs1AW0a
#有问题联系3288588344
#频道：https://pd.qq.com/s/672fku8ge







import os
import requests
response = requests.get("https://github.com/3288588344/toulu/blob/main/tl.txt")
response.encoding = 'utf-8'
txt = response.text
print(txt)


accounts = os.getenv("chmlck", "").splitlines()
print("☞☞☞ 长虹美菱每日签到 ☜☜☜\n")

if not accounts:
    print("未找到任何账号信息。")
else:
    for account in accounts:
        if not account.strip():
            continue
        try:
            token, note = account.split("#")
        except ValueError:
            print(f"格式错误: {account}")
            continue

        url = "https://hongke.changhong.com/gw/applet/aggr/signin"
        params = {'aggrId': "608"}
        headers = {
            'User-Agent': "Mozilla/5.0 (Linux; Android 10; Mobile Safari/537.36)",
            'Accept-Encoding': "gzip, deflate",
            'Content-Type': "application/json",
            'Token': token.strip()
        }

        try:
            response = requests.post(url, params=params, headers=headers)
            if response.status_code == 200:
                print(f"{note.strip()}：签到成功")
            elif response.status_code == 400:
                print(f"{note.strip()}：请勿重复签到")
            else:
                print(f"{note.strip()}：响应状态码 {response.status_code} - {response.text}")
        except requests.RequestException as e:
            print(f"{note.strip()}：请求失败 - {e}")
