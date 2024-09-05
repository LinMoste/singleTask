/**
 * cron: 40 9 * * *
 *
 * yqdz
 *
 * export yqdz_accounts="手机号#密码"
 * export yqdz_Did="app或者小程序中抓请求头中的Did"
 * const $ = new Env('一汽大众');
 */
const $ = new Env("一汽大众"),
  CryptoJS = require("crypto-js"),
  axios = require("axios"),
  {
    sendNotify
  } = require("./sendNotify"),
  cache = require("./cache"),
  SyncRequest = require("sync-request");
let notifyStr = "";
const Did = process.env.yqdz_Did,
  apiHost = "https://one-app-h5.faw-vw.com/prod-api/mobile/one-app",
  appHost = "https://oneapp-api.faw-vw.com";
(async () => {
  checkVersion("yqdz.js", "5b7cdd12e0b39236a3455ba4b866bf5f");
  const _0x1f933c = process.env.yqdz_accounts;
  if (!Did || !_0x1f933c) {
    logAndNotify("yqdz_Did或yqdz_accounts不存在");
    return;
  }
  cache.initializeCache();
  let _0x90b623 = _0x1f933c.split("\n");
  for (let _0x1caf23 = 0; _0x1caf23 < _0x90b623.length; _0x1caf23++) {
    const _0x4d55c3 = _0x90b623[_0x1caf23].split("#")[0];
    logAndNotify("🧐" + _0x4d55c3 + "🧐");
    const _0xdb69e5 = _0x90b623[_0x1caf23].split("#")[1];
    let _0x5dd70c = cache.readCache(_0x4d55c3);
    if (!_0x5dd70c) {
      const _0x20bccc = await sendPostRequest(apiHost, "/user/public/v1/login", undefined, {
        account: "" + _0x4d55c3,
        password: "" + _0xdb69e5,
        scope: "openid profile mbb"
      });
      if (_0x20bccc.data.returnStatus !== "SUCCEED") {
        logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】登录失败☹");
        continue;
      }
      logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】登录成功");
      _0x5dd70c = _0x20bccc.data.data.tokenInfo;
      cache.addCache(_0x4d55c3, _0x5dd70c);
    } else {
      logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】从缓存中读取用户信息");
    }
    const _0x543fad = await sendPostRequest(apiHost, "/general/public/v1/member/get_miniapp_score", _0x5dd70c.accessToken, {
      systemKey: "8F7EC8DCAEE74A2FA1",
      tenantId: "VW",
      businessId: 1,
      businessTypeId: 1,
      scoreTypeId: 2
    });
    if (_0x543fad.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】缓存失效 重新登录");
      const _0x57edec = await sendPostRequest(apiHost, "/user/public/v1/login", undefined, {
        account: "" + _0x4d55c3,
        password: "" + _0xdb69e5,
        scope: "openid profile mbb"
      });
      if (_0x57edec.data.returnStatus !== "SUCCEED") {
        logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】登录失败☹");
        continue;
      }
      logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】登录成功");
      _0x5dd70c = _0x57edec.data.data.tokenInfo;
      cache.addCache(_0x4d55c3, _0x5dd70c);
    }
    const _0x262ac5 = await sendGetRequest(apiHost, "/general/public/v1/mall/integral/get_days_sign", _0x5dd70c.accessToken);
    if (_0x262ac5.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】签到失败");
      continue;
    }
    logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】签到成功 累计签到【" + _0x262ac5.data.data.totaldays + "】天 积分【" + _0x262ac5.data.data.availablescore + "】");
    const _0xec84b9 = await sendGetRequest(appHost, "/profile/lottery/able/v1", _0x5dd70c.accessToken);
    if (_0xec84b9.data.returnStatus !== "SUCCEED") {
      logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】查询盲盒状态出错");
    } else {
      !_0xec84b9.data.data.able ? logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】还不到开盲盒的时候") : logAndNotify("账号【" + (_0x1caf23 + 1) + "】 【" + _0x4d55c3 + "】可以开盲盒了 手动去app开");
    }
  }
})().catch(_0x5b3bf => {
  logAndNotify(_0x5b3bf);
}).finally(() => {
  sendNotify("一汽大众", notifyStr);
  $.done();
});
function oaSignFunc(_0x3d7352) {
  var _0xd1b560 = _0x3d7352.url,
    _0x577e02 = _0x3d7352.data,
    _0x43b13a = "",
    _0x2db39f = {};
  _0xd1b560.split("?")[1] && _0xd1b560.split("?")[1].split("&").forEach(function (_0x23b6d0) {
    var _0x3defd8 = _0x23b6d0.split("=");
    _0x2db39f[_0x3defd8[0]] = decodeURIComponent(_0x3defd8[1]);
  });
  var _0x489a98 = _0x2db39f.signTimestamp,
    _0x10c71f = _0x2db39f.nonce,
    _0x5490a5 = btoa(unescape(encodeURIComponent(JSON.stringify(_0x577e02)))) + _0x10c71f + _0x489a98,
    _0x5aa715 = CryptoJS.HmacSHA256(_0x5490a5, atob("NjNmYThjZDA2ZGRhMzQ3ODQ3MTNjMWZkY2NmN2U2YmQ=")).words,
    _0x233d43 = new ArrayBuffer(32),
    _0x59e1c1 = new DataView(_0x233d43);
  _0x5aa715.forEach(function (_0x496148, _0x23692a) {
    _0x59e1c1.setInt32(4 * _0x23692a, _0x496148, !1);
  });
  for (var _0x2b0ce4 = 0; _0x2b0ce4 < 32;) {
    _0x43b13a += (255 & _0x59e1c1.getInt8(_0x2b0ce4) | 256).toString(16).substring(1, 3);
    _0x2b0ce4++;
  }
  return _0x43b13a;
}
function signUrl(_0x2974bf) {
  var _0x173760 = _0x2974bf.path,
    _0x213b06 = _0x2974bf.params,
    _0x2f5732 = _0x213b06,
    _0x120169 = "9144085367";
  _0x2f5732.appkey = _0x120169;
  _0x2f5732.signTimestamp = Date.now();
  _0x2f5732.timestamp = _0x2f5732.signTimestamp;
  _0x2f5732.nonce = Array.from({
    length: 8
  }).map(function () {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
  }).join("");
  var _0x80a981 = Object.keys(_0x2f5732).map(_0x4bb341 => _0x4bb341 + "=" + _0x2f5732[_0x4bb341]);
  _0x2f5732.digitalSign = function (_0x21f485, _0x2ec411) {
    var _0xf6bbb6,
      _0x5b45f7 = _0x21f485.replace("one-app/", "").replace("test/", "").replace(/^\//, "");
    if (Array.isArray(_0x2ec411)) {
      _0x2ec411.sort();
      var _0x37b8a8 = "".concat(_0x5b45f7, "_").concat(_0x2ec411.join("_"), "_").concat("63fa8cd06dda34784713c1fdccf7e6bd"),
        _0x24040e = encodeURIComponent(_0x37b8a8);
      _0xf6bbb6 = CryptoJS.MD5(_0x24040e).toString(CryptoJS.enc.Hex);
    } else {
      console.error("signAlgorithm - queryArray 必须为数组！");
    }
    return _0xf6bbb6;
  }(_0x173760, _0x80a981);
  return Object.keys(_0x2f5732).map(_0x27de47 => _0x27de47 + "=" + _0x2f5732[_0x27de47]).join("&");
  console.error("signAlgorithm - appkey 不存在！");
  return _0x2f5732;
}
function sendPostRequest(_0x96b6fc, _0x252430, _0x4ebf6f, _0x1a5e42) {
  const _0x5ac683 = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html",
    entry: "vwapp"
  };
  if (_0x252430.indexOf("?") > -1) {
    _0x252430 += "&" + signUrl({
      path: _0x252430,
      params: {}
    });
  } else {
    _0x252430 += "?" + signUrl({
      path: _0x252430,
      params: {}
    });
  }
  const _0x5890d2 = _0x96b6fc + _0x252430;
  let _0x41f8ee = {};
  if (_0x4ebf6f) {
    _0x41f8ee = {
      ..._0x5ac683,
      ...{
        Authorization: "Bearer " + _0x4ebf6f
      },
      ...{
        bodySign: oaSignFunc({
          url: _0x252430,
          data: _0x1a5e42
        })
      }
    };
  } else {
    _0x41f8ee = {
      ..._0x5ac683
    };
  }
  const _0x1d0ad2 = axios.create({
    headers: _0x41f8ee
  });
  return _0x1d0ad2.post(_0x5890d2, _0x1a5e42);
}
function sendGetRequest(_0x317a1c, _0x3ee08e, _0x2dbab) {
  const _0x5d423d = {
    "anonymous-id": "MINIAPPCOMMUNITY_",
    "Content-Type": "application/json",
    "x-namespace-code": "production",
    "x-microservice-name": "api-gateway",
    "x-mp-name": "COMMUNITY",
    Did: Did,
    Referer: "https://servicewechat.com/" + atob("d3g0ZjNiNjY0NWU3OWJkMDlk") + "/78/page-frame.html",
    entry: "vwapp"
  };
  _0x3ee08e.indexOf("?") > -1 ? _0x3ee08e += "&" + signUrl({
    path: _0x3ee08e,
    params: {}
  }) : _0x3ee08e += "?" + signUrl({
    path: _0x3ee08e,
    params: {}
  });
  const _0x48d0bc = _0x317a1c + _0x3ee08e;
  let _0x2b095d = {};
  if (_0x2dbab) {
    _0x2b095d = {
      ..._0x5d423d,
      ...{
        Authorization: "Bearer " + _0x2dbab
      },
      ...{
        bodySign: oaSignFunc({
          url: _0x3ee08e,
          data: {}
        })
      }
    };
  } else {
    _0x2b095d = {
      ..._0x5d423d
    };
  }
  const _0x17f5fa = axios.create({
    headers: _0x2b095d
  });
  return _0x17f5fa.get(_0x48d0bc);
}
function logAndNotify(_0x4c307f) {
  1;
  $.log(_0x4c307f);
  notifyStr += _0x4c307f;
  notifyStr += "\n";
}
function Env(_0x134df4, _0x48acb1) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0x598198 {
    constructor(_0x1b5e89) {
      this.env = _0x1b5e89;
    }
    send(_0x19432b, _0x3d5ac4 = "GET") {
      _0x19432b = "string" == typeof _0x19432b ? {
        url: _0x19432b
      } : _0x19432b;
      let _0x40b7bf = this.get;
      "POST" === _0x3d5ac4 && (_0x40b7bf = this.post);
      return new Promise((_0x1c76e1, _0x74939f) => {
        _0x40b7bf.call(this, _0x19432b, (_0x6475bb, _0x5257bb, _0x2b8495) => {
          _0x6475bb ? _0x74939f(_0x6475bb) : _0x1c76e1(_0x5257bb);
        });
      });
    }
    get(_0x2e6a78) {
      return this.send.call(this.env, _0x2e6a78);
    }
    post(_0x1145e0) {
      return this.send.call(this.env, _0x1145e0, "POST");
    }
  }
  return new class {
    constructor(_0x4da680, _0x5ae8bf) {
      this.name = _0x4da680;
      this.http = new _0x598198(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0x5ae8bf);
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
    toObj(_0x35d884, _0x3940fa = null) {
      try {
        return JSON.parse(_0x35d884);
      } catch {
        return _0x3940fa;
      }
    }
    toStr(_0x4e8301, _0x398955 = null) {
      try {
        return JSON.stringify(_0x4e8301);
      } catch {
        return _0x398955;
      }
    }
    getjson(_0x5a2b16, _0x118b75) {
      let _0x4ec0a0 = _0x118b75;
      const _0x48751f = this.getdata(_0x5a2b16);
      if (_0x48751f) {
        try {
          _0x4ec0a0 = JSON.parse(this.getdata(_0x5a2b16));
        } catch {}
      }
      return _0x4ec0a0;
    }
    setjson(_0x1b44ed, _0x104b10) {
      try {
        return this.setdata(JSON.stringify(_0x1b44ed), _0x104b10);
      } catch {
        return !1;
      }
    }
    getScript(_0x37c9ab) {
      return new Promise(_0x2d46f1 => {
        this.get({
          url: _0x37c9ab
        }, (_0x3340cb, _0x30a192, _0x3248b8) => _0x2d46f1(_0x3248b8));
      });
    }
    runScript(_0x36de5b, _0x59da5a) {
      return new Promise(_0x23c3c1 => {
        let _0x19989c = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0x19989c = _0x19989c ? _0x19989c.replace(/\n/g, "").trim() : _0x19989c;
        let _0x2d8efe = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x2d8efe = _0x2d8efe ? 1 * _0x2d8efe : 20;
        _0x2d8efe = _0x59da5a && _0x59da5a.timeout ? _0x59da5a.timeout : _0x2d8efe;
        const [_0x4a5932, _0x1e7571] = _0x19989c.split("@"),
          _0x465fd1 = {
            url: "http://" + _0x1e7571 + "/v1/scripting/evaluate",
            body: {
              script_text: _0x36de5b,
              mock_type: "cron",
              timeout: _0x2d8efe
            },
            headers: {
              "X-Key": _0x4a5932,
              Accept: "*/*"
            }
          };
        this.post(_0x465fd1, (_0xadf93c, _0xc134c7, _0x51725e) => _0x23c3c1(_0x51725e));
      }).catch(_0x5e8e67 => this.logErr(_0x5e8e67));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x387d27 = this.path.resolve(this.dataFile),
          _0x56982e = this.path.resolve(process.cwd(), this.dataFile),
          _0x52492a = this.fs.existsSync(_0x387d27),
          _0x3193af = !_0x52492a && this.fs.existsSync(_0x56982e);
        if (!_0x52492a && !_0x3193af) {
          return {};
        }
        {
          const _0x5a705a = _0x52492a ? _0x387d27 : _0x56982e;
          try {
            return JSON.parse(this.fs.readFileSync(_0x5a705a));
          } catch (_0x562a3c) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x284871 = this.path.resolve(this.dataFile),
          _0x2a68e3 = this.path.resolve(process.cwd(), this.dataFile),
          _0x48fa70 = this.fs.existsSync(_0x284871),
          _0x5c4e01 = !_0x48fa70 && this.fs.existsSync(_0x2a68e3),
          _0x3156c2 = JSON.stringify(this.data);
        _0x48fa70 ? this.fs.writeFileSync(_0x284871, _0x3156c2) : _0x5c4e01 ? this.fs.writeFileSync(_0x2a68e3, _0x3156c2) : this.fs.writeFileSync(_0x284871, _0x3156c2);
      }
    }
    lodash_get(_0x1729c3, _0x4347f6, _0x3fadea) {
      const _0xe54718 = _0x4347f6.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0x590300 = _0x1729c3;
      for (const _0x31074 of _0xe54718) if (_0x590300 = Object(_0x590300)[_0x31074], void 0 === _0x590300) {
        return _0x3fadea;
      }
      return _0x590300;
    }
    lodash_set(_0x556a22, _0x7d6c61, _0x4ccd77) {
      return Object(_0x556a22) !== _0x556a22 ? _0x556a22 : (Array.isArray(_0x7d6c61) || (_0x7d6c61 = _0x7d6c61.toString().match(/[^.[\]]+/g) || []), _0x7d6c61.slice(0, -1).reduce((_0x42cb57, _0xfb1590, _0x426373) => Object(_0x42cb57[_0xfb1590]) === _0x42cb57[_0xfb1590] ? _0x42cb57[_0xfb1590] : _0x42cb57[_0xfb1590] = Math.abs(_0x7d6c61[_0x426373 + 1]) >> 0 == +_0x7d6c61[_0x426373 + 1] ? [] : {}, _0x556a22)[_0x7d6c61[_0x7d6c61.length - 1]] = _0x4ccd77, _0x556a22);
    }
    getdata(_0x29f1cf) {
      let _0x56ecc2 = this.getval(_0x29f1cf);
      if (/^@/.test(_0x29f1cf)) {
        const [, _0x107dd0, _0x26ce61] = /^@(.*?)\.(.*?)$/.exec(_0x29f1cf),
          _0x5376ae = _0x107dd0 ? this.getval(_0x107dd0) : "";
        if (_0x5376ae) {
          try {
            const _0x5d743c = JSON.parse(_0x5376ae);
            _0x56ecc2 = _0x5d743c ? this.lodash_get(_0x5d743c, _0x26ce61, "") : _0x56ecc2;
          } catch (_0x1d6d50) {
            _0x56ecc2 = "";
          }
        }
      }
      return _0x56ecc2;
    }
    setdata(_0x4c4f88, _0x52da04) {
      let _0x5c841d = !1;
      if (/^@/.test(_0x52da04)) {
        const [, _0x1c5628, _0x32a5f6] = /^@(.*?)\.(.*?)$/.exec(_0x52da04),
          _0x28fe05 = this.getval(_0x1c5628),
          _0x5ec7ac = _0x1c5628 ? "null" === _0x28fe05 ? null : _0x28fe05 || "{}" : "{}";
        try {
          const _0x2066e8 = JSON.parse(_0x5ec7ac);
          this.lodash_set(_0x2066e8, _0x32a5f6, _0x4c4f88);
          _0x5c841d = this.setval(JSON.stringify(_0x2066e8), _0x1c5628);
        } catch (_0x4a3add) {
          const _0x40134a = {};
          this.lodash_set(_0x40134a, _0x32a5f6, _0x4c4f88);
          _0x5c841d = this.setval(JSON.stringify(_0x40134a), _0x1c5628);
        }
      } else {
        _0x5c841d = this.setval(_0x4c4f88, _0x52da04);
      }
      return _0x5c841d;
    }
    getval(_0x6176c7) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x6176c7) : this.isQuanX() ? $prefs.valueForKey(_0x6176c7) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x6176c7]) : this.data && this.data[_0x6176c7] || null;
    }
    setval(_0x2386fc, _0x42ab28) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0x2386fc, _0x42ab28) : this.isQuanX() ? $prefs.setValueForKey(_0x2386fc, _0x42ab28) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x42ab28] = _0x2386fc, this.writedata(), !0) : this.data && this.data[_0x42ab28] || null;
    }
    initGotEnv(_0x3ce55f) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x3ce55f && (_0x3ce55f.headers = _0x3ce55f.headers ? _0x3ce55f.headers : {}, void 0 === _0x3ce55f.headers.Cookie && void 0 === _0x3ce55f.cookieJar && (_0x3ce55f.cookieJar = this.ckjar));
    }
    get(_0x3becc1, _0x50b24f = () => {}) {
      _0x3becc1.headers && (delete _0x3becc1.headers["Content-Type"], delete _0x3becc1.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x3becc1.headers = _0x3becc1.headers || {}, Object.assign(_0x3becc1.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x3becc1, (_0x9791ea, _0x1825b5, _0x160881) => {
        !_0x9791ea && _0x1825b5 && (_0x1825b5.body = _0x160881, _0x1825b5.statusCode = _0x1825b5.status);
        _0x50b24f(_0x9791ea, _0x1825b5, _0x160881);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x3becc1.opts = _0x3becc1.opts || {}, Object.assign(_0x3becc1.opts, {
        hints: !1
      })), $task.fetch(_0x3becc1).then(_0x3a4acc => {
        const {
          statusCode: _0x12de28,
          statusCode: _0x8cd0fd,
          headers: _0x478348,
          body: _0x380909
        } = _0x3a4acc;
        _0x50b24f(null, {
          status: _0x12de28,
          statusCode: _0x8cd0fd,
          headers: _0x478348,
          body: _0x380909
        }, _0x380909);
      }, _0x54045b => _0x50b24f(_0x54045b))) : this.isNode() && (this.initGotEnv(_0x3becc1), this.got(_0x3becc1).on("redirect", (_0x39374b, _0x1c5288) => {
        try {
          if (_0x39374b.headers["set-cookie"]) {
            const _0x490959 = _0x39374b.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x490959 && this.ckjar.setCookieSync(_0x490959, null);
            _0x1c5288.cookieJar = this.ckjar;
          }
        } catch (_0x5e9283) {
          this.logErr(_0x5e9283);
        }
      }).then(_0x1371f5 => {
        const {
          statusCode: _0x13965e,
          statusCode: _0x444587,
          headers: _0x40c854,
          body: _0x7e51e3
        } = _0x1371f5;
        _0x50b24f(null, {
          status: _0x13965e,
          statusCode: _0x444587,
          headers: _0x40c854,
          body: _0x7e51e3
        }, _0x7e51e3);
      }, _0x2cfdb7 => {
        const {
          message: _0x2a6fd7,
          response: _0x40b1ec
        } = _0x2cfdb7;
        _0x50b24f(_0x2a6fd7, _0x40b1ec, _0x40b1ec && _0x40b1ec.body);
      }));
    }
    post(_0x2b4213, _0x4802dc = () => {}) {
      if (_0x2b4213.body && _0x2b4213.headers && !_0x2b4213.headers["Content-Type"] && (_0x2b4213.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x2b4213.headers && delete _0x2b4213.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x2b4213.headers = _0x2b4213.headers || {}, Object.assign(_0x2b4213.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x2b4213, (_0x169740, _0x5cba1f, _0x30a67f) => {
          !_0x169740 && _0x5cba1f && (_0x5cba1f.body = _0x30a67f, _0x5cba1f.statusCode = _0x5cba1f.status);
          _0x4802dc(_0x169740, _0x5cba1f, _0x30a67f);
        });
      } else {
        if (this.isQuanX()) {
          _0x2b4213.method = "POST";
          this.isNeedRewrite && (_0x2b4213.opts = _0x2b4213.opts || {}, Object.assign(_0x2b4213.opts, {
            hints: !1
          }));
          $task.fetch(_0x2b4213).then(_0x98e8d7 => {
            const {
              statusCode: _0x1e73bc,
              statusCode: _0x513437,
              headers: _0x2e12d1,
              body: _0x1f9c8b
            } = _0x98e8d7;
            _0x4802dc(null, {
              status: _0x1e73bc,
              statusCode: _0x513437,
              headers: _0x2e12d1,
              body: _0x1f9c8b
            }, _0x1f9c8b);
          }, _0x359492 => _0x4802dc(_0x359492));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x2b4213);
            const {
              url: _0x589def,
              ..._0xec469f
            } = _0x2b4213;
            this.got.post(_0x589def, _0xec469f).then(_0x1e60fa => {
              const {
                statusCode: _0x5dc33d,
                statusCode: _0x5ed1df,
                headers: _0xc6e78,
                body: _0x3b3c1b
              } = _0x1e60fa;
              _0x4802dc(null, {
                status: _0x5dc33d,
                statusCode: _0x5ed1df,
                headers: _0xc6e78,
                body: _0x3b3c1b
              }, _0x3b3c1b);
            }, _0x1fe221 => {
              const {
                message: _0x46df8e,
                response: _0x39dde4
              } = _0x1fe221;
              _0x4802dc(_0x46df8e, _0x39dde4, _0x39dde4 && _0x39dde4.body);
            });
          }
        }
      }
    }
    time(_0x2ffd23, _0x5cee27 = null) {
      const _0x521e17 = _0x5cee27 ? new Date(_0x5cee27) : new Date();
      let _0x55dee9 = {
        "M+": _0x521e17.getMonth() + 1,
        "d+": _0x521e17.getDate(),
        "H+": _0x521e17.getHours(),
        "m+": _0x521e17.getMinutes(),
        "s+": _0x521e17.getSeconds(),
        "q+": Math.floor((_0x521e17.getMonth() + 3) / 3),
        S: _0x521e17.getMilliseconds()
      };
      /(y+)/.test(_0x2ffd23) && (_0x2ffd23 = _0x2ffd23.replace(RegExp.$1, (_0x521e17.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x5be3f4 in _0x55dee9) new RegExp("(" + _0x5be3f4 + ")").test(_0x2ffd23) && (_0x2ffd23 = _0x2ffd23.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x55dee9[_0x5be3f4] : ("00" + _0x55dee9[_0x5be3f4]).substr(("" + _0x55dee9[_0x5be3f4]).length)));
      return _0x2ffd23;
    }
    msg(_0x980d23 = _0x134df4, _0x16be08 = "", _0x3b1790 = "", _0x58f6ff) {
      const _0x55fd1f = _0x24bf1a => {
        if (!_0x24bf1a) {
          return _0x24bf1a;
        }
        if ("string" == typeof _0x24bf1a) {
          return this.isLoon() ? _0x24bf1a : this.isQuanX() ? {
            "open-url": _0x24bf1a
          } : this.isSurge() ? {
            url: _0x24bf1a
          } : void 0;
        }
        if ("object" == typeof _0x24bf1a) {
          if (this.isLoon()) {
            let _0x5d2506 = _0x24bf1a.openUrl || _0x24bf1a.url || _0x24bf1a["open-url"],
              _0x4ff2de = _0x24bf1a.mediaUrl || _0x24bf1a["media-url"];
            return {
              openUrl: _0x5d2506,
              mediaUrl: _0x4ff2de
            };
          }
          if (this.isQuanX()) {
            let _0x2879e5 = _0x24bf1a["open-url"] || _0x24bf1a.url || _0x24bf1a.openUrl,
              _0x1b7a29 = _0x24bf1a["media-url"] || _0x24bf1a.mediaUrl;
            return {
              "open-url": _0x2879e5,
              "media-url": _0x1b7a29
            };
          }
          if (this.isSurge()) {
            let _0x2a06bd = _0x24bf1a.url || _0x24bf1a.openUrl || _0x24bf1a["open-url"];
            return {
              url: _0x2a06bd
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x980d23, _0x16be08, _0x3b1790, _0x55fd1f(_0x58f6ff)) : this.isQuanX() && $notify(_0x980d23, _0x16be08, _0x3b1790, _0x55fd1f(_0x58f6ff))), !this.isMuteLog) {
        let _0x24ca68 = ["", "==============📣系统通知📣=============="];
        _0x24ca68.push(_0x980d23);
        _0x16be08 && _0x24ca68.push(_0x16be08);
        _0x3b1790 && _0x24ca68.push(_0x3b1790);
        console.log(_0x24ca68.join("\n"));
        this.logs = this.logs.concat(_0x24ca68);
      }
    }
    log(..._0xed79e2) {
      _0xed79e2.length > 0 && (this.logs = [...this.logs, ..._0xed79e2]);
      console.log(_0xed79e2.join(this.logSeparator));
    }
    logErr(_0xb03aa0, _0x3555f9) {
      const _0x386f3f = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0x386f3f ? this.log("", "❗️" + this.name + ", 错误!", _0xb03aa0.stack) : this.log("", "❗️" + this.name + ", 错误!", _0xb03aa0);
    }
    wait(_0x114692) {
      return new Promise(_0x5c8e9d => setTimeout(_0x5c8e9d, _0x114692));
    }
    done(_0x455f74 = {}) {
      const _0x466bf6 = new Date().getTime(),
        _0x3e7d4d = (_0x466bf6 - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0x3e7d4d + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x455f74);
    }
  }(_0x134df4, _0x48acb1);
}
function checkVersion(_0x20d0eb, _0x2654c0) {
  try {
    logAndNotify("文件md5：" + _0x2654c0);
    const _0x575cdc = SyncRequest("GET", "https://checktoke.filegear-sg.me/api/update/check?fileName=" + _0x20d0eb + "&fileMd5=" + _0x2654c0),
      _0x3d60db = JSON.parse(_0x575cdc.getBody("utf8"));
    if (_0x3d60db.code === 301) {
      process.exit(0);
    } else {
      logAndNotify(_0x3d60db.data);
    }
  } catch (_0x740fc2) {
    logAndNotify("版本检查失败:", _0x740fc2);
  }
}