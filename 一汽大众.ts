/**
 * 一汽大众，签到
 * cron 0 9 * * *  一汽大众.js
 * ========= 青龙--配置文件 ===========
 * # 项目名称
 * export yqdz_data='token @ token'
 *
 * 多账号用 换行 或 @ 分割
 * ====================================
 *
 */
const $ = new Env("一汽大众");
const ckName = "yqdz_data";
//-------------------- 一般不动变量区域 -------------------------------------
const Notify = 1;		 //0为关闭通知,1为打开通知,默认为1
let debug = 1;           //Debug调试   0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';       //let ck,msg
let host, hostname;
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
let userList = [];
let userIdx = 0;
let userCount = 0;
//---------------------- 自定义变量区域 -----------------------------------

function r(r, n, t, u, e, o) {
    return c((f = c(c(n, r), c(u, o))) << (a = e) | f >>> 32 - a, t);
    var f, a;
}

function n(n, t, u, e, c, o, f) {
    return r(t & u | ~t & e, n, t, c, o, f);
}

function t(n, t, u, e, c, o, f) {
    return r(t & e | u & ~e, n, t, c, o, f);
}

function u(n, t, u, e, c, o, f) {
    return r(t ^ u ^ e, n, t, c, o, f);
}

function e(n, t, u, e, c, o, f) {
    return r(u ^ (t | ~e), n, t, c, o, f);
}

function c(r, n) {
    var t = (65535 & r) + (65535 & n);
    return (r >> 16) + (n >> 16) + (t >> 16) << 16 | 65535 & t;
}

const hex_md5 = function(r) {
    return function(r) {
        for (var n = "0123456789abcdef", t = "", u = 0; u < 4 * r.length; u++) t += n.charAt(r[u >> 2] >> u % 4 * 8 + 4 & 15) + n.charAt(r[u >> 2] >> u % 4 * 8 & 15);
        return t;
    }(function(r, o) {
        r[o >> 5] |= 128 << o % 32, r[14 + (o + 64 >>> 9 << 4)] = o;
        for (var f = 1732584193, a = -271733879, i = -1732584194, h = 271733878, v = 0; v < r.length; v += 16) {
            var A = f, g = a, l = i, d = h;
            f = n(f, a, i, h, r[v + 0], 7, -680876936), h = n(h, f, a, i, r[v + 1], 12, -389564586),
                i = n(i, h, f, a, r[v + 2], 17, 606105819), a = n(a, i, h, f, r[v + 3], 22, -1044525330),
                f = n(f, a, i, h, r[v + 4], 7, -176418897), h = n(h, f, a, i, r[v + 5], 12, 1200080426),
                i = n(i, h, f, a, r[v + 6], 17, -1473231341), a = n(a, i, h, f, r[v + 7], 22, -45705983),
                f = n(f, a, i, h, r[v + 8], 7, 1770035416), h = n(h, f, a, i, r[v + 9], 12, -1958414417),
                i = n(i, h, f, a, r[v + 10], 17, -42063), a = n(a, i, h, f, r[v + 11], 22, -1990404162),
                f = n(f, a, i, h, r[v + 12], 7, 1804603682), h = n(h, f, a, i, r[v + 13], 12, -40341101),
                i = n(i, h, f, a, r[v + 14], 17, -1502002290), f = t(f, a = n(a, i, h, f, r[v + 15], 22, 1236535329), i, h, r[v + 1], 5, -165796510),
                h = t(h, f, a, i, r[v + 6], 9, -1069501632), i = t(i, h, f, a, r[v + 11], 14, 643717713),
                a = t(a, i, h, f, r[v + 0], 20, -373897302), f = t(f, a, i, h, r[v + 5], 5, -701558691),
                h = t(h, f, a, i, r[v + 10], 9, 38016083), i = t(i, h, f, a, r[v + 15], 14, -660478335),
                a = t(a, i, h, f, r[v + 4], 20, -405537848), f = t(f, a, i, h, r[v + 9], 5, 568446438),
                h = t(h, f, a, i, r[v + 14], 9, -1019803690), i = t(i, h, f, a, r[v + 3], 14, -187363961),
                a = t(a, i, h, f, r[v + 8], 20, 1163531501), f = t(f, a, i, h, r[v + 13], 5, -1444681467),
                h = t(h, f, a, i, r[v + 2], 9, -51403784), i = t(i, h, f, a, r[v + 7], 14, 1735328473),
                f = u(f, a = t(a, i, h, f, r[v + 12], 20, -1926607734), i, h, r[v + 5], 4, -378558),
                h = u(h, f, a, i, r[v + 8], 11, -2022574463), i = u(i, h, f, a, r[v + 11], 16, 1839030562),
                a = u(a, i, h, f, r[v + 14], 23, -35309556), f = u(f, a, i, h, r[v + 1], 4, -1530992060),
                h = u(h, f, a, i, r[v + 4], 11, 1272893353), i = u(i, h, f, a, r[v + 7], 16, -155497632),
                a = u(a, i, h, f, r[v + 10], 23, -1094730640), f = u(f, a, i, h, r[v + 13], 4, 681279174),
                h = u(h, f, a, i, r[v + 0], 11, -358537222), i = u(i, h, f, a, r[v + 3], 16, -722521979),
                a = u(a, i, h, f, r[v + 6], 23, 76029189), f = u(f, a, i, h, r[v + 9], 4, -640364487),
                h = u(h, f, a, i, r[v + 12], 11, -421815835), i = u(i, h, f, a, r[v + 15], 16, 530742520),
                f = e(f, a = u(a, i, h, f, r[v + 2], 23, -995338651), i, h, r[v + 0], 6, -198630844),
                h = e(h, f, a, i, r[v + 7], 10, 1126891415), i = e(i, h, f, a, r[v + 14], 15, -1416354905),
                a = e(a, i, h, f, r[v + 5], 21, -57434055), f = e(f, a, i, h, r[v + 12], 6, 1700485571),
                h = e(h, f, a, i, r[v + 3], 10, -1894986606), i = e(i, h, f, a, r[v + 10], 15, -1051523),
                a = e(a, i, h, f, r[v + 1], 21, -2054922799), f = e(f, a, i, h, r[v + 8], 6, 1873313359),
                h = e(h, f, a, i, r[v + 15], 10, -30611744), i = e(i, h, f, a, r[v + 6], 15, -1560198380),
                a = e(a, i, h, f, r[v + 13], 21, 1309151649), f = e(f, a, i, h, r[v + 4], 6, -145523070),
                h = e(h, f, a, i, r[v + 11], 10, -1120210379), i = e(i, h, f, a, r[v + 2], 15, 718787259),
                a = e(a, i, h, f, r[v + 9], 21, -343485551), f = c(f, A), a = c(a, g), i = c(i, l),
                h = c(h, d);
        }
        return Array(f, a, i, h);
    }(function(r) {
        for (var n = Array(), t = 0; t < 8 * r.length; t += 8) n[t >> 5] |= (255 & r.charCodeAt(t / 8)) << t % 32;
        return n;
    }(r), 8 * r.length));
};


const queryToArray = function (data) {
    let array = [];
    for (let e in data) null != data[e] && array.push("".concat(e, "=").concat(data[e]));
    return array;
};
const path = '/general/public/v1/mall/integral/get_days_sign'

let users = userCookie.split(envSplitor[0])
console.log('找到'+(users.length)+'个账号')

for (let user of users){
    start(user)
}

function start(token){
    const queryData = {
        appkey:'6667793400',// 小程序的key
        signTimestamp:Date.now(),
        timestamp:Date.now(),
        nonce:'',
    }
    queryData.nonce = Array.from({length: 8}).map(function () {
        return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
    }).join("");

    let queryArray = queryToArray(queryData);

    let digitalSign, newPath = path.replace("one-app/", "").replace("test/", "").replace(/^\//, "");
    if (Array.isArray(queryArray)) {
        queryArray.sort();
        let pathStr = "".concat(newPath, "_").concat(queryArray.join("_"), "_").concat('a9a7371b38547e7ddbdd368927f9da9c'),
            c = encodeURIComponent(pathStr);
        digitalSign = hex_md5(c);
    } else console.error("signAlgorithm - queryArray 必须为数组！");
    queryData.digitalSign = digitalSign

    const query = queryToArray(queryData).join('&')
    let options = {
        url: 'https://one-app-h5.faw-vw.com/prod-api/mobile/one-app'+path+'?'+query,
        headers: {
            "Host":"one-app-h5.faw-vw.com",
            "Connection":"keep-alive",
            "Content-Length":"147",
            "Did":"VW_WECHAT_iPhone 14 Pro<iPhone15,2>_12345678912345678900_iOS 16.6_v1.23.0",
            "content-type":"application/json",
            "x-mp-name":"SERVER",
            "x-microservice-name":"api-gateway",
            "Authorization":token,
            "bodySign":"111b4e07bc91b24267b4dc698955e37bc4b683f9995db56262567b9913976606",
            "x-namespace-code":"production",
            "anonymous-id":"MINIAPPSERVER_",
            "Accept-Encoding":"gzip,compress,br,deflate",
            "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42(0x18002a2b) NetType/WIFI Language/zh_CN",
            "Referer":"https://servicewechat.com/wx684fc81ee38e543e/56/page-frame.html",
        }
    }


    $.get(options, (err, resp, str) => {
        const data = JSON.parse(str)
        if(data.returnStatus === 'SUCCEED'){
            const res = data.data
            console.log(`账号1登录成功，总积分${res.availablescore},累计签到：${res.totaldays}天`)
        }else{
            console.log('异常信息')
            console.log(data)
        }
    })

}

// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
