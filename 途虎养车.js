/**

TL库
QQ频道：https://pd.qq.com/s/672fku8ge
tg频道：https://t.me/TLtoulu
 * 脚本名称：途虎养车
 * 活动规则：每日签到可获取积分奖励
 * 脚本说明：添加重写进入途虎养车小程序积分页面即可获取 Token，支持多账号，兼容 NE / Node.js 环境。
 * 环境变量：TUHU_TOKEN、TUHU_BLACKBOX / CODESERVER_ADDRESS、CODESERVER_FUN、TUHU_BLACKBOX
========================================================================================================
cron: 12 8 * * *
更新cron
青龙环境变量：TUHU_TOKEN、TUHU_BLACKBOX  ，可以随便填（ CODESERVER_ADDRESS、CODESERVER_FUN）
api.tuhu.cn域名下 TUHU_TOKEN不要 Bearer 不要空格  ck比较长 个把月都不会变
TUHU_BLACKBOX只有7天 
========================================================================================================

------------------ Surge 配置 -----------------

[MITM]
hostname = api.tuhu.cn

[Script]
途虎养车 = type=cron,cronexp=17 7 * * *,timeout=60,script-path=https://www.tuhu.cn/cn/home/default/FoKit/Scripts/main/scripts/tuhu.js,script-update-interval=0

------------------ Loon 配置 ------------------

[MITM]
hostname = api.tuhu.cn

[Script]
cron "17 7 * * *" script-path=https://www.tuhu.cn/cn/home/default/FoKit/Scripts/main/scripts/tuhu.js,tag = 途虎养车,enable=true

-------------- Quantumult X 配置 --------------

[MITM]
hostname = api.tuhu.cn

[rewrite_local]
https:\/\/api\.tuhu\.cn\/User\/GetInternalCenterInfo url script-request-header https://www.tuhu.cn/cn/home/default/FoKit/Scripts/main/scripts/tuhu.js

[task_local]
------------------ Stash 配置 -----------------

cron:
  script:
    - name: 途虎养车
      cron: '17 7 * * *'
      timeout: 10

http:
  mitm:
    - "api.tuhu.cn"
  script:
    - match: https:\/\/api\.tuhu\.cn\/User\/GetInternalCenterInfo
      name: 途虎养车
      type: request
      require-body: false

script-providers:
  途虎养车:
    url: https://www.tuhu.cn/cn/home/default/FoKit/Scripts/main/scripts/tuhu.js
    interval: 86400

 */

const $ = new Env('途虎养车');
// $.is_debug = ($.isNode() ? process.env['IS_DEDUG'] : $.getdata('is_debug')) || 'true';  // 调试模式
$.is_debug = 'false';  // 调试模式
//$.token = ($.isNode() ? process.env['TUHU_TOKEN'] : $.getdata('tuhu_token')) || '';  // Token
//$.blackbox = ($.isNode() ? process.env['TUHU_BLACKBOX'] : $.getdata('tuhu_blackbox')) || 'kMPSQ1710898198mf9JVT5oKB5';  // blackbox
//$.tokenArr = $.toObj($.token) || [];
let token = ($.isNode() ? process.env['TUHU_TOKEN'] : $.getdata('tuhu_token')) || '', tokenArr = []; // Token
let blackbox = ($.isNode() ? process.env['TUHU_BLACKBOX'] : $.getdata('tuhu_blackbox')) || '', blackboxArr = []; // blackbox

$.appid = 'wx27d20205249c56a3';  // 小程序 appId
$.messages = [];

// 检查变量
async function checkEnv() {
  // 多账号分割
  tokenArr = token.split('@');
  blackboxArr = blackbox.split('@');
  
  // 当下标0为空字符串也会占用长度，所以需判断是否为空字符串
  if (tokenArr[0]) {
    console.log(`\n检测到 ${tokenArr.length} 个账号变量\n`);
    return tokenArr.length;
  } else {
    console.log(`\n检测到 0 个账号变量\n`);
    return 0;
  }
}
// 主函数
async function main() {
  // 获取微信 Code
  //await getWxCode();
  checkEnv();
  for (let i = 0; i < tokenArr.length; i++) {
    // 初始化
    $.token = tokenArr[i];
    $.blackbox = blackboxArr[i];
    
   // $.wx_code = $.codeList[i];

    // 获取 Token
    //await getToken();
    // 把新的 Token 添加到 $.tokenArr
    //$.token && $.tokenArr.push($.token);
  }

  if (tokenArr.length) {
   // $.log(`找到 ${$.tokenArr.length} 个 Token 变量 ✅`);
    for (let i = 0; i < tokenArr.length; i++) {
      $.log(`----- 账号 [${i + 1}] 开始执行 -----`);
      // 初始化
      $.mobile = '';
      $.nickname = '';
      $.is_login = true;
      $.token = tokenArr[i].startsWith('Bearer ') ? tokenArr[i] : 'Bearer ' + tokenArr[i];  // 补充 Bearer

      // 用户信息
      await whoami();

      if (!$.is_login) continue;  // 无效 token 跳出

      // 每日签到
      const taskMap = [
        { "name": "APP ", "url": "" },
        { "name": "小程序", "url": "?channel=wxapp" }
      ]
      for (item of taskMap) {
        await checkin(item['url'], item['name']);
      }

      // 用户积分
      await getIntegral();
    }
    $.log(`----- 所有账号执行完成 -----`);
  } else {
    throw new Error('未找到 Token 变量 ❌');
  }
}

// 获取 Token
async function getToken() {
  // 构造请求
  const options = {
    url: `https://cl-gateway.tuhu.cn/cl-user-auth-login/login/authSilentSign`,
    headers: {
      'Content-Type': 'application/json',
      'channel': `wechat-miniprogram`
    },
    body: $.toStr({
      channel: "WXAPP",
      code: $.wx_code
    })
  }

  // 发起请求
  const result = await Request(options)
  if (result?.code == "10000") {
    const { mobile, userSession, userId, userName, nickName } = result.data;
    $.token = userSession;
    $.log(`✅ 成功获取 Token`);
  } else {
    $.log(`❌ 获取 Token 失败: ${$.toStr(result)}`);
  }
}


// 获取用户信息
async function whoami() {
  let msg = ''
  // 构造请求
  const options = {
    url: `https://cl-gateway.tuhu.cn/cl-user-info-site/userAccount/getCurrentUserInfo`,
    headers: {
      'Authorization': $.token,
      'authType': 'oauth',
      'Content-Type': 'application/json'
    },
    body: `{}`
  }

  // 发起请求
  const result = await Request(options);
  if (result?.code == 10000 && result?.data) {
    const { nickName, mobile } = result.data;
    msg += `\n用户: ${nickName}  [${hideSensitiveData(mobile, 3, 4)}]`;
  } else if (/token无效/.test($.toStr(result))) {
    $.is_login = false;
    msg += `${$.toStr(result)} ❌`;
  } else {
    $.log($.toStr(result));
  }
  $.messages.push(msg), $.log(msg);
}


// 每日签到
async function checkin(suffix, name) {
  let msg = '';
  // 构造请求
  let opt = {
    url: `https://api.tuhu.cn/user/UserCheckInVersion1${suffix}`,
    headers: {
      'Authorization': $.token,
      'Content-Type': 'application/json',
      'blackbox': $.blackbox
    }
  };

  var result = await Request(opt);
  if (result?.Code == 1) {
    msg += `${name}签到成功, 积分 +${result.AddIntegral}, 连续签到: ${result.NeedDays}/7天 ✅`;
  } else {
    msg += `${name}签到失败, ${result?.Message || $.toStr(result)}`;
  }

  $.messages.push(msg), $.log(msg);
}

// 获取用户积分
async function getIntegral() {
  let msg = ''
  // 构造请求
  const options = {
    url: `https://api.tuhu.cn/User/GetPersonalCenterQuantity`,
    headers: {
      'Authorization': $.token,
      'Content-Type': 'application/json'
    }
  }

  // 发起请求
  const result = await Request(options);
  if (result?.Code == 1) {
    msg += `当前积分: ${result.IntegralNumber} 分, 可抵现: ${result.IntegralNumber / 100} 元`;
  } else {
    msg += `❌ 积分查询失败`;
  }
  $.messages.push(msg), $.log(msg);
}

// 脚本执行入口
if (typeof $request !== `undefined`) {
  GetCookie();
  $.done();
} else {
  !(async () => {
    await main();  // 主函数
  })()
    .catch((e) => $.messages.push(e.message || e) && $.logErr(e))
    .finally(async () => {
      await sendMsg($.messages.join('\n').trimStart().trimEnd());  // 推送通知
      $.done();
    })
}


// 获取签到数据
function GetCookie() {
  try {
    debug($request.headers);
    const headers = ObjectKeys2LowerCase($request.headers);
    $.newToken = headers['authorization'];
    headers['blackbox'] && $.setdata(headers['blackbox'], 'tuhu_blackbox'), $.log(`blackbox: ${headers['blackbox']}`);  // 更新 blackbox
    if (/User\/GetInternalCenterInfo/.test($request.url) && !new RegExp($.newToken).test($.token)) {
      $.tokenArr.push($.newToken);
      $.log(`开始新增用户数据 ${$.newToken}`);
      $.setdata($.toStr($.tokenArr), 'tuhu_token');
      $.msg($.name, ``, `Token 获取成功。🎉`);
    } else {
      $.log(`无需更新 Token: ${$.newToken}`);
    }
  } catch (e) {
    $.log("❌ 签到数据获取失败"), $.log(e);
  }
}


// 获取微信 Code
async function getWxCode() {
  try {
    $.codeList = [];
    $.codeServer = ($.isNode() ? process.env["CODESERVER_ADDRESS"] : $.getdata("@codeServer.address")) || '';
    $.codeFuc = ($.isNode() ? process.env["CODESERVER_FUN"] : $.getdata("@codeServer.fun")) || '';
    if (!$.codeServer) return $.log(`⚠️ 未配置微信 Code Server。`);

    $.codeList = ($.codeFuc
      ? (eval($.codeFuc), await WxCode($.appid))
      : (await Request(`${$.codeServer}/?wxappid=${$.appid}`))?.split("|"))
      .filter(item => item.length === 32);
    $.log(`♻️ 获取到 ${$.codeList.length} 个微信 Code:\n${$.codeList}`);
  } catch (e) {
    $.logErr(`❌ 获取微信 Code 失败！`);
  }
}


/**
 * 数据脱敏
 * @param {string} string - 传入字符串
 * @param {number} head_length - 前缀展示字符数，默认为 2
 * @param {number} foot_length - 后缀展示字符数，默认为 2
 * @returns {string} - 返回字符串
 */
function hideSensitiveData(string, head_length = 2, foot_length = 2) {
  try {
    let star = '';
    for (var i = 0; i < string.length - head_length - foot_length; i++) {
      star += '*';
    }
    return string.substring(0, head_length) + star + string.substring(string.length - foot_length);
  } catch (e) {
    return string;
  }
}


/**
 * 对象属性转小写
 * @param {object} obj - 传入 $request.headers
 * @returns {object} 返回转换后的对象
 */
function ObjectKeys2LowerCase(obj) {
  const _lower = Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]))
  return new Proxy(_lower, {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey.toLowerCase(), receiver)
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey.toLowerCase(), value, receiver)
    }
  })
}


/**
 * 请求函数二次封装
 * @param {(object|string)} options - 构造请求内容，可传入对象或 Url
 * @returns {(object|string)} - 根据 options['respType'] 传入的 {status|headers|rawBody} 返回对象或字符串，默认为 body
 */
async function Request(options) {
  try {
    options = options.url ? options : { url: options };
    const _method = options?._method || ('body' in options ? 'post' : 'get');
    const _respType = options?._respType || 'body';
    const _timeout = options?._timeout || 15e3;
    const _http = [
      new Promise((_, reject) => setTimeout(() => reject(`❌ 请求超时：${options['url']}`), _timeout)),
      new Promise((resolve, reject) => {
        debug(options, '[Request]');
        $[_method.toLowerCase()](options, (error, response, data) => {
          debug(response, '[response]');
          error && $.log($.toStr(error));
          if (_respType !== 'all') {
            resolve($.toObj(response?.[_respType], response?.[_respType]));
          } else {
            resolve(response);
          }
        })
      })
    ];
    return await Promise.race(_http);
  } catch (err) {
    $.logErr(err);
  }
}


// 发送消息
async function sendMsg(message) {
  if (!message) return;
  try {
    if ($.isNode()) {
      try {
        var notify = require('./sendNotify');
      } catch (e) {
        var notify = require('./utils/sendNotify');
      }
      await notify.sendNotify($.name, message);
    } else {
      $.msg($.name, '', message);
    }
  } catch (e) {
    $.log(`\n\n----- ${$.name} -----\n${message}`);
  }
}


/**
 * DEBUG
 * @param {*} content - 传入内容
 * @param {*} title - 标题
 */
function debug(content, title = "debug") {
  let start = `\n----- ${title} -----\n`;
  let end = `\n----- ${$.time('HH:mm:ss')} -----\n`;
  if ($.is_debug === 'true') {
    if (typeof content == "string") {
      $.log(start + content + end);
    } else if (typeof content == "object") {
      $.log(start + $.toStr(content) + end);
    }
  }
}

// prettier-ignore
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, a) => { s.call(this, t, (t, s, r) => { t ? a(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const a = this.getdata(t); if (a) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, a) => e(a)) }) } runScript(t, e) { return new Promise(s => { let a = this.getdata("@chavy_boxjs_userCfgs.httpapi"); a = a ? a.replace(/\n/g, "").trim() : a; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [i, o] = a.split("@"), n = { url: `http://${o}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": i, Accept: "*/*" }, timeout: r }; this.post(n, (t, e, a) => s(a)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e); if (!s && !a) return {}; { const a = s ? t : e; try { return JSON.parse(this.fs.readFileSync(a)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const a = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of a) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, a) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, a, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(a), o = a ? "null" === i ? null : i || "{}" : "{}"; try { const e = JSON.parse(o); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), a) } catch (e) { const i = {}; this.lodash_set(i, r, t), s = this.setval(JSON.stringify(i), a) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: a, statusCode: r, headers: i, rawBody: o } = t, n = s.decode(o, this.encoding); e(null, { status: a, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: a, response: r } = t; e(a, r, r && s.decode(r.rawBody, this.encoding)) }) } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let a = require("iconv-lite"); this.initGotEnv(t); const { url: r, ...i } = t; this.got[s](r, i).then(t => { const { statusCode: s, statusCode: r, headers: i, rawBody: o } = t, n = a.decode(o, this.encoding); e(null, { status: s, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: s, response: r } = t; e(s, r, r && a.decode(r.rawBody, this.encoding)) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let a = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in a) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let a = t[s]; null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), e += `${s}=${a}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", a = "", r) { const i = t => { switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } case "Loon": { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } case "Quantumult X": { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl, a = t["update-pasteboard"] || t.updatePasteboard; return { "open-url": e, "media-url": s, "update-pasteboard": a } } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, a, i(r)); break; case "Quantumult X": $notify(e, s, a, i(r)); break; case "Node.js": }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name}, 错误!`, t); break; case "Node.js": this.log("", `❗️${this.name}, 错误!`, t.stack) } } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }