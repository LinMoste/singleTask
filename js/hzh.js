/**
 * 华住会
 * 小程序：华住会酒店预订汉庭全季桔子
 * 路径： 会员 -> 签到   抓点击签到后的完整url 例：https://hweb-minilogin.huazhu.com/bridge/jump?redirectUrl=*********
 * 多个换行
 * export hzh_url="url"
 * 定时规则
 * cron: 0 5 * * *
 * const $ = new Env('华住会');
 */
const $ = new Env("华住会"),
  axios = require("axios"),
  {
    wrapper
  } = require("axios-cookiejar-support"),
  tough = require("tough-cookie"),
  {
    sendNotify
  } = require("./sendNotify"),
  FormData = require("form-data"),
  SyncRequest = require("sync-request");
let notifyStr = "";
var userToken = undefined;
(async () => {
  checkVersion("hzh.js", "bae990de2f8a47da70e954eacadaffee");
  const _0x95b2c1 = process.env.hzh_url;
  if (!_0x95b2c1) {
    logAndNotify("请设置 hzh_url");
    return;
  }
  let _0x65da50 = _0x95b2c1.split("\n");
  for (let _0x55e960 = 0; _0x55e960 < _0x65da50.length; _0x55e960++) {
    const _0x5140d1 = _0x65da50[_0x55e960],
      _0x5a2515 = _0x5140d1.match(/miniUuid=(\d+)/);
    if (_0x5a2515) {
      const _0x46b4fe = _0x5a2515[1];
      _0x46b4fe && logAndNotify("🧐" + _0x46b4fe + "🧐");
    }
    let _0x5a11d7 = getInstance();
    userToken = undefined;
    userToken = getParameterByName(_0x5140d1, "sk");
    const _0x205a57 = await _0x5a11d7.get(_0x5140d1);
    if (_0x205a57.status !== 200) {
      logAndNotify("账号【" + (_0x55e960 + 1) + "】 url失效");
      continue;
    }
    const _0x4cab37 = await _0x5a11d7.get("https://hweb-mbf.huazhu.com/api/singInIndex");
    if (_0x4cab37.data.businessCode !== "1000") {
      logAndNotify("账号【" + (_0x55e960 + 1) + "】 url失效 singInfoResp");
      continue;
    }
    logAndNotify("账号【" + (_0x55e960 + 1) + "】 累计签到【" + _0x4cab37.data.content.signInCount + "】天");
    let _0x148007 = [];
    for (const _0x54d174 in _0x4cab37.data.content.signInfos) {
      const _0x20a676 = _0x4cab37.data.content.signInfos[_0x54d174];
      if (_0x20a676.time === _0x4cab37.data.content.today) {
        if (_0x20a676.isSign) {
          logAndNotify("账号【" + (_0x55e960 + 1) + "】 今日已签到");
        } else {
          const _0x166f38 = new FormData();
          _0x166f38.append("state", 1);
          _0x166f38.append("day", new Date().getDate());
          const _0x3f5eaa = await _0x5a11d7.post("https://hweb-mbf.huazhu.com/api/signIn", _0x166f38, {
            headers: {
              ..._0x166f38.getHeaders()
            }
          });
          if (_0x3f5eaa.data.businessCode !== "1000") {
            const _0x50ca72 = JSON.stringify(_0x3f5eaa.data);
            logAndNotify("账号【" + (_0x55e960 + 1) + "】 签到失败：【" + _0x50ca72 + "】");
          } else {
            logAndNotify("账号【" + (_0x55e960 + 1) + "】 签到成功");
          }
        }
        break;
      } else {
        !_0x20a676.isSign && _0x148007.push(_0x20a676.time);
      }
    }
    _0x148007.length > 0 ? logAndNotify("账号【" + (_0x55e960 + 1) + "】 本周未签到【" + _0x148007 + "】") : logAndNotify("账号【" + (_0x55e960 + 1) + "】 本周都已签到");
    const _0x59fb44 = await _0x5a11d7.post("https://hweb-mbf.huazhu.com/api/getPoint");
    if (_0x59fb44.data.businessCode !== "1000") {
      logAndNotify("账号【" + (_0x55e960 + 1) + "】 积分查询失败：【" + _0x59fb44.data + "】");
      continue;
    }
    logAndNotify("账号【" + (_0x55e960 + 1) + "】 积分查询成功：【" + _0x59fb44.data.content.point + "】");
  }
})().catch(_0x20ba21 => {
  logAndNotify(_0x20ba21);
}).finally(() => {
  sendNotify("华住会", notifyStr);
  $.done();
});
function logAndNotify(_0x124455) {
  $.log(_0x124455);
  notifyStr += _0x124455;
  notifyStr += "\n";
}
function getParameterByName(_0x4451a0, _0x55dd41) {
  const _0x554114 = decodeURIComponent(_0x4451a0),
    _0x4abac9 = new RegExp("[?&]" + _0x55dd41 + "=([^&#]*)"),
    _0x25a4f7 = _0x4abac9.exec(_0x554114);
  return _0x25a4f7 ? _0x25a4f7[1] : null;
}
var headersTemp = {
  "content-type": "application/json",
  "Client-Platform": "WX-MP",
  "Accept-Encoding": "gzip,compress,br,deflate",
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003130) NetType/WIFI Language/zh_CN",
  Referer: "https://servicewechat.com/wx286efc12868f2559/489/page-frame.html",
  version: "",
  "User-Token": "" + userToken
};
function sendPostRequest(_0x51dc23, _0x51be41, _0x2be572) {
  let _0x10515f = {};
  _0x51be41 ? _0x10515f = {
    ...headersTemp,
    ...{
      sId: "" + _0x51be41
    }
  } : _0x10515f = headersTemp;
  const _0x20372a = axios.create({
    headers: _0x10515f
  });
  return _0x20372a.post(_0x51dc23, _0x2be572);
}
function getInstance() {
  const _0x5ef165 = new tough.CookieJar();
  return wrapper(axios.create({
    jar: _0x5ef165,
    withCredentials: true,
    maxRedirects: 5
  }));
}
function Env(_0x40f161, _0x1bc605) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0x417369 {
    constructor(_0x17074b) {
      this.env = _0x17074b;
    }
    send(_0x39d32c, _0x18b34c = "GET") {
      _0x39d32c = "string" == typeof _0x39d32c ? {
        url: _0x39d32c
      } : _0x39d32c;
      let _0x333cba = this.get;
      "POST" === _0x18b34c && (_0x333cba = this.post);
      return new Promise((_0x1f4ea7, _0x12620c) => {
        _0x333cba.call(this, _0x39d32c, (_0x4db71c, _0x4ec39a, _0x42028a) => {
          _0x4db71c ? _0x12620c(_0x4db71c) : _0x1f4ea7(_0x4ec39a);
        });
      });
    }
    get(_0x50fc21) {
      return this.send.call(this.env, _0x50fc21);
    }
    post(_0x51a9de) {
      return this.send.call(this.env, _0x51a9de, "POST");
    }
  }
  return new class {
    constructor(_0x57df66, _0xaf04ca) {
      this.name = _0x57df66;
      this.http = new _0x417369(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0xaf04ca);
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
    toObj(_0x2a68d3, _0x574108 = null) {
      try {
        return JSON.parse(_0x2a68d3);
      } catch {
        return _0x574108;
      }
    }
    toStr(_0x4fd640, _0x395099 = null) {
      try {
        return JSON.stringify(_0x4fd640);
      } catch {
        return _0x395099;
      }
    }
    getjson(_0x512753, _0x35f838) {
      let _0x352e27 = _0x35f838;
      const _0x39a035 = this.getdata(_0x512753);
      if (_0x39a035) {
        try {
          _0x352e27 = JSON.parse(this.getdata(_0x512753));
        } catch {}
      }
      return _0x352e27;
    }
    setjson(_0x4191e5, _0xe548ab) {
      try {
        return this.setdata(JSON.stringify(_0x4191e5), _0xe548ab);
      } catch {
        return !1;
      }
    }
    getScript(_0x4adb46) {
      return new Promise(_0x5deef4 => {
        this.get({
          url: _0x4adb46
        }, (_0x2d679f, _0xe81802, _0x434b5d) => _0x5deef4(_0x434b5d));
      });
    }
    runScript(_0x235828, _0x2a3e0a) {
      return new Promise(_0x596c8e => {
        let _0x3fcac9 = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0x3fcac9 = _0x3fcac9 ? _0x3fcac9.replace(/\n/g, "").trim() : _0x3fcac9;
        let _0x372c2c = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x372c2c = _0x372c2c ? 1 * _0x372c2c : 20;
        _0x372c2c = _0x2a3e0a && _0x2a3e0a.timeout ? _0x2a3e0a.timeout : _0x372c2c;
        const [_0x6b265f, _0x3b3ad4] = _0x3fcac9.split("@"),
          _0x381746 = {
            url: "http://" + _0x3b3ad4 + "/v1/scripting/evaluate",
            body: {
              script_text: _0x235828,
              mock_type: "cron",
              timeout: _0x372c2c
            },
            headers: {
              "X-Key": _0x6b265f,
              Accept: "*/*"
            }
          };
        this.post(_0x381746, (_0x200c45, _0x5f4c5b, _0x2e2d03) => _0x596c8e(_0x2e2d03));
      }).catch(_0x2242c0 => this.logErr(_0x2242c0));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x67a39c = this.path.resolve(this.dataFile),
          _0x23bfda = this.path.resolve(process.cwd(), this.dataFile),
          _0x10311b = this.fs.existsSync(_0x67a39c),
          _0x492b1d = !_0x10311b && this.fs.existsSync(_0x23bfda);
        if (!_0x10311b && !_0x492b1d) {
          return {};
        }
        {
          const _0x58ef2f = _0x10311b ? _0x67a39c : _0x23bfda;
          try {
            return JSON.parse(this.fs.readFileSync(_0x58ef2f));
          } catch (_0x3c09eb) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x5483e5 = this.path.resolve(this.dataFile),
          _0xa817d0 = this.path.resolve(process.cwd(), this.dataFile),
          _0x139a05 = this.fs.existsSync(_0x5483e5),
          _0x3ba1d9 = !_0x139a05 && this.fs.existsSync(_0xa817d0),
          _0x2fcb56 = JSON.stringify(this.data);
        _0x139a05 ? this.fs.writeFileSync(_0x5483e5, _0x2fcb56) : _0x3ba1d9 ? this.fs.writeFileSync(_0xa817d0, _0x2fcb56) : this.fs.writeFileSync(_0x5483e5, _0x2fcb56);
      }
    }
    lodash_get(_0x12c913, _0x5a49e8, _0x9a7b96) {
      const _0x4a9959 = _0x5a49e8.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0x7ccedb = _0x12c913;
      for (const _0x1e5609 of _0x4a9959) if (_0x7ccedb = Object(_0x7ccedb)[_0x1e5609], void 0 === _0x7ccedb) {
        return _0x9a7b96;
      }
      return _0x7ccedb;
    }
    lodash_set(_0x1f39f0, _0x2f982d, _0x40721f) {
      return Object(_0x1f39f0) !== _0x1f39f0 ? _0x1f39f0 : (Array.isArray(_0x2f982d) || (_0x2f982d = _0x2f982d.toString().match(/[^.[\]]+/g) || []), _0x2f982d.slice(0, -1).reduce((_0x1d5b77, _0x21af4f, _0x2d25a2) => Object(_0x1d5b77[_0x21af4f]) === _0x1d5b77[_0x21af4f] ? _0x1d5b77[_0x21af4f] : _0x1d5b77[_0x21af4f] = Math.abs(_0x2f982d[_0x2d25a2 + 1]) >> 0 == +_0x2f982d[_0x2d25a2 + 1] ? [] : {}, _0x1f39f0)[_0x2f982d[_0x2f982d.length - 1]] = _0x40721f, _0x1f39f0);
    }
    getdata(_0x43e258) {
      let _0x1815ca = this.getval(_0x43e258);
      if (/^@/.test(_0x43e258)) {
        const [, _0x56edea, _0x263cca] = /^@(.*?)\.(.*?)$/.exec(_0x43e258),
          _0x2ab945 = _0x56edea ? this.getval(_0x56edea) : "";
        if (_0x2ab945) {
          try {
            const _0x2044ef = JSON.parse(_0x2ab945);
            _0x1815ca = _0x2044ef ? this.lodash_get(_0x2044ef, _0x263cca, "") : _0x1815ca;
          } catch (_0x3249dc) {
            _0x1815ca = "";
          }
        }
      }
      return _0x1815ca;
    }
    setdata(_0x53d86c, _0x3e1cd2) {
      let _0x310152 = !1;
      if (/^@/.test(_0x3e1cd2)) {
        const [, _0x44dd52, _0x565ce1] = /^@(.*?)\.(.*?)$/.exec(_0x3e1cd2),
          _0x5ad1fe = this.getval(_0x44dd52),
          _0x56e8a0 = _0x44dd52 ? "null" === _0x5ad1fe ? null : _0x5ad1fe || "{}" : "{}";
        try {
          const _0x210053 = JSON.parse(_0x56e8a0);
          this.lodash_set(_0x210053, _0x565ce1, _0x53d86c);
          _0x310152 = this.setval(JSON.stringify(_0x210053), _0x44dd52);
        } catch (_0x46afe5) {
          const _0x357b0e = {};
          this.lodash_set(_0x357b0e, _0x565ce1, _0x53d86c);
          _0x310152 = this.setval(JSON.stringify(_0x357b0e), _0x44dd52);
        }
      } else {
        _0x310152 = this.setval(_0x53d86c, _0x3e1cd2);
      }
      return _0x310152;
    }
    getval(_0x472804) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x472804) : this.isQuanX() ? $prefs.valueForKey(_0x472804) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x472804]) : this.data && this.data[_0x472804] || null;
    }
    setval(_0x1ed43e, _0x708077) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0x1ed43e, _0x708077) : this.isQuanX() ? $prefs.setValueForKey(_0x1ed43e, _0x708077) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x708077] = _0x1ed43e, this.writedata(), !0) : this.data && this.data[_0x708077] || null;
    }
    initGotEnv(_0x273415) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x273415 && (_0x273415.headers = _0x273415.headers ? _0x273415.headers : {}, void 0 === _0x273415.headers.Cookie && void 0 === _0x273415.cookieJar && (_0x273415.cookieJar = this.ckjar));
    }
    get(_0x546663, _0x4270fd = () => {}) {
      _0x546663.headers && (delete _0x546663.headers["Content-Type"], delete _0x546663.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x546663.headers = _0x546663.headers || {}, Object.assign(_0x546663.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x546663, (_0x455cd4, _0x1ced75, _0x4ea574) => {
        !_0x455cd4 && _0x1ced75 && (_0x1ced75.body = _0x4ea574, _0x1ced75.statusCode = _0x1ced75.status);
        _0x4270fd(_0x455cd4, _0x1ced75, _0x4ea574);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x546663.opts = _0x546663.opts || {}, Object.assign(_0x546663.opts, {
        hints: !1
      })), $task.fetch(_0x546663).then(_0x3de283 => {
        const {
          statusCode: _0x69e876,
          statusCode: _0x596896,
          headers: _0x52613c,
          body: _0x5c3e37
        } = _0x3de283;
        _0x4270fd(null, {
          status: _0x69e876,
          statusCode: _0x596896,
          headers: _0x52613c,
          body: _0x5c3e37
        }, _0x5c3e37);
      }, _0xd25d06 => _0x4270fd(_0xd25d06))) : this.isNode() && (this.initGotEnv(_0x546663), this.got(_0x546663).on("redirect", (_0xd64eaa, _0x8cae3b) => {
        try {
          if (_0xd64eaa.headers["set-cookie"]) {
            const _0x43bb49 = _0xd64eaa.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x43bb49 && this.ckjar.setCookieSync(_0x43bb49, null);
            _0x8cae3b.cookieJar = this.ckjar;
          }
        } catch (_0x471114) {
          this.logErr(_0x471114);
        }
      }).then(_0x514793 => {
        const {
          statusCode: _0x17dd88,
          statusCode: _0x48a384,
          headers: _0x35b0a6,
          body: _0xe891b6
        } = _0x514793;
        _0x4270fd(null, {
          status: _0x17dd88,
          statusCode: _0x48a384,
          headers: _0x35b0a6,
          body: _0xe891b6
        }, _0xe891b6);
      }, _0x5d7c73 => {
        const {
          message: _0xdf062,
          response: _0x3a99f5
        } = _0x5d7c73;
        _0x4270fd(_0xdf062, _0x3a99f5, _0x3a99f5 && _0x3a99f5.body);
      }));
    }
    post(_0x4b4153, _0x8d4e0e = () => {}) {
      if (_0x4b4153.body && _0x4b4153.headers && !_0x4b4153.headers["Content-Type"] && (_0x4b4153.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x4b4153.headers && delete _0x4b4153.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x4b4153.headers = _0x4b4153.headers || {}, Object.assign(_0x4b4153.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x4b4153, (_0x3e41f2, _0x5572d8, _0x153539) => {
          !_0x3e41f2 && _0x5572d8 && (_0x5572d8.body = _0x153539, _0x5572d8.statusCode = _0x5572d8.status);
          _0x8d4e0e(_0x3e41f2, _0x5572d8, _0x153539);
        });
      } else {
        if (this.isQuanX()) {
          _0x4b4153.method = "POST";
          this.isNeedRewrite && (_0x4b4153.opts = _0x4b4153.opts || {}, Object.assign(_0x4b4153.opts, {
            hints: !1
          }));
          $task.fetch(_0x4b4153).then(_0x1d6db3 => {
            const {
              statusCode: _0x59307d,
              statusCode: _0x10aa66,
              headers: _0xec228c,
              body: _0x3f9c46
            } = _0x1d6db3;
            _0x8d4e0e(null, {
              status: _0x59307d,
              statusCode: _0x10aa66,
              headers: _0xec228c,
              body: _0x3f9c46
            }, _0x3f9c46);
          }, _0x35164e => _0x8d4e0e(_0x35164e));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x4b4153);
            const {
              url: _0x51c737,
              ..._0x4df3b4
            } = _0x4b4153;
            this.got.post(_0x51c737, _0x4df3b4).then(_0x3ea5b2 => {
              const {
                statusCode: _0x3827f3,
                statusCode: _0x17c6b9,
                headers: _0xb5f93e,
                body: _0x4ad4cb
              } = _0x3ea5b2;
              _0x8d4e0e(null, {
                status: _0x3827f3,
                statusCode: _0x17c6b9,
                headers: _0xb5f93e,
                body: _0x4ad4cb
              }, _0x4ad4cb);
            }, _0x117ad0 => {
              const {
                message: _0x1420f6,
                response: _0x2bcbba
              } = _0x117ad0;
              _0x8d4e0e(_0x1420f6, _0x2bcbba, _0x2bcbba && _0x2bcbba.body);
            });
          }
        }
      }
    }
    time(_0x2811d3, _0x168609 = null) {
      const _0x4ecf5d = _0x168609 ? new Date(_0x168609) : new Date();
      let _0x16f265 = {
        "M+": _0x4ecf5d.getMonth() + 1,
        "d+": _0x4ecf5d.getDate(),
        "H+": _0x4ecf5d.getHours(),
        "m+": _0x4ecf5d.getMinutes(),
        "s+": _0x4ecf5d.getSeconds(),
        "q+": Math.floor((_0x4ecf5d.getMonth() + 3) / 3),
        S: _0x4ecf5d.getMilliseconds()
      };
      /(y+)/.test(_0x2811d3) && (_0x2811d3 = _0x2811d3.replace(RegExp.$1, (_0x4ecf5d.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0xee28db in _0x16f265) new RegExp("(" + _0xee28db + ")").test(_0x2811d3) && (_0x2811d3 = _0x2811d3.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x16f265[_0xee28db] : ("00" + _0x16f265[_0xee28db]).substr(("" + _0x16f265[_0xee28db]).length)));
      return _0x2811d3;
    }
    msg(_0x9b9a6a = _0x40f161, _0x4f8afd = "", _0x46bf39 = "", _0x144314) {
      const _0x1b92e6 = _0x2b3296 => {
        if (!_0x2b3296) {
          return _0x2b3296;
        }
        if ("string" == typeof _0x2b3296) {
          return this.isLoon() ? _0x2b3296 : this.isQuanX() ? {
            "open-url": _0x2b3296
          } : this.isSurge() ? {
            url: _0x2b3296
          } : void 0;
        }
        if ("object" == typeof _0x2b3296) {
          if (this.isLoon()) {
            let _0x2326b1 = _0x2b3296.openUrl || _0x2b3296.url || _0x2b3296["open-url"],
              _0x189479 = _0x2b3296.mediaUrl || _0x2b3296["media-url"];
            return {
              openUrl: _0x2326b1,
              mediaUrl: _0x189479
            };
          }
          if (this.isQuanX()) {
            let _0x481705 = _0x2b3296["open-url"] || _0x2b3296.url || _0x2b3296.openUrl,
              _0x3f1cc7 = _0x2b3296["media-url"] || _0x2b3296.mediaUrl;
            return {
              "open-url": _0x481705,
              "media-url": _0x3f1cc7
            };
          }
          if (this.isSurge()) {
            let _0x47fbd0 = _0x2b3296.url || _0x2b3296.openUrl || _0x2b3296["open-url"];
            return {
              url: _0x47fbd0
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x9b9a6a, _0x4f8afd, _0x46bf39, _0x1b92e6(_0x144314)) : this.isQuanX() && $notify(_0x9b9a6a, _0x4f8afd, _0x46bf39, _0x1b92e6(_0x144314))), !this.isMuteLog) {
        let _0x101ff4 = ["", "==============📣系统通知📣=============="];
        _0x101ff4.push(_0x9b9a6a);
        _0x4f8afd && _0x101ff4.push(_0x4f8afd);
        _0x46bf39 && _0x101ff4.push(_0x46bf39);
        console.log(_0x101ff4.join("\n"));
        this.logs = this.logs.concat(_0x101ff4);
      }
    }
    log(..._0x3f1083) {
      _0x3f1083.length > 0 && (this.logs = [...this.logs, ..._0x3f1083]);
      console.log(_0x3f1083.join(this.logSeparator));
    }
    logErr(_0x5b09a1, _0x2412e9) {
      const _0x34f431 = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0x34f431 ? this.log("", "❗️" + this.name + ", 错误!", _0x5b09a1.stack) : this.log("", "❗️" + this.name + ", 错误!", _0x5b09a1);
    }
    wait(_0x2f5fa0) {
      return new Promise(_0x3e0036 => setTimeout(_0x3e0036, _0x2f5fa0));
    }
    done(_0x53bce9 = {}) {
      const _0x49d4d7 = new Date().getTime(),
        _0x1e5f8e = (_0x49d4d7 - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0x1e5f8e + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x53bce9);
    }
  }(_0x40f161, _0x1bc605);
}
function checkVersion(_0xa2d340, _0x10619d) {
  try {
    logAndNotify("文件md5：" + _0x10619d);
    const _0x16de5e = SyncRequest("GET", "https://checktoke.filegear-sg.me/api/update/check?fileName=" + _0xa2d340 + "&fileMd5=" + _0x10619d),
      _0x1570a = JSON.parse(_0x16de5e.getBody("utf8"));
    if (_0x1570a.code === 301) {
      process.exit(0);
    } else {
      logAndNotify(_0x1570a.data);
    }
  } catch (_0x1617b2) {
    logAndNotify("版本检查失败:", _0x1617b2);
  }
}