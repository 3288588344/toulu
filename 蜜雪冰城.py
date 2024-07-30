#有问题联系3288588344


#频道：https://pd.qq.com/s/672fku8ge


import requests
import threading
from hashlib import md5 as md5Encode

# ----固定变量区----
marketingId = '1816854086004391938'

# 任务数和线程数
tasks_num = 100  # 运行 100 次
threads_num = 30 # 最大线程数  30 个

# ----自定义变量区----
token = '抓包token'#token填里面
round = '13:00'
secretword = '年度重磅 新品免单'#口令


headers = {
    'Access-Token': token,
    'Referer': 'https://mxsa-h5.mxbc.net/',
    'Host': 'mxsa.mxbc.net',
    'Origin': 'https://mxsa-h5.mxbc.net',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003233) NetType/4G Language/zh_CN miniProgram/wx7696c66d2245d107',
    'Content-type': 'application/json;charset=UTF-8',
}


def exchange():
    try:
        url = 'https://mxsa.mxbc.net/api/v1/h5/marketing/secretword/confirm'
        param = f'marketingId={marketingId}&round={round}&s=2&secretword={secretword}c274bac6493544b89d9c4f9d8d542b84'
        m = md5Encode(param.encode("utf8"))
        sign = m.hexdigest()
        body = {
            "secretword": secretword,
            "sign": sign,
            "marketingId": marketingId,
            "round": round,
            "s": 2
        }
        res = requests.post(url, headers=headers, json=body)
        print(f'任务开始: {res.text}')
    except Exception as e:
        print(f'任务失败: {e}')


def threading_run(tasks,threads):
    for i in range(tasks):
        if threading.active_count() < threads + 1 and tasks != 0:
            t = threading.Thread(target=exchange)
            t.start()
            tasks -= 1
        if threading.active_count() == threads + 1:
            # 等待前面的进程结束后，再执行后面的代码，这里为1，因为程序本身即为一个线程
            while threading.active_count() == threads + 1:
                pass
    while threading.active_count() != 1:
        pass

def start_task():
    threading_run(tasks_num, threads_num)


if __name__ == '__main__':
    # 手动执行任务
    start_task()


