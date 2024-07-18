/**
 * 品赞HTTP代理签到v1.1
 * const $ = new Env("品赞HTTP代理签到");
 * cron 0 0 * * 0  品赞HTTP代理签到.js
 * 注册地址：https://www.ipzan.com?pid=4k9aetvd
 
 
   有问题联系3288588344
   频道：https://pd.qq.com/s/672fku8ge
 
 
 
 * 
 * ========= 青龙--配置文件 ===========
 * # 项目名称（两种配置二选一）
 * 推荐，token容易过期
 * export pzhttp='账号#密码'
 * 不推荐
 * export pzhttp='你抓包的token'

 * 自己抓包协议头上的Authorization

 * 多账号换行或&隔开

 * 奖励：每周签到得3金币，大概500个IP，可在免费使用代理IP用于其他项目
 * 
 * ====================================
 *   
 */



const _0xf1ea8 = new _0x299988("品赞HTTP签到");
let _0x34f238 = "pzhttp",
  _0x44155b = ["\n", "&"],
  _0xa2efe3 = (_0xf1ea8.isNode() ? process.env[_0x34f238] : _0xf1ea8.getdata(_0x34f238)) || "",
  _0xd941b5 = [],
  _0x8a72a2 = 0;
class _0x138232 {
  constructor(_0x61bdcb) {
    this.index = ++_0x8a72a2;
    this.points = 0;
    this.valid = false;
    _0x61bdcb?.["includes"]("#") ? [this.account, this.password] = _0x61bdcb?.["split"]("#") : this.activedAuthToken = _0x61bdcb;
  }
  async ["taskApi"](_0x15938b, _0x2b4597, _0x292c45, _0x4b21ba) {
    let _0x17737f = null;
    try {
      let _0x9d8394 = _0x292c45.replace("//", "/").split("/")[1],
        _0x41ba2f = {
          "url": _0x292c45,
          "headers": {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
            "Host": _0x9d8394,
            "Connection": "Keep-Alive",
            "Origin": "https://kip.ipzan.com",
            "Authorization": "Bearer " + this.activedAuthToken,
            "Referer": "https://kip.ipzan.com/",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Type": "application/json"
          },
          "timeout": 60000
        };
      _0x4b21ba && (_0x41ba2f.body = _0x4b21ba, _0x41ba2f.headers["Content-Length"] = _0x4b21ba?.["length"]);
      await _0x58c2e5(_0x2b4597, _0x41ba2f).then(async _0x1fce27 => {
        if (_0x1fce27.resp?.["statusCode"] == 200) _0x1fce27.resp?.["body"] ? _0x17737f = JSON.parse(_0x1fce27.resp.body) : console.log("账号[" + this.index + "]调用" + _0x2b4597 + "[" + _0x15938b + "]出错，返回为空");else {
          console.log("账号[" + this.index + "]调用" + _0x2b4597 + "[" + _0x15938b + "]出错，返回状态码[" + (_0x1fce27.resp?.["statusCode"] || "") + "]");
        }
      });
    } catch (_0x2abedd) {
      console.log(_0x2abedd);
    } finally {
      return Promise.resolve(_0x17737f);
    }
  }
  async ["GetUserBalance"]() {
    try {
      let _0x181f92 = "GetUserBalance",
        _0x567f03 = "get",
        _0x23d272 = "https://service.ipzan.com/home/userWallet-find",
        _0x3f986e = "";
      await this.taskApi(_0x181f92, _0x567f03, _0x23d272, _0x3f986e).then(async _0x40fe24 => {
        if (_0x40fe24.code === 0) this.valid = true, this.points = _0x40fe24.data.balance, console.log("账号[" + this.index + "] 当前金币: " + this.points);else {
          _0xf1ea8.logAndNotify("账号[" + this.index + "]查询金币失败，可能Token无效");
        }
      });
    } catch (_0xc67e18) {
      console.log(_0xc67e18);
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["Login"]() {
    try {
      let _0x1f2260 = "Login",
        _0x459f03 = "post",
        _0x3d2b06 = "https://service.ipzan.com/users-login",
        _0x3e4a5c = JSON.stringify(_0x3771fa(this.account, this.password));
      await this.taskApi(_0x1f2260, _0x459f03, _0x3d2b06, _0x3e4a5c).then(async _0x480963 => {
        if (_0x480963.code === 0) console.log("账号[" + this.index + "] 登录成功"), this.activedAuthToken = _0x480963?.["data"];else {
          console.log("账号[" + this.index + "] 登录失败：" + _0x480963?.["message"]);
        }
      });
    } catch (_0x573284) {
      console.log(_0x573284);
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["SignInDaily"]() {
    try {
      let _0x28765f = "SignInDaily",
        _0x4735c6 = "get",
        _0x42ed00 = "https://service.ipzan.com/home/userWallet-receive",
        _0x299e34 = "";
      await this.taskApi(_0x28765f, _0x4735c6, _0x42ed00, _0x299e34).then(async _0x3f3169 => {
        if (_0x3f3169.code === 0) {
          console.log("账号[" + this.index + "] 签到成功：", _0x3f3169?.["data"]);
        } else console.log("账号[" + this.index + "] 签到失败：" + _0x3f3169?.["message"]);
      });
    } catch (_0x568f80) {
      console.log(_0x568f80);
    } finally {
      return Promise.resolve(1);
    }
  }
  async ["doTask"]() {
    try {
      await _0x241982(1000);
      console.log("\n============= 账号[" + this.index + "] 开始签到=============");
      await this.SignInDaily();
    } catch (_0x23c68c) {
      console.log(_0x23c68c);
    }
  }
}
!(async () => {
  if (typeof $request !== "undefined") {
    await _0x5e22b6();
  } else {
    if (!(await _0x76f888())) return;
    console.log("\n================ 开始执行 ================");
    for (let _0x59d06c of _0xd941b5) {
      console.log("----------- 执行 第 [" + _0x59d06c.index
