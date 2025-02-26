#入口:应用市场下载:顺易充App
#抓包任意域名下的authorization，填写在环境变量YSC中，多账号使用&分割
#需要使用代理就配置YSCAPI环境变量
#代理推荐使用:https://www.ipzan.com?pid=4k9aetvd





import requests
import json
import os
import time
import logging
from threading import Lock
import re 

logging.basicConfig(level=logging.WARNING, format='%(levelname)s - %(message)s')

class ProxyManager:
    def __init__(self):
        self.proxy = None
        self.lock = Lock()
        self.last_fetch_time = None  # 记录上次获取代理的时间

    def get_proxy(self):
        """从代理API获取代理IP"""
        try:
            response = requests.get(os.getenv("YSCAPI"), timeout=10)
            if response.status_code == 200:
                proxy = response.text.strip()
                if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$', proxy):
                    self.proxy = proxy
                    self.last_fetch_time = time.time()
                    logging.info(f"获取代理成功: {self.proxy}")
                    return {"http": self.proxy, "https": self.proxy}
                else:
                    logging.warning(f"获取的代理格式无效: {proxy}")
            else:
                logging.warning(f"获取代理失败，HTTP 状态码: {response.status_code}")
        except requests.exceptions.RequestException as e:
            logging.error(f"获取代理时出错: {e}")
        return None

    def check_proxy(self):
        """检测代理是否有效"""
        if not self.proxy:
            logging.warning("未获取到代理IP，无法进行检测。")
            return False

        try:
            proxies = {
                'http': self.proxy,
                'https': self.proxy
            }
            response = requests.get("https://httpbin.org/ip", proxies=proxies, timeout=10)
            if response.status_code == 200:
                logging.info(f"代理检测通过，当前IP: {response.json()['origin']}")
                return True
            else:
                logging.warning(f"代理检测失败，HTTP 状态码: {response.status_code}")
        except requests.exceptions.RequestException as e:
            logging.warning(f"代理检测失败: {e}")
        return False

    def ensure_valid_proxy(self):
        """确保获取并使用有效的代理"""
        if not os.getenv("YSCAPI"):
            logging.warning("环境变量 'YSCAPI' 未设置，将直接使用本地 IP 运行。")
            return None

        while True:
            self.get_proxy()  # 获取新的代理
            if self.check_proxy():  # 检测代理是否有效
                logging.info(f"代理有效，将使用代理: {self.proxy}")
                return {"http": self.proxy, "https": self.proxy}
            else:
                logging.warning("当前代理无效，正在尝试重新获取代理...")
                time.sleep(2)  # 等待2秒后重新尝试


def get_proclamation():
    """
    获取公告信息
    """
    external_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    try:
        response = requests.get(external_url)
        if response.status_code == 200:
            print(response.text)
            print("公告获取成功，开始执行任务...")
        else:
            print(f"获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}")


# 定义任务函数
def _send_request(token, task_type, task_stage=None, proxies=None):
    """通用请求发送函数"""
    url = "https://app.wodeev.com/bil-front/v2.0/activity/getWelfare"
    headers = {
        "Host": "app.wodeev.com",
        "content-length": "35",
        "pragma": "no-cache",
        "cache-control": "no-cache",
        "sec-ch-ua-platform": '"Android"',
        "authorization": token,
        "lang": "1",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Android WebView";v="132"',
        "sec-ch-ua-mobile": "?1",
        "loginchannel": "01",
        "user-agent": "Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/132.0.6834.163 Mobile Safari/537.36",
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json;charset=UTF-8",
        "client-version": "5.5.2",
        "origin": "https://www.wodeev.com",
        "x-requested-with": "com.longshine.nanwang.electric.charge",
        "sec-fetch-site": "same-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": "https://www.wodeev.com/",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "priority": "u=1, i"
    }
    data = {
        "type": task_type,
        "taskNo": "20221231"
    }
    if task_stage:
        data["taskStage"] = task_stage

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data), proxies=proxies)
        response_data = response.json()
        ret_code = response_data.get("ret")
        msg = response_data.get("msg")

        if ret_code == "200" and msg in ["调用成功", "成功!", "成功"]:
            return "任务成功完成！"
        elif msg == "今日已签到":
            return "今日已签到，请勿重复操作。"
        elif msg == "超过最大可领取次数":
            return "已达今日领取上限。"
        elif msg == "未找到可领取的！":
            return "暂无可领取的积分，请先完成任务。"
        elif ret_code == "401" or msg == "token无效":
            return "登录状态失效，请重新登录。"
        elif ret_code == "400" and msg == "该用户已经存在完成的任务,请先领取!":
            return "您已完成任务，请先领取积分。"
        else:
            return f"任务失败，返回信息：{msg}"

    except json.JSONDecodeError as e:
        return f"解析响应失败，返回内容：{response.text}"
    except requests.RequestException as e:
        return f"请求失败，错误信息：{e}"


def sign_in(token, proxies=None):
    """执行签到任务"""
    return _send_request(token, task_type="1201", task_stage=None, proxies=proxies)


def watch_ad(token, proxies=None):
    """执行观看广告任务"""
    return _send_request(token, task_type="1216", task_stage="01", proxies=proxies)


def claim_ad_points(token, proxies=None):
    """执行领取广告积分任务"""
    return _send_request(token, task_type="1216", task_stage=None, proxies=proxies)


# 主程序入口
if __name__ == "__main__":
    # 获取公告信息
    get_proclamation()

    tokens = os.getenv("YSC")
    if not tokens:
        raise ValueError("环境变量 'YSC' 未设置或为空！")

    proxy_manager = ProxyManager()
    token_list = tokens.split("&")

    for idx, token in enumerate(token_list, start=1):
        print(f"=== 账号 {idx} ===")
        token = token.strip()

        # 检查是否设置了代理API
        if not os.getenv("YSCAPI"):
            logging.warning("环境变量 'YSCAPI' 未设置，将直接使用本地 IP 运行。")
            proxies = None
        else:
            # 确保获取并使用有效的代理
            proxies = proxy_manager.ensure_valid_proxy()
            if proxies:
                print(f"使用代理: {proxies['http']}")
            else:
                print("未获取到有效代理，将直接使用本地 IP 运行。")

        # 检测当前使用的IP地址
        try:
            if proxies:
                current_ip_response = requests.get("https://httpbin.org/ip", proxies=proxies)
            else:
                current_ip_response = requests.get("https://httpbin.org/ip")
            current_ip = current_ip_response.json()['origin']
            print(f"当前使用的IP地址为: {current_ip}")
        except requests.RequestException as e:
            logging.error(f"检测当前IP时出错: {e}")
            print("无法检测当前IP地址，任务可能无法正常运行。")

        # 执行签到任务
        sign_in_result = sign_in(token, proxies=proxies)
        print(f"签到任务结果：{sign_in_result}")
        time.sleep(1)  # 添加 1 秒延迟

        # 循环执行观看广告和领取积分任务
        for loop in range(10):  # 循环 10 次
            print(f"--- 循环 {loop + 1}/10 ---")

            # 执行观看广告任务
            watch_ad_result = watch_ad(token, proxies=proxies)
            print(f"观看广告任务结果：{watch_ad_result}")
            time.sleep(1)  # 添加 1 秒延迟

            # 执行领取广告积分任务
            claim_points_result = claim_ad_points(token, proxies=proxies)
            print(f"领取广告积分任务结果：{claim_points_result}")
            time.sleep(1)  # 添加 1 秒延迟

        print("-" * 30)
        time.sleep(2)  # 每个账号之间添加 2 秒延迟

#该脚本来自TL库 仅供学习参考，请学习后24小时内删除
#https://github.com/3288588344/toulu.git
  