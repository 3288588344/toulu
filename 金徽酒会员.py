#by:哆啦A梦
#入口:http://api.0vsp.com/h5/wxa/link?sid=25430gykJTW
#抓包ucodeprod-openapi.jinhuijiu.com.cn域名下的Authorization和serialId，格式Authorization#serialId
#多账号换行分割

import os
import requests
import json
import random
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
            print("\n" + "=" * 50)
            print("📢 公告信息")
            print("=" * 45)
            print(response.text)
            print("=" * 45 + "\n")
            print("公告获取成功，开始执行任务...\n")
        else:
            print(f"⚠️ 获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 获取公告时发生错误: {e}, 可能是网络问题或链接无效。")

def get_desensitized_phone(response_data):
    """
    从响应数据中提取并脱敏账号。
    """
    phone_number = response_data.get("phoneNumber", "")
    if phone_number and len(phone_number) >= 11:
        return phone_number[:3] + "****" + phone_number[7:]
    return "未知账号"

def fetch_user_metadata():
    """
    从环境变量获取多账号信息，发送请求获取用户数据元，并对账号进行脱敏处理。
    """
    env_variable = "JHHY"
    url = "https://ucodeprod-openapi.jinhuijiu.com.cn/user/metadata"

    account_info_list = os.getenv(env_variable, "").splitlines()
    if not account_info_list:
        print("环境变量JHHY未设置或格式不正确")
        print("=" * 45)
        return

    for account_info in account_info_list:
        if not account_info.strip():
            continue

        try:
            token_part, serial_part = account_info.split("#", 1)
            token = token_part.strip()
            serial_id = serial_part.strip()
        except ValueError:
            print(f"警告: 账号信息格式错误")
            print("=" * 45)
            continue

        headers = {
            'Authorization': f"Bearer {token}",
            'serialId': serial_id
        }

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()

            desensitized_phone = get_desensitized_phone(data)
            print(f"账号 {desensitized_phone} 获取账户信息成功")
            print("=" * 45)

        except requests.exceptions.RequestException as e:
            print(f"账号 {account_info} 获取账号信息失败: {e}")
            print("=" * 45)
        except ValueError as e:
            print(f"账号 {account_info} 账号数据解析失败: {e}")
            print("=" * 45)

def perform_check_in():
    """
    发送签到请求。
    """
    env_variable = "JHHY"
    checkin_url = "https://ucodeprod-openapi.jinhuijiu.com.cn/lottery/checkIn"
    metadata_url = "https://ucodeprod-openapi.jinhuijiu.com.cn/user/metadata"

    account_info_list = os.getenv(env_variable, "").splitlines()
    if not account_info_list:
        print("环境变量JHHY未设置或格式不正确")
        print("=" * 45)
        return

    # 使用字典存储每个账号的脱敏手机号
    account_desensitized_info = {}

    # 首先获取每个账号的脱敏手机号
    for account_info in account_info_list:
        if not account_info.strip():
            continue

        try:
            token_part, serial_part = account_info.split("#", 1)
            auth_token = f"Bearer {token_part.strip()}"
            serial_id = serial_part.strip()
        except ValueError:
            print(f"警告: 账号信息格式错误")
            print("=" * 45)
            continue

        headers = {
            'Authorization': auth_token,
            'serialId': serial_id,
        }

        try:
            # 获取账号信息并脱敏
            metadata_response = requests.get(metadata_url, headers=headers)
            metadata_response.raise_for_status()
            metadata_data = metadata_response.json()

            account_desensitized_info[account_info] = get_desensitized_phone(metadata_data)
        except Exception as e:
            # 这里只记录获取脱敏信息的错误，不输出
            account_desensitized_info[account_info] = "未知账号"

    # 进行签到
    for account_info in account_info_list:
        if not account_info.strip():
            continue

        desensitized_phone = account_desensitized_info.get(account_info, "未知账号")

        try:
            token_part, serial_part = account_info.split("#", 1)
            auth_token = f"Bearer {token_part.strip()}"
            serial_id = serial_part.strip()
        except ValueError:
            print(f"警告: 账号信息格式错误")
            print("=" * 45)
            continue

        params = {
            'longitude': "119.24095916748047",
            'latitude': "34.2840690612793"
        }

        payload = {
            "promotionCode": "signIn",
            "promotionId": 1001867,
            "longitude": 119.24095916748047,
            "latitude": 34.2840690612793
        }

        headers = {
            'Content-Type': "application/json",
            'Authorization': auth_token,
            'serialId': serial_id,
        }

        try:
            response = requests.post(checkin_url, params=params, data=json.dumps(payload), headers=headers)
            response.raise_for_status()
            response_data = response.json()

            if response_data.get("success", False):
                if "今日已签到" in response_data.get("message", ""):
                    print(f"账号 {desensitized_phone} 今日已签到")
                    print("=" * 45)
                else:
                    print(f"账号 {desensitized_phone} 签到成功")
                    print("=" * 45)
            else:
                error_message = response_data.get('message', '未知错误')
                if "今日已签到" in error_message:
                    print(f"账号 {desensitized_phone} 今日已签到")
                    print("=" * 45)
                else:
                    print(f"账号 {desensitized_phone} 签到失败: {error_message}")
                    print("=" * 45)

        except requests.exceptions.RequestException as e:
            # 检查是否有返回的响应内容
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_response = e.response.json()
                    error_message = error_response.get('emsg', error_response.get('message', '未知错误'))
                    # 检查是否是已签到的错误
                    if "今日已签到" in error_message:
                        print(f"账号 {desensitized_phone} 今日已签到")
                        print("=" * 45)
                    else:
                        print(f"账号 {desensitized_phone} 签到失败: {error_message}")
                        print("=" * 45)
                except ValueError:
                    # 如果响应内容不是JSON格式，直接输出原始内容
                    print(f"账号 {desensitized_phone} 签到失败: {e.response.text}")
                    print("=" * 45)
            else:
                # 如果没有响应内容，输出通用错误提示
                print(f"账号 {desensitized_phone} 签到失败: 网络请求失败，请检查网络连接后重试")
                print("=" * 45)

def complete_tasks(task_ids):
    """
    完成指定任务，并加入随机延迟
    """
    url = "https://ucodeprod-openapi.jinhuijiu.com.cn/task/complete"
    env_variable = "JHHY"

    account_info_list = os.getenv(env_variable, "").splitlines()
    if not account_info_list:
        print("环境变量JHHY未设置或格式不正确")
        print("=" * 45)
        return

    # 首先获取每个账号的脱敏手机号和认证信息
    account_info_map = {}
    for account_info in account_info_list:
        if not account_info.strip():
            continue

        try:
            token_part, serial_part = account_info.split("#", 1)
            token = token_part.strip()
            serial_id = serial_part.strip()
        except ValueError:
            print(f"警告: 账号信息格式错误")
            print("=" * 45)
            continue

        # 获取账号脱敏信息
        headers = {
            'Authorization': f"Bearer {token}",
            'serialId': serial_id,
        }
        try:
            metadata_response = requests.get("https://ucodeprod-openapi.jinhuijiu.com.cn/user/metadata", headers=headers)
            metadata_response.raise_for_status()
            metadata_data = metadata_response.json()
            desensitized_phone = get_desensitized_phone(metadata_data)
            account_info_map[account_info] = {
                'token': token,
                'serial_id': serial_id,
                'desensitized_phone': desensitized_phone
            }
        except Exception as e:
            account_info_map[account_info] = {
                'token': token,
                'serial_id': serial_id,
                'desensitized_phone': "未知账号"
            }

    # 对每个账号完成任务
    for account_info, info in account_info_map.items():
        desensitized_phone = info['desensitized_phone']
        token = info['token']
        serial_id = info['serial_id']

        headers = {
            'Content-Type': "application/json",
            'Authorization': f"Bearer {token}",
            'serialId': serial_id
        }

        for task_id in task_ids:
            payload = {
                "taskId": task_id,
                "auto": True
            }

            try:
                response = requests.post(url, data=json.dumps(payload), headers=headers)
                # 不再调用raise_for_status，因为我们需要捕获400状态码
                if response.status_code == 200:
                    data = response.json()
                    # 如果任务完成成功
                    if data.get('success', False):
                        task_name = data.get('lotteryResultVo', {}).get('prizes', [{}])[0].get('remark', '未知任务')
                        print("=" * 45)
                        print(f"账号 {desensitized_phone} 任务 '{task_name}'（ID: {task_id}）成功完成！")
                        print("=" * 45)
                    else:
                        error_message = data.get('message', '未知错误')
                        print(f"账号 {desensitized_phone} 任务 ID {task_id} 完成失败: {error_message}")
                elif response.status_code == 400:
                    error_data = response.json()
                    if error_data.get('ecode') == 41041 and "用户已完成任务" in error_data.get('emsg', ''):
                        print(f"账号 {desensitized_phone} 任务 ID {task_id} 已完成")
                        print("=" * 45)
                    else:
                        print(f"账号 {desensitized_phone} 任务 ID {task_id} 完成失败: 状态码400，错误信息: {response.text}")
                        print("=" * 45)
                else:
                    print(f"账号 {desensitized_phone} 任务 ID {task_id} 完成失败: 状态码 {response.status_code}，响应内容: {response.text}")
                    print("=" * 45)

                # 随机延迟0-20秒
                delay_time = random.uniform(0, 20)
                print(f"账号 {desensitized_phone} 在完成任务后延迟 {delay_time:.2f} 秒")
                print("=" * 45)
                time.sleep(delay_time)

            except requests.exceptions.RequestException as e:
                print(f"账号 {desensitized_phone} 请求任务 ID {task_id} 时发生网络错误：{e}")
                print("=" * 45)
            except ValueError as e:
                print(f"账号 {desensitized_phone} 解析任务 ID {task_id} 响应内容失败：{e}")
                print("=" * 45)
# 主函数
def main():
    #获取公告
    get_proclamation()
    # 签到任务
    perform_check_in()
    # 完成任务
    task_ids = [100016, 100017, 10018]
    complete_tasks(task_ids)

if __name__ == "__main__":
    main()
