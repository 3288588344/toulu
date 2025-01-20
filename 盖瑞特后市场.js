/*
盖瑞特后市场
入口：http://weixin.qq.com/q/02TSy-4ATzbKe1CDzRND1D
变量名:grtck
依赖require
*/
const axios = require('axios');

async function main() {
  try {
    const externalUrl = 'https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt';
    const externalResponse = await axios.get(externalUrl);
    
    console.log('公告:', externalResponse.data);

   
    if (externalResponse.status === 200) {
      console.log('公告获取成功，开始执行签到请求...');
      
      
      const cookies = process.env.grtck.split(',');     
      const url = 'https://app.ma.scrmtech.com/svip/index/SignSet';
      const headers = {
        'Host': 'app.ma.scrmtech.com',
        'sec-ch-ua-platform': '"Android"',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.103 Mobile Safari/537.36 XWEB/1300333 MMWEBSDK/20240801 MMWEBID/3628 MicroMessenger/8.0.51.2720(0x28003339) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64',
        'accept': 'application/json, text/javascript, /; q=0.01',
        'sec-ch-ua': '"Chromium";v="130", "Android WebView";v="130", "Not?A_Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://app.ma.scrmtech.com/svip/index/sign?pf_uid=26989_2051&pf_type=3&code=051soVll2z7FUe4Qaqnl2067es2soVlE&state=&appid=wx3b54c4b113f78be5',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': cookies.join('; '), 
      };

    
      const signInResponse = await axios.get(url, { headers });

     
      const { data } = signInResponse;
      if (data.code === 0) {
        console.log('签到成功');
      } else if (data.code === 30005) {
        console.log('今日已签到，每天再试试吧');
      } else {
        console.log('签到失败，未知错误代码:', data.code);
      }
    } else {
      console.log('公告获取失败，HTTP 状态码:', externalResponse.status);
    }
    
  } catch (error) {
    console.error('发生错误:', error.message);
  }
}


main();
/*
TL库
*/