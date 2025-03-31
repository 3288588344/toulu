#抓包艾石头驱动软件任意域名下的Authorization值放在环境变量AST中
#by:哆啦A梦

import requests
import json
import os

def get_proclamation():
    external_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    try:
        response = requests.get(external_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 50)
            print("📢 公告信息")
            print("=" * 50)
            print(response.text)
            print("=" * 50 + "\n")
            print("公告获取成功，开始执行任务...\n")
        else:
            print(f"⚠️ 获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 获取公告时发生错误: {e}")

def sign_in():
    authorization_tokens = os.environ.get('AST')
    if not authorization_tokens:
        print("❌ 环境变量AST未设置，请设置AST环境变量后再运行脚本。")
        return

    tokens = authorization_tokens.split('&')

    for token in tokens:
        sign_in_url = "https://irok.ast.joyway.net/user/doAstTask"
        headers = {
            "Host": "irok.ast.joyway.net",
            "Connection": "keep-alive",
            "Authorization": token,
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8",
            "Accept-Language": "zh-CN"
        }
        data = {"app_str_id": "nav"}
        
        try:
            sign_in_response = requests.post(sign_in_url, headers=headers, data=json.dumps(data))
            
            if sign_in_response.status_code == 200:
                response_data = json.loads(sign_in_response.text)
                
                if response_data.get('code') == 0:
                    print("✓ 签到成功！")
                  
                    claim_coin_url = "https://irok.ast.joyway.net/user/takeAstTaskCoin"
                    claim_coin_response = requests.post(claim_coin_url, headers=headers, data=json.dumps(data))
                    
                    if claim_coin_response.status_code == 200:
                        claim_coin_data = json.loads(claim_coin_response.text)
                        
                        if claim_coin_data.get('code') == 0:
                            print("✓ 领取积分成功！")
                        elif claim_coin_data.get('code') == -1:
                            print("⚠️ 今天已经领取过积分。")
                        else:
                            print(f"❌ 领取积分失败，错误代码：{claim_coin_data.get('code')}")
                    else:
                        print(f"❌ 领取积分失败，状态码：{claim_coin_response.status_code}")
                elif response_data.get('code') == -1:
                    print("⚠️ 今天已经签到过。")
                else:
                    print(f"❌ 签到失败，错误代码：{response_data.get('code')}")
            else:
                print(f"❌ 签到失败，状态码：{sign_in_response.status_code}")
        except Exception as e:
            print(f"❌ 请求失败，错误信息：{str(e)}")

if __name__ == "__main__":
    get_proclamation()
    
    print("-" * 50)
    print("🚀 开始执行签到任务")
    print("-" * 50)
    
    sign_in()
    
    print("\n" + "-" * 50)
    print("✅ 任务执行完成")
    print("-" * 50)
