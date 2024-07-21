/*
小程序美孚臻享俱乐部
变量名=mftoken
抓包www.rewards.mobil.com.cn域名的请求头的X-access-token
多账号分割&
也可以使用多个变量名
支持插件提交多变量
有问题联系3288588344
 频道：https://pd.qq.com/s/672fku8ge
*/



const axios = require('axios');
const mftoken = process.env.mftoken.split('&');

const url = "https://www.rewards.mobil.com.cn/web/index.php?_mall_id=1&r=api/kc/user/user-sign-info";

async function fetchSignInfo(mftoken) {
    const headers = {
        "Host": "www.rewards.mobil.com.cn",
        "Connection": "keep-alive",
        "x-form-id-list": '[{"value":"requestFormId:fail deprecated","type":0,"remains":1,"expires_at":"2024-07-27 10:40:54"}]',
        "charset": "utf-8",
        "x-app-platform": "wxapp",
        "x-requested-with": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.122 Mobile Safari/537.36 XWEB/1260059 MMWEBSDK/20240501 MMWEBID/3628 MicroMessenger/8.0.50.2701(0x28003252) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        "content-type": "application/x-www-form-urlencoded",
        "x-channel": "WXapp",
        "x-user-id": "1045255",
        "Accept-Encoding": "gzip,compress,br,deflate",
        "x-app-version": "4.8.9",
        "x-access-token": mftoken,
        "Referer": "https://servicewechat.com/wx46f9572cac706c22/120/page-frame.html"
    };

    try {
        const response = await axios.get(url, { headers: headers });
        const result = response.data;
        if (result["code"] === 0 && result["data"]["now_date_is_sign"]) {
            console.log(`签到成功，已累计签到${result["data"]["sign_continue_text"]}天，本次获得${result["data"]["sign_once_point"]}积分。`);
        } else {
            console.error(`签到失败，错误信息：${result["msg"]}`);
        }
    } catch (error) {
        console.error(`请求出错，错误信息：${error.message}`);
    }
}

mftoken.forEach(mftoken => {
    fetchSignInfo(mftoken);
});
