/**
 * cron: 40 8 * * *
 *
 * 万达酒店
 * 小程序：万达酒店及度假村
 * 特别注意 需要添加linux依赖：chromium
 * 抓取wuOpenid的值 ： https://order.wandahotels.com/svcmember/getUnidInfo?wuOpenid=****
 * export wdjd_opid="opid" 多个换行
 * 如果运行报错executablePath，需要手动指定 export chrome_path="" 默认为/usr/bin/chromium-browser windows下为chrome.exe完整路径
 * const $ = new Env('万达酒店');
 */
const $ = new Env("万达酒店"),
  axios = require("axios"),
  {
    wrapper
  } = require("axios-cookiejar-support"),
  puppeteer = require("puppeteer-core"),
  {
    sendNotify
  } = require("./sendNotify"),
  SyncRequest = require("sync-request");
let notifyStr = "";
var chrome_path = process.env.chrome_path;
(async () => {
  checkVersion("wdjd.js", "fbf9ec0321bff1914dbef3fd1e4c53bd");
  const _0x2d8fa0 = process.env.wdjd_opid;
  if (!_0x2d8fa0) {
    logAndNotify("请先设置环境变量 wdjd_opid");
    return;
  }
  logAndNotify("🧐" + _0x2d8fa0 + "🧐");
  !chrome_path && (logAndNotify("使用默认的chrome_path /usr/bin/chromium-browser"), chrome_path = "/usr/bin/chromium-browser");
  let _0x289db6 = _0x2d8fa0.split("\n");
  for (let _0x3cbe02 = 0; _0x3cbe02 < _0x289db6.length; _0x3cbe02++) {
    let _0x548e84 = _0x289db6[_0x3cbe02],
      _0x125043 = await sendGetRequest("https://order.wandahotels.com/mine/personalInformation?openid=" + _0x548e84);
    if (_0x125043.data.ret !== 0) {
      logAndNotify("【账号" + (_0x3cbe02 + 1) + "】 获取用户信息失败☹： " + JSON.stringify(_0x125043.data));
      continue;
    }
    logAndNotify("【账号1】 【" + _0x125043.data.data.wuPhoneNumber + "】状态正常");
    let _0x2a8583 = await sendPostRequest("https://order.wandahotels.com/duiba/generateAutoLoginUrl", undefined, {
      levelCode: "" + _0x125043.data.data.levelCode,
      redirectUrl: "https://80263.activity-11.m.duiba.com.cn/sign/component/page?signOperatingId=169563444704837",
      openId: "" + _0x548e84,
      mobile: "" + _0x125043.data.data.wuPhoneNumber,
      memberName: "" + _0x125043.data.data.name,
      levelName: "" + _0x125043.data.data.cardName,
      cardNo: "" + _0x125043.data.data.cardNo,
      points: "" + _0x125043.data.data.totalPoints
    });
    const _0x11ed48 = _0x2a8583.data.data,
      _0xf435e = await getPuppeteer(_0x11ed48, ""),
      _0x3b1788 = _0xf435e.map(_0x73ef5 => _0x73ef5.name + "=" + _0x73ef5.value).join("; ");
    let _0x1d952a = await sendGetRequest("https://80263.activity-11.m.duiba.com.cn/sign/component/index?signOperatingId=169563444704837&preview=false", _0x3b1788);
    if (!_0x1d952a.data.success) {
      const _0x4ab041 = JSON.stringify(_0x1d952a.data);
      logAndNotify("【账号1】 【" + _0x125043.data.data.wuPhoneNumber + "】查询签到状态失败 ： " + _0x4ab041);
    }
    if (_0x1d952a.data.data.signResult) {
      logAndNotify("【账号1】 【" + _0x125043.data.data.wuPhoneNumber + "】已签到");
    } else {
      logAndNotify("【账号1】 【" + _0x125043.data.data.wuPhoneNumber + "】签到失败");
      continue;
    }
    const _0x2a7bf2 = _0x1d952a.data.data.times;
    _0x2a7bf2 > 0 && logAndNotify("【账号1】 【" + _0x125043.data.data.wuPhoneNumber + "】可抽奖 " + _0x2a7bf2 + " 次 手动去抽奖吧");
    let _0x30f76b = await sendPostRequest("https://80263.activity-11.m.duiba.com.cn/ctool/getCredits", _0x3b1788);
    if (!_0x30f76b.data.success) {
      const _0x3ac35a = JSON.stringify(_0x30f76b.data);
      logAndNotify("【账号1】 已失效 ： " + _0x3ac35a);
    }
    logAndNotify("【账号1】 【" + _0x125043.data.data.wuPhoneNumber + "】 积分【" + _0x30f76b.data.data.credits + "】");
  }
})().catch(_0x3b6701 => {
  logAndNotify(_0x3b6701);
}).finally(() => {
  sendNotify("万达酒店", notifyStr);
  $.done();
});
function logAndNotify(_0x3a0a97) {
  $.log(_0x3a0a97);
  notifyStr += _0x3a0a97;
  notifyStr += "\n";
}
function sendGetRequest(_0x32d83d, _0x2a535c) {
  let _0x1ff9a4 = {
    "content-type": "application/json"
  };
  if (_0x2a535c) {
    _0x1ff9a4 = {
      Cookie: "" + _0x2a535c,
      "content-type": "application/json"
    };
  }
  const _0x24b487 = axios.create({
    headers: _0x1ff9a4
  });
  return _0x24b487.get(_0x32d83d);
}
async function getPuppeteer(_0x5159ee, _0x275f0a) {
  let _0x26f5c7 = [];
  _0x275f0a && (_0x26f5c7 = _0x275f0a.split("; ").map(_0x3b1db0 => {
    const [_0x54d61f, _0x5d2458] = _0x3b1db0.split("=");
    return {
      name: _0x54d61f,
      value: _0x5d2458,
      domain: "80263.activity-11.m.duiba.com.cn"
    };
  }));
  const _0x33fb7d = await puppeteer.launch({
      executablePath: chrome_path,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }),
    _0x36d3e8 = await _0x33fb7d.newPage();
  await _0x36d3e8.setCookie(..._0x26f5c7);
  await _0x36d3e8.goto(_0x5159ee, {
    waitUntil: "networkidle0"
  });
  const _0x3a439c = await _0x36d3e8.cookies();
  await _0x33fb7d.close();
  return _0x3a439c;
}
function sendPostRequest(_0x3e4d29, _0x5cbd0b, _0x38dcf7) {
  let _0x4e92ae = {
    "content-type": "application/json"
  };
  _0x5cbd0b && (_0x4e92ae = {
    Cookie: "" + _0x5cbd0b,
    "content-type": "application/json"
  });
  const _0x3be916 = axios.create({
    headers: _0x4e92ae
  });
  return _0x3be916.post(_0x3e4d29, _0x38dcf7);
}
function delay(_0x57642e) {
  return new Promise(_0x6f9162 => setTimeout(_0x6f9162, _0x57642e));
}
function Env(_0x11a1ae, _0x858098) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0xdaccde {
    constructor(_0x543f32) {
      this.env = _0x543f32;
    }
    send(_0x2132ab, _0x4d6239 = "GET") {
      _0x2132ab = "string" == typeof _0x2132ab ? {
        url: _0x2132ab
      } : _0x2132ab;
      let _0x16637a = this.get;
      "POST" === _0x4d6239 && (_0x16637a = this.post);
      return new Promise((_0x148b0c, _0x2ae23c) => {
        _0x16637a.call(this, _0x2132ab, (_0x2719f9, _0x3a9f90, _0x112297) => {
          _0x2719f9 ? _0x2ae23c(_0x2719f9) : _0x148b0c(_0x3a9f90);
        });
      });
    }
    get(_0x1ddf3d) {
      return this.send.call(this.env, _0x1ddf3d);
    }
    post(_0x58a4b8) {
      return this.send.call(this.env, _0x58a4b8, "POST");
    }
  }
  return new class {
    constructor(_0x4cf7cc, _0x3646bd) {
      this.name = _0x4cf7cc;
      this.http = new _0xdaccde(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0x3646bd);
      this.log("", "🔔" + this.name + ", 开始!");
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(_0x2fd5a4, _0x5cb670 = null) {
      try {
        return JSON.parse(_0x2fd5a4);
      } catch {
        return _0x5cb670;
      }
    }
    toStr(_0x30c573, _0xa198d7 = null) {
      try {
        return JSON.stringify(_0x30c573);
      } catch {
        return _0xa198d7;
      }
    }
    getjson(_0x42aa6d, _0x3e48cf) {
      let _0x50f4b1 = _0x3e48cf;
      const _0x1ea3c0 = this.getdata(_0x42aa6d);
      if (_0x1ea3c0) {
        try {
          _0x50f4b1 = JSON.parse(this.getdata(_0x42aa6d));
        } catch {}
      }
      return _0x50f4b1;
    }
    setjson(_0x24b5ea, _0x10bc3f) {
      try {
        return this.setdata(JSON.stringify(_0x24b5ea), _0x10bc3f);
      } catch {
        return !1;
      }
    }
    getScript(_0x41b493) {
      return new Promise(_0x2a84f3 => {
        this.get({
          url: _0x41b493
        }, (_0x58c6d6, _0x5b46f0, _0x4db636) => _0x2a84f3(_0x4db636));
      });
    }
    runScript(_0x11e5f2, _0x5092ed) {
      return new Promise(_0xda8358 => {
        let _0x36a1b7 = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0x36a1b7 = _0x36a1b7 ? _0x36a1b7.replace(/\n/g, "").trim() : _0x36a1b7;
        let _0x228c23 = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x228c23 = _0x228c23 ? 1 * _0x228c23 : 20;
        _0x228c23 = _0x5092ed && _0x5092ed.timeout ? _0x5092ed.timeout : _0x228c23;
        const [_0x1844ef, _0x2761c1] = _0x36a1b7.split("@"),
          _0x50505c = {
            url: "http://" + _0x2761c1 + "/v1/scripting/evaluate",
            body: {
              script_text: _0x11e5f2,
              mock_type: "cron",
              timeout: _0x228c23
            },
            headers: {
              "X-Key": _0x1844ef,
              Accept: "*/*"
            }
          };
        this.post(_0x50505c, (_0x4a5b3b, _0x2882a3, _0x17c680) => _0xda8358(_0x17c680));
      }).catch(_0x22eeeb => this.logErr(_0x22eeeb));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x51433e = this.path.resolve(this.dataFile),
          _0x4279ac = this.path.resolve(process.cwd(), this.dataFile),
          _0x238008 = this.fs.existsSync(_0x51433e),
          _0x4caa3e = !_0x238008 && this.fs.existsSync(_0x4279ac);
        if (!_0x238008 && !_0x4caa3e) {
          return {};
        }
        {
          const _0x46bb19 = _0x238008 ? _0x51433e : _0x4279ac;
          try {
            return JSON.parse(this.fs.readFileSync(_0x46bb19));
          } catch (_0x40910e) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x35be7d = this.path.resolve(this.dataFile),
          _0x2d8417 = this.path.resolve(process.cwd(), this.dataFile),
          _0x22169e = this.fs.existsSync(_0x35be7d),
          _0x6f2fd2 = !_0x22169e && this.fs.existsSync(_0x2d8417),
          _0x2ab971 = JSON.stringify(this.data);
        _0x22169e ? this.fs.writeFileSync(_0x35be7d, _0x2ab971) : _0x6f2fd2 ? this.fs.writeFileSync(_0x2d8417, _0x2ab971) : this.fs.writeFileSync(_0x35be7d, _0x2ab971);
      }
    }
    lodash_get(_0x1441a5, _0x4e22c1, _0x1aa44f) {
      const _0x50b98a = _0x4e22c1.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0xc0c357 = _0x1441a5;
      for (const _0x165fde of _0x50b98a) if (_0xc0c357 = Object(_0xc0c357)[_0x165fde], void 0 === _0xc0c357) {
        return _0x1aa44f;
      }
      return _0xc0c357;
    }
    lodash_set(_0x768f5a, _0xa7892a, _0x48429b) {
      return Object(_0x768f5a) !== _0x768f5a ? _0x768f5a : (Array.isArray(_0xa7892a) || (_0xa7892a = _0xa7892a.toString().match(/[^.[\]]+/g) || []), _0xa7892a.slice(0, -1).reduce((_0x3e1b1c, _0x4ba4e6, _0x2f2bc6) => Object(_0x3e1b1c[_0x4ba4e6]) === _0x3e1b1c[_0x4ba4e6] ? _0x3e1b1c[_0x4ba4e6] : _0x3e1b1c[_0x4ba4e6] = Math.abs(_0xa7892a[_0x2f2bc6 + 1]) >> 0 == +_0xa7892a[_0x2f2bc6 + 1] ? [] : {}, _0x768f5a)[_0xa7892a[_0xa7892a.length - 1]] = _0x48429b, _0x768f5a);
    }
    getdata(_0x4d719b) {
      let _0x57da1d = this.getval(_0x4d719b);
      if (/^@/.test(_0x4d719b)) {
        const [, _0xd7fb11, _0x24c89d] = /^@(.*?)\.(.*?)$/.exec(_0x4d719b),
          _0x1450fa = _0xd7fb11 ? this.getval(_0xd7fb11) : "";
        if (_0x1450fa) {
          try {
            const _0x102fdb = JSON.parse(_0x1450fa);
            _0x57da1d = _0x102fdb ? this.lodash_get(_0x102fdb, _0x24c89d, "") : _0x57da1d;
          } catch (_0x262203) {
            _0x57da1d = "";
          }
        }
      }
      return _0x57da1d;
    }
    setdata(_0x3a8080, _0x29e77d) {
      let _0x2f89c5 = !1;
      if (/^@/.test(_0x29e77d)) {
        const [, _0x3a79fb, _0x2a18b9] = /^@(.*?)\.(.*?)$/.exec(_0x29e77d),
          _0x40a834 = this.getval(_0x3a79fb),
          _0x25095c = _0x3a79fb ? "null" === _0x40a834 ? null : _0x40a834 || "{}" : "{}";
        try {
          const _0x5f18cc = JSON.parse(_0x25095c);
          this.lodash_set(_0x5f18cc, _0x2a18b9, _0x3a8080);
          _0x2f89c5 = this.setval(JSON.stringify(_0x5f18cc), _0x3a79fb);
        } catch (_0x36131b) {
          const _0x1685bb = {};
          this.lodash_set(_0x1685bb, _0x2a18b9, _0x3a8080);
          _0x2f89c5 = this.setval(JSON.stringify(_0x1685bb), _0x3a79fb);
        }
      } else {
        _0x2f89c5 = this.setval(_0x3a8080, _0x29e77d);
      }
      return _0x2f89c5;
    }
    getval(_0x4cde81) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x4cde81) : this.isQuanX() ? $prefs.valueForKey(_0x4cde81) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x4cde81]) : this.data && this.data[_0x4cde81] || null;
    }
    setval(_0x4d72ec, _0x20a5b9) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0x4d72ec, _0x20a5b9) : this.isQuanX() ? $prefs.setValueForKey(_0x4d72ec, _0x20a5b9) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x20a5b9] = _0x4d72ec, this.writedata(), !0) : this.data && this.data[_0x20a5b9] || null;
    }
    initGotEnv(_0x52790b) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x52790b && (_0x52790b.headers = _0x52790b.headers ? _0x52790b.headers : {}, void 0 === _0x52790b.headers.Cookie && void 0 === _0x52790b.cookieJar && (_0x52790b.cookieJar = this.ckjar));
    }
    get(_0x4a9e59, _0x5e58ec = () => {}) {
      _0x4a9e59.headers && (delete _0x4a9e59.headers["Content-Type"], delete _0x4a9e59.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x4a9e59.headers = _0x4a9e59.headers || {}, Object.assign(_0x4a9e59.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x4a9e59, (_0x1b82a6, _0x27e0cf, _0x6cf5cf) => {
        !_0x1b82a6 && _0x27e0cf && (_0x27e0cf.body = _0x6cf5cf, _0x27e0cf.statusCode = _0x27e0cf.status);
        _0x5e58ec(_0x1b82a6, _0x27e0cf, _0x6cf5cf);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x4a9e59.opts = _0x4a9e59.opts || {}, Object.assign(_0x4a9e59.opts, {
        hints: !1
      })), $task.fetch(_0x4a9e59).then(_0x5d2c0c => {
        const {
          statusCode: _0x3fde44,
          statusCode: _0x2aed75,
          headers: _0x59dc6c,
          body: _0x41355b
        } = _0x5d2c0c;
        _0x5e58ec(null, {
          status: _0x3fde44,
          statusCode: _0x2aed75,
          headers: _0x59dc6c,
          body: _0x41355b
        }, _0x41355b);
      }, _0x1ee764 => _0x5e58ec(_0x1ee764))) : this.isNode() && (this.initGotEnv(_0x4a9e59), this.got(_0x4a9e59).on("redirect", (_0x65a6f9, _0x572883) => {
        try {
          if (_0x65a6f9.headers["set-cookie"]) {
            const _0x807807 = _0x65a6f9.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x807807 && this.ckjar.setCookieSync(_0x807807, null);
            _0x572883.cookieJar = this.ckjar;
          }
        } catch (_0x20fd15) {
          this.logErr(_0x20fd15);
        }
      }).then(_0x584804 => {
        const {
          statusCode: _0x5ae130,
          statusCode: _0x1143a3,
          headers: _0x2fa057,
          body: _0xa6abf7
        } = _0x584804;
        _0x5e58ec(null, {
          status: _0x5ae130,
          statusCode: _0x1143a3,
          headers: _0x2fa057,
          body: _0xa6abf7
        }, _0xa6abf7);
      }, _0x504ab7 => {
        const {
          message: _0x8f3628,
          response: _0x599d72
        } = _0x504ab7;
        _0x5e58ec(_0x8f3628, _0x599d72, _0x599d72 && _0x599d72.body);
      }));
    }
    post(_0x207a07, _0x4bc9a1 = () => {}) {
      if (_0x207a07.body && _0x207a07.headers && !_0x207a07.headers["Content-Type"] && (_0x207a07.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x207a07.headers && delete _0x207a07.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x207a07.headers = _0x207a07.headers || {}, Object.assign(_0x207a07.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x207a07, (_0x546ff0, _0x57315c, _0xbc8013) => {
          !_0x546ff0 && _0x57315c && (_0x57315c.body = _0xbc8013, _0x57315c.statusCode = _0x57315c.status);
          _0x4bc9a1(_0x546ff0, _0x57315c, _0xbc8013);
        });
      } else {
        if (this.isQuanX()) {
          _0x207a07.method = "POST";
          this.isNeedRewrite && (_0x207a07.opts = _0x207a07.opts || {}, Object.assign(_0x207a07.opts, {
            hints: !1
          }));
          $task.fetch(_0x207a07).then(_0x5bc30d => {
            const {
              statusCode: _0x13006b,
              statusCode: _0x594509,
              headers: _0x368068,
              body: _0x4ed05b
            } = _0x5bc30d;
            _0x4bc9a1(null, {
              status: _0x13006b,
              statusCode: _0x594509,
              headers: _0x368068,
              body: _0x4ed05b
            }, _0x4ed05b);
          }, _0x5cb839 => _0x4bc9a1(_0x5cb839));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x207a07);
            const {
              url: _0x268309,
              ..._0x484986
            } = _0x207a07;
            this.got.post(_0x268309, _0x484986).then(_0x451bd9 => {
              const {
                statusCode: _0x5c33d2,
                statusCode: _0x5292d3,
                headers: _0xbcfdd3,
                body: _0x57b659
              } = _0x451bd9;
              _0x4bc9a1(null, {
                status: _0x5c33d2,
                statusCode: _0x5292d3,
                headers: _0xbcfdd3,
                body: _0x57b659
              }, _0x57b659);
            }, _0x435836 => {
              const {
                message: _0x15a4a3,
                response: _0x28e000
              } = _0x435836;
              _0x4bc9a1(_0x15a4a3, _0x28e000, _0x28e000 && _0x28e000.body);
            });
          }
        }
      }
    }
    time(_0x28b19a, _0x4856a6 = null) {
      const _0x3b217f = _0x4856a6 ? new Date(_0x4856a6) : new Date();
      let _0x5e481e = {
        "M+": _0x3b217f.getMonth() + 1,
        "d+": _0x3b217f.getDate(),
        "H+": _0x3b217f.getHours(),
        "m+": _0x3b217f.getMinutes(),
        "s+": _0x3b217f.getSeconds(),
        "q+": Math.floor((_0x3b217f.getMonth() + 3) / 3),
        S: _0x3b217f.getMilliseconds()
      };
      /(y+)/.test(_0x28b19a) && (_0x28b19a = _0x28b19a.replace(RegExp.$1, (_0x3b217f.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x2c399e in _0x5e481e) new RegExp("(" + _0x2c399e + ")").test(_0x28b19a) && (_0x28b19a = _0x28b19a.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x5e481e[_0x2c399e] : ("00" + _0x5e481e[_0x2c399e]).substr(("" + _0x5e481e[_0x2c399e]).length)));
      return _0x28b19a;
    }
    msg(_0x518de8 = _0x11a1ae, _0x5d5c4d = "", _0x15a7fd = "", _0x461c2d) {
      const _0xd879ad = _0x4c9848 => {
        if (!_0x4c9848) {
          return _0x4c9848;
        }
        if ("string" == typeof _0x4c9848) {
          return this.isLoon() ? _0x4c9848 : this.isQuanX() ? {
            "open-url": _0x4c9848
          } : this.isSurge() ? {
            url: _0x4c9848
          } : void 0;
        }
        if ("object" == typeof _0x4c9848) {
          if (this.isLoon()) {
            let _0x2a79a1 = _0x4c9848.openUrl || _0x4c9848.url || _0x4c9848["open-url"],
              _0x164181 = _0x4c9848.mediaUrl || _0x4c9848["media-url"];
            return {
              openUrl: _0x2a79a1,
              mediaUrl: _0x164181
            };
          }
          if (this.isQuanX()) {
            let _0x538b03 = _0x4c9848["open-url"] || _0x4c9848.url || _0x4c9848.openUrl,
              _0x381799 = _0x4c9848["media-url"] || _0x4c9848.mediaUrl;
            return {
              "open-url": _0x538b03,
              "media-url": _0x381799
            };
          }
          if (this.isSurge()) {
            let _0x29ff72 = _0x4c9848.url || _0x4c9848.openUrl || _0x4c9848["open-url"];
            return {
              url: _0x29ff72
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x518de8, _0x5d5c4d, _0x15a7fd, _0xd879ad(_0x461c2d)) : this.isQuanX() && $notify(_0x518de8, _0x5d5c4d, _0x15a7fd, _0xd879ad(_0x461c2d))), !this.isMuteLog) {
        let _0x1887bc = ["", "==============📣系统通知📣=============="];
        _0x1887bc.push(_0x518de8);
        _0x5d5c4d && _0x1887bc.push(_0x5d5c4d);
        _0x15a7fd && _0x1887bc.push(_0x15a7fd);
        console.log(_0x1887bc.join("\n"));
        this.logs = this.logs.concat(_0x1887bc);
      }
    }
    log(..._0x2bfa51) {
      _0x2bfa51.length > 0 && (this.logs = [...this.logs, ..._0x2bfa51]);
      console.log(_0x2bfa51.join(this.logSeparator));
    }
    logErr(_0x2bbc67, _0x495dfb) {
      const _0x51830b = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0x51830b ? this.log("", "❗️" + this.name + ", 错误!", _0x2bbc67.stack) : this.log("", "❗️" + this.name + ", 错误!", _0x2bbc67);
    }
    wait(_0x3ca40e) {
      return new Promise(_0x230af5 => setTimeout(_0x230af5, _0x3ca40e));
    }
    done(_0x18a23b = {}) {
      const _0x554036 = new Date().getTime(),
        _0x574a9b = (_0x554036 - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0x574a9b + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x18a23b);
    }
  }(_0x11a1ae, _0x858098);
}
function checkVersion(_0x1a92d5, _0x393e77) {
  try {
    logAndNotify("文件md5：" + _0x393e77);
    const _0x445b3b = SyncRequest("GET", "https://checktoke.filegear-sg.me/api/update/check?fileName=" + _0x1a92d5 + "&fileMd5=" + _0x393e77),
      _0x2120f9 = JSON.parse(_0x445b3b.getBody("utf8"));
    if (_0x2120f9.code === 301) {
      process.exit(0);
    } else {
      logAndNotify(_0x2120f9.data);
    }
  } catch (_0x75a5a8) {
    logAndNotify("版本检查失败:", _0x75a5a8);
  }
}