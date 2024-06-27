/*
------------------------------------------
@Author: smallfawn 
@Date: 2024.06.10 21:00
@Description: 每日一句 小程序  一天大概2毛满3提
有问题联系3288588344
频道：https://pd.qq.com/s/672fku8ge
------------------------------------------
变量名：juzi
变量值 https://api.juzi.co/ 接口域名的请求头Headers中token的值 多账号&或换行或新建同名变量
[Script]
http-response

[MITM]
hostname = 

⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
*/

const $ = new Env("每日一句小程序");
let ckName = `juzi`;
let userCookie = checkEnv(
    ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || ""
);
const notify = $.isNode() ? require("./sendNotify") : "";

!(async () => {
    console.log(
        `==================================================\n 脚本执行 - 北京时间(UTC+8): ${new Date(
            new Date().getTime() +
            new Date().getTimezoneOffset() * 60 * 1000 +
            8 * 60 * 60 * 1000
        ).toLocaleString()} \n==================================================`
    );
    //console.log(userCookie)
    if (!userCookie?.length) return console.log(`没有找到CK哦`);
    let index = 1;
    let strSplitor = "#";

    for (let user of userCookie) {
        $.log(`\n🚀 user:【${index}】 start work\n`);
        index++
        $.token = user
        $.ckStatus = true;
        $.juzi = null
        $.sid = null
        await getJuzi();
        if ($.juzi) {
            $.log(`🎉 获取成功：${$.juzi}`);
            await postJuzi();
        } else {
        }
        await getNewJuzi()
        if ($.sid) {
            await likeJuzi()
        } else {
        }
    }

    await $.sendMsg($.logs.join("\n"));
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

async function getJuzi() {
    let config = {
        url: `https://v1.hitokoto.cn`,
        method: "GET"
    }
    let { data: result } = await Request(config);
    if (result) {
        $.juzi = result.hitokoto + "~~~" + result.from_who;
    }
}
async function postJuzi() {

    let config = {
        url: `https://api.juzi.co/sentence/execWrite`,
        method: "POST",
        headers: {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "token": $.token,
            "xweb_xhr": "1",
            "Referer": "https://servicewechat.com/wx3e3540cb2012ea1f/26/page-frame.html",
            "Referrer-Policy": "unsafe-url"
        },
        data: qs({
            "juzi": encodeURIComponent($.juzi),
            "original": "false",
            "writer": "",
            "source": "",
            "tagsValue": "",
            "tagslength": "0",
            "tags": ""
        })

    }


    let { data: result } = await Request(config);
    if (result.code = 200) {
        $.log(`发布句子成功`)
        console.log(result)
    } else {
        $.log(`发布句子失败 [${result.msg}]`)
    }
}

async function likeJuzi() {
    let config = {
        url: `https://api.juzi.co/sentence/slike`,
        method: "POST",
        headers: {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "token": $.token,
            "xweb_xhr": "1",
            "Referer": "https://servicewechat.com/wx3e3540cb2012ea1f/26/page-frame.html",
            "Referrer-Policy": "unsafe-url"
        },
        data: qs({ sid: $.sid })
    }
    let { data: result } = await Request(config);
    if (result.code = 200) {
        $.log(`点赞句子成功`)
    } else {
        $.log(`点赞句子失败 [${result.msg}]`)
    }
}
async function getNewJuzi() {
    let config = {
        url: `https://api.juzi.co/index/tab`,
        method: "GET",
        headers: {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "token": $.token,
            "xweb_xhr": "1",
            "Referer": "https://servicewechat.com/wx3e3540cb2012ea1f/26/page-frame.html",
            "Referrer-Policy": "unsafe-url"
        },
    }
    let { data: result } = await Request(config);
    if (result.code = 200) {
        let num = Math.floor(Math.random() * 9)
        $.sid = result.data.recommend[num].id
    } else {
        $.log(`获取待点赞句子失败 [${result.msg}]`)
    }
}
function qs(obj) {
    let str = "";
    for (let key in obj) {
        str += `${key}=${obj[key]}&`
    }
    return str.substring(0, str.length - 1)
}

function checkEnv(userCookie) {
    const envSplitor = ["&", "\n"];
    //console.log(userCookie);
    let userList = userCookie
        .split(envSplitor.find((o) => userCookie.includes(o)) || "&")
        .filter((n) => n);
    console.log(`共找到${userList.length}个账号`);
    return userList;
}
// prettier-ignore
function Env(t, s) { return new (class { constructor(t, s) { this.name = t; this.logs = []; this.logSeparator = "\n"; this.startTime = new Date().getTime(); Object.assign(this, s); this.log("", `\ud83d\udd14${this.name},\u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } queryStr(options) { return Object.entries(options).map(([key, value]) => `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`).join("&") } getURLParams(url) { const params = {}; const queryString = url.split("?")[1]; if (queryString) { const paramPairs = queryString.split("&"); paramPairs.forEach((pair) => { const [key, value] = pair.split("="); params[key] = value }) } return params } isJSONString(str) { try { return JSON.parse(str) && typeof JSON.parse(str) === "object" } catch (e) { return false } } isJson(obj) { var isjson = typeof obj == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; return isjson } async sendMsg(message) { if (!message) return; if (this.isNode()) { await notify.sendNotify(this.name, message) } else { this.msg(this.name, "", message) } } randomNumber(length) { const characters = "0123456789"; return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join("") } randomString(length) { const characters = "abcdefghijklmnopqrstuvwxyz0123456789"; return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join("") } uuid() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8; return v.toString(16) }) } time(t) { let s = { "M+": new Date().getMonth() + 1, "d+": new Date().getDate(), "H+": new Date().getHours(), "m+": new Date().getMinutes(), "s+": new Date().getSeconds(), "q+": Math.floor((new Date().getMonth() + 3) / 3), S: new Date().getMilliseconds(), }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (new Date().getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in s) { new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? s[e] : ("00" + s[e]).substr(("" + s[e]).length))) } return t } msg(title = t, subtitle = "", body = "", options) { const formatOptions = (options) => { if (!options) { return options } else if (typeof options === "string") { if (this.isQuanX()) { return { "open-url": options } } else { return undefined } } else if (typeof options === "object" && (options["open-url"] || options["media-url"])) { if (this.isQuanX()) { return options } else { return undefined } } else { return undefined } }; if (!this.isMute) { if (this.isQuanX()) { $notify(title, subtitle, body, formatOptions(options)) } } let logs = ["", "==============📣系统通知📣=============="]; logs.push(title); subtitle ? logs.push(subtitle) : ""; body ? logs.push(body) : ""; console.log(logs.join("\n")); this.logs = this.logs.concat(logs) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, s) { const e = !this.isQuanX(); e ? this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t) } wait(t) { return new Promise((s) => setTimeout(s, t)) } done(t = {}) { const s = new Date().getTime(), e = (s - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name},\u7ed3\u675f!\ud83d\udd5b ${e}\u79d2`); this.log(); if (this.isNode()) { process.exit(1) } if (this.isQuanX()) { $done(t) } } })(t, s) }

async function Request(options) {
    if ($.isNode()) {
        const axios = require("axios");
        Request = async (options) => {
            try {
                return await axios.request(options);
            } catch (error) {
                return error && error.error ? error.error : "请求失败";
            }
        };
    }
    if ($.isQuanX()) {
        Request = async (options) => {
            try {
                return await $task.fetch(options);
            } catch (error) {
                return error && error.error ? error.error : "请求失败";
            }
        };
    }
    return await Request(options);
}


