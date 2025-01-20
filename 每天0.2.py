#每天2毛，抓请求头里的x_token，ey开头的那串
#name是备注，随便写。多号按以下格式复制粘贴
#入口:微信小程序:北京96156


#TL库:https://github.com/3288588344/toulu.git
#tg频道:https://t.me/TLtoulu
#QQ频道:https://pd.qq.com/s/672fku8ge


import requests,json,time

ck = '''{"data": [
        {
            "x_token": "token填在这里",
            "name": "这里是备注"
        },
        {
            "x_token": "token填在这里",
            "name": "这里是备注>"
        }
    ]}'''

push_token = 'UID_5pOoko7jlD5eIirr8WXrCmGPkgz9' #wxpusher的UID
push_title = 'TL库通知' 
push_content = 'TL\n\n'
wxapp_token = 'AT_VYtANZpJ6ecWpgwz9iQdUoSMz3ONwOdA'#wxpusher的APPToken

def wxpusher_send():
    headers = {'Content-Type': 'application/json;charset=utf-8'}
    data = {
            "appToken": wxapp_token,
            "uids": [f"{push_token}"],
            "topicIds": [],
            "summary": push_title,
            "content": push_content,
            "contentType": 1,
            "verifyPay": False
        }
    json_data = json.dumps(data)
    response = requests.post('https://wxpusher.zjiecode.com/api/send/message', headers=headers, data=json_data)
    print(response.text, "\n")

def get_substring_between(s, start_char, end_char):

    start_index = s.find(start_char)
    if start_index == -1:
        return ""
    
    end_index = s.find(end_char, start_index)
    if end_index == -1:
        return ""
    
    return s[start_index + 1:end_index]


ck1 = json.loads(ck)
for data in ck1['data']:
    x_token = data['x_token']
    name = data['name']
    headers = {
            "host": "ylapi.luckystarpay.com",
            "content-length": "2",
            "xweb_xhr": "1",
            "x-token": x_token,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090b19)XWEB/11581",
            "content-type": "application/json;charset=UTF-8",
            "accept": "*/*",
            "sec-fetch-site": "cross-site",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            "accept-language": "zh-CN,zh;q=0.9"}
    
    print("\n>>>>>>>>>> 账号:",name,)
    push_content = push_content + "\n>>>>>>>>>> 账号:" + name + "\n"
    try:
        response = requests.post('https://ylapi.luckystarpay.com/api/userSign', headers=headers, json={})
        print("签到：",response.json()['message'])
        push_content = push_content + "签到：" + response.json()['message'] + "\n"

        url = "https://ylapi.luckystarpay.com/api/home"
        body = '''{}'''
        response = requests.post(url=url, data=body, headers=headers)
        data = json.loads(response.text)["data"]["activity"]
        for i in range(2):
            id = data[i]["id"]
            print("活动id：",data[i]["id"])
            push_content = push_content + "活动id：" + str(data[i]["id"]) + "\n"
            next = False

            for n in range(10):
                if n == 0:
                    url = "https://ylapi.luckystarpay.com/api/startAnswer"
                    body = {"id": id}
                else:
                    url = "https://ylapi.luckystarpay.com/api/getQuestion"
                    body = {"id":id,"examId":examId,"number":n+1}
                    

                response = requests.post(url=url, data=json.dumps(body), headers=headers)

                if response.text.find("此活动参与次数已达上限") != -1:
                    next = True
                    print("此活动参与次数已达上限")
                    push_content = push_content + "此活动参与次数已达上限\n"
                    break
                else:
                    re = json.loads(response.text)
                    answer = re["data"]["question"]["explain"]#data.question.explain
                    answer = get_substring_between(answer, "【", " ")
                    if n == 0:
                        examId = re["data"]["examId"]
                    
                    url = "https://ylapi.luckystarpay.com/api/submitAnswer"
                    body = {"examId":examId,"id":id,"answer":answer,"number":n+1}
                    response = requests.post(url=url, data=json.dumps(body), headers=headers)
                    re = json.loads(response.text)
                    print(f"第{n+1}题答题结果：",re["data"]["isCorrect"])
                    push_content = push_content + f"第{n+1}题答题结果：" + str(re["data"]["isCorrect"]) + "\n"

                time.sleep(2)

            if next:
                continue
            else:
                url = "https://ylapi.luckystarpay.com/api/submitExam"
                body = {"examId":examId,"id":id}
                response = requests.post(url=url, data=json.dumps(body), headers=headers)
                re = json.loads(response.text)
                print(f"交卷：",re["message"])
                push_content = push_content + "交卷：" + re["message"] + "\n"

                url = "https://ylapi.luckystarpay.com/api/examResult"
                body = {"examId":examId,"id":id}
                response = requests.post(url=url, data=json.dumps(body), headers=headers)
                re = json.loads(response.text)
                print(f"交卷结果：",re["message"])
                push_content = push_content + "交卷结果：" + re["message"] + "\n"

                url = "https://ylapi.luckystarpay.com/api/lottery"
                body = {"examId":examId,"id":id}
                for kk in range(2):
                    response = requests.post(url=url, data=json.dumps(body), headers=headers)
                    re = json.loads(response.text)
                    try:
                        if re["data"]['isWin']:
                            print(f"抽奖结果：",re["data"]["money"],re["data"]["isWin"]) 
                            push_content = push_content + "抽奖结果：" + str(re["data"]["money"]) + "  " + str(re["data"]["isWin"]) + "\n"  
                        else:
                            print('未中奖')
                            push_content = push_content + "抽奖结果：未中奖\n"  
                    except:
                        print('抽奖异常')
                        print(response.text)
                    time.sleep(5)
    except:
        print('账号CK可能失效')
        push_content = push_content + "账号CK可能失效\n"                 

wxpusher_send()





