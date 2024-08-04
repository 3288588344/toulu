'''QQ频道：98do10s246

联系：3288588344（看心情回，巨婴别来问）
下载config.toml文件，上传到同目录，在config.toml文件中填联想APP的手机号和密码
通知可填可不填
config.toml文件下载链接：https://raw.githubusercontent.com/3288588344/toulu/main/config.toml
'''
import base64
import json
import logging
import random
import re
from sys import exit

import smtplib
from email.mime.text import MIMEText
from smtplib import SMTP_SSL
from email.header import Header

import requests
import toml
from requests.utils import cookiejar_from_dict, dict_from_cookiejar


USER_AGENT = [
    "Mozilla/5.0 (Linux; U; Android 11; zh-cn; PDYM20 Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 HeyTapBrowser/40.7.24.9",
    "Mozilla/5.0 (Linux; Android 12; Redmi K30 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36"
]


class Push_messages:
    class Server_chan:
        def __init__(self, send_key: str) -> None:
            self.send_key = send_key

        def send_message(self, content: str) -> bool:
            data = {"title": "联想签到", "desp": content}
            response = requests.post(
                f"https://sctapi.ftqq.com/{self.send_key}.send", data=data
            )
            res_data = response.json().get("data")
            pushid = res_data.get("pushid")
            readkey = res_data.get("readkey")
            result = requests.get(
                f"https://sctapi.ftqq.com/push?id={pushid}&readkey={readkey}"
            )
            return True if result.json().get("code") == 0 else False

    class Wechat_message:
        def __init__(self, corpid: str, corpsecret: str, agentid: str) -> None:
            self.corpid = corpid
            self.corpsecret = corpsecret
            self.agentid = agentid
            self.token = (
                requests.get(
                    f"https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={self.corpid}&corpsecret={self.corpsecret}"
                )
                .json()
                .get("access_token")
            )

        def send_message(self, content: str) -> bool:
            data = {
                "touser": "@all",
                "msgtype": "text",
                "agentid": self.agentid,
                "text": {"content": content},
                "safe": 0,
            }
            response = requests.post(
                f"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={self.token}",
                data=json.dumps(data),
            )
            return True if response.json().get("errcode") == 0 else False

    class Dingtalk_message:
        def __init__(self, ding_accesstoken: str) -> None:
            self.ding_accesstoken = ding_accesstoken

        def send_message(self, content: str) -> bool:
            data = {
                "msgtype": "text",
                "text": {"content": content},
                "at": {"isAtAll": True},
            }
            response = requests.post(
                f"https://oapi.dingtalk.com/robot/send?access_token={self.ding_accesstoken}",
                data=json.dumps(data),
            )
            return True if response.json().get("errcode") == 0 else False

    class Email_message:
        def __init__(self, sender_email: str, sender_password: str, receiver_email: str, smtp_server: str,
                     smtp_port: int) -> None:
            self.sender_email = sender_email
            self.sender_password = sender_password
            self.receiver_email = receiver_email
            self.smtp_server = smtp_server
            self.smtp_port = smtp_port

        def send_message(self, content: str) -> bool:
            receiver_email = [self.receiver_email]

            message = MIMEText(content, 'plain', 'utf-8')
            message['Subject'] = Header("联想智选定时签到结果", "utf-8")
            message['From'] = Header("联想智选定时签到程序", "utf-8")
            message['To'] = receiver_email[0]

            try:
                smtp = SMTP_SSL(self.smtp_server, self.smtp_port)
                smtp.login(self.sender_email, self.sender_password)
                smtp.sendmail(
                    self.sender_email, receiver_email, message.as_string())
                smtp.quit()
                return True
            except smtplib.SMTPException as e:
                print('send email error', e)
                return False


def set_push_type():
    for type, key in config.get("message_push").items():
        key_list = key.values()
        if "".join(key_list):
            return getattr(Push_messages(), type)(*key_list).send_message
    else:
        return logger


def login(username, password):
    def get_cookie():
        session.headers = {
            "user-agent": ua,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }
        session.get(url="https://reg.lenovo.com.cn/auth/rebuildleid")
        session.get(
            url="https://reg.lenovo.com.cn/auth/v1/login?ticket=5e9b6d3d-4500-47fc-b32b-f2b4a1230fd3&ru=https%3A%2F%2Fmclub.lenovo.com.cn%2F"
        )
        data = f"account={username}&password={base64.b64encode(str(password).encode()).decode()}\
            &ps=1&ticket=5e9b6d3d-4500-47fc-b32b-f2b4a1230fd3&codeid=&code=&slide=v2&applicationPlatform=2&shopId=\
                1&os=web&deviceId=BIT%2F8ZTwWmvKpMsz3bQspIZRY9o9hK1Ce3zKIt5js7WSUgGQNnwvYmjcRjVHvJbQ00fe3T2wxgjZAVSd\
                    OYl8rrQ%3D%3D&t=1655187183738&websiteCode=10000001&websiteName=%25E5%2595%2586%25E5%259F%258E%25E\
                        7%25AB%2599&forwardPageUrl=https%253A%252F%252Fmclub.lenovo.com.cn%252F"
        login_response = session.post(
            url="https://reg.lenovo.com.cn/auth/v2/doLogin", data=data
        )
        if login_response.json().get("ret") == "1":
            logger(f"{username}账号或密码错误")
            return None
        ck_dict = dict_from_cookiejar(session.cookies)
        config["cookies"][username] = f"{ck_dict}"
        toml.dump(config, open(config_file, "w"))
        session.cookies = cookiejar_from_dict(ck_dict)
        return session

    session = requests.Session()
    session.headers = {
        "user-agent": ua,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
    if cookie_dict := config.get("cookies").get(username):
        session.cookies = cookiejar_from_dict(eval(cookie_dict))
        ledou = session.post(
            "https://i.lenovo.com.cn/info/uledou.jhtml",
            data={"sts": "b044d754-bda2-4f56-9fea-dcf3aecfe782"},
        )
        try:
            int(ledou.text)
        except ValueError:
            logger(f"{username} ck有错，重新获取ck并保存")
            session = get_cookie()
            return session
        logger(f"{username} ck没有错")
        return session
    else:
        logger(f"{username} ck为空，重新获取ck并保存")
        session = get_cookie()
        return session


def sign(session):
    res = session.get(url="https://mclub.lenovo.com.cn/signlist/")
    token = re.findall('token\s=\s"(.*?)"', res.text)[0]
    data = f"_token={token}&memberSource=1"
    headers = {
        "Host": "mclub.lenovo.com.cn",
        "pragma": "no-cache",
        "cache-control": "no-cache",
        "accept": "application/json, text/javascript, */*; q=0.01",
        "origin": "https://mclub.lenovo.com.cn",
        "x-requested-with": "XMLHttpRequest",
        "user-agent": ua
        + "/lenovoofficialapp/16554342219868859_10128085590/newversion/versioncode-1000080/",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "referer": "https://mclub.lenovo.com.cn/signlist?pmf_group=in-push&pmf_medium=app&pmf_source=Z00025783T000",
        "accept-language": "zh-CN,en-US;q=0.8",
    }
    sign_response = session.post(
        "https://mclub.lenovo.com.cn/signadd", data=data, headers=headers
    )
    sign_days = (
        session.get(url="https://mclub.lenovo.com.cn/getsignincal")
        .json()
        .get("signinCal")
        .get("continueCount")
    )
    sign_user_info = session.get("https://mclub.lenovo.com.cn/signuserinfo")
    try: 
        serviceAmount = sign_user_info.json().get("serviceAmount")
        ledou = sign_user_info.json().get("ledou")
    except Exception as e:
        logger(sign_user_info.headers["content-type"])
        logger(sign_user_info.status_code)
        logger(e)
        serviceAmount, ledou = None, None
    session.close()
    if sign_response.json().get("success"):
        return f"\U00002705账号{username}签到成功, \U0001F4C6连续签到{sign_days}天, \U0001F954共有乐豆{ledou}个, \U0001F4C5共有延保{serviceAmount}天\n"
    else:
        return f"\U0001F6AB账号{username}今天已经签到, \U0001F4C6连续签到{sign_days}天, \U0001F954共有乐豆{ledou}个, \U0001F4C5共有延保{serviceAmount}天\n"


def main():
    global logger, config_file, config, ua, username
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s"
    )
    logger = logging.getLogger(__name__).info
    config_file = r"config.toml"
    config = toml.load(config_file)
    account = config.get("account")
    if not account:
        exit(1)
    if not (ua := config.get("browser").get("ua")):
        ua = random.choice(USER_AGENT)
        config["browser"]["ua"] = ua
    push = set_push_type()
    message = "联想签到: \n"
    for username, password in account.items():
        session = login(username, password)
        if not session:
            continue
        message += sign(session)
    push(message)


if __name__ == "__main__":
    main()
