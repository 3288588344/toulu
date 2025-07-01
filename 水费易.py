"""
抓包m.ipaiyun.cn域名下的ck，填到环境变量名SFYCK中
例如:
SFYCK = 'ASP.NET_SessionId=xxxxxx; IPAI_UV=xxxx; temp_clause=1815556'
"""
import os
import requests
import asyncio
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import random

class SYFSign:
    def __init__(self):
        self.name = "水费易签到"
        self.SFYCK = os.getenv("SFYCK", "").split("\n")
        self.baseUrl = "https://m.ipaiyun.cn"
        self.headers = {
            'Host': 'm.ipaiyun.cn',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': self.baseUrl,
            'Referer': f'{self.baseUrl}/Ipai/Home/Index?code=031sLtFa11eBTH0d0uFa1NqtY53sLtFQ&state=wxbe5b7a2bc0467240',
            'Accept-Encoding': 'gzip, deflate, br',
        }
        
        retry_strategy = Retry(
            total=3,
            status_forcelist=[429, 500, 502, 503, 504],
            method_whitelist=["POST", "GET"],
            backoff_factor=1
        )
        self.adapter = HTTPAdapter(max_retries=retry_strategy)
        self.http = requests.Session()
        self.http.mount("https://", self.adapter)
    
    def get_proclamation(self):
        primary_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
        backup_url = "https://tfapi.cn/TL/tl.json"
        
        try:
            response = self.http.get(primary_url, timeout=10)
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
            response = self.http.get(backup_url, timeout=10)
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
    
    async def main(self):
        self.get_proclamation()
        
        print(f"\n已随机分配 User-Agent\n\n{self.headers['User-Agent']}")
        for index, cookie in enumerate(self.SFYCK):
            if not cookie.strip():
                continue
                
            cookie_parts = cookie.split('#')
            headers = self.headers.copy()
            headers['Cookie'] = cookie_parts[0].strip() if cookie_parts else ""
            member_id = cookie_parts[1].strip() if len(cookie_parts) > 1 else ""
            
            print(f"\n*****第[{index+1}]个{self.name}账号*****")
            await self.process_account(index+1, headers, member_id)
            await asyncio.sleep(2 + random.random() * 3)
    
    async def process_account(self, index, headers, member_id):
        try:
            user_info = await self.get_user_info(headers, member_id)
            if user_info.get("code") != 0:
                print(user_info.get("message", "获取用户信息失败"))
                return
                
            nick_name = user_info.get("resultJson", {}).get("userMember", {}).get("nickName", "未知用户")
            phone = user_info.get("resultJson", {}).get("userMember", {}).get("mobilePhone", "未知手机号")
            sign_num = user_info.get("resultJson", {}).get("signNum", 0)
            
            print(f"{nick_name}({phone})")
            
            if sign_num == 0:
                print("今日已签到")
            else:
                sign_result = await self.sign(headers, member_id)
                if sign_result.get("code") == 0:
                    print(f"签到成功，已连续签到{sign_result.get('resultJson', {}).get('signdays', 0)}天")
                else:
                    print(f"签到失败：{sign_result.get('message', '未知错误')}")
            
            points_result = await self.get_points(headers, member_id)
            if points_result.get("code") == 0:
                points = points_result.get("resultJson", {}).get("meberinfo", {}).get("totalIntegral", 0)
                print(f"当前积分：{points}")
            else:
                print(f"获取积分失败：{points_result.get('message', '未知错误')}")
            
        except Exception as e:
            print(f"处理账号{index}时发生异常：{str(e)}")
    
    async def get_user_info(self, headers, member_id):
        try:
            url = f"{self.baseUrl}/PersonalCenter/PersonalCenter/GetShopMemberDetail"
            params = f"memberId={member_id}"
            response = self.http.post(url, headers=headers, data=params)
            return response.json()
        except Exception as e:
            print(f"获取用户信息时发生异常：{str(e)}")
            return {"code": -1, "message": f"获取用户信息时发生异常：{str(e)}"}
    
    async def sign(self, headers, member_id):
        try:
            url = f"{self.baseUrl}/PersonalCenter/PersonalCenter/ShopMemberSign"
            params = f"memberId={member_id}"
            response = self.http.post(url, headers=headers, data=params)
            return response.json()
        except Exception as e:
            print(f"签到时发生异常：{str(e)}")
            return {"code": -1, "message": f"签到时发生异常：{str(e)}"}
    
    async def get_points(self, headers, member_id):
        try:
            url = f"{self.baseUrl}/PersonalCenter/PersonalCenter/GetShopMemberDetail"
            params = f"memberId={member_id}"
            response = self.http.post(url, headers=headers, data=params)
            return response.json()
        except Exception as e:
            print(f"获取积分时发生异常：{str(e)}")
            return {"code": -1, "message": f"获取积分时发生异常：{str(e)}"}

if __name__ == "__main__":
    task = SYFSign()
    asyncio.run(task.main())
