/**
 * 丰信客户端
 * fxkhd
 * Author: Mist 
 * Date: 2024-06-08
 * 抓app 丰信客户端 一天1w8积分
 * cron "10 10,16 * * *" fxkud.js
 * export fxkhd= token&uid&deviceCode 多账号换行或者#分隔
 必须一机一号，不然失效很快
 有问题联系3288588344
 频道：https://pd.qq.com/s/672fku8ge

长期套餐大额流量电话卡办理地址：https://hk.yunhaoka.cn/#/pages/micro_store/index?agent_id=669709

 
 */
// ============================================================================================================
const $ = new Env("丰信客户端");
const axios = require("axios");
const env_name = "fxkhd"; //环境变量名字
const env = process.env[env_name] || ""; //获取环境变量
const Notify = 1; //是否通知, 1通知, 0不通知. 默认通知
const debug = 0; //是否调试, 1调试, 0不调试. 默认不调试
let scriptVersionNow = "1.0.0"; //脚本版本号
let msg = "";
// ==================================异步顺序==============================================================================
!(async () => {
	await getNotice(); //远程通知

	await main(); //主函数
	await SendMsg(msg); //发送通知
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done());
//==================================脚本入口函数main()==============================================================
async function main() {
	if (env == "") {
		//没有设置变量,直接退出
		console.log(`没有填写变量,请查看脚本说明: ${env_name}`);
		return;
	}
	let user_ck = env.split("\n");
	DoubleLog(`\n========= 共找到 ${user_ck.length} 个账号 =========`);
	let index = 1; //用来给账号标记序号, 从1开始
	for (let ck of user_ck) {
		if (!ck) continue; //跳过空行
		let ck_info = ck.split("&");
		let token = ck_info[0];
		let uid = ck_info[1];
		let deviceCode = ck_info[2];
		let user = {
			index: index,
			token,
			uid,
			deviceCode,
		};
		index = index + 1; //每次用完序号+1
		let Run = new run(user);
        await Run.userTask(user)
		//每个账号之间等1~5秒随机时间
		let rnd_time = Math.floor(Math.random() * 4000) + 1000;
		console.log(`账号[${user.index}]随机等待${rnd_time / 1000}秒...`);
		await $.wait(rnd_time);
	}
}
class run {
    constructor(user) {
		this.signkey = 'nNo7464SYE6kUHjL';
	}
// ======================================开始任务=========================================
async  userTask(user) {
	console.log(`\n============= 账号[${user.index}]开始任务 =============`);
	await this.generalKeyGet(user)
	await this.SignTask(user);
	await wait(3);
	await this.fb(user);
	await wait(3);
	await this.jl(user);
	await wait(3);
	await this.jljs(user);
	await wait(3);
	for (let i = 0; i < 10; i++) {
		await this.dj(user);
		await wait(30);
		await this.dy(user);
		await wait(30);
		await this.mndj(user);
		await wait(30);
		await this.dyplus(user);
		await wait(30);
	}
	for (let i = 0; i < 3; i++) {
		await this.gg(user);
		await wait(2);
		await this.jlmax(user);
		await wait(2);
		await this.ggplus(user);
		await wait(2);
	}
	await this.liulan(user);
	await wait(30);
	await this.zzlq(user);
	await wait(2);
	await this.account(user);
}
// =============================================================================================================================
async  generalKeyGet(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5(time + user.uid + this.signkey);
		//console.log(sign);
		//console.log(sign);
		let urlObject = {
			method: "GET",
			url: "https://capp.phtion.com/api/system/generalKey",
			headers: {
				Host: "capp.phtion.com",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
		};
		//
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result?.status == "200") {
			//打印签到结果
			DoubleLog(`🌸账号[${user.index}]` + `🕊获取key成功[${result.data}]🎉`);
			this.signkey = 'nNo7464SYE6kUHjL' + result.data
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//签到
async  SignTask(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5(time + user.uid + this.signkey);
		//console.log(sign);
		let urlObject = {
			method: "GET",
			url: "https://capp.phtion.com/api/sign/daily-sign-v3",
			headers: {
				Host: "capp.phtion.com",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
		};
		//
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result?.status == "200") {
			//打印签到结果
			DoubleLog(`🌸账号[${user.index}]` + `🕊签到[${result.data}]🎉`);
		}
		if (result?.status == "400") {
			DoubleLog(`🌸账号[${user.index}]签到失败:[${result.message}]❌`);
		}
		if (result?.status == "500") {
			DoubleLog(`🌸账号[${user.index}]登入失败,${result.message}❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
// 签到任务翻倍
async  fb(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5(
			"finishType0taskCode1010taskDetail1" + time + user.uid + this.signkey
		);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers:{
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "1",
				taskCode: "1010",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊签到翻倍任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//激励视频
async  jl(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode0011taskDetail1" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "1",
				taskCode: "0011",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊激励视频任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//激励解锁
async  jljs(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType1taskCode0012taskDetail1" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "1",
				taskCode: "0012",
				finishType: "1",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊激励视频解锁任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//广告
async  gg(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode0010taskDetail1" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "1",
				taskCode: "0010",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊广告任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//看短剧
async  dj(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode009taskDetail30" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "30",
				taskCode: "009",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊看短剧任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//抖音
async  dy(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode008taskDetail30" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "30",
				taskCode: "008",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊抖音任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//迷你短剧
async  mndj(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode006taskDetail30" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "30",
				taskCode: "006",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊迷你短剧任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//抖音plus
async  dyplus(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode004taskDetail30" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "30",
				taskCode: "004",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊抖音plus任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//激励视频MAX
async  jlmax(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode007taskDetail1" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "1",
				taskCode: "007",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊激励视频MAX任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//广告plus
async  ggplus(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode0014taskDetail1" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "1",
				taskCode: "0014",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊广告plus任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//浏览任务
async  liulan(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode002taskDetail30" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "30",
				taskCode: "002",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊浏览任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//最终奖励
async  zzlq(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5("finishType0taskCode1011taskDetail1" + time + user.uid + this.signkey);
		let urlObject = {
			method: "POST",
			url: "https://capp.phtion.com/api/task/add-task-rate-v3",
			headers: {
				Host: "capp.phtion.com",
				"Content-Type": "application/x-www-form-urlencoded",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
			data: {
				taskDetail: "1",
				taskCode: "1011",
				finishType: "0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			console.log(`🌸账号[${user.index}]🕊最终奖励任务[${result.message}]🎉`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊任务失败❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
//账户积分
async  account(user) {
	try {
		let md5 = require("md5");
		let time = getTimestamp();
		let sign = md5(`uid${user.uid}` + time + user.uid + this.signkey);
		let urlObject = {
			method: "get",
			url: `https://capp.phtion.com/api/account/getintegral?uid=${user.uid}`,
			headers: {
				Host: "capp.phtion.com",
				version: "3.2.0",
				token: `${user.token}`,
				sign: sign,
				plat: "1",
				time: time,
				deviceCode: `${user.deviceCode}`,
				"User-Agent": "okhttp/4.12.0",
			},
		};
		let { data: result } = await axios.request(urlObject);
		//console.log(result);
		if (result) {
			DoubleLog(`🌸账号[${user.index}]🕊账户当前积分${result.message}:[${result.data.num}]💰`);
		} else {
			DoubleLog(`🌸账号[${user.index}]🕊查询当前积分失败:${result.message}❌`);
		}
	} catch (e) {
		//打印错误信息
		console.log(e);
	}
}
}
/**
 * =========================================================发送消息=============================================
 */
async function SendMsg(message) {
	if (!message) return;
	if (Notify > 0) {
		if ($.isNode()) {
			var notify = require("./sendNotify");
			await notify.sendNotify($.name, message);
		} else {
			// $.msg(message);
			$.msg($.name, "", message);
		}
	} else {
		console.log(message);
	}
}
/**
 * =====================================================双平台log输出==========================================
 */
function DoubleLog(data) {
	if ($.isNode()) {
		if (data) {
			console.log(`${data}`);
			msg += `\n${data}`;
		}
	} else {
		console.log(`${data}`);
		msg += `\n${data}`;
	}
}
/**
 * ======================================================等待 X 秒============================================
 */
function wait(n) {
	return new Promise(function (resolve) {
		setTimeout(resolve, n * 1000);
	});
}
/**
 * ======================================================随机等待 1-5 秒============================================
 */
function sjwait() {
	return new Promise(function (resolve) {
		let waitTime = Math.floor(Math.random() * 4000 + 1000);
		setTimeout(resolve, waitTime);
	});
}
// ==========================================================13位时间戳=====================================================
function getTimestamp() {
	return new Date().getTime();
}
//===============================================网络请求httpRequest=========================================
function httpRequest(options, timeout = 1 * 1000) {
	method = options.method ? options.method.toLowerCase() : options.body ? "post" : "get";
	return new Promise((resolve) => {
		setTimeout(() => {
			$[method](options, (err, resp, data) => {
				try {
					if (err) {
						console.log(JSON.stringify(err));
						$.logErr(err);
					} else {
						try {
							data = JSON.parse(data);
						} catch (error) {}
					}
				} catch (e) {
					console.log(e);
					$.logErr(e, resp);
				} finally {
					resolve(data);
				}
			});
		}, timeout);
	});
}
//==============================================Debug模式===============================================
function debugLog(...args) {
	if (debug) {
		console.log(...args);
	}
}
//===============================================获取远程通知========================================
async function getNotice() {
	try {
		const urls = ["https://raw.githubusercontent.com/3288588344/toulu/main/tl.json"];
		let notice = null;
		for (const url of urls) {
			const options = { url, headers: { "User-Agent": "" } };
			const result = await httpRequest(options);
			if (result && "notice" in result) {
				notice = result.notice.replace(/\\n/g, "\n");
				break;
			}
		}
		if (notice) {
			$.DoubleLog(notice);
		}
	} catch (e) {
		console.log(e);
	}
}


//===============================================================================================================================================
//================================================固定API===============================================================================================
function Env(t, e) {
	class s {
		constructor(t) {
			this.env = t;
		}
		send(t, e = "GET") {
			t = "string" == typeof t ? { url: t } : t;
			let s = this.get;
			return (
				"POST" === e && (s = this.post),
				new Promise((e, a) => {
					s.call(this, t, (t, s, r) => {
						t ? a(t) : e(s);
					});
				})
			);
		}
		get(t) {
			return this.send.call(this.env, t);
		}
		post(t) {
			return this.send.call(this.env, t, "POST");
		}
	}
	return new (class {
		constructor(t, e) {
			this.userList = [];
			this.userIdx = 0;
			(this.name = t),
				(this.http = new s(this)),
				(this.data = null),
				(this.dataFile = "box.dat"),
				(this.logs = []),
				(this.isMute = !1),
				(this.isNeedRewrite = !1),
				(this.logSeparator = "\n"),
				(this.encoding = "utf-8"),
				(this.startTime = new Date().getTime()),
				Object.assign(this, e),
				this.log("", `🔔${this.name},开始!`);
		}
		getEnv() {
			return "undefined" != typeof $environment && $environment["surge-version"]
				? "Surge"
				: "undefined" != typeof $environment && $environment["stash-version"]
				? "Stash"
				: "undefined" != typeof module && module.exports
				? "Node.js"
				: "undefined" != typeof $task
				? "Quantumult X"
				: "undefined" != typeof $loon
				? "Loon"
				: "undefined" != typeof $rocket
				? "Shadowrocket"
				: void 0;
		}
		isNode() {
			return "Node.js" === this.getEnv();
		}
		isQuanX() {
			return "Quantumult X" === this.getEnv();
		}
		isSurge() {
			return "Surge" === this.getEnv();
		}
		isLoon() {
			return "Loon" === this.getEnv();
		}
		isShadowrocket() {
			return "Shadowrocket" === this.getEnv();
		}
		isStash() {
			return "Stash" === this.getEnv();
		}
		toObj(t, e = null) {
			try {
				return JSON.parse(t);
			} catch {
				return e;
			}
		}
		toStr(t, e = null) {
			try {
				return JSON.stringify(t);
			} catch {
				return e;
			}
		}
		getjson(t, e) {
			let s = e;
			const a = this.getdata(t);
			if (a)
				try {
					s = JSON.parse(this.getdata(t));
				} catch {}
			return s;
		}
		setjson(t, e) {
			try {
				return this.setdata(JSON.stringify(t), e);
			} catch {
				return !1;
			}
		}
		getScript(t) {
			return new Promise((e) => {
				this.get({ url: t }, (t, s, a) => e(a));
			});
		}
		runScript(t, e) {
			return new Promise((s) => {
				let a = this.getdata("@chavy_boxjs_userCfgs.httpapi");
				a = a ? a.replace(/\n/g, "").trim() : a;
				let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
				(r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r);
				const [i, o] = a.split("@"),
					n = {
						url: `http://${o}/v1/scripting/evaluate`,
						body: { script_text: t, mock_type: "cron", timeout: r },
						headers: { "X-Key": i, Accept: "*/*" },
						timeout: r,
					};
				this.post(n, (t, e, a) => s(a));
			}).catch((t) => this.logErr(t));
		}
		loaddata() {
			if (!this.isNode()) return {};
			{
				(this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path"));
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					a = !s && this.fs.existsSync(e);
				if (!s && !a) return {};
				{
					const a = s ? t : e;
					try {
						return JSON.parse(this.fs.readFileSync(a));
					} catch (t) {
						return {};
					}
				}
			}
		}
		writedata() {
			if (this.isNode()) {
				(this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path"));
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					a = !s && this.fs.existsSync(e),
					r = JSON.stringify(this.data);
				s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
			}
		}
		lodash_get(t, e, s) {
			const a = e.replace(/\[(\d+)\]/g, ".$1").split(".");
			let r = t;
			for (const t of a) if (((r = Object(r)[t]), void 0 === r)) return s;
			return r;
		}
		lodash_set(t, e, s) {
			return Object(t) !== t
				? t
				: (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
				  (e
						.slice(0, -1)
						.reduce(
							(t, s, a) => (Object(t[s]) === t[s] ? t[s] : (t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {})),
							t
						)[e[e.length - 1]] = s),
				  t);
		}
		getdata(t) {
			let e = this.getval(t);
			if (/^@/.test(t)) {
				const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t),
					r = s ? this.getval(s) : "";
				if (r)
					try {
						const t = JSON.parse(r);
						e = t ? this.lodash_get(t, a, "") : e;
					} catch (t) {
						e = "";
					}
			}
			return e;
		}
		setdata(t, e) {
			let s = !1;
			if (/^@/.test(e)) {
				const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e),
					i = this.getval(a),
					o = a ? ("null" === i ? null : i || "{}") : "{}";
				try {
					const e = JSON.parse(o);
					this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), a));
				} catch (e) {
					const i = {};
					this.lodash_set(i, r, t), (s = this.setval(JSON.stringify(i), a));
				}
			} else s = this.setval(t, e);
			return s;
		}
		getval(t) {
			switch (this.getEnv()) {
				case "Surge":
				case "Loon":
				case "Stash":
				case "Shadowrocket":
					return $persistentStore.read(t);
				case "Quantumult X":
					return $prefs.valueForKey(t);
				case "Node.js":
					return (this.data = this.loaddata()), this.data[t];
				default:
					return (this.data && this.data[t]) || null;
			}
		}
		setval(t, e) {
			switch (this.getEnv()) {
				case "Surge":
				case "Loon":
				case "Stash":
				case "Shadowrocket":
					return $persistentStore.write(t, e);
				case "Quantumult X":
					return $prefs.setValueForKey(t, e);
				case "Node.js":
					return (this.data = this.loaddata()), (this.data[e] = t), this.writedata(), !0;
				default:
					return (this.data && this.data[e]) || null;
			}
		}
		initGotEnv(t) {
			(this.got = this.got ? this.got : require("got")),
				(this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
				(this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
				t &&
					((t.headers = t.headers ? t.headers : {}),
					void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
		}
		get(t, e = () => {}) {
			switch (
				(t.headers &&
					(delete t.headers["Content-Type"],
					delete t.headers["Content-Length"],
					delete t.headers["content-type"],
					delete t.headers["content-length"]),
				this.getEnv())
			) {
				case "Surge":
				case "Loon":
				case "Stash":
				case "Shadowrocket":
				default:
					this.isSurge() &&
						this.isNeedRewrite &&
						((t.headers = t.headers || {}), Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
						$httpClient.get(t, (t, s, a) => {
							!t && s && ((s.body = a), (s.statusCode = s.status ? s.status : s.statusCode), (s.status = s.statusCode)),
								e(t, s, a);
						});
					break;
				case "Quantumult X":
					this.isNeedRewrite && ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
						$task.fetch(t).then(
							(t) => {
								const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t;
								e(
									null,
									{
										status: s,
										statusCode: a,
										headers: r,
										body: i,
										bodyBytes: o,
									},
									i,
									o
								);
							},
							(t) => e((t && t.error) || "UndefinedError")
						);
					break;
				case "Node.js":
					let s = require("iconv-lite");
					this.initGotEnv(t),
						this.got(t)
							.on("redirect", (t, e) => {
								try {
									if (t.headers["set-cookie"]) {
										const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
										s && this.ckjar.setCookieSync(s, null), (e.cookieJar = this.ckjar);
									}
								} catch (t) {
									this.logErr(t);
								}
							})
							.then(
								(t) => {
									const { statusCode: a, statusCode: r, headers: i, rawBody: o } = t,
										n = s.decode(o, this.encoding);
									e(
										null,
										{
											status: a,
											statusCode: r,
											headers: i,
											rawBody: o,
											body: n,
										},
										n
									);
								},
								(t) => {
									const { message: a, response: r } = t;
									e(a, r, r && s.decode(r.rawBody, this.encoding));
								}
							);
			}
		}
		post(t, e = () => {}) {
			const s = t.method ? t.method.toLocaleLowerCase() : "post";
			switch (
				(t.body &&
					t.headers &&
					!t.headers["Content-Type"] &&
					!t.headers["content-type"] &&
					(t.headers["content-type"] = "application/x-www-form-urlencoded"),
				t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]),
				this.getEnv())
			) {
				case "Surge":
				case "Loon":
				case "Stash":
				case "Shadowrocket":
				default:
					this.isSurge() &&
						this.isNeedRewrite &&
						((t.headers = t.headers || {}), Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
						$httpClient[s](t, (t, s, a) => {
							!t && s && ((s.body = a), (s.statusCode = s.status ? s.status : s.statusCode), (s.status = s.statusCode)),
								e(t, s, a);
						});
					break;
				case "Quantumult X":
					(t.method = s),
						this.isNeedRewrite && ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
						$task.fetch(t).then(
							(t) => {
								const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t;
								e(
									null,
									{
										status: s,
										statusCode: a,
										headers: r,
										body: i,
										bodyBytes: o,
									},
									i,
									o
								);
							},
							(t) => e((t && t.error) || "UndefinedError")
						);
					break;
				case "Node.js":
					let a = require("iconv-lite");
					this.initGotEnv(t);
					const { url: r, ...i } = t;
					this.got[s](r, i).then(
						(t) => {
							const { statusCode: s, statusCode: r, headers: i, rawBody: o } = t,
								n = a.decode(o, this.encoding);
							e(null, { status: s, statusCode: r, headers: i, rawBody: o, body: n }, n);
						},
						(t) => {
							const { message: s, response: r } = t;
							e(s, r, r && a.decode(r.rawBody, this.encoding));
						}
					);
			}
		}
		time(t, e = null) {
			const s = e ? new Date(e) : new Date();
			let a = {
				"M+": s.getMonth() + 1,
				"d+": s.getDate(),
				"H+": s.getHours(),
				"m+": s.getMinutes(),
				"s+": s.getSeconds(),
				"q+": Math.floor((s.getMonth() + 3) / 3),
				S: s.getMilliseconds(),
			};
			/(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
			for (let e in a)
				new RegExp("(" + e + ")").test(t) &&
					(t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length)));
			return t;
		}
		queryStr(t) {
			let e = "";
			for (const s in t) {
				let a = t[s];
				null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), (e += `${s}=${a}&`));
			}
			return (e = e.substring(0, e.length - 1)), e;
		}
		msg(e = t, s = "", a = "", r) {
			const i = (t) => {
				switch (typeof t) {
					case void 0:
						return t;
					case "string":
						switch (this.getEnv()) {
							case "Surge":
							case "Stash":
							default:
								return { url: t };
							case "Loon":
							case "Shadowrocket":
								return t;
							case "Quantumult X":
								return { "open-url": t };
							case "Node.js":
								return;
						}
					case "object":
						switch (this.getEnv()) {
							case "Surge":
							case "Stash":
							case "Shadowrocket":
							default: {
								let e = t.url || t.openUrl || t["open-url"];
								return { url: e };
							}
							case "Loon": {
								let e = t.openUrl || t.url || t["open-url"],
									s = t.mediaUrl || t["media-url"];
								return { openUrl: e, mediaUrl: s };
							}
							case "Quantumult X": {
								let e = t["open-url"] || t.url || t.openUrl,
									s = t["media-url"] || t.mediaUrl,
									a = t["update-pasteboard"] || t.updatePasteboard;
								return {
									"open-url": e,
									"media-url": s,
									"update-pasteboard": a,
								};
							}
							case "Node.js":
								return;
						}
					default:
						return;
				}
			};
			if (!this.isMute)
				switch (this.getEnv()) {
					case "Surge":
					case "Loon":
					case "Stash":
					case "Shadowrocket":
					default:
						$notification.post(e, s, a, i(r));
						break;
					case "Quantumult X":
						$notify(e, s, a, i(r));
						break;
					case "Node.js":
				}
			if (!this.isMuteLog) {
				let t = ["", "==============📣系统通知📣=============="];
				t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("\n")), (this.logs = this.logs.concat(t));
			}
		}
		log(...t) {
			t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator));
		}
		logErr(t, e) {
			switch (this.getEnv()) {
				case "Surge":
				case "Loon":
				case "Stash":
				case "Shadowrocket":
				case "Quantumult X":
				default:
					this.log("", `❗️${this.name},错误!`, t);
					break;
				case "Node.js":
					this.log("", `❗️${this.name},错误!`, t.stack);
			}
		}
		wait(t) {
			return new Promise((e) => setTimeout(e, t));
		}
		DoubleLog(d) {
			if (this.isNode()) {
				if (d) {
					console.log(`${d}`);
					msg += `\n ${d}`;
				}
			} else {
				console.log(`${d}`);
				msg += `\n ${d}`;
			}
		}
		async SendMsg(m) {
			if (!m) return;
			if (Notify > 0) {
				if (this.isNode()) {
					var notify = require("./sendNotify");
					await notify.sendNotify(this.name, m);
				} else {
					this.msg(this.name, "", m);
				}
			} else {
				console.log(m);
			}
		}
		done(t = {}) {
			const e = new Date().getTime(),
				s = (e - this.startTime) / 1e3;
			switch ((this.log("", `🔔${this.name},结束!🕛${s}秒`), this.log(), this.getEnv())) {
				case "Surge":
				case "Loon":
				case "Stash":
				case "Shadowrocket":
				case "Quantumult X":
				default:
					$done(t);
					break;
				case "Node.js":
					process.exit(1);
			}
		}
	})(t, e);
}
