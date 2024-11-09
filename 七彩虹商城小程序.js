/**

  TL库:https://github.com/3288588344/toulu.git
  tg频道:https://t.me/TLtoulu
  QQ频道:https://pd.qq.com/s/672fku8ge

 * cron "19 8,19 * * *" 
 * export COLORFUL='[{"id": "1", "token": "Authorization","refreshToken:"xxxX-Authorization"},{"id": "2", "token": "Authorization","refreshToken:"xxxX-Authorization"}]'
 * export COLORFUL_RAFFLE='true' //开启抽奖
 */
const $ = new Env('七彩虹商城')
const baseUrl = 'shop.skycolorful.com:45677'
const COLORFUL = ($.isNode() ? (process.env.COLORFUL ? JSON.parse(process.env.COLORFUL) : undefined) : $.getjson("COLORFUL")) || [],
    COLORFUL_RAFFLE = ($.isNode() ? process.env.COLORFUL_RAFFLE : $.getjson("COLORFUL_RAFFLE")) === 'true' || false;
let token = '', refreshToken = ''
let notice = ''
!(async () => {
    if (typeof $request != "undefined") {
        await getCookie();
    } else {
        await main();
    }
})().catch((e) => {
    $.log(e)
}).finally(() => {
    $.done({});
});


async function main() {

    for (const item of COLORFUL) {
        id = item.id;
        token = item.token;
        refreshToken = item.refreshToken
        let refreshLogin= await commonPost('/User/RefreshLoginTime',{"phone":""})
        if (refreshLogin.Code != 0) {
            if (!item.body){
                console.log(`用户：${id}\ntoken已过期，请重新获取`);
                await sendMsg(`用户：${id}\ntoken已过期，请重新获取`);
                continue
            }
          let login=  await commonPost('/User/DecryptPhoneNumber',JSON.parse(item.body))
            if (login.Code != 0) {
                console.log(`用户：${id}\ntoken已过期，请重新获取`);
                await sendMsg(`用户：${id}\ntoken已过期，请重新获取`);
                continue
            }
            token = login.Data.Token;
            refreshToken = login.Data.RefreshToken
          await commonPost('/User/RefreshLoginTime',{"phone":""})
        }

        let userInfo = await commonGet('/User/GetUserInfo')
        console.log(`用户：${id}开始任务`)
        let taskPoint = await commonGet('/Sys/GetPointConfig')
        if (taskPoint.Code === 401) {
            await sendMsg(`用户：${id}\ntoken已过期，请重新获取`);
            continue
        }
        for (const point of taskPoint.Data?.DataList) {
            console.log(`${point.Name} ${point.Title} ${point.PerPoint}`)
            if ((point.DayMaxPointTotal === point.DayGetPointTotal && point.LinkType==1)|| ( point.PerPoint === point.DayGetPointTotal && point.LinkType==2)) {
                continue
            }
            switch (point.Name) {
                case '社区签到':
                    let sign = await commonPost('/User/Sign')
                    console.log(`${sign.Code} ${sign.Message}  ${sign.Data?.Point}`)
                    break;
                case '会员信息完善':
                    await commonGet('/User/EditInfo')
                    let data = await commonPost('/User/DoEditInfo', {
                        "Birthday": getRandomBirthday(),
                        "Nickname": userInfo.Data.NickName,
                        "Sex": 1
                    })
                    console.log(`${data.Code} ${data.Message} `)
                    break;
                case '购物有礼':
                    break;
                case '社区内容发布':
                    let hitokotoData = await hitokoto();
                    if (hitokotoData?.hitokoto) {
                        let body1 = {
                            "ModuleId": "09539c50-6de2-4a0c-adc8-535e488a419e",
                            "Phone": userInfo.Data.Mobile,
                            "Title": "签到",
                            "Content": hitokotoData.hitokoto,
                            "Pictures": [],
                            "Source": 30
                        };
                        console.log(body1)
                        let data = await commonPost('/Bbs/Posting', body1)
                        console.log(`${data.Code} ${data.Message} `)
                        await $.wait(Math.floor(Math.random() * 5000 + 10000));
                    }

                    break;
                case '社区内容评论':
                    let PostingList = await commonGet('/Bbs/GetPostingList?page=1&size=20&moduleId=09539c50-6de2-4a0c-adc8-535e488a419e&phone=')
                    if (PostingList?.Data?.DataList) {
                        for (let i = 0; i < 3; i++) {
                            let hitokotoData2 = await hitokoto();
                            if (hitokotoData2?.hitokoto) {
                                let body = {
                                    "PostId": PostingList?.Data?.DataList[Math.floor(Math.random() * 20)].Id,
                                    "ReplyId": "",
                                    "ParentReplyId": "",
                                    "Phone": userInfo.Data.Mobile,
                                    "Content": hitokotoData2.hitokoto,
                                    "Pictures": []
                                };
                                console.log(body)
                                let data3 = await commonPost('/Bbs/PostReply', body)
                                console.log(data3)
                                await $.wait(Math.floor(Math.random() * 5000 + 10000));
                            }
                        }
                    }
                    break;
                default :
                    console.log('未实现');
                    break;
            }
        }
        console.log(`抽奖 ${COLORFUL_RAFFLE}`)
        if (COLORFUL_RAFFLE) {
            let activityData = await commonGet('/Activity/GetPageList?Page=1&Limit=20')
            for (const activity of activityData.Data.DataList) {
                console.log(`活动：${activity.Name} ${activity.StatusDescription} ${activity.TypeDescription}`)
                if (activity.Type == 1 && activity.Status == 1) {
                    let luckyDrawInfo = await commonGet(`/LuckyDraw/GetLuckyDraw?Key=${activity.ActivityKey}`)
                    for (let i = 0; i < luckyDrawInfo.Data.ResidueCount; i++) {
                        let luckyDraw = await commonPost(`/LuckyDraw/Do`, {key: activity.ActivityKey})
                        console.log(luckyDraw)
                        await $.wait(2000)
                    }
                }
            }
        }
        console.log("————————————")
        console.log("查询积分")
        userInfo = await commonGet('/User/GetUserInfo')
        console.log(`拥有积分：${userInfo.Data.Point}\n`)
        notice += `用户：${id} 拥有积分: ${userInfo.Data.Point}\n`
        extracted(id, token, refreshToken)
    }
    if (notice) {
        await sendMsg(notice);
    }
}

async function hitokoto() {
    return new Promise(resolve => {
        $.get({
            url: `https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=e&c=f&c=i&c=j&c=k&c=l&min_length=5`,
            timeout: 10000
        }, (err, resp, data) => {
            try {
                if (err) {
                    console.log(JSON.stringify(err));
                    $.logErr(err);
                } else {
                    let dataObj = JSON.parse(data);
                    resolve(dataObj);
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function getRandomBirthday() {
    const start = new Date(1980, 0, 1).getTime(); // 1980-01-01
    const end = new Date(2005, 11, 31).getTime(); // 2005-12-31
    const randomTime = start + Math.random() * (end - start);
    const randomDate = new Date(randomTime);

    const year = randomDate.getFullYear();
    const month = ('0' + (randomDate.getMonth() + 1)).slice(-2); // Months are zero-indexed
    const day = ('0' + randomDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

function extracted(id, token, refreshToken) {
    const index = COLORFUL.findIndex(e => e.id === id);
    if (index !== -1 && COLORFUL[index].token !== token) {
        COLORFUL[index].token = token;
        COLORFUL[index].refreshToken = refreshToken;
        console.log(JSON.stringify(COLORFUL[index]))
        // $.msg($.name, `🎉用户${id}更新token成功!`, ``);
        $.setjson(COLORFUL, "COLORFUL");
    }
}

async function getCookie() {
    const requestBody = $request.body;
    if (!requestBody) {
        return
    }
    let login = await commonPost('/User/DecryptPhoneNumber', JSON.parse(requestBody))
    console.log(login)
    token = login.Data.Token;
    refreshToken = login.Data.RefreshToken
    let userInfo = await commonGet('/User/GetUserInfo')
    console.log(userInfo)
    if (userInfo.Code === 401) {
        return
    }
    const id = userInfo.Data.Id;
    const newData = {"id": id, "token": token, "refreshToken": refreshToken, body: requestBody};
    const index = COLORFUL.findIndex(e => e.id === newData.id);
    if (index !== -1) {
        if (COLORFUL[index].body === newData.body) {
            return
        } else {
            COLORFUL[index] = newData;
            console.log(JSON.stringify(newData))
            $.msg($.name, `🎉用户${newData.id}更新token成功!`, ``);
        }
    } else {
        COLORFUL.push(newData)
        console.log(JSON.stringify(newData))
        $.msg($.name, `🎉新增用户${newData.id}成功!`, ``);
    }
    $.setjson(COLORFUL, "COLORFUL");
}



async function commonPost(url, body = {}) {
    return new Promise(resolve => {
        const options = {
            url: `https://${baseUrl}/api${url}`,
            headers: {
                'Host': baseUrl,
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781() NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat()XWEB/1',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'version': '2.0.0',
                'User-from': 'xcx',
                'source': 'Wx',
                'xweb_xhr': 1,
                'UcSource': 30,
                'Referer': 'https://servicewechat.com/wx49018277e65fc3e1/61/page-frame.html',
                'Authorization': `Bearer ${token}`,
                'X-Authorization': `Bearer ${refreshToken}`,
                ...sign()
            },
            body: JSON.stringify(body)
        }
        $.post(options, async (err, resp, data) => {
            try {
                if (resp.statusCode == 401 || resp.statusCode == 400 ) {
                    resolve({Code: 401});
                } else {
                    if (err) {
                        if (data) {
                            resolve(JSON.parse(data));
                        } else {
                            console.log(`${JSON.stringify(err)}`)
                            console.log(`${$.name} API请求失败，请检查网路重试`)
                        }
                    } else {
                        const token1 = resp.headers["access-token"] || resp.headers["Access-Token"];
                        const refreshToken1 = resp.headers["x-Access-Token"] || resp.headers["x-access-token"];
                        if (token1 && refreshToken1) {
                            token = token1
                            refreshToken = token1
                        }
                        await $.wait(1000)
                        resolve(JSON.parse(data));
                    }
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
            url: `https://${baseUrl}/api${url}`,
            headers: {
                'Host': baseUrl,
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781() NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat()XWEB/1',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'version': '2.0.0',
                'User-from': 'xcx',
                'source': 'Wx',
                'xweb_xhr': 1,
                'UcSource': 30,
                'Referer': 'https://servicewechat.com/wx49018277e65fc3e1/61/page-frame.html',
                'Authorization': `Bearer ${token}`,
                'X-Authorization': `Bearer ${refreshToken}`,
                ...sign()
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (resp.statusCode == 401) {
                    resolve({Code: 401});
                } else {
                    if (err) {
                        if (data) {
                            resolve(JSON.parse(data));
                        } else {
                            console.log(`${JSON.stringify(err)}`)
                            console.log(`${$.name} API请求失败，请检查网路重试`)
                        }
                    } else {
                        const token1 = resp.headers["access-token"] || resp.headers["Access-Token"];
                        const refreshToken1 = resp.headers["x-Access-Token"] || resp.headers["x-access-token"];
                        if (token1 && refreshToken1) {
                            token = token1
                            refreshToken = token1
                        }
                        await $.wait(1000)
                        resolve(JSON.parse(data));
                    }
                }

            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
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

function sign() {
    let t = Date.now(), uuid = v4(), appId = '815d8026-9a52-4445-a42c-a5443134232e',
        o = md5([JSON.stringify({AppId: appId}), JSON.stringify({Ticks: t}), JSON.stringify({requestId: uuid}), JSON.stringify({AppSecret: "2b5c01fb-7640-401a-8188-43a13190a626"})].join(""));
    return {
        AppId: appId,
        Ticks: t,
        AppSecret: 'MmI1YzAxZmItNzY0MC00MDFhLTgxODgtNDNhMTMxOTBhNjI2',
        requestId: uuid,
        Sign: o
    }
}

function uuidToString(buffer, offset) {
    var hex = [];
    for (var i = 0; i < 256; ++i) {
        hex[i] = (i + 0x100).toString(16).substr(1);
    }
    var i = offset || 0;
    return [
        hex[buffer[i++]], hex[buffer[i++]], hex[buffer[i++]], hex[buffer[i++]], '-',
        hex[buffer[i++]], hex[buffer[i++]], '-',
        hex[buffer[i++]], hex[buffer[i++]], '-',
        hex[buffer[i++]], hex[buffer[i++]], '-',
        hex[buffer[i++]], hex[buffer[i++]], hex[buffer[i++]], hex[buffer[i++]], hex[buffer[i++]], hex[buffer[i++]]
    ].join('');
}

function v4(options, buf, offset) {
    options = options || {};
    let i = buf && offset || 0;

    if (typeof options === 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
    }

    let rnds = new Array(16);
    for (let c = 0, r; c < 16; c++) {
        if ((c & 3) === 0) r = Math.random() * 0x100000000;
        rnds[c] = (r >>> ((c & 3) << 3)) & 0xff;
    }
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
            buf[i + ii] = rnds[ii];
        }
    }

    return buf || uuidToString(rnds);
}

function md5(a){function b(a,b){return a<<b|a>>>32-b}function c(a,b){var c,d,e,f,g;return e=2147483648&a,f=2147483648&b,c=1073741824&a,d=1073741824&b,g=(1073741823&a)+(1073741823&b),c&d?2147483648^g^e^f:c|d?1073741824&g?3221225472^g^e^f:1073741824^g^e^f:g^e^f}function d(a,b,c){return a&b|~a&c}function e(a,b,c){return a&c|b&~c}function f(a,b,c){return a^b^c}function g(a,b,c){return b^(a|~c)}function h(a,e,f,g,h,i,j){return a=c(a,c(c(d(e,f,g),h),j)),c(b(a,i),e)}function i(a,d,f,g,h,i,j){return a=c(a,c(c(e(d,f,g),h),j)),c(b(a,i),d)}function j(a,d,e,g,h,i,j){return a=c(a,c(c(f(d,e,g),h),j)),c(b(a,i),d)}function k(a,d,e,f,h,i,j){return a=c(a,c(c(g(d,e,f),h),j)),c(b(a,i),d)}function l(a){for(var b,c=a.length,d=c+8,e=(d-d%64)/64,f=16*(e+1),g=new Array(f-1),h=0,i=0;c>i;)b=(i-i%4)/4,h=i%4*8,g[b]=g[b]|a.charCodeAt(i)<<h,i++;return b=(i-i%4)/4,h=i%4*8,g[b]=g[b]|128<<h,g[f-2]=c<<3,g[f-1]=c>>>29,g}function m(a){var b,c,d="",e="";for(c=0;3>=c;c++)b=a>>>8*c&255,e="0"+b.toString(16),d+=e.substr(e.length-2,2);return d}function n(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b}var o,p,q,r,s,t,u,v,w,x=[],y=7,z=12,A=17,B=22,C=5,D=9,E=14,F=20,G=4,H=11,I=16,J=23,K=6,L=10,M=15,N=21;for(a=n(a),x=l(a),t=1732584193,u=4023233417,v=2562383102,w=271733878,o=0;o<x.length;o+=16)p=t,q=u,r=v,s=w,t=h(t,u,v,w,x[o+0],y,3614090360),w=h(w,t,u,v,x[o+1],z,3905402710),v=h(v,w,t,u,x[o+2],A,606105819),u=h(u,v,w,t,x[o+3],B,3250441966),t=h(t,u,v,w,x[o+4],y,4118548399),w=h(w,t,u,v,x[o+5],z,1200080426),v=h(v,w,t,u,x[o+6],A,2821735955),u=h(u,v,w,t,x[o+7],B,4249261313),t=h(t,u,v,w,x[o+8],y,1770035416),w=h(w,t,u,v,x[o+9],z,2336552879),v=h(v,w,t,u,x[o+10],A,4294925233),u=h(u,v,w,t,x[o+11],B,2304563134),t=h(t,u,v,w,x[o+12],y,1804603682),w=h(w,t,u,v,x[o+13],z,4254626195),v=h(v,w,t,u,x[o+14],A,2792965006),u=h(u,v,w,t,x[o+15],B,1236535329),t=i(t,u,v,w,x[o+1],C,4129170786),w=i(w,t,u,v,x[o+6],D,3225465664),v=i(v,w,t,u,x[o+11],E,643717713),u=i(u,v,w,t,x[o+0],F,3921069994),t=i(t,u,v,w,x[o+5],C,3593408605),w=i(w,t,u,v,x[o+10],D,38016083),v=i(v,w,t,u,x[o+15],E,3634488961),u=i(u,v,w,t,x[o+4],F,3889429448),t=i(t,u,v,w,x[o+9],C,568446438),w=i(w,t,u,v,x[o+14],D,3275163606),v=i(v,w,t,u,x[o+3],E,4107603335),u=i(u,v,w,t,x[o+8],F,1163531501),t=i(t,u,v,w,x[o+13],C,2850285829),w=i(w,t,u,v,x[o+2],D,4243563512),v=i(v,w,t,u,x[o+7],E,1735328473),u=i(u,v,w,t,x[o+12],F,2368359562),t=j(t,u,v,w,x[o+5],G,4294588738),w=j(w,t,u,v,x[o+8],H,2272392833),v=j(v,w,t,u,x[o+11],I,1839030562),u=j(u,v,w,t,x[o+14],J,4259657740),t=j(t,u,v,w,x[o+1],G,2763975236),w=j(w,t,u,v,x[o+4],H,1272893353),v=j(v,w,t,u,x[o+7],I,4139469664),u=j(u,v,w,t,x[o+10],J,3200236656),t=j(t,u,v,w,x[o+13],G,681279174),w=j(w,t,u,v,x[o+0],H,3936430074),v=j(v,w,t,u,x[o+3],I,3572445317),u=j(u,v,w,t,x[o+6],J,76029189),t=j(t,u,v,w,x[o+9],G,3654602809),w=j(w,t,u,v,x[o+12],H,3873151461),v=j(v,w,t,u,x[o+15],I,530742520),u=j(u,v,w,t,x[o+2],J,3299628645),t=k(t,u,v,w,x[o+0],K,4096336452),w=k(w,t,u,v,x[o+7],L,1126891415),v=k(v,w,t,u,x[o+14],M,2878612391),u=k(u,v,w,t,x[o+5],N,4237533241),t=k(t,u,v,w,x[o+12],K,1700485571),w=k(w,t,u,v,x[o+3],L,2399980690),v=k(v,w,t,u,x[o+10],M,4293915773),u=k(u,v,w,t,x[o+1],N,2240044497),t=k(t,u,v,w,x[o+8],K,1873313359),w=k(w,t,u,v,x[o+15],L,4264355552),v=k(v,w,t,u,x[o+6],M,2734768916),u=k(u,v,w,t,x[o+13],N,1309151649),t=k(t,u,v,w,x[o+4],K,4149444226),w=k(w,t,u,v,x[o+11],L,3174756917),v=k(v,w,t,u,x[o+2],M,718787259),u=k(u,v,w,t,x[o+9],N,3951481745),t=c(t,p),u=c(u,q),v=c(v,r),w=c(w,s);var O=m(t)+m(u)+m(v)+m(w);return O.toLowerCase()}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}))}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}