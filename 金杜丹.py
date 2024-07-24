'''
new Env('金杜丹小程序');
变量名字JDD抓tianxin.jmd724.com域名下的access_token多号@

入口：https://i.postimg.cc/13GZ6Kn0/mmexport1721791764278.png


有问题联系3288588344
 频道：https://pd.qq.com/s/672fku8ge

长期套餐大额流量电话卡办理地址：https://hk.yunhaoka.cn/#/pages/micro_store/index?agent_id=669709


'''

import requests
import os
class AC:
    def __init__(self, token):
        self.token = token
        self.headers = {
            'User-Agent': "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.122 Mobile Safari/537.36 XWEB/1260059 MMWEBSDK/20240501 MMWEBID/2307 MicroMessenger/8.0.50.2701(0x28003253) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android"
        }
        self.article_ids = self.fetch_ids()  # 初始化时获取文章 IDs
        self.video_ids = self.fetch_video_ids()  # 初始化视频 ID
    def sign(self):
        url = f"https://tianxin.jmd724.com/index.php?r=client/v1/task/sign-up&access_token={self.token}"
        response = requests.get(url, headers=self.headers)
        response_data = response.json()
        if response_data['code'] == 0:
            gold_num = response_data["data"]["gold_num"]
            msg = response_data["msg"]
            print(f"{msg} 获得 {gold_num} 金币")
        else:
            msg = response_data["msg"]
            print(msg)
    def fetch_ids(self):
        url = "https://tianxin.jmd724.com/index.php?r=client/v1/article/list"
        response = requests.get(url, headers=self.headers)
        response_data = response.json()
        ids = []
        for item in response_data.get("data", {}).get("list", [])[:5]:
            article_id = item.get("id")
            ids.append(article_id)
        return ids

    def fetch_video_ids(self):
        url = "https://tianxin.jmd724.com/index.php?store_id=1&r=client/v1/article/list&pageSize=10&article_type=2"
        response = requests.get(url, headers=self.headers)
        response_data = response.json()
        ids = []
        for item in response_data.get("data", {}).get("list", [])[:5]:
            article_id = item.get("id")
            ids.append(article_id)
        return ids
    def red(self):
        for article_id in self.article_ids:
            url = f"https://tianxin.jmd724.com/index.php?r=client/v1/article/detail&article_id={article_id}&access_token={self.token}"
            response = requests.get(url, headers=self.headers)
            response_data = response.json()
            if response_data['code'] == 0:
                print(f"开始阅读文章编号{article_id}")
            else:
                msg = response_data["msg"]
                print(msg)
    def gold(self):
        for article_id in self.article_ids:
            url = "https://tianxin.jmd724.com/index.php?r=client/v1/article/read-gold"
            data = {
                'article_id': article_id,
                'access_token': self.token
            }
            response = requests.post(url, headers=self.headers, data=data)
            response_data = response.json()
            if response_data['code'] == 0:
                print(f"成功获取文章编号{article_id} 的金币奖励")
            else:
                msg = response_data["msg"]
                print(msg)
    def Videoviewing(self):  
        for video_ids in self.video_ids:
            url = f"https://tianxin.jmd724.com/index.php?r=client/v1/article/detail&article_id={video_ids}&access_token={self.token}"
            response = requests.get(url, headers=self.headers)
            response_data = response.json()
            if response_data['code'] == 0:
                print(f"开始观看视频编号{video_ids}")
            else:
                msg = response_data["msg"]
                print(msg)          
    def VideoRewards(self):
        for video_ids in self.video_ids:
            url = "https://tianxin.jmd724.com/index.php?r=client/v1/article/read-gold"
            data = {
                'article_id': video_ids,
                'access_token': self.token
            }
            response = requests.post(url, headers=self.headers, data=data)
            response_data = response.json()
            if response_data['code'] == 0:
                print(f"成功获取视频编号{video_ids} 的金币奖励")
            else:
                msg = response_data["msg"]
                print(msg)
if __name__ == "__main__":
    tokens = os.environ.get('JDD')
    if not tokens:
        print("获取账号失败，请检查配置是否正确")
    else:
        tokens_list = tokens.split('@')
        for index, token in enumerate(tokens_list, start=1):
            print(f"=====开始执行第{index}个账号任务=====")
            ac = AC(token)
            ac.sign()
            ac.red()
            ac.gold()
            ac.Videoviewing()
            ac.VideoRewards()
