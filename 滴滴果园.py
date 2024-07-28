"""
滴滴果园

入口：微信小程序->滴滴出行->首页->领车费->免费领水果（中间左右滑动那里）
或者：滴滴出行APP->免费领水果

变量：
ddgyToken: 必填，账号token，多账号换行或者@隔开，格式uid&token。uid可随便填，主要是方便区分账号用


青龙：捉任意game.xiaojukeji.com的包，把请求里面的D-Header-T用填到变量ddgyToken
uid其实不重要，只是用来区分token所属的账号，方便重写。手动捉包的话uid随便填都可以
多账号换行或者@隔开，重写多账号直接换号捉就行
export ddgyToken='uid&token'


有问题联系3288588344
频道：https://pd.qq.com/s/672fku8ge
cron: 28 0,8,12,18 * * *
const $ = new Env('滴滴果园');

"""
import requests
import re
import os
import time
response = requests.get("https://raw.githubusercontent.com/3288588344/toulu/main/tl.json")
response.encoding = 'utf-8'
txt = response.text
print(txt)

def main(uid,token):
    print('=================================')
    print(f'正在执行账号：{uid}')
    try:
        xx = cxguosju(uid,token)
        if xx != None:
            gs,jd,sd=xx
            print(f'种植状态：{gs}-目前进度：{jd}')
            try:
                gsqd(uid,token)
            except Exception as e:
                print('签到出错')

            try:
                gscnlsd(uid,token)
            except Exception as e:
                print('吹牛出错')

            try:
                gskbx(uid,token)
            except Exception as e:
                print('开宝箱出错')

            try:
                print('--------做任务---------')
                cxrw(uid,token)
                print('--------做任务结束---------')
            except Exception as e:
                print('有请，下一位')
        else:
            print('种树吧……')
    except Exception as e:
        print('有请，下一位')
    #查水滴浇水
    try:
        xx = cxguosju(uid,token)
        if xx != None:
            gs,jd,sd=xx
            print(f'目前水滴：{sd}')
            print(f'可浇水：{sd//10}次')
            for xx in range(sd//10):
                print(f"第{xx+1}次浇水-目前进度：{jsjs(uid,token)}")

        else:
            print('种树吧……')
    except Exception as e:
        print('有请，下一位')

#吹牛领水滴
def gscnlsd(uid,token):
    print('----------')
    while True:
        time.sleep(3)
        data = {"xbiz":"240301","prod_key":"didi-orchard","xpsid":"b7b5ec0727fb4c8ea230ed1243c61c79","dchn":"078Je67","xoid":"ce8cef18-738a-4a72-b1e2-63727ff0ad3f","xenv":"wxmp","xspm_from":"welfare-center.none.c1324.none","xpsid_root":"8a334bb6264f4360ba8a917f65520d3b","xpsid_from":"f1bd01f08f3b42c682d3f1058ba838a8","xpsid_share":"","platform":1,"token":token,"game_id":23}
        tijiao = requests.post(url='https://game.xiaojukeji.com/api/game/cow/goal',json=data).json()
        if tijiao['errmsg'] == 'success':
            print(f"吹牛成功目前有水滴：{tijiao['data']['water_wallet']['cur']}")
        else:
            data = {"xbiz":"240301","prod_key":"didi-orchard","xpsid":"73fbe801e5844806a448836ca6eab7bd","dchn":"078Je67","xoid":"ce8cef18-738a-4a72-b1e2-63727ff0ad3f","xenv":"wxmp","xspm_from":"welfare-center.none.c1324.none","xpsid_root":"8a334bb6264f4360ba8a917f65520d3b","xpsid_from":"57cac99225a3488da3bcf1c305e85b31","xpsid_share":"","platform":1,"token":token,"game_id":23}
            tijiao1 = requests.post(url='https://game.xiaojukeji.com/api/game/cow/award',json=data).json()
            print('水滴已满100，不吹牛了，领了')
            break
    print('----------')

#开宝箱
def gskbx(uid,token):
    data = {"xbiz":"240301","prod_key":"didi-orchard","xpsid":"ea8dbe2ec151431ca5cd95b3665a000f","dchn":"078Je67","xoid":"ce8cef18-738a-4a72-b1e2-63727ff0ad3f","xenv":"wxmp","xspm_from":"welfare-center.none.c1324.none","xpsid_root":"8a334bb6264f4360ba8a917f65520d3b","xpsid_from":"3fc9e729fb75452a8d194a7cfff7d236","xpsid_share":"","platform":1,"token":token,"game_id":23}
    tijiao = requests.post(url='https://game.xiaojukeji.com/api/game/plant/recCommonBox',json=data).json()
    if tijiao['errmsg'] == 'success':
        print(f"开宝箱成功获得：{tijiao['data']['rewards'][0]['num']}{tijiao['data']['rewards'][0]['name']}")

#浇水
def jsjs(uid,token):
    data = {"xbiz":"240301","prod_key":"didi-orchard","xpsid":"2b331082770f4992a56178342bb879b2","dchn":"078Je67","xoid":"ce8cef18-738a-4a72-b1e2-63727ff0ad3f","xenv":"wxmp","xspm_from":"welfare-center.none.c1324.none","xpsid_root":"89cbc350b4c3419f81f93db452b8a9b8","xpsid_from":"00959013f7744e01b9fdbe879bf629bc","xpsid_share":"","is_fast":False,"water_status":0,"platform":1,"token":token,"game_id":23}
    tijiao = requests.post(url='https://game.xiaojukeji.com/api/game/plant/newWatering',json=data).json()
    if tijiao['errmsg'] == 'success':
        return tijiao['data']['tree_progress']

#签到
def gsqd(uid,token):
    data = {"xbiz":"240301","prod_key":"didi-orchard","xpsid":"610983df35da43faae623d8a8b8d9710","dchn":"078Je67","xoid":"ce8cef18-738a-4a72-b1e2-63727ff0ad3f","xenv":"wxmp","xspm_from":"welfare-center.none.c1324.none","xpsid_root":"8a334bb6264f4360ba8a917f65520d3b","xpsid_from":"f5232018989841e680abc96dae938ae4","xpsid_share":"","platform":1,"token":token,"game_id":23}
    tijiao = requests.post(url='https://game.xiaojukeji.com/api/game/plant/sign',json=data).json()
    if tijiao['errmsg'] == 'success':
        print(f"签到获得：{tijiao['data']['rewards'][0]['num']}{tijiao['data']['rewards'][0]['name']}")

#查询任务、提交、领取
def cxrw(uid,token):
	#查询
	tijiao = requests.get(url=f'https://game.xiaojukeji.com/api/game/mission/get?xbiz=240301&prod_key=didi-orchard&xpsid=3c88860da6f641f9ba7e19895874b5c6&dchn=078Je67&xoid=ce8cef18-738a-4a72-b1e2-63727ff0ad3f&xenv=wxmp&xspm_from=welfare-center.none.c1324.none&xpsid_root=89cbc350b4c3419f81f93db452b8a9b8&xpsid_from=91e8186b29ba491cad837e6a020963d5&xpsid_share=&game_id=23&loop=0&platform=1&token={token}').json()
	if tijiao['errmsg'] == 'success':

		for i in tijiao['data']['missions']:
			#提交
			headers = {'Content-Type':'application/json;charset=UTF-8'}
			data = {"xbiz":"240301","prod_key":"didi-orchard","xpsid":"3c88860da6f641f9ba7e19895874b5c6","dchn":"078Je67","xoid":"ce8cef18-738a-4a72-b1e2-63727ff0ad3f","xenv":"wxmp","xspm_from":"welfare-center.none.c1324.none","xpsid_root":"89cbc350b4c3419f81f93db452b8a9b8","xpsid_from":"91e8186b29ba491cad837e6a020963d5","xpsid_share":"","mission_id":i['id'],"game_id":23,"platform":1,"token":token}
			tijiao1 = requests.post(url='https://game.xiaojukeji.com/api/game/mission/update',json=data,headers=headers).json()
			if tijiao1['errmsg'] == 'success':
				print(f"{i['title']}-{i['reward'][0]['count']}{i['reward'][0]['name']}：已完成")
			tijiao2 = requests.post(url='https://game.xiaojukeji.com/api/game/mission/award',json=data,headers=headers).json()
			if tijiao2['errmsg'] == 'success':
				print(f"{i['title']}-{i['reward'][0]['count']}{i['reward'][0]['name']}：已领取")
	else:
		print(f'{uid}-登录错误')

#查询果树状态
def cxguosju(uid,token):
	#查询
    data = {"xbiz":"240301","prod_key":"didi-orchard","xpsid":"2f346355e5c2442c8e7a337cd7888b48","dchn":"078Je67","xoid":"ce8cef18-738a-4a72-b1e2-63727ff0ad3f","xenv":"wxmp","xspm_from":"welfare-center.none.c1324.none","xpsid_root":"89cbc350b4c3419f81f93db452b8a9b8","xpsid_from":"41e43325ea244de888ce9f965bffab32","xpsid_share":"","assist_type":0,"encode_uid":"","is_old_player":True,"platform":1,"token":token,"game_id":23}
    tijiao = requests.post(url='https://game.xiaojukeji.com/api/game/plant/newEnter',json=data).json()
    if tijiao['errmsg'] == 'success':
        for i in tijiao['data']['trees_cfg']:

            if i['tree_id'] == tijiao['data']['tree_info']['tree_id']:
                return i['desc'],tijiao['data']['tree_info']['tree_progress'],tijiao['data']['tree_info']['pack_water']
    else:
        print(f'{uid}-登录错误')

if __name__ == '__main__':
    uid = 1
    token = ""
    if 'ddgyToken' in os.environ:
        fen = os.environ.get("ddgyToken").split("@")
        print(f'查找到{len(fen)}个账号')
        print('==================================')
        for duo in fen:
            
            uid,token = duo.split("&")
            try:
                main(uid,token)
                print('============📣结束📣============')
            except Exception as e:
                print('友情提示:系统性报错')
    else:
        print('不存在青龙变量，本地运行')
        if uid == '' or token == '':
            print('本地账号密码为空')
            exit()
        else:
            try:
                main(uid,token)
                print('============📣结束📣============')
            except Exception as e:
                print('友情提示:系统性报错')