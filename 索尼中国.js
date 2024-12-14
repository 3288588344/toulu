/**
  TL库:https://github.com/3288588344/toulu.git
  tg频道:https://t.me/TLtoulu
  QQ频道:https://pd.qq.com/s/672fku8ge
  
  微信搜索索尼中国小程序
  变量：sonybbs='账号&密码'  多个账号用换行分割 
  定时：一天一次
 cron：5 0 * * *
 */

 const $ = new Env('索尼中国');
 const CryptoJS = require("crypto-js");
 const notify = $.isNode() ? require('./sendNotify') : '';
 const {log} = console;
 const Notify = 1; //0为关闭通知，1为打开通知,默认为1
 //////////////////////
 let sonybbs = process.env.sonybbs;
 let sonybbsArr = [];
 let msg = '';
 let token = '';
 let name = '';
 
 
 !(async () => {
 
     if (!(await Envs()))
         return;
     else {
         log(`\n\n=============================================    \n脚本执行 - 北京时间(UTC+8)：${new Date(
             new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 +
             8 * 60 * 60 * 1000).toLocaleString()} \n=============================================\n`);

         log(`\n=================== 共找到 ${sonybbsArr.length} 个账号 ===================`)
         for (let index = 0; index < sonybbsArr.length; index++) {

             let num = index + 1
             log(`\n========= 开始【第 ${num} 个账号】=========\n`)
 
             sony = sonybbsArr[index].split('&');
             password=getpassword(sony[1]);
 
             msg += `\n第${num}个账号运行结果：`

             log('【开始登录】');
             await login();
             await $.wait(2 * 1000);

             log('【首页签到】');
             await appsignin();
             await $.wait(2 * 1000);

             log('【社区签到】');
             await bbssignin();
             await $.wait(2 * 1000);


             log('【查询信息】');
             await info();
             await $.wait(2 * 1000);

             }

         }
         await SendMsg(msg);
     }
 
 )()
     .catch((e) => log(e))
     .finally(() => $.done())

 /**
  * 登录  
  */
  function login(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://www.sonystyle.com.cn/mysony/bbsapp/index.php?app=user&ac=api&ts=user_login&api=user`,    
            headers: { 
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary5pkSjZVXTMJpiM9l",
                "Accept-Encoding": "gzip, deflate, br"
            },
            //body: `{"channel":"WAP","loginID":"${sony[0]}","password":"${password}"}`,
            body: `------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"user_name\"\n\n${sony[0]}\n------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"channel\"\n\nwap\n------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"pwd\"\n\n${password}\n------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"swiperok\"\n\nfalse\n------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"setSessionId\"\n\n\n------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"setToken\"\n\n\n------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"setScene\"\n\nnc_message_h5\n------WebKitFormBoundary5pkSjZVXTMJpiM9l\nContent-Disposition: form-data; name=\"setSig\"\n\n\n------WebKitFormBoundary5pkSjZVXTMJpiM9l--`,
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.msg == '已登录') {
                    log(`\n账号[${result.data.username}]登录成功`)
                    token = result.data['access_token'];
                    name = result.data.username;
                } else {  
                    loginBack = 1;
                    log(`【登录失败】${result.message} `)
                    msg += `\n【登录失败】${result.message}`
                }
            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
 } 

 /**
  * 查询资产 
  */
 function info(timeout = 3 * 1000) {
     return new Promise((resolve) => {
         let url = {
             url: `https://www.sonystyle.com.cn/mysony/bbsapp/index.php?app=user&ac=api&api=user&ts=getUserinfo`,    
             headers: { 
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
             },
             body: '',
         }
         $.post(url, async (error, response, data) => {
             try {
                 let result = JSON.parse(data);
                 if (result.code == 101) {
                    log(`查询资产失败`)
                 } else {  
                    log(`账号[${name}]成长值：${result.data.level}，等级：${result.data['user_level_text']}，社区点数:${result.data.allscore}`)
                    msg += `\n账号[${name}]成长值：${result.data.level}，等级：${result.data['user_level_text']}，社区点数:${result.data.allscore}`
                 }
 
             } catch (e) {
                 log(e)
             } finally {
                 resolve();
             }
         }, timeout)
     })
 }
 
 /**
  * 首页签到  
  */
  function appsignin(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://www.sonystyle.com.cn/eSolverOmniChannel/account/signupPoints.do?channel=WAP`,    
            headers: { 
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: '',
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.resultMsg[0].code == '99') {
                    log(`账号[${name}]APP首页签到失败：已经签到过了`)
                    msg += `\n账号[${name}]APP首页签到失败：已经签到过了`
                } else {  
                    log(`账号[${name}]APP首页签到成功，今天是第${result.resultData.signupRankingOfDay}个完成签到，目前成长值是：${result.resultData.totalPoints}`)
                    msg += `\n账号[${name}]APP首页签到成功，今天是第${result.resultData.signupRankingOfDay}个完成签到`
                }
            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
 }

 /**
  * 社区签到  
  */
  function bbssignin(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://www.sonystyle.com.cn/mysony/bbsapp/index.php?app=user&ac=api&api=user&ts=signin`,    
            headers: { 
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: '',
        }
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.code == '112') {
                    log(`账号[${name}]索尼社区签到失败：已经签到过了`)
                    msg += `\n账号[${name}]索尼社区签到失败：已经签到过了`
                } else {  
                    log(`账号[${name}]索尼社区签到成功，${result.msg}`)
                    msg += `\n账号[${name}]索尼社区签到成功，${result.msg}`
                }

            } catch (e) {
                log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
 }
// ============================================变量检查============================================ \\
 async function Envs() {
     if (sonybbs) {
         if (sonybbs.indexOf("\n") != -1) {
             sonybbs.split("\n").forEach((item) => {
                 sonybbsArr.push(item);
             });
         } else {
             sonybbsArr.push(sonybbs);
         }
     } else {
         log(`\n 【${$.name}】：未填写变量 sonybbs`)
         return;
     }
 
     return true;
 }
 
 // ============================================发送消息============================================ \\
 async function SendMsg(message) {
     if (!message)
         return;
 
     if (Notify > 0) {
         if ($.isNode()) {
             var notify = require('./sendNotify');
             await notify.sendNotify($.name, message);
         } else {
             $.msg(message);
         }
     } else {
         log(message);
     }
 }
 
 /**
  * 随机数生成
  */
 function randomString(e) {
     e = e || 32;
     var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
         a = t.length,
         n = "";
     for (i = 0; i < e; i++)
         n += t.charAt(Math.floor(Math.random() * a));
     return n
 }
 
 function getpassword(text){
    var key = CryptoJS.enc.Utf8.parse("qydjwjqp4me3rnitdptf7eyznva357fp")
    var encryptedData = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB,  
    padding: CryptoJS.pad.Pkcs7
    });
    return encryptedData;
 }
 
 /**
  * 修改配置文件
  */
  function modify() {
                
    fs.readFile('/ql/data/config/config.sh','utf8',function(err,dataStr){
        if(err){
            return log('读取文件失败！'+err)
        }
        else {
            var result = dataStr.replace(/regular/g,string);
            fs.writeFile('/ql/data/config/config.sh', result, 'utf8', function (err) {
                     if (err) {return log(err);}
                });
            }
    })
 }

 function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("xxxxxx") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }