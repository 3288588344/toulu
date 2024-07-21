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

async function signIn() {
  const url = 'https://www.rewards.mobil.com.cn/web/index.php?_mall_id=1&r=api/kc/user/sign-in';
  const headers = {
    'Host': 'www.rewards.mobil.com.cn',
    'Connection': 'keep-alive',
    'Content-Length': '0',
    'x-form-id-list': '[]',
    'charset': 'utf-8',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.122 Mobile Safari/537.36 XWEB/1260059 MMWEBSDK/20240501 MMWEBID/3628 MicroMessenger/8.0.50.2701(0x28003252) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
    'x-user-id': '1045255',
    'Accept-Encoding': 'gzip,compress,br,deflate',
    'x-app-platform': 'wxapp',
    'x-requested-with': 'XMLHttpRequest',
    'content-type': 'application/x-www-form-urlencoded',
    'x-channel': 'WXapp',
    'x-app-version': '4.8.9',
    'Referer': 'https://servicewechat.com/wx46f9572cac706c22/120/page-frame.html'
  };

  try {
    for (let token of mftoken) {
      headers['x-access-token'] = token;
      const response = await axios.post(url, {}, { headers: headers });
      if (response.data.code === 0 && response.data.data.now_date_is_sign) {
        console.log("签到成功，已累计签到{}天，本次获得{}积分。".format(response.data.data.sign_continue_text, response.data.data.sign_once_point));
      } else if (response.data.code === 1) {
        console.log("签到失败，错误信息：", response.data.msg);
      } else {
        console.log("响应：", response.data);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

signIn();


