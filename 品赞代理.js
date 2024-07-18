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
 * 推荐账号密码，token容易过期
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
      console.log("----------- 执行 第 [" + _0x59d06c.index + "] 个账号 -----------");
      !_0x59d06c?.["activedAuthToken"] && (await _0x59d06c?.["Login"]());
      await _0x59d06c.GetUserBalance();
    }
    let _0x3737e6 = _0xd941b5.filter(_0x2aad38 => _0x2aad38.valid);
    if (_0x3737e6.length > 0) {
      console.log("\n================ 任务队列构建完毕 ================");
      for (let _0x434b43 of _0x3737e6) {
        console.log("----------- 账号[" + _0x434b43.index + "] -----------");
        await _0x434b43.doTask();
      }
    } else console.log("\n================ 未检测到帐号，请先注册：https://www.ipzan.com?pid=4k9aetvd ================");
    await _0xf1ea8.showmsg();
  }
})().catch(_0x4c4062 => console.log(_0x4c4062)).finally(() => _0xf1ea8.done());
function _0x416dc5(_0x3a97a0) {
  const _0x414c4d = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return _0x414c4d.test(_0x3a97a0);
}
function _0xb417d8(_0x2829c6 = true) {
  const _0x2334d0 = _0x2829c6 ? "1.1.1.1" : "0.0.0.0",
    _0x44facb = _0x2829c6 ? "223.255.255.255" : "255.255.255.255",
    _0xd9f504 = _0x2334d0.split(".").map(Number),
    _0x275c26 = _0x44facb.split(".").map(Number),
    _0x556be6 = _0xd9f504.map((_0xbf46cc, _0x2a9d1c) => {
      const _0x1ab328 = _0x275c26[_0x2a9d1c];
      return Math.floor(Math.random() * (_0x1ab328 - _0xbf46cc + 1)) + _0xbf46cc;
    });
  return _0x556be6.join(".");
}
function _0x157dd3(_0x2d7503, _0x42788a, _0x2e1e85) {
  const _0x36ac8a = {};
  _0x36ac8a[_0x42788a] = _0x2e1e85;
  const _0x1f7e27 = JSON.stringify(_0x36ac8a);
  try {
    fs.writeFileSync(_0x2d7503 + ".json", _0x1f7e27);
  } catch (_0x2fd9c9) {
    _0x2fd9c9.code === "ENOENT" ? fs.writeFileSync(_0x2d7503 + ".json", _0x1f7e27) : console.error("保存文件时发生错误：", _0x2fd9c9);
  }
}
function _0x35c695(_0x188ff0, _0x1924d1) {
  try {
    const _0x206e18 = fs.readFileSync(_0x188ff0 + ".json", "utf8"),
      _0x4e7920 = JSON.parse(_0x206e18);
    return _0x4e7920[_0x1924d1];
  } catch (_0x527dd9) {
    if (_0x527dd9.code === "ENOENT") return undefined;else {
      console.error("读取文件时发生错误：", _0x527dd9);
    }
  }
}
function _0x3771fa(_0x256ced, _0x59add5) {
  var _0x3b0e44 = {
    "table": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"],
    "UTF16ToUTF8": function (_0x164874) {
      for (var _0x22d31c = [], _0x34b5d0 = _0x164874.length, _0x12ffe3 = 0; _0x12ffe3 < _0x34b5d0; _0x12ffe3++) {
        var _0x60360,
          _0x57e360,
          _0x243264 = _0x164874.charCodeAt(_0x12ffe3);
        0 < _0x243264 && _0x243264 <= 127 ? _0x22d31c.push(_0x164874.charAt(_0x12ffe3)) : 128 <= _0x243264 && _0x243264 <= 2047 ? (_0x60360 = 192 | _0x243264 >> 6 & 31, _0x57e360 = 128 | 63 & _0x243264, _0x22d31c.push(String.fromCharCode(_0x60360), String.fromCharCode(_0x57e360))) : 2048 <= _0x243264 && _0x243264 <= 65535 && (_0x60360 = 224 | _0x243264 >> 12 & 15, _0x57e360 = 128 | _0x243264 >> 6 & 63, _0x243264 = 128 | 63 & _0x243264, _0x22d31c.push(String.fromCharCode(_0x60360), String.fromCharCode(_0x57e360), String.fromCharCode(_0x243264)));
      }
      return _0x22d31c.join("");
    },
    "UTF8ToUTF16": function (_0x2f5e6d) {
      for (var _0x2e1ff5 = [], _0x1fe47c = _0x2f5e6d.length, _0x36c899 = 0, _0x36c899 = 0; _0x36c899 < _0x1fe47c; _0x36c899++) {
        var _0xddba5e,
          _0x1c66d1,
          _0x4e11bc = _0x2f5e6d.charCodeAt(_0x36c899);
        0 == (_0x4e11bc >> 7 & 255) ? _0x2e1ff5.push(_0x2f5e6d.charAt(_0x36c899)) : 6 == (_0x4e11bc >> 5 & 255) ? (_0x1c66d1 = (31 & _0x4e11bc) << 6 | 63 & (_0xddba5e = _0x2f5e6d.charCodeAt(++_0x36c899)), _0x2e1ff5.push(Sting.fromCharCode(_0x1c66d1))) : 14 == (_0x4e11bc >> 4 & 255) && (_0x1c66d1 = (255 & (_0x4e11bc << 4 | (_0xddba5e = _0x2f5e6d.charCodeAt(++_0x36c899)) >> 2 & 15)) << 8 | ((3 & _0xddba5e) << 6 | 63 & _0x2f5e6d.charCodeAt(++_0x36c899)), _0x2e1ff5.push(String.fromCharCode(_0x1c66d1)));
      }
      return _0x2e1ff5.join("");
    },
    "encode": function (_0x4440be) {
      if (!_0x4440be) return "";
      for (var _0x44c43a = this.UTF16ToUTF8(_0x4440be), _0xa978b5 = 0, _0x4f9c35 = _0x44c43a.length, _0x59ac5c = []; _0xa978b5 < _0x4f9c35;) {
        var _0x4a5bc7 = 255 & _0x44c43a.charCodeAt(_0xa978b5++);
        if (_0x59ac5c.push(this.table[_0x4a5bc7 >> 2]), _0xa978b5 == _0x4f9c35) {
          _0x59ac5c.push(this.table[(3 & _0x4a5bc7) << 4]);
          _0x59ac5c.push("==");
          break;
        }
        var _0x77e2fc = _0x44c43a.charCodeAt(_0xa978b5++);
        if (_0xa978b5 == _0x4f9c35) {
          _0x59ac5c.push(this.table[(3 & _0x4a5bc7) << 4 | _0x77e2fc >> 4 & 15]);
          _0x59ac5c.push(this.table[(15 & _0x77e2fc) << 2]);
          _0x59ac5c.push("=");
          break;
        }
        var _0xdaed0e = _0x44c43a.charCodeAt(_0xa978b5++);
        _0x59ac5c.push(this.table[(3 & _0x4a5bc7) << 4 | _0x77e2fc >> 4 & 15]);
        _0x59ac5c.push(this.table[(15 & _0x77e2fc) << 2 | (192 & _0xdaed0e) >> 6]);
        _0x59ac5c.push(this.table[63 & _0xdaed0e]);
      }
      return _0x59ac5c.join("");
    },
    "decode": function (_0x4de779) {
      if (!_0x4de779) return "";
      for (var _0x44177d = _0x4de779.length, _0x3286ef = 0, _0x5afdd4 = []; _0x3286ef < _0x44177d;) code1 = this.table.indexOf(_0x4de779.charAt(_0x3286ef++)), code2 = this.table.indexOf(_0x4de779.charAt(_0x3286ef++)), code3 = this.table.indexOf(_0x4de779.charAt(_0x3286ef++)), code4 = this.table.indexOf(_0x4de779.charAt(_0x3286ef++)), c1 = code1 << 2 | code2 >> 4, _0x5afdd4.push(String.fromCharCode(c1)), -1 != code3 && (c2 = (15 & code2) << 4 | code3 >> 2, _0x5afdd4.push(String.fromCharCode(c2))), -1 != code4 && (c3 = (3 & code3) << 6 | code4, _0x5afdd4.push(String.fromCharCode(c3)));
      return this.UTF8ToUTF16(_0x5afdd4.join(""));
    }
  };
  function _0x52233c(_0x5136e2, _0xe0d60f) {
    for (var _0x2ab4f3 = _0x3b0e44.encode("".concat(_0x5136e2, "QWERIPZAN1290QWER").concat(_0xe0d60f)), _0x4cc15c = "", _0x1675cf = 0; _0x1675cf < 80; _0x1675cf++) _0x4cc15c += Math.random().toString(16).slice(2);
    return _0x2ab4f3 = "".concat(_0x4cc15c.slice(0, 100)).concat(_0x2ab4f3.slice(0, 8)).concat(_0x4cc15c.slice(100, 200)).concat(_0x2ab4f3.slice(8, 20)).concat(_0x4cc15c.slice(200, 300)).concat(_0x2ab4f3.slice(20)).concat(_0x4cc15c.slice(300, 400)), _0x2ab4f3;
  }
  return {
    "account": _0x52233c(_0x256ced, _0x59add5),
    "source": "ipzan-home-one"
  };
}
async function _0x241982(_0x100501 = 3000) {
  return console.log("----------- 延迟 " + _0x100501 / 1000 + " s，请稍等 -----------"), await new Promise(_0x5783a5 => setTimeout(_0x5783a5, _0x100501));
}
async function _0x5e22b6() {}
async function _0x76f888() {
  if (_0xa2efe3) {
    let _0x57de73 = _0x44155b[0];
    for (let _0x2979c7 of _0x44155b) {
      if (_0xa2efe3.indexOf(_0x2979c7) > -1) {
        _0x57de73 = _0x2979c7;
        break;
      }
    }
    for (let _0xf9d291 of _0xa2efe3.split(_0x57de73)) {
      if (_0xf9d291) _0xd941b5.push(new _0x138232(_0xf9d291));
    }
    userCount = _0xd941b5.length;
  } else {
    console.log("未找到 配置信息，请检查是否配置 变量：", _0x34f238);
    return;
  }
  return console.log("共找到" + userCount + "个账号"), true;
}
async function _0x58c2e5(_0x542f7d, _0x5679cd) {
  return httpErr = null, httpReq = null, httpResp = null, new Promise(_0x2ef8a3 => {
    _0xf1ea8.send(_0x542f7d, _0x5679cd, async (_0xb83695, _0x271317, _0x41aed5) => {
      httpErr = _0xb83695;
      httpReq = _0x271317;
      httpResp = _0x41aed5;
      _0x2ef8a3({
        "err": _0xb83695,
        "req": _0x271317,
        "resp": _0x41aed5
      });
    });
  });
}
function _0x299988(_0x35c70e, _0xb9b557) {
  return "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0), new class {
    constructor(_0x26381d, _0x43202e) {
      this.name = _0x26381d;
      this.notifyStr = "";
      this.startTime = new Date().getTime();
      Object.assign(this, _0x43202e);
      console.log(this.name + " 开始运行：\n");
    }
    ["isNode"]() {
      return "undefined" != typeof module && !!module.exports;
    }
    ["isQuanX"]() {
      return "undefined" != typeof $task;
    }
    ["isSurge"]() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    ["isLoon"]() {
      return "undefined" != typeof $loon;
    }
    ["getdata"](_0x2d117f) {
      let _0x30f15c = this.getval(_0x2d117f);
      if (/^@/.test(_0x2d117f)) {
        const [, _0x1c3665, _0x103309] = /^@(.*?)\.(.*?)$/.exec(_0x2d117f),
          _0x2a7cde = _0x1c3665 ? this.getval(_0x1c3665) : "";
        if (_0x2a7cde) try {
          const _0x594976 = JSON.parse(_0x2a7cde);
          _0x30f15c = _0x594976 ? this.lodash_get(_0x594976, _0x103309, "") : _0x30f15c;
        } catch (_0x26da6d) {
          _0x30f15c = "";
        }
      }
      return _0x30f15c;
    }
    ["setdata"](_0x411712, _0x5b20be) {
      let _0x170076 = false;
      if (/^@/.test(_0x5b20be)) {
        const [, _0x223398, _0x52b97d] = /^@(.*?)\.(.*?)$/.exec(_0x5b20be),
          _0x62b663 = this.getval(_0x223398),
          _0x57cf24 = _0x223398 ? "null" === _0x62b663 ? null : _0x62b663 || "{}" : "{}";
        try {
          const _0x1a909a = JSON.parse(_0x57cf24);
          this.lodash_set(_0x1a909a, _0x52b97d, _0x411712);
          _0x170076 = this.setval(JSON.stringify(_0x1a909a), _0x223398);
        } catch (_0x2da117) {
          const _0x5c5c9f = {};
          this.lodash_set(_0x5c5c9f, _0x52b97d, _0x411712);
          _0x170076 = this.setval(JSON.stringify(_0x5c5c9f), _0x223398);
        }
      } else _0x170076 = this.setval(_0x411712, _0x5b20be);
      return _0x170076;
    }
    ["getval"](_0x5f389a) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x5f389a) : this.isQuanX() ? $prefs.valueForKey(_0x5f389a) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x5f389a]) : this.data && this.data[_0x5f389a] || null;
    }
    ["setval"](_0x1b34bf, _0x28cdab) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0x1b34bf, _0x28cdab) : this.isQuanX() ? $prefs.setValueForKey(_0x1b34bf, _0x28cdab) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x28cdab] = _0x1b34bf, this.writedata(), !0) : this.data && this.data[_0x28cdab] || null;
    }
    ["send"](_0x38991d, _0x10122b, _0xf72ed5 = () => {}) {
      if (_0x38991d != "get" && _0x38991d != "post" && _0x38991d != "put" && _0x38991d != "delete") {
        console.log("无效的http方法：" + _0x38991d);
        return;
      }
      if (_0x38991d == "get" && _0x10122b.headers) delete _0x10122b.headers["Content-Type"], delete _0x10122b.headers["Content-Length"];else {
        if (_0x10122b.body && _0x10122b.headers) {
          if (!_0x10122b.headers["Content-Type"]) _0x10122b.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
      }
      if (this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x10122b.headers = _0x10122b.headers || {}, Object.assign(_0x10122b.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        let _0x2f0893 = {
          "method": _0x38991d,
          "url": _0x10122b.url,
          "headers": _0x10122b.headers,
          "timeout": _0x10122b.timeout,
          "data": _0x10122b.body
        };
        if (_0x38991d == "get") delete _0x2f0893.data;
        $axios(_0x2f0893).then(_0x39a13c => {
          const {
            status: _0x53aa82,
            request: _0x141a34,
            headers: _0x2979d9,
            data: _0x2262bf
          } = _0x39a13c;
          _0xf72ed5(null, _0x141a34, {
            "statusCode": _0x53aa82,
            "headers": _0x2979d9,
            "body": _0x2262bf
          });
        }).catch(_0x3a5bbb => console.log(_0x3a5bbb));
      } else {
        if (this.isQuanX()) {
          _0x10122b.method = _0x38991d.toUpperCase();
          this.isNeedRewrite && (_0x10122b.opts = _0x10122b.opts || {}, Object.assign(_0x10122b.opts, {
            "hints": !1
          }));
          $task.fetch(_0x10122b).then(_0x538157 => {
            const {
              statusCode: _0x2101fb,
              request: _0x186259,
              headers: _0x452945,
              body: _0x5eb9cc
            } = _0x538157;
            _0xf72ed5(null, _0x186259, {
              "statusCode": _0x2101fb,
              "headers": _0x452945,
              "body": _0x5eb9cc
            });
          }, _0x467989 => _0xf72ed5(_0x467989));
        } else {
          if (this.isNode()) {
            this.got = this.got ? this.got : require("got");
            const {
              url: _0x5ee2a9,
              ..._0x2ff382
            } = _0x10122b;
            this.instance = this.got.extend({
              "followRedirect": false
            });
            this.instance[_0x38991d](_0x5ee2a9, _0x2ff382).then(_0x5b094d => {
              const {
                statusCode: _0x2e12ae,
                request: _0x52d154,
                headers: _0x3a7327,
                body: _0x3cfb53
              } = _0x5b094d;
              _0xf72ed5(null, _0x52d154, {
                "statusCode": _0x2e12ae,
                "headers": _0x3a7327,
                "body": _0x3cfb53
              });
            }, _0x596487 => {
              const {
                message: _0x5e8d76,
                request: _0x115f17,
                response: _0x3fbe55
              } = _0x596487;
              _0xf72ed5(_0x5e8d76, _0x115f17, _0x3fbe55);
            });
          }
        }
      }
    }
    ["time"](_0x348195, _0x5bc6db = null) {
      let _0x4dac7b = _0x5bc6db ? new Date(_0x5bc6db) : new Date(),
        _0x587f4c = {
          "M+": _0x4dac7b.getMonth() + 1,
          "d+": _0x4dac7b.getDate(),
          "h+": _0x4dac7b.getHours(),
          "m+": _0x4dac7b.getMinutes(),
          "s+": _0x4dac7b.getSeconds(),
          "q+": Math.floor((_0x4dac7b.getMonth() + 3) / 3),
          "S": _0x4dac7b.getMilliseconds()
        };
      /(y+)/.test(_0x348195) && (_0x348195 = _0x348195.replace(RegExp.$1, (_0x4dac7b.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x5f41dc in _0x587f4c) new RegExp("(" + _0x5f41dc + ")").test(_0x348195) && (_0x348195 = _0x348195.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x587f4c[_0x5f41dc] : ("00" + _0x587f4c[_0x5f41dc]).substr(("" + _0x587f4c[_0x5f41dc]).length)));
      return _0x348195;
    }
    async ["showmsg"]() {
      if (!this.notifyStr) return;
      let _0x28fba3 = this.name + " 运行通知\n\n" + this.notifyStr;
      if (_0xf1ea8.isNode()) {
        var _0x419448 = require("./sendNotify");
        console.log("\n============== 推送 ==============");
        await _0x419448.sendNotify(this.name, _0x28fba3);
      } else this.msg(_0x28fba3);
    }
    ["logAndNotify"](_0x59ff05) {
      console.log(_0x59ff05);
      this.notifyStr += _0x59ff05;
      this.notifyStr += "\n";
    }
    ["logAndNotifyWithTime"](_0x4a4431) {
      let _0x16db0f = "[" + this.time("hh:mm:ss.S") + "]" + _0x4a4431;
      console.log(_0x16db0f);
      this.notifyStr += _0x16db0f;
      this.notifyStr += "\n";
    }
    ["logWithTime"](_0x248e8e) {
      console.log("[" + this.time("hh:mm:ss.S") + "]" + _0x248e8e);
    }
    ["msg"](_0x5ccbaf = t, _0x5f2ea9 = "", _0x33a21d = "", _0x15d370) {
      const _0x26bf99 = _0x479142 => {
        if (!_0x479142) return _0x479142;
        if ("string" == typeof _0x479142) return this.isLoon() ? _0x479142 : this.isQuanX() ? {
          "open-url": _0x479142
        } : this.isSurge() ? {
          "url": _0x479142
        } : void 0;
        if ("object" == typeof _0x479142) {
          if (this.isLoon()) {
            let _0x1298eb = _0x479142.openUrl || _0x479142.url || _0x479142["open-url"],
              _0x21c7dc = _0x479142.mediaUrl || _0x479142["media-url"];
            return {
              "openUrl": _0x1298eb,
              "mediaUrl": _0x21c7dc
            };
          }
          if (this.isQuanX()) {
            let _0x599a1c = _0x479142["open-url"] || _0x479142.url || _0x479142.openUrl,
              _0x11d41a = _0x479142["media-url"] || _0x479142.mediaUrl;
            return {
              "open-url": _0x599a1c,
              "media-url": _0x11d41a
            };
          }
          if (this.isSurge()) {
            let _0x526793 = _0x479142.url || _0x479142.openUrl || _0x479142["open-url"];
            return {
              "url": _0x526793
            };
          }
        }
      };
      this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x5ccbaf, _0x5f2ea9, _0x33a21d, _0x26bf99(_0x15d370)) : this.isQuanX() && $notify(_0x5ccbaf, _0x5f2ea9, _0x33a21d, _0x26bf99(_0x15d370)));
      let _0x5b72bc = ["", "============== 系统通知 =============="];
      _0x5b72bc.push(_0x5ccbaf);
      _0x5f2ea9 && _0x5b72bc.push(_0x5f2ea9);
      _0x33a21d && _0x5b72bc.push(_0x33a21d);
      console.log(_0x5b72bc.join("\n"));
    }
    ["getMin"](_0x1e4c28, _0x1b3fed) {
      return _0x1e4c28 < _0x1b3fed ? _0x1e4c28 : _0x1b3fed;
    }
    ["getMax"](_0x44257e, _0x5e7519) {
      return _0x44257e < _0x5e7519 ? _0x5e7519 : _0x44257e;
    }
    ["padStr"](_0x42eadb, _0x4722e0, _0x520994 = "0") {
      let _0x325005 = String(_0x42eadb),
        _0x33179d = _0x4722e0 > _0x325005.length ? _0x4722e0 - _0x325005.length : 0,
        _0x15c189 = "";
      for (let _0xfe43c4 = 0; _0xfe43c4 < _0x33179d; _0xfe43c4++) {
        _0x15c189 += _0x520994;
      }
      return _0x15c189 += _0x325005, _0x15c189;
    }
    ["json2str"](_0x300f3f, _0x2c0636, _0x37b9a0 = false) {
      let _0x2f13c4 = [];
      for (let _0xd689e of Object.keys(_0x300f3f).sort()) {
        let _0x546626 = _0x300f3f[_0xd689e];
        if (_0x546626 && _0x37b9a0) _0x546626 = encodeURIComponent(_0x546626);
        _0x2f13c4.push(_0xd689e + "=" + _0x546626);
      }
      return _0x2f13c4.join(_0x2c0636);
    }
    ["str2json"](_0x407b63, _0x270666 = false) {
      let _0xd85dc6 = {};
      for (let _0x23e13a of _0x407b63.split("&")) {
        if (!_0x23e13a) continue;
        let _0x2388ac = _0x23e13a.indexOf("=");
        if (_0x2388ac == -1) continue;
        let _0x189560 = _0x23e13a.substr(0, _0x2388ac),
          _0x37af9c = _0x23e13a.substr(_0x2388ac + 1);
        if (_0x270666) _0x37af9c = decodeURIComponent(_0x37af9c);
        _0xd85dc6[_0x189560] = _0x37af9c;
      }
      return _0xd85dc6;
    }
    ["randomString"](_0x58daa1, _0x2792a6 = "abcdef0123456789") {
      let _0x27ce4a = "";
      for (let _0x11c145 = 0; _0x11c145 < _0x58daa1; _0x11c145++) {
        _0x27ce4a += _0x2792a6.charAt(Math.floor(Math.random() * _0x2792a6.length));
      }
      return _0x27ce4a;
    }
    ["randomList"](_0x2b61e8) {
      let _0xeea55d = Math.floor(Math.random() * _0x2b61e8.length);
      return _0x2b61e8[_0xeea55d];
    }
    ["wait"](_0x2724d1) {
      return new Promise(_0x3418cd => setTimeout(_0x3418cd, _0x2724d1));
    }
    ["done"](_0x37d9be = {}) {
      const _0x3487fc = new Date().getTime(),
        _0x58b1e9 = (_0x3487fc - this.startTime) / 1000;
      console.log("\n" + this.name + " 运行结束，共运行了 " + _0x58b1e9 + " 秒！");
      if (this.isSurge() || this.isQuanX() || this.isLoon()) $done(_0x37d9be);
    }
  }(_0x35c70e, _0xb9b557);
}
