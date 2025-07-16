#把需要添加白名单的账号AppKey填到环境变量BMD51中就行，多账号&分割
#入口:https://www.51daili.com/index/user/promotion/parent_id/20685/code/nlEAxeqD.html

import os
import requests
import time


def get_proclamation():
    primary_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    backup_url = "https://tfapi.cn/TL/tl.json"
    
    try:
        response = requests.get(primary_url, timeout=10)
        if response.status_code == 200:
            print("📢 公告信息")
            print("=" * 45)
            print(response.text)
            print("=" * 45 + "\n")
            print("公告获取成功，开始执行任务...\n")
            return
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}, 尝试备用链接...")

    try:
        response = requests.get(backup_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 14)
            print("📢 公告信息")
            print("=" * 45)
            print(response.text)
            print("=" * 45 + "\n")
            print("公告获取成功，开始执行任务...\n")
        else:
            print(f"⚠️ 获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 获取公告时发生错误: {e}, 可能是网络问题或链接无效。")
        
class WhiteListManager:
    def __init__(self, appkey):
        self.appkey = appkey
        self.white_base_url = "http://bapi.51daili.com/white-ip/"
        self.user_base_url = "http://aapi.51daili.com/userapi"

    def add_white_ip(self, ips, isdel=1):
        """
        添加白名单
        :param ips: 要添加的IP，多个IP用英文逗号隔开
        :param isdel: 0(超出不删除),1(超出删除最先开始添加的)
        :return: 返回请求结果
        """
        url = f"{self.white_base_url}add?appkey={self.appkey}&isdel={isdel}&ips={ips}"
        response = requests.get(url)
        return response.json()

    def get_user_info(self):
        """
        获取用户信息
        :return: 返回请求结果
        """
        url = f"{self.user_base_url}?appkey={self.appkey}"
        response = requests.get(url)
        return response.json()

    def get_white_ip(self):
        
        try:
            response = requests.get("https://httpbin.org/ip")
            ip_data = response.json()
            return ip_data.get("origin", "")
        except Exception as e:
            print(f"从外部接口获取IP失败: {e}")
            return ""


if __name__ == "__main__":

    get_proclamation()
    
    print(f"开始执行... ")

    # 从环境变量获取多个账号的APPkey，多个账号用&分隔
    appkeys = os.environ.get("BMD51", "").split("&")

    if not appkeys or appkeys == [""]:
        print("环境变量51BMD未设置或格式不正确")
    else:
        # 获取白名单IP
        white_ip = WhiteListManager("").get_white_ip()
        if white_ip:
            print(f"获取的IP: {white_ip}")
            print("正在处理多个账号...")
            for appkey in appkeys:
                if appkey.strip() == "":
                    continue
                manager = WhiteListManager(appkey.strip())

                # 获取用户信息
                user_info = manager.get_user_info()
                if user_info.get("code") != 0:
                    print(f"获取用户信息失败，跳过该账号")
                    continue

                # 提取用户名
                username = user_info.get("data", {}).get("userName", "未知用户名")
                print(f"账号 {username} - 开始添加白名单IP {white_ip} 到白名单")

                # 添加白名单IP到白名单
                result = manager.add_white_ip(white_ip)
                msg = result.get("msg", "")
                code = result.get("code", -1)

                if code == 0:
                    print(f"账号 {username} - 白名单IP {white_ip} 添加成功: {msg}")
                elif code == 1:
                    print(f"账号 {username} - 白名单IP {white_ip} 已存在: {msg}")
                else:
                    print(f"账号 {username} - 添加白名单IP失败: {msg}")

                # 为了防止请求过快，添加适当的延迟
                time.sleep(1)
        else:
            print("无法获取IP")

    
    print(f"执行结束... ")
