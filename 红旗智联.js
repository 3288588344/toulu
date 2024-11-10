/**
 * cron "28 10,16 * * *" 
 * export HQZL="账号1&密码1 账号2&密码2"
 
 
  TL库:https://github.com/3288588344/toulu.git
  tg频道:https://t.me/TLtoulu
  QQ频道:https://pd.qq.com/s/672fku8ge
  
 */
const $ = new Env('红旗智联')
const HQZL = ($.isNode() ? process.env.HQZL : $.getdata("HQZL")) || '';
let Utils = undefined;
let CryptoJS = ''
let phone = ''
let password = ''
let token = ''
let aid = ''
let notice = ''
let clientKey = '-----BEGIN PRIVATE KEY-----\n' +
    'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClKFtRRKV2PbeY\n' +
    'koRw2eKpstLik9hddOuB1UMc/AkkP8I3WbOCoYyvkk7bYHq98Csa4kZabFBzSeCR\n' +
    'aqFMxbQ114kwvs0u/mKG/j3mB9cys9kZJOIfutqyBUpbsi+RDVhpVB0dZoHRqr/C\n' +
    'Sw9ORX1CC1zk4ITO9Lvp/ystIH9wKdp4Gg7OyFGXyw0asfVqbMLkMqwqMqZFuKX1\n' +
    'GQj+xNMcPEsBPwYeFbAc9Fzdu4x0goh8moTLd7sa8KjyV68sORQenl+7QhPte26e\n' +
    'SI3Ezy73tLjPSgaZ6qPkAyLHZGfIAPsLwK2ZM236z3D7u85qVQii6tNDCH0NgOU1\n' +
    'ODQlre/xAgMBAAECggEADR1LQwTEbsMv1PmtcpiamwcMH9nFkIY8PS8GCUMqJqq5\n' +
    'bVO+IV1aooZnpJvgozxy78uP8pYvPThckK9653G7gZr/1dMQz+57PGTr3Vw6Blip\n' +
    'oImBOyvHOeOZp/ZaOJZqstJvDWqaXF/GolL7gCecbqYgVjxNz3E3irksYIT4GZvY\n' +
    'hsobS/HY4gdVMT0YfLzaHaERU+zToUuZ6tIJ4OBbasxwt8vH3RKDqviDtZNtWtUS\n' +
    'hfKIgAfrFiDtAY5ii3+kVf7SHFjC/a0aYmeRHXH2/B8wwiBbv8SOe4TWCgHgF0X6\n' +
    '93cfdkk6hnfK154cNF6Ea39nSm17E/UVieJkKWtkEQKBgQDIihxBdygtcchEsoCH\n' +
    'et3XrMIniyWSxYJGD8Wtw7GuHIVW6S6i8PDVtt4C9Uli93xezV0dVTc+xzNh/3g/\n' +
    'NDwgj/Q2k2CF+e17iHQbflqqw4pCsQPi3DUjKPM3aQ7geplwYyTRCzf5xtXfKDGv\n' +
    'DfeLzOc6wkpkpMKuFPngyFOHOwKBgQDS1UPybmURqHW8YDWsa0MFdj/3fLTxv5xX\n' +
    'UMPgGuQaBW2U2EkTDFzliq2JbIWx79HBPzmLirIQ/F9DSORaCM2JnRINDvJQC45X\n' +
    'EcxnAmrae+FqcaZ3KoI7RD7fB11+McEoyr6LzxRnbYPV8Diq8l48ZHxGwKfJPHYf\n' +
    'kGgjKjbqwwKBgGLsxl2A8z/ftiQ1TfQHJzJCVZB+Mq3BYq8/DovWUmsKRLiH1Oqq\n' +
    'IpO6XrBk4avBXAfEFJ/orpT4XR+Fj4LWOKbzfEwDzYSpsn3S5Tu+y+kbBrQ5cCpT\n' +
    '6J6Mj9YQrDcOI2zua3X3q8g6TryDrmalZC0BijtRJrOZFzQawt0g1RuLAoGAL8T0\n' +
    'dTyAF+Ukb/8Yii1vbRBi4+9UjCXPBZWeG+vb3O13666pt/AoKDYopad6D1v4GaH6\n' +
    'ptxRBjo4V2Vvn9q4v0Jgcab+ThagNKgquPg6P7Cr3VNM1VlDUqxe1mezzkD1tAlj\n' +
    '7QeJZvnQUivwmwL5SRO3eMxz98uENBijD7yj3sMCgYEAxr8GdzDGi7CyY1Rc62fK\n' +
    'oyUz7AdrUgaYrBaNMFNqstXda/1I8WNxOmAnAATSWEMFPeM32NNtop9YZiAbR3Y1\n' +
    'weKf5jk+YKQmwcqnRh61HafrfFrblAD+D1EF3Atg6F35dniC5h9usZDNgiuBw1sv\n' +
    'tpoEb7g0v/k37gQghbggrGs=\n' +
    '-----END PRIVATE KEY-----'
let clientCert = '-----BEGIN CERTIFICATE-----\n' +
    'MIIDmjCCAoKgAwIBAgIIH4/IYJHo1A0wDQYJKoZIhvcNAQELBQAwIjELMAkGA1UE\n' +
    'BhMCQ04xEzARBgNVBAMMCkZBVy1tb2JpbGUwHhcNMTkwMTIzMDYwMDUyWhcNNDgw\n' +
    'ODE4MDYwMDUyWjBCMQswCQYDVQQGEwJDTjEPMA0GA1UECgwGRkFXLUhRMQwwCgYD\n' +
    'VQQLDANBcHAxFDASBgNVBAMMC0RlZmF1bHQtQXBwMIIBIjANBgkqhkiG9w0BAQEF\n' +
    'AAOCAQ8AMIIBCgKCAQEApShbUUSldj23mJKEcNniqbLS4pPYXXTrgdVDHPwJJD/C\n' +
    'N1mzgqGMr5JO22B6vfArGuJGWmxQc0ngkWqhTMW0NdeJML7NLv5ihv495gfXMrPZ\n' +
    'GSTiH7rasgVKW7IvkQ1YaVQdHWaB0aq/wksPTkV9Qgtc5OCEzvS76f8rLSB/cCna\n' +
    'eBoOzshRl8sNGrH1amzC5DKsKjKmRbil9RkI/sTTHDxLAT8GHhWwHPRc3buMdIKI\n' +
    'fJqEy3e7GvCo8levLDkUHp5fu0IT7XtunkiNxM8u97S4z0oGmeqj5AMix2RnyAD7\n' +
    'C8CtmTNt+s9w+7vOalUIourTQwh9DYDlNTg0Ja3v8QIDAQABo4GzMIGwMB8GA1Ud\n' +
    'IwQYMBaAFDPZV0KpQWJymU15AsK+gOjkSXVzMB0GA1UdDgQWBBRLrIP+46GjEeE1\n' +
    'y7FfxhJTUqtiCTALBgNVHQ8EBAMCBsAwYQYDVR0fBFowWDA1oDOgMaQvMC0xCzAJ\n' +
    'BgNVBAYTAkNOMQ8wDQYDVQQLDAZDUkxtb2IxDTALBgNVBAMMBGNybDAwH6AdoBuG\n' +
    'GWh0dHA6Ly8xMjcuMC4wLjEvY3JsMC5jcmwwDQYJKoZIhvcNAQELBQADggEBAJRV\n' +
    'bfDGDmTmGoAEtq0Jj5aCDhCrLCC48sRx4Fuc7Oh72cG1p7xIVLpFxDeqQzEsN2U2\n' +
    'z8owmdwrsngIIsc3LQ9YJkA88i+wUp2epOX8BUeHuMPf4jKi+FdYNwciYEpH3Tnn\n' +
    '8gTajeZ40v9r8axv/xxwcS71RUZg/EGycECA2f7q35XCAWgUS+HUFBrog1XrCATa\n' +
    'dkg1Pp2plTl5QpLzJZ4mNS6Yfik3jvwxxmlsdAY81TABOWLCoEDGMK+/3BVK3JIK\n' +
    'v1EcSzepF59YIcJ/VemEhQU9rJCr6k+MIC39v1xoXfj+Sb121Q9sDD7WuT0V/3JF\n' +
    'oYjU6io07CCCmeNCw+I=\n' +
    '-----END CERTIFICATE-----'
!(async () => {
    await main();
})().catch((e) => {$.log(e)}).finally(() => {$.done({});});

async function main() {
    if (!HQZL) {
        console.log("先去boxjs填写账号密码")
        await sendMsg('先去boxjs填写账号密码');
        return
    }
    Utils = await loadUtils();
    CryptoJS = Utils.createCryptoJS();
    let arr = HQZL.split(" ");
    for (const item of arr) {
        phone = item.split("&")[0]
        password = item.split("&")[1]
        console.log(`用户：${phone}开始任务`)
        iv = CryptoJS.enc.Utf8.parse('51C1A11FFB006C10');
        key = CryptoJS.enc.Utf8.parse('12A63EDBA74F77CF');
        console.log("登录")
        let login = await loginPost(`/user/account/mp/login?appId=M001&deviceId=${generateUUID().replace(/-/g, '')}tsp2`,`password=${encodeURIComponent(encrypt(key,iv,password))}&mobile=${encodeURIComponent(encrypt(key,iv,phone))}&version=1`)
        console.log('登录结果：' + login.status)
        if (login.status != 'SUCCEED') {
            continue
        }
        token = login.accountVo.grayToken;
        aid = login.accountVo.cid;
        console.log("开始签到")
        let sign = await commonPost('/fawcshop/collect-public/v1/score/addScore',{"scoreType":"2"})
        if (sign.code == '000000') {
            console.log(`签到成功，获得${sign.data.score}积分`)
        } else {
            console.log(sign.msg)
        }
        console.log("————————————")
        console.log("开始任务")
        let taskList = await commonGet('/fawcshop/members/task/v3/getTaskList')
        for (const task of taskList.data.noticeTaskList) {
            console.log(`任务：${task.taskName}`)
            if (task.completeFlag) {
                console.log('任务已完成')
                continue
            }
            if (task.taskCode == 'NT-APP_isLike') {
                let getILikeThis = await commonGet(`/fawcshop/collect-sns/v1/dynamicTopic/getILikeThis?invId=31375771`)
                console.log(getILikeThis.msg)
            }
        }
        for (const task of taskList.data.dailyTaskList) {
            console.log(`任务：${task.taskName}`)
            if (task.completeFlag) {
                console.log('任务已完成')
                continue
            }
            if (task.taskCode == 'PT-APP_comment') {
                let postList = await commonGet('/fawcshop/cms/api/front/content/v3/queryUnionContentPostList?pageNo=1&pageSize=10&menuType=1')
                let contentId = ''
                while(!contentId) {
                    let index = Math.floor(Math.random() * postList?.data?.data?.length);
                    contentId = postList?.data?.data[index]?.contentId;
                    if (!contentId) {
                        continue
                    }
                    let commentList = ['红旗，让理想飞扬','红旗加油，红旗棒！','红旗，遥遥领先！','支持红旗，加油！']
                    let comment = commentList[Math.floor(Math.random() * commentList.length)];
                    console.log(`获取评论：${comment}`)
                    let addComment = await commentPost('/fawcshop/collect-sns/v1/dynamicTopic/saveCommentDetailsRevision',{"commentContext":comment,"commentType":"8500","contentId":contentId,"parentId":"0","fileString":[]})
                    console.log(addComment.msg)
                }
            }
            if (task.taskCode == 'PT-APP_share') {
                let share = await commonPost('/fawcshop/collect-public/v1/score/addScore',{"scoreType":"4"})
                console.log(share.msg)
            }
        }
        console.log("————————————")
        console.log("查询积分")
        let getUserInfo = await commonPost(`/fawcshop/mall/v1/apiCus/getUserInfo`,{"userId":aid})
        console.log(`拥有积分：${getUserInfo.data.scoreCount}\n`)
        notice += `用户：${phone} 积分：${getUserInfo.data.scoreCount}\n`
    }
    if (notice) {
        await sendMsg(notice);
    }
}

async function loginPost(url,body) {
    return new Promise(resolve => {
        const options = {
            url: `https://58.244.119.104${url}`,
            headers : {
                'signt': Date.now(),
                'devModel': '21091116AC',
                'simAudit': 'SUCCEED',
                'os': 'android',
                'appVer': '5.0.3',
                'appkey': '7261076202',
                'nonce': generateUUID().replace(/-/g, ''),
                'appVerCode': '2024102917',
                'manufacturer': 'Xiaomi',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip',
                'user-agent': 'okhttp/4.9.2',
            },
            body: body,
            https: {
                key: stringToUint8Array(clientKey),
                certificate: stringToUint8Array(clientCert),
                rejectUnauthorized: false
            }
        }
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    await $.wait(2000)
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function commonPost(url,body) {
    let params = getParams(body);
    return new Promise(resolve => {
        const options = {
            url: `https://hqapp.faw.cn${url}`,
            headers : {
                'Authorization': token,
                'aid': aid,
                'platform': '2',
                'o35xzbbp': 'qjzsuioa',
                'version': '5.0.3',
                'X-Feature': 'sprint3-demo',
                'anonymousId': 'f33b8c0033deea93',
                'timestamp': params.timestamp,
                'nonce': params.nonce,
                'signature': params.signature,
                'tenantId': '03001001',
                'Content-Type': 'application/json',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip',
                'user-agent': 'okhttp/4.9.2',
            },
            body: JSON.stringify(body)
        }
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    await $.wait(2000)
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function commentPost(url,body) {
    let params = getParams(body);
    return new Promise(resolve => {
        const options = {
            url: `https://hqapp.faw.cn${url}`,
            headers : {
                'Connection': 'keep-alive',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'o35xzbbp': 'qjzsuioa',
                'Authorization': token,
                'aid': aid,
                'platform': '2',
                'version': '5.0.3',
                'Accept': '*/*',
                'Origin': 'https://hqapp.faw.cn',
                'X-Requested-With': 'com.sunao.qm.qm_android',
                'timestamp': params.timestamp,
                'nonce': params.nonce,
                'signature': params.signature,
                'Content-Type': 'application/json',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                'user-agent': 'okhttp/4.9.2',
            },
            body: JSON.stringify(body)
        }
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    await $.wait(2000)
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function commonGet(url) {
    return new Promise(resolve => {
        const options = {
            url: `https://hqapp.faw.cn${url}`,
            headers : {
                'Authorization': token,
                'aid': aid,
                'platform': '2',
                'o35xzbbp': 'qjzsuioa',
                'version': '5.0.3',
                'X-Feature': 'sprint3-demo',
                'anonymousId': 'f33b8c0033deea93',
                'tenantId': '03001001',
                'Content-Type': 'application/json',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip',
                'user-agent': 'okhttp/4.9.2',
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    await $.wait(2000)
                    resolve(JSON.parse(data));
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function getParams(body) {
    let timestamp = Date.now();
    let nonce = generateUUID().replace(/-/g, '') + generateUUID().replace(/-/g, '')
    let sortedKeys = Object.keys(body).sort();
    const sortedData = {};
    sortedKeys.forEach(key => {
        sortedData[key] = body[key];
    });
    iv = CryptoJS.enc.Utf8.parse('do78coatrjrtzqvs');
    key = CryptoJS.enc.Utf8.parse('rnt69xfvwktr7yss');
    let signature = encrypt(key,iv,`${JSON.stringify(sortedData)}${timestamp}${nonce}`)
    return {"timestamp":timestamp,"nonce":nonce,"signature":signature}
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function stringToUint8Array(string) {
    const binaryString = string;
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function encrypt(key,iv,word) {
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

async function loadUtils() {
    let code = $.getdata('Utils_Code') || '';
    if (code && Object.keys(code).length) {
        console.log(`✅ ${$.name}: 缓存中存在Utils代码, 跳过下载`)
        eval(code)
        return creatUtils();
    }
    console.log(`🚀 ${$.name}: 开始下载Utils代码`)
    return new Promise(async (resolve) => {
        $.getScript(
            'https://raw.githubusercontent.com/3288588344/toulu/main/Utils.js'
        ).then((fn) => {
            $.setdata(fn, "Utils_Code")
            eval(fn)
            console.log(`✅ Utils加载成功, 请继续`)
            resolve(creatUtils())
        })
    })
}

async function sendMsg(message) {
    if ($.isNode()) {
        let notify = ''
        try {
            notify = require('./sendNotify');
        } catch (e) {
            notify = require("../sendNotify");
        }
        await notify.sendNotify($.name, message);
    } else {
        $.msg($.name, '', message)
    }
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}))}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}