/**
 * 东呈会
 * 特别注意 需要添加linux依赖：chromium
 * 小程序：东呈酒店预定城市便捷宜尚怡程
 * 路径：首页 签到/任务 抓点击时完整的url 例：https://campaign.dossen.com/taskcenter/taskIndex?**********
 * 多个换行
 * export dch_url="url"
 * 如果运行报错executablePath，需要手动指定 export chrome_path="" 默认为/usr/bin/chromium-browser
 * 定时规则
 * cron: 0 5 * * *
 * const $ = new Env('东呈会');
 */
const $ = new Env("东呈会"),
  axios = require("axios"),
  {
    wrapper
  } = require("axios-cookiejar-support"),
  tough = require("tough-cookie"),
  {
    sendNotify
  } = require("./sendNotify"),
  puppeteer = require("puppeteer-core"),
  SyncRequest = require("sync-request");
let notifyStr = "";
var headersUrl = undefined,
  chrome_path = process.env.chrome_path;
(async () => {
  checkVersion("dch.js", "78f61d8e68a46333c137d94e0ebd065e");
  const _0x307f5c = process.env.dch_url;
  if (!_0x307f5c) {
    logAndNotify("请设置 dch_url");
    return;
  }
  if (!chrome_path) {
    logAndNotify("使用默认的chrome_path /usr/bin/chromium-browser");
    chrome_path = "/usr/bin/chromium-browser";
  }
  let _0x290e19 = _0x307f5c.split("\n");
  for (let _0x2045ba = 0; _0x2045ba < _0x290e19.length; _0x2045ba++) {
    const _0x5731b5 = _0x290e19[_0x2045ba];
    headersUrl = _0x5731b5;
    let _0x2c4301 = await getInstance(await getPuppeteer(_0x5731b5)),
      _0x352684 = await _0x2c4301.get("https://selling-activity-query.dossen.com/selling/task/center/init");
    if (_0x352684.data.code !== 0 || !_0x352684.data.results.hasLogin) {
      logAndNotify("账号【" + (_0x2045ba + 1) + "】 登录出错☹：【" + _0x352684.data.message + "]");
      continue;
    }
    let _0x53a2b3 = await _0x2c4301.get("https://selling-activity-query.dossen.com/selling/task/group/list?pageIndex=1&pageSize=10");
    if (_0x53a2b3.data.code !== 0) {
      logAndNotify("账号【" + (_0x2045ba + 1) + "】 查询任务列表出错：【" + _0x53a2b3.data.message + "]");
    } else {
      const _0x5db66a = _0x53a2b3.data.results.content;
      for (let _0x4ccd0f = 0; _0x4ccd0f < _0x5db66a.length; _0x4ccd0f++) {
        const _0x29dab2 = _0x5db66a[_0x4ccd0f];
        if (_0x29dab2.title === "签到赚积分" && !_0x29dab2.ukey) {
          let _0x3ffd8c = await _0x2c4301.get("https://campaignapi.dossen.com/selling/task/group/get?taskGroupCode=ee15ec6eaf93412381794fccf4fb7a1a&blackbox=pWPHv1721971460eBC7l9sdrjf");
          if (_0x3ffd8c.data.code !== 0) {
            logAndNotify("账号【" + (_0x2045ba + 1) + "】 自动领取签到任务出错：【" + _0x3ffd8c.data.message + "]");
          } else {
            logAndNotify("账号【" + (_0x2045ba + 1) + "】 自动领取签到任务");
          }
        } else {
          _0x29dab2.title === "签到赚积分" && _0x29dab2.ukey && logAndNotify("账号【" + (_0x2045ba + 1) + "】 已经领取过签到任务");
        }
      }
    }
    const _0x268f80 = _0x352684.data.results.dayOfWeek;
    for (const _0x1c4255 of _0x352684.data.results.baseTaskList) {
      if (_0x1c4255.dayOfWeek === _0x268f80) {
        if (_0x1c4255.hasCheckin) {
          logAndNotify("账号【" + (_0x2045ba + 1) + "】 已签到过了");
        } else {
          let _0x426002 = await _0x2c4301.get("https://campaignapi.dossen.com/selling/checkin/do?blackbox=qWPHf1721963183JAQUvcMb9t0&title=%E4%BB%BB%E5%8A%A1%E4%B8%AD%E5%BF%83&distinctId=604319816723208439&referrer=&isLogin=true");
          if (_0x426002.data.code !== 0) {
            logAndNotify("账号【" + (_0x2045ba + 1) + "】 签到出错：【" + _0x426002.data.message + "]");
            continue;
          }
          logAndNotify("账号【" + (_0x2045ba + 1) + "】 签到成功 获得积分【" + _0x426002.data.results + "】");
        }
      }
    }
    _0x352684 = await _0x2c4301.get("https://selling-activity-query.dossen.com/selling/task/center/init");
    if (_0x352684.data.code !== 0) {
      logAndNotify("账号【" + (_0x2045ba + 1) + "】 init出错：【" + _0x352684.data.message + "]");
      continue;
    }
    logAndNotify("账号【" + (_0x2045ba + 1) + "】 积分：【" + _0x352684.data.results.point + "】");
  }
})().catch(_0x180014 => {
  logAndNotify(_0x180014);
}).finally(() => {
  sendNotify("东呈会", notifyStr);
  $.done();
});
function logAndNotify(_0x2d0e9a) {
  $.log(_0x2d0e9a);
  notifyStr += _0x2d0e9a;
  notifyStr += "\n";
}
var headersTemp = {
  "content-type": "application/json",
  "Accept-Encoding": "gzip,compress,br,deflate",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Referer: "" + headersUrl
};
function sendPostRequest(_0x282a8a, _0x5c12b4, _0x59c9f4) {
  let _0x3dcf93 = {};
  _0x5c12b4 ? _0x3dcf93 = {
    ...headersTemp,
    ...{
      sId: "" + _0x5c12b4
    }
  } : _0x3dcf93 = headersTemp;
  const _0x4835a7 = axios.create({
    headers: _0x3dcf93
  });
  return _0x4835a7.post(_0x282a8a, _0x59c9f4);
}
async function getPuppeteer(_0x7fde9d) {
  const _0x37957b = await puppeteer.launch({
      executablePath: chrome_path,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }),
    _0x530e86 = await _0x37957b.newPage();
  await _0x530e86.goto(_0x7fde9d, {
    waitUntil: "networkidle0"
  });
  const _0x1a9350 = await _0x530e86.cookies();
  await _0x37957b.close();
  return _0x1a9350;
}
async function getInstance(_0x5c20c9) {
  const _0x35cba2 = new tough.CookieJar();
  _0x5c20c9.forEach(_0x18877c => {
    const _0x4a2da3 = new tough.Cookie({
      key: _0x18877c.name,
      value: _0x18877c.value,
      domain: _0x18877c.domain,
      path: _0x18877c.path,
      secure: _0x18877c.secure,
      httpOnly: _0x18877c.httpOnly,
      expires: _0x18877c.expires ? new Date(_0x18877c.expires * 1000) : null
    });
    _0x35cba2.setCookieSync(_0x4a2da3, "https://" + _0x18877c.domain + _0x18877c.path);
  });
  const _0x5c0311 = _0x5c20c9.map(_0x52055a => _0x52055a.name + "=" + _0x52055a.value).join("; ");
  return wrapper(axios.create({
    jar: _0x35cba2,
    withCredentials: true,
    maxRedirects: 5,
    headers: {
      ...headersTemp,
      Cookie: _0x5c0311
    }
  }));
}
function Env(_0x154a4e, _0x298c22) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0x30052c {
    constructor(_0x5687d6) {
      this.env = _0x5687d6;
    }
    send(_0x18998b, _0x1c38db = "GET") {
      _0x18998b = "string" == typeof _0x18998b ? {
        url: _0x18998b
      } : _0x18998b;
      let _0xf2c608 = this.get;
      "POST" === _0x1c38db && (_0xf2c608 = this.post);
      return new Promise((_0xcbea98, _0x269692) => {
        _0xf2c608.call(this, _0x18998b, (_0x28073f, _0x2ec250, _0x780bff) => {
          _0x28073f ? _0x269692(_0x28073f) : _0xcbea98(_0x2ec250);
        });
      });
    }
    get(_0x166abe) {
      return this.send.call(this.env, _0x166abe);
    }
    post(_0x14f35b) {
      return this.send.call(this.env, _0x14f35b, "POST");
    }
  }
  return new class {
    constructor(_0x292fb4, _0x144946) {
      this.name = _0x292fb4;
      this.http = new _0x30052c(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0x144946);
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
    toObj(_0x54fbdc, _0x46d4d7 = null) {
      try {
        return JSON.parse(_0x54fbdc);
      } catch {
        return _0x46d4d7;
      }
    }
    toStr(_0x2c6f62, _0x54a7f2 = null) {
      try {
        return JSON.stringify(_0x2c6f62);
      } catch {
        return _0x54a7f2;
      }
    }
    getjson(_0x488474, _0x1cf49a) {
      let _0x31c707 = _0x1cf49a;
      const _0x20bec0 = this.getdata(_0x488474);
      if (_0x20bec0) {
        try {
          _0x31c707 = JSON.parse(this.getdata(_0x488474));
        } catch {}
      }
      return _0x31c707;
    }
    setjson(_0x2fd84d, _0x1bbffc) {
      try {
        return this.setdata(JSON.stringify(_0x2fd84d), _0x1bbffc);
      } catch {
        return !1;
      }
    }
    getScript(_0x26d9f6) {
      return new Promise(_0x24be72 => {
        this.get({
          url: _0x26d9f6
        }, (_0x8854, _0x222e87, _0x245817) => _0x24be72(_0x245817));
      });
    }
    runScript(_0x245080, _0x2f5a87) {
      return new Promise(_0x2fd38a => {
        let _0xcf2928 = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0xcf2928 = _0xcf2928 ? _0xcf2928.replace(/\n/g, "").trim() : _0xcf2928;
        let _0x4c5673 = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x4c5673 = _0x4c5673 ? 1 * _0x4c5673 : 20;
        _0x4c5673 = _0x2f5a87 && _0x2f5a87.timeout ? _0x2f5a87.timeout : _0x4c5673;
        const [_0x49cf8d, _0x1c8abb] = _0xcf2928.split("@"),
          _0x5ab3ab = {
            url: "http://" + _0x1c8abb + "/v1/scripting/evaluate",
            body: {
              script_text: _0x245080,
              mock_type: "cron",
              timeout: _0x4c5673
            },
            headers: {
              "X-Key": _0x49cf8d,
              Accept: "*/*"
            }
          };
        this.post(_0x5ab3ab, (_0x35b283, _0x5730ac, _0x14ffab) => _0x2fd38a(_0x14ffab));
      }).catch(_0x45ae16 => this.logErr(_0x45ae16));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x33f51f = this.path.resolve(this.dataFile),
          _0x68c74c = this.path.resolve(process.cwd(), this.dataFile),
          _0x52e404 = this.fs.existsSync(_0x33f51f),
          _0x235ef2 = !_0x52e404 && this.fs.existsSync(_0x68c74c);
        if (!_0x52e404 && !_0x235ef2) {
          return {};
        }
        {
          const _0x2501ad = _0x52e404 ? _0x33f51f : _0x68c74c;
          try {
            return JSON.parse(this.fs.readFileSync(_0x2501ad));
          } catch (_0x10d2a1) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x2e6f54 = this.path.resolve(this.dataFile),
          _0xfb33d9 = this.path.resolve(process.cwd(), this.dataFile),
          _0x342bab = this.fs.existsSync(_0x2e6f54),
          _0x1cb3dd = !_0x342bab && this.fs.existsSync(_0xfb33d9),
          _0x7cd511 = JSON.stringify(this.data);
        _0x342bab ? this.fs.writeFileSync(_0x2e6f54, _0x7cd511) : _0x1cb3dd ? this.fs.writeFileSync(_0xfb33d9, _0x7cd511) : this.fs.writeFileSync(_0x2e6f54, _0x7cd511);
      }
    }
    lodash_get(_0x21a8d6, _0x198fc9, _0x1f9ebf) {
      const _0x3fa65d = _0x198fc9.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0x123131 = _0x21a8d6;
      for (const _0x2f4a97 of _0x3fa65d) if (_0x123131 = Object(_0x123131)[_0x2f4a97], void 0 === _0x123131) {
        return _0x1f9ebf;
      }
      return _0x123131;
    }
    lodash_set(_0x354784, _0x10da57, _0x385aae) {
      return Object(_0x354784) !== _0x354784 ? _0x354784 : (Array.isArray(_0x10da57) || (_0x10da57 = _0x10da57.toString().match(/[^.[\]]+/g) || []), _0x10da57.slice(0, -1).reduce((_0x5df262, _0x16f4f8, _0x832950) => Object(_0x5df262[_0x16f4f8]) === _0x5df262[_0x16f4f8] ? _0x5df262[_0x16f4f8] : _0x5df262[_0x16f4f8] = Math.abs(_0x10da57[_0x832950 + 1]) >> 0 == +_0x10da57[_0x832950 + 1] ? [] : {}, _0x354784)[_0x10da57[_0x10da57.length - 1]] = _0x385aae, _0x354784);
    }
    getdata(_0x5c2d49) {
      let _0x55cb44 = this.getval(_0x5c2d49);
      if (/^@/.test(_0x5c2d49)) {
        const [, _0x5b501e, _0x3ab33c] = /^@(.*?)\.(.*?)$/.exec(_0x5c2d49),
          _0x494cf0 = _0x5b501e ? this.getval(_0x5b501e) : "";
        if (_0x494cf0) {
          try {
            const _0x29bc17 = JSON.parse(_0x494cf0);
            _0x55cb44 = _0x29bc17 ? this.lodash_get(_0x29bc17, _0x3ab33c, "") : _0x55cb44;
          } catch (_0x25a94f) {
            _0x55cb44 = "";
          }
        }
      }
      return _0x55cb44;
    }
    setdata(_0x3b0169, _0x1a4d71) {
      let _0x19badd = !1;
      if (/^@/.test(_0x1a4d71)) {
        const [, _0x493f12, _0x4d6d95] = /^@(.*?)\.(.*?)$/.exec(_0x1a4d71),
          _0x1ebc8d = this.getval(_0x493f12),
          _0x43f780 = _0x493f12 ? "null" === _0x1ebc8d ? null : _0x1ebc8d || "{}" : "{}";
        try {
          const _0x149301 = JSON.parse(_0x43f780);
          this.lodash_set(_0x149301, _0x4d6d95, _0x3b0169);
          _0x19badd = this.setval(JSON.stringify(_0x149301), _0x493f12);
        } catch (_0x289493) {
          const _0x2cf0b8 = {};
          this.lodash_set(_0x2cf0b8, _0x4d6d95, _0x3b0169);
          _0x19badd = this.setval(JSON.stringify(_0x2cf0b8), _0x493f12);
        }
      } else {
        _0x19badd = this.setval(_0x3b0169, _0x1a4d71);
      }
      return _0x19badd;
    }
    getval(_0x5090dd) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0x5090dd) : this.isQuanX() ? $prefs.valueForKey(_0x5090dd) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x5090dd]) : this.data && this.data[_0x5090dd] || null;
    }
    setval(_0x1cda93, _0xbc5d93) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0x1cda93, _0xbc5d93) : this.isQuanX() ? $prefs.setValueForKey(_0x1cda93, _0xbc5d93) : this.isNode() ? (this.data = this.loaddata(), this.data[_0xbc5d93] = _0x1cda93, this.writedata(), !0) : this.data && this.data[_0xbc5d93] || null;
    }
    initGotEnv(_0x269e90) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x269e90 && (_0x269e90.headers = _0x269e90.headers ? _0x269e90.headers : {}, void 0 === _0x269e90.headers.Cookie && void 0 === _0x269e90.cookieJar && (_0x269e90.cookieJar = this.ckjar));
    }
    get(_0x222112, _0x178fc9 = () => {}) {
      _0x222112.headers && (delete _0x222112.headers["Content-Type"], delete _0x222112.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x222112.headers = _0x222112.headers || {}, Object.assign(_0x222112.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x222112, (_0x2c716d, _0x1562af, _0x4f2d6d) => {
        !_0x2c716d && _0x1562af && (_0x1562af.body = _0x4f2d6d, _0x1562af.statusCode = _0x1562af.status);
        _0x178fc9(_0x2c716d, _0x1562af, _0x4f2d6d);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x222112.opts = _0x222112.opts || {}, Object.assign(_0x222112.opts, {
        hints: !1
      })), $task.fetch(_0x222112).then(_0x4fbe40 => {
        const {
          statusCode: _0x5cda61,
          statusCode: _0x260fdb,
          headers: _0x1bd27b,
          body: _0x1ae4b7
        } = _0x4fbe40;
        _0x178fc9(null, {
          status: _0x5cda61,
          statusCode: _0x260fdb,
          headers: _0x1bd27b,
          body: _0x1ae4b7
        }, _0x1ae4b7);
      }, _0x54aa13 => _0x178fc9(_0x54aa13))) : this.isNode() && (this.initGotEnv(_0x222112), this.got(_0x222112).on("redirect", (_0x5ee080, _0x3cd57b) => {
        try {
          if (_0x5ee080.headers["set-cookie"]) {
            const _0x20507e = _0x5ee080.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x20507e && this.ckjar.setCookieSync(_0x20507e, null);
            _0x3cd57b.cookieJar = this.ckjar;
          }
        } catch (_0x3bf723) {
          this.logErr(_0x3bf723);
        }
      }).then(_0x152cf9 => {
        const {
          statusCode: _0x3446fc,
          statusCode: _0x3ddb2c,
          headers: _0x53a914,
          body: _0x49f099
        } = _0x152cf9;
        _0x178fc9(null, {
          status: _0x3446fc,
          statusCode: _0x3ddb2c,
          headers: _0x53a914,
          body: _0x49f099
        }, _0x49f099);
      }, _0x1cc6ff => {
        const {
          message: _0x158707,
          response: _0x1cfb65
        } = _0x1cc6ff;
        _0x178fc9(_0x158707, _0x1cfb65, _0x1cfb65 && _0x1cfb65.body);
      }));
    }
    post(_0x43c99b, _0x4ec270 = () => {}) {
      if (_0x43c99b.body && _0x43c99b.headers && !_0x43c99b.headers["Content-Type"] && (_0x43c99b.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x43c99b.headers && delete _0x43c99b.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x43c99b.headers = _0x43c99b.headers || {}, Object.assign(_0x43c99b.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x43c99b, (_0x817eb8, _0x10fde7, _0x1ada46) => {
          !_0x817eb8 && _0x10fde7 && (_0x10fde7.body = _0x1ada46, _0x10fde7.statusCode = _0x10fde7.status);
          _0x4ec270(_0x817eb8, _0x10fde7, _0x1ada46);
        });
      } else {
        if (this.isQuanX()) {
          _0x43c99b.method = "POST";
          this.isNeedRewrite && (_0x43c99b.opts = _0x43c99b.opts || {}, Object.assign(_0x43c99b.opts, {
            hints: !1
          }));
          $task.fetch(_0x43c99b).then(_0x1094e4 => {
            const {
              statusCode: _0x4f74a9,
              statusCode: _0x111c6c,
              headers: _0x501811,
              body: _0x259d92
            } = _0x1094e4;
            _0x4ec270(null, {
              status: _0x4f74a9,
              statusCode: _0x111c6c,
              headers: _0x501811,
              body: _0x259d92
            }, _0x259d92);
          }, _0xe34b15 => _0x4ec270(_0xe34b15));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x43c99b);
            const {
              url: _0x4f84e7,
              ..._0x16bdb2
            } = _0x43c99b;
            this.got.post(_0x4f84e7, _0x16bdb2).then(_0x153619 => {
              const {
                statusCode: _0x2f3e2b,
                statusCode: _0x4831a8,
                headers: _0xec34a9,
                body: _0x5dc8f5
              } = _0x153619;
              _0x4ec270(null, {
                status: _0x2f3e2b,
                statusCode: _0x4831a8,
                headers: _0xec34a9,
                body: _0x5dc8f5
              }, _0x5dc8f5);
            }, _0x4d47c7 => {
              const {
                message: _0x4f24f3,
                response: _0x1a7ffe
              } = _0x4d47c7;
              _0x4ec270(_0x4f24f3, _0x1a7ffe, _0x1a7ffe && _0x1a7ffe.body);
            });
          }
        }
      }
    }
    time(_0x92c50a, _0x534272 = null) {
      const _0x471c61 = _0x534272 ? new Date(_0x534272) : new Date();
      let _0x38591c = {
        "M+": _0x471c61.getMonth() + 1,
        "d+": _0x471c61.getDate(),
        "H+": _0x471c61.getHours(),
        "m+": _0x471c61.getMinutes(),
        "s+": _0x471c61.getSeconds(),
        "q+": Math.floor((_0x471c61.getMonth() + 3) / 3),
        S: _0x471c61.getMilliseconds()
      };
      /(y+)/.test(_0x92c50a) && (_0x92c50a = _0x92c50a.replace(RegExp.$1, (_0x471c61.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x1ee159 in _0x38591c) new RegExp("(" + _0x1ee159 + ")").test(_0x92c50a) && (_0x92c50a = _0x92c50a.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x38591c[_0x1ee159] : ("00" + _0x38591c[_0x1ee159]).substr(("" + _0x38591c[_0x1ee159]).length)));
      return _0x92c50a;
    }
    msg(_0x218255 = _0x154a4e, _0x3ea64b = "", _0x3afff6 = "", _0x8ed70d) {
      const _0xae2b15 = _0x269480 => {
        if (!_0x269480) {
          return _0x269480;
        }
        if ("string" == typeof _0x269480) {
          return this.isLoon() ? _0x269480 : this.isQuanX() ? {
            "open-url": _0x269480
          } : this.isSurge() ? {
            url: _0x269480
          } : void 0;
        }
        if ("object" == typeof _0x269480) {
          if (this.isLoon()) {
            let _0x3f17f1 = _0x269480.openUrl || _0x269480.url || _0x269480["open-url"],
              _0x1cd96a = _0x269480.mediaUrl || _0x269480["media-url"];
            return {
              openUrl: _0x3f17f1,
              mediaUrl: _0x1cd96a
            };
          }
          if (this.isQuanX()) {
            let _0x7cac46 = _0x269480["open-url"] || _0x269480.url || _0x269480.openUrl,
              _0x3d1c3d = _0x269480["media-url"] || _0x269480.mediaUrl;
            return {
              "open-url": _0x7cac46,
              "media-url": _0x3d1c3d
            };
          }
          if (this.isSurge()) {
            let _0xd7062f = _0x269480.url || _0x269480.openUrl || _0x269480["open-url"];
            return {
              url: _0xd7062f
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x218255, _0x3ea64b, _0x3afff6, _0xae2b15(_0x8ed70d)) : this.isQuanX() && $notify(_0x218255, _0x3ea64b, _0x3afff6, _0xae2b15(_0x8ed70d))), !this.isMuteLog) {
        let _0x224898 = ["", "==============📣系统通知📣=============="];
        _0x224898.push(_0x218255);
        _0x3ea64b && _0x224898.push(_0x3ea64b);
        _0x3afff6 && _0x224898.push(_0x3afff6);
        console.log(_0x224898.join("\n"));
        this.logs = this.logs.concat(_0x224898);
      }
    }
    log(..._0x2a0e3e) {
      _0x2a0e3e.length > 0 && (this.logs = [...this.logs, ..._0x2a0e3e]);
      console.log(_0x2a0e3e.join(this.logSeparator));
    }
    logErr(_0x4092e7, _0x32040e) {
      const _0x45e8f8 = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0x45e8f8 ? this.log("", "❗️" + this.name + ", 错误!", _0x4092e7.stack) : this.log("", "❗️" + this.name + ", 错误!", _0x4092e7);
    }
    wait(_0x357a0a) {
      return new Promise(_0x59ea33 => setTimeout(_0x59ea33, _0x357a0a));
    }
    done(_0x1e00fb = {}) {
      const _0x16c980 = new Date().getTime(),
        _0x12c07d = (_0x16c980 - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0x12c07d + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x1e00fb);
    }
  }(_0x154a4e, _0x298c22);
}
function checkVersion(_0x44e4c2, _0x43e1c1) {
  try {
    logAndNotify("文件md5：" + _0x43e1c1);
    const _0x55cd49 = SyncRequest("GET", "https://checktoke.filegear-sg.me/api/update/check?fileName=" + _0x44e4c2 + "&fileMd5=" + _0x43e1c1),
      _0x188dd0 = JSON.parse(_0x55cd49.getBody("utf8"));
    _0x188dd0.code === 301 ? process.exit(0) : logAndNotify(_0x188dd0.data);
  } catch (_0x4d1f3a) {
    logAndNotify("版本检查失败:", _0x4d1f3a);
  }
}