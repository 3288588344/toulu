import requests
import os

#抓包域名https://ys.shajixueyuan.com/api/user_sign/sign
#取url请求中的token，变量名：dfjsck
#变量格式 token#备注，多账号换行或者用@连接
#【tl库】：https://pd.qq.com/s/btv4bw7av
#联系：3288588344


def sign(token, remark):
    url = "https://ys.shajixueyuan.com/api/user_sign/sign"
    headers = {
        'User-Agent': "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220099 MMWEBSDK/20240404 MMWEBID/2307 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        'token': token
    }
    response = requests.post(url, headers=headers)
    data = response.json()
    if data['code'] == 1:
        msg = data['data']['msg']
        energy_release = data["data"]["rewards_info"]["energy_release"]
        print(f"[{remark}] 签到结果: {msg}, 释放 {energy_release} 能量果子")
    else:
        msg = data["msg"]
        print(f"[{remark}] 签到失败原因: {msg}")

def issueRewards(token, remark):
    url = "https://ys.shajixueyuan.com/api/quest.quest/issueRewards"
    headers = {
        'User-Agent': "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220099 MMWEBSDK/20240404 MMWEBID/2307 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        'token': token
    }
    data = {
        "quest_id": 4
    }
    response = requests.post(url, json=data, headers=headers)
    data = response.json()
    msg = data['msg']
    print(f"[{remark}] 分享结果: {msg}")

def info(token, remark):
    url = "https://ys.shajixueyuan.com/api/user/info"
    headers = {
        'User-Agent': "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220099 MMWEBSDK/20240404 MMWEBID/2307 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        'token': token
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    if data['code'] == 1:
        remaining_fruits = float(data["data"]["remaining_fruits"])
        nickname = data["data"]["nickname"]
        print(f"[{remark}]：当前余额: {remaining_fruits}")
        if remaining_fruits >= 0.3:
            apply(token, remark)
        else:
            print(f"[{remark}] 余额不足，无法进行提现")
    else:
        msg = data["msg"]
        print(f"[{remark}] 查询失败: {msg}")

def apply(token, remark):
    url = "https://ys.shajixueyuan.com/api/user.user_withdraw/apply"
    headers = {
        'User-Agent': "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220099 MMWEBSDK/20240404 MMWEBID/2307 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        'token': token
    }
    data = {
        "fruit_withdraw_amount": "0.3",
        "pay_gateway": "wechat"
    }
    response = requests.post(url, json=data, headers=headers)
    data = response.json()
    msg = data['msg']
    print(f"[{remark}] 提现结果: {msg}")

if __name__ == "__main__":
    tokens = os.environ.get('dfjsck')
    if not tokens:
        print("获取账号失败，请检查配置是否正确")
    else:
        # 将换行符替换为 @ 号，分割每个账号
        tokens_list = [token.strip() for token in tokens.replace('@', '\n').split('\n') if token.strip()]
        for index, item in enumerate(tokens_list, start=1):
            parts = item.split('#')
            token = parts[0].strip()  # 提取 token
            remark = parts[1].strip() if len(parts) > 1 else f"账号{index}"  # 提取备注，如果没有则用“账号X”代替

            print(f"===== 开始执行第 {index} 个账号任务 =====")
            print(f"账号: {remark}")
            print(f"===== 开始执行签到任务 =====")
            sign(token, remark)
            print(f"===== 开始执行分享任务 =====")
            issueRewards(token, remark)
            print(f"===== 开始执行查询和提现任务 =====")
            info(token, remark)
            print("==============================")