## 此脚本用于达美乐短信认证，只需要手动进一次游戏界面，不用玩！！！！
## 替换每期GAME_TYPE参数，游戏类型

# TL库:https://github.com/3288588344/toulu.git
#  tg频道:https://t.me/TLtoulu
# QQ频道:https://pd.qq.com/s/672fku8ge
  
import requests

# 固定分数
SCORE = "G+oAJ6PkCLjILdZ4ynoxaH4wQGqHQyXKKBe1tD/C6jj/Ew+gBmSGDj60ggw739hvaz0nzfQjha5jA+yBLiBE1smAjOR7xSLt6bR1cCNDiR6VgbfCYF6o19AvuHB64YTgwUQuJcSOP2zODgkjucSo33lwk1NJ82BFmA88v2sjJGLbMisjWWE0mOSeXz6VKNAhoVF8fwfjw79sxeEoUadqHkrpvUOuyswvzHsUJIlFwqD2eRQtffmR0PQNxFKoqttskJWpQTQ73uLYEjJfm9VCUxksVkqhtvzprqib9H4jFunQqQ25zdq09+0ZI6v7fLarKXEkV0/V+WmuEHzHxzHI+Q=="

# 每期游戏类型
GAME_TYPE = "volcano"

# 统一请求头
headers = {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b13)XWEB/11177",
    'Content-Type': "application/x-www-form-urlencoded",
    'xweb_xhr': "1",
    'Sec-Fetch-Site': "cross-site",
    'Sec-Fetch-Mode': "cors",
    'Sec-Fetch-Dest': "empty",
    'Referer': "https://servicewechat.com/wx887bf6ad752ca2f3/66/page-frame.html",
    'Accept-Language': "zh-CN,zh;q=0.9"
}

def post_request(endpoint, payload):
    url = f"https://game.dominos.com.cn/{GAME_TYPE}/{endpoint}"
    try:
        response = requests.post(url, data=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"请求出现异常: {e}")
        return None

def get_temp_id(openid, score):
    payload = {'openid': openid, 'score': score, 'tempId': 'null'}
    response_data = post_request('game/gameDone', payload)
    
    if response_data:
        status_code = response_data.get("statusCode")
        if status_code == 10:
            tempId = response_data.get("extra", {}).get("tempId")
            if tempId:
                print(f"成功获取 tempId: {tempId}")
                return tempId
            else:
                print("获取 tempId 失败，tempId 为 null")
        else:
            error_message = response_data.get("errorMessage", "无错误信息")
            print(f"获取 tempId 失败，状态码: {status_code}, 信息: {error_message}")
    return None

def send_sms(openid, mobile):
    payload = {'openid': openid, 'mobile': mobile, 'type': 'null'}
    response_data = post_request('sendSMS', payload)
    
    if response_data:
        status_code = response_data.get("statusCode")
        error_message = response_data.get("errorMessage", "无错误信息")
        
        if status_code == 10:
            print(f"手机号码已绑定，错误信息: {error_message}，跳过短信验证")
            return True  # 手机号已绑定，返回 True 表示跳过短信验证
        elif status_code == 0:
            print("短信发送成功!")
            return False  # 短信发送成功，返回 False 表示需要进行短信验证
        else:
            print(f"短信发送失败，状态码: {status_code}")
            print(f"错误信息: {error_message}")
            print(f"响应: {response_data}")
    return False

def verify_code(openid, mobile, verification_code):
    payload = {'openid': openid, 'mobile': mobile, 'code': verification_code}
    response_data = post_request('verification', payload)
    
    if response_data:
        status_code = response_data.get("statusCode")
        error_message = response_data.get("errorMessage", "无错误信息")
        
        if status_code == 0:
            print("验证码验证成功!")
        else:
            print(f"验证码验证失败，状态码: {status_code}")
            print(f"错误信息: {error_message}")
            print(f"响应: {response_data}")

def post_game_done(openid, score, tempId):
    payload = {'openid': openid, 'score': score, 'tempId': tempId}
    response_data = post_request('game/gameDone', payload)
    
    if response_data:
        print(f"游戏认证完成: 响应: {response_data}")

def main():
    mobile = input("请输入手机号: ")
    openid = input("请输入openid: ")

    tempId = get_temp_id(openid, SCORE)
    if tempId:
        # 如果成功获取到 tempId，执行 send_sms
        if send_sms(openid, mobile):
            # 如果手机号已绑定，直接执行后续任务
            print("手机号已绑定")
            post_game_done(openid, SCORE, tempId)
        else:
            # 如果短信发送成功，要求输入验证码进行验证
            verification_code = input("请输入验证码: ")
            verify_code(openid, mobile, verification_code)
            post_game_done(openid, SCORE, tempId)
    else:
        # 如果未获取到 tempId，直接获取短信验证码
        if send_sms(openid, mobile):
            # 如果手机号已绑定，直接执行后续任务
            print("手机号已绑定")
            post_game_done(openid, SCORE, 'null')  # tempId 为 null，因为未获取到 tempId
        else:
            verification_code = input("请输入验证码: ")
            verify_code(openid, mobile, verification_code)
            post_game_done(openid, SCORE, 'null')  # tempId 为 null，因为未获取到 tempId

if __name__ == "__main__":
    main()