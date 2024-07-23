/*
微信小程序DQ点单安卓版
抓包wechat.dairyqueen.com.cn域名下的cookie
变量名=dqdd
多账号用&分开或者添加多个变量名
有问题联系3288588344
 频道：https://pd.qq.com/s/672fku8ge

长期套餐大额流量电话卡办理地址：https://hk.yunhaoka.cn/#/pages/micro_store/index?agent_id=669709

*/


const axios = require('axios');
const dqdd = process.env.dqdd.split('&');

const url = 'https://wechat.dairyqueen.com.cn/memSignIn/signIn';

async function fetchSignInfo(cookie, accountIndex) {
  const headers = {
    'Host': 'wechat.dairyqueen.com.cn',
    'Connection': 'keep-alive',
    'Content-Length': '0',
    'charset': 'utf-8',
    'cookie': dqdd,
    'channel': '202',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.122 Mobile Safari/537.36 XWEB/1260059 MMWEBSDK/20240501 MMWEBID/3628 MicroMessenger/8.0.50.2701(0x28003252) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
    'content-type': 'application/json',
    'Accept-Encoding': 'gzip,compress,br,deflate',
    'tenant': '1',
    'Referer': 'https://servicewechat.com/wx22e5ce7c766b4b78/149/page-frame.html'
  };

  try {
    const response = await axios.post(url, {}, { headers: headers });
    if (response.data.code === 200 && response.data.message === 'success') {
      console.log(`账号${accountIndex}签到成功`);
      return { success: true, message: `账号${accountIndex}签到成功` };
    } else {
      console.log(`账号${accountIndex}签到失败`);
      return { success: false, message: `账号${accountIndex}签到失败` };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

dqdd.forEach((dqdd, index) => {
  fetchSignInfo(dqdd, index + 1).then(result => {
    console.log(result);
  });
});
