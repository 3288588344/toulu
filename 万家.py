#by:哆啦A梦
#TL库
#https://github.com/3288588344/toulu.git
#抓包wakecloud.chinamacro.com域名中的cookie中钱sessionid
#多账号换行分割，一行一号
#账号环境变量名WJL
import requests
import time
import os

# 从环境变量中读取cookie
cookies = os.environ.get("WJL", "").split('\n')

# 设置请求头
headers = {
    "Host": "wakecloud.chinamacro.com",
    "Accept-Language": "zh",
    "Content-Type": "application/json",
    "Charset": "utf-8",
    "Referer": "https://servicewechat.com/wx07b7a339bb2cf065/117/page-frame.html",
    "Accept-Encoding": "gzip, deflate, br"
}

# 签到URL
sign_url = "https://wakecloud.chinamacro.com/wd-member/app/member/sign"

# 抽奖URL
draw_url = "https://wakecloud.chinamacro.com/mtool/app/luckywheel/draw"

# 抽奖请求体
draw_data = {"activityNo": 2025041400000001}

def get_proclamation():
    """获取公告信息"""
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

def sign_in(session_id):
    """签到功能"""
    try:
        # 更新请求头中的Cookie
        headers["Cookie"] = f"sessionId={session_id}"
        
        response = requests.get(sign_url, headers=headers)
        if response.status_code == 200:
            result = response.json()
            
            if result.get("success", False):
                print("签到成功！")
            else:
                print("签到失败，请检查原因。")
        else:
            print(f"签到请求失败，状态码: {response.status_code}")
    except Exception as e:
        print(f"签到发生错误: {e}")

def draw_prize(session_id):
    """抽奖功能，抽奖3次"""
    try:
        # 更新请求头中的Cookie
        headers["Cookie"] = f"sessionId={session_id}"
        
        for i in range(3):
            print(f"\n第 {i+1} 次抽奖中...")
            response = requests.post(draw_url, headers=headers, json=draw_data)
            
            if response.status_code == 200:
                result = response.json()
                
                
                if result.get("success", False):
                    gift_name = result["data"]["giftName"]
                    print(f"恭喜你抽到了: {gift_name}")
                else:
                    print("抽奖失败")
            else:
                print(f"抽奖请求失败，状态码: {response.status_code}")
            
            # 等待1秒再进行下一次抽奖
            time.sleep(1)
    except Exception as e:
        print(f"抽奖发生错误: {e}")

def main():
    if not cookies:
        print("环境变量WJL中没有找到sessionid，请检查配置。")
        return
    
    for idx, cookie in enumerate(cookies, 1):
        if not cookie.strip():
            continue
        
        print(f"\n===== 开始处理第 {idx} 个账户 =====")
        session_id = cookie.strip()
        
        # 签到
        print("开始签到...")
        sign_in(session_id)
        
        # 抽奖
        print("\n开始抽奖...")
        draw_prize(session_id)
        
        print(f"===== 第 {idx} 个账户处理完成 =====\n")

if __name__ == "__main__":
    # 获取公告
    get_proclamation()
    
    # 执行主程序
    main()
