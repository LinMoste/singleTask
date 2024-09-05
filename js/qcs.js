/**
 * cron: 40 8 * * *
 *
 * 屈臣氏
 * 把token 填到变量里 多个换行
 * 20240706 签到可能黑号 一直提示系统繁忙
 * export qcs_ck="token1#openId#unionId"
 * const $ = new Env('屈臣氏');
 */
const $ = new Env("屈臣氏"),
  axios = require("axios"),
  {
    sendNotify
  } = require("./sendNotify"),
  SyncRequest = require("sync-request");
let notifyStr = "",
  inviterId = "",
  taskId = "",
  needHelpTimes = -1,
  inviterToken = "",
  inviterOid = "",
  inviterUid = "";
(async () => {
  checkVersion("qcs.js", "6d1bf75dae4611afbaa51b93b8ef53d4");
  const _0x25ba83 = process.env.qcs_ck;
  if (!_0x25ba83) {
    logAndNotify("请先设置环境变量 qcs_ck");
    return;
  }
  let _0xc54b1e = _0x25ba83.split("\n"),
    _0x48e44a = "",
    _0x1b5a63 = "",
    _0x39b54a = "";
  for (let _0x3919c5 = 0; _0x3919c5 < _0xc54b1e.length; _0x3919c5++) {
    await delay(10000);
    _0x48e44a = _0xc54b1e[_0x3919c5].split("#")[0];
    _0x1b5a63 = _0xc54b1e[_0x3919c5].split("#")[1];
    _0x39b54a = _0xc54b1e[_0x3919c5].split("#")[2];
    const _0x1854c1 = await sendGetRequest("https://mystore-01api.watsonsvip.com.cn/wx/signIn/index?unionId=" + _0x39b54a, _0x48e44a, _0x1b5a63, _0x39b54a);
    logAndNotify("🧐" + _0x1b5a63 + "🧐");
    if (_0x1854c1.data.code !== 0) {
      logAndNotify("账号【" + (_0x3919c5 + 1) + "】 已失效☹ token=" + _0x48e44a + ", oid=" + _0x1b5a63 + ", uid=" + _0x39b54a);
      continue;
    }
    const _0x37d43f = _0x1854c1.data.result.signInStatus;
    if (!_0x37d43f.signedToday) {
      const _0x46419d = {
        unionId: _0x39b54a,
        isSorttion: false,
        deviceId: "BNBGp+qwI8bc7r+2X3swaV1cO5hYgNv7ifhmbMt7EQn/y1vUv4Uk2ghM3siBIEPTkGysGwpVrry/hZdPw4eVtPg==",
        blackbox: "sMPV31716602633iv7qxNz39Q0"
      };
      if (inviterId) {
        const _0x5c868e = await sendPostRequest("https://mystore-01api.watsonsvip.com.cn/invitefriends/clickshareLink", _0x48e44a, {
            taskId: taskId,
            inviterId: inviterId
          }, _0x1b5a63, _0x39b54a),
          _0x59802f = _0x5c868e.data.result;
        logAndNotify("账号【" + (_0x3919c5 + 1) + "】 走邀请结果：" + _0x59802f.popCopywritting);
        _0x46419d.inviterId = inviterId;
        _0x46419d.taskId = taskId;
      }
      const _0x211905 = await sendPostRequest("https://mystore-01api.watsonsvip.com.cn/wx/signIn/iter/sign", _0x48e44a, _0x46419d, _0x1b5a63, _0x39b54a);
      if (_0x211905.data.code === 0) {
        logAndNotify("账号【" + (_0x3919c5 + 1) + "】 签到成功 已连续签到" + _0x211905.data.result.continueDays + "天 回馈金+" + _0x211905.data.result.rewardAmount / 100);
      } else {
        if (_0x211905.data.code === 11000) {
          logAndNotify("账号【" + (_0x3919c5 + 1) + "】 签到失败 【" + _0x211905.data.errorMsg + "】");
        } else {
          logAndNotify("账号【" + (_0x3919c5 + 1) + "】 签到失败 【" + _0xfddfca.data.errorMsg + "】 改为非邀请签到");
          delete _0x46419d.inviterId;
          delete _0x46419d.taskId;
          const _0xfddfca = await sendPostRequest("https://mystore-01api.watsonsvip.com.cn/wx/signIn/iter/sign", _0x48e44a, _0x46419d, _0x1b5a63, _0x39b54a);
          _0xfddfca.data.code === 0 ? logAndNotify("账号【" + (_0x3919c5 + 1) + "】 签到成功 已连续签到" + _0xfddfca.data.result.continueDays + "天 回馈金+" + _0xfddfca.data.result.rewardAmount / 100) : logAndNotify("账号【" + (_0x3919c5 + 1) + "】 签到失败 【" + _0xfddfca.data.errorMsg + "】");
        }
      }
    } else {
      logAndNotify("账号【" + (_0x3919c5 + 1) + "】 已签到");
    }
    let _0x2e6a6f = await sendGetRequest("https://mystore-01api.watsonsvip.com.cn/cloudapi/v2/users/tasks", _0x48e44a, _0x1b5a63, _0x39b54a),
      _0x5db628 = _0x2e6a6f.data.result.list;
    for (const _0x938173 of _0x5db628) {
      if (_0x938173.prizeReceiveStatus === 0 && _0x938173.cycle === "EveryDay" && _0x938173.state !== 2) {
        let _0x1ba304 = {};
        if (_0x938173.type === "Browse") {
          logAndNotify("账号【" + (_0x3919c5 + 1) + "】 浏览任务【" + _0x938173.name + "】");
          const _0x23f6dc = await sendGetRequest("https://mystore-01api.watsonsvip.com.cn/cloudapi/v2/users/tasks/browserTask/token/" + _0x938173.id, _0x48e44a, _0x1b5a63, _0x39b54a),
            _0x1bbb6a = _0x23f6dc.data.result.token;
          await delay(10000);
          _0x1ba304 = {
            taskId: _0x938173.id,
            completeBrowserTaskToken: _0x1bbb6a
          };
          await sendPostRequest("https://mystore-01api.watsonsvip.com.cn/cloudapi/v2/users/tasks/complete", _0x48e44a, _0x1ba304, _0x1b5a63, _0x39b54a);
        }
        _0x938173.type === "Jump" && (logAndNotify("账号【" + (_0x3919c5 + 1) + "】 跳转任务【" + _0x938173.name + "】"), _0x1ba304 = {
          taskId: _0x938173.id
        }, await sendPostRequest("https://mystore-01api.watsonsvip.com.cn/cloudapi/v2/users/tasks/complete", _0x48e44a, _0x1ba304, _0x1b5a63, _0x39b54a));
        if (_0x938173.type === "NoPrize" && _0x938173.name === "喊好友一起签到") {
          logAndNotify("账号【" + (_0x3919c5 + 1) + "】 邀请任务【" + _0x938173.name + "】");
          if (!inviterId) {
            const _0x40f577 = await sendGetRequest("https://mystore-01api.watsonsvip.com.cn/invitefriends/popSecond", _0x48e44a, _0x1b5a63, _0x39b54a);
            taskId = _0x40f577.data.result.taskId;
            inviterId = _0x40f577.data.result.inviterId;
            needHelpTimes = _0x40f577.data.result.activityConfig.needHelpTimes;
            inviterToken = _0x48e44a;
            inviterOid = _0x1b5a63;
            inviterUid = _0x39b54a;
          }
        }
      }
    }
    _0x2e6a6f = await sendGetRequest("https://mystore-01api.watsonsvip.com.cn/cloudapi/v2/users/tasks", _0x48e44a, _0x1b5a63, _0x39b54a);
    _0x5db628 = _0x2e6a6f.data.result.list;
    for (const _0x2e33db of _0x5db628) {
      if (_0x2e33db.prizeReceiveStatus === 0 && _0x2e33db.state === 2) {
        const _0x45bde5 = {
            prizeId: _0x2e33db.prizeId
          },
          _0x46a138 = await sendPostRequest("https://mystore-01api.watsonsvip.com.cn/cloudapi/v2/users/receive", _0x48e44a, _0x45bde5, _0x1b5a63, _0x39b54a);
        if (_0x46a138.data.code !== 0) {
          logAndNotify("账号【" + (_0x3919c5 + 1) + "】 领取奖励失败");
        } else {
          logAndNotify("账号【" + (_0x3919c5 + 1) + "】 回馈金+" + _0x46a138.data.result.grantNum / 100);
        }
      }
    }
    const _0x27c0bc = await sendGetRequest("https://mystore-01api.watsonsvip.com.cn/thirdparty/api/items", _0x48e44a, {}, _0x1b5a63, _0x39b54a),
      _0x2ae80e = _0x27c0bc.data.data.list;
    for (const _0x4d2ef4 of _0x2ae80e) {
      if (_0x4d2ef4.type === 2 && _0x4d2ef4.count > 0) {
        if (_0x4d2ef4.price > _0x27c0bc.data.data.scores) {
          logAndNotify("账号【1】 监控到可兑换的实物" + _0x4d2ef4.name + ", " + _0x4d2ef4.count + " 奖励金不够");
          continue;
        }
        logAndNotify("账号【1】 监控到可兑换的实物" + _0x4d2ef4.name + ", " + _0x4d2ef4.count);
        const _0x2193b3 = {
            flow_from: 1,
            itemId: _0x4d2ef4.id,
            deviceId: "BNBGp+qwI8bc7r+2X3swaV1cO5hYgNv7ifhmbMt7EQn/y1vUv4Uk2ghM3siBIEPTkGysGwpVrry/hZdPw4eVtPg==",
            blackbox: "sMPV31716602633iv7qxNz39Q0"
          },
          _0x51e31b = await sendPostRequest("https://mystore-01api.watsonsvip.com.cn/thirdparty/api/items", _0x48e44a, _0x2193b3, _0x1b5a63, _0x39b54a);
        _0x51e31b.data.code === 0 ? logAndNotify("账号【1】 兑换实物结果 【" + _0x51e31b.data.data.extra.description + "】") : logAndNotify("账号【1】 兑换实物失败");
      }
    }
    logAndNotify("账号【1】 奖励金" + _0x27c0bc.data.data.scores / 100);
  }
  if (inviterId) {
    const _0x5a5be1 = await sendGetRequest("https://mystore-01api.watsonsvip.com.cn/invitefriends/popSecond", inviterToken, inviterOid, inviterUid),
      _0x3e714e = _0x5a5be1.data.result.invitefriendsList.length;
    if (_0x3e714e !== 0) {
      logAndNotify("账号【1】 走邀请签到成功 任务需要邀请【" + needHelpTimes + "】人 主账号邀请成功次数" + _0x3e714e);
    } else {
      logAndNotify("账号【1}】 走邀请签到失败 任务需要邀请【" + needHelpTimes + "】人 主账号邀请成功次数" + _0x3e714e);
    }
  }
})().catch(_0x180782 => {
  logAndNotify(_0x180782);
}).finally(() => {
  sendNotify("屈臣氏", notifyStr);
  $.done();
});
function logAndNotify(_0x385a03) {
  $.log(_0x385a03);
  notifyStr += _0x385a03;
  notifyStr += "\n";
}
function sendGetRequest(_0x3fe11f, _0x3cf142, _0x215d9a, _0x21d675) {
  const _0x469a65 = axios.create({
    headers: {
      Authorization: "Bearer " + _0x3cf142,
      "authorizer-appid": "wx1ffbd6927043dff7",
      openId: _0x215d9a,
      unionId: _0x21d675,
      "content-type": "application/json",
      miniProgramVersion: "1.0.0"
    }
  });
  return _0x469a65.get(_0x3fe11f);
}
function sendGetRequestOnlyUrl(_0x2d5da6) {
  const _0x59e4bc = axios.create();
  return _0x59e4bc.get(_0x2d5da6);
}
function sendPostRequest(_0x53cc9b, _0x352606, _0x10e7f5, _0x1b608e, _0x53202b) {
  const _0x2b2f8d = axios.create({
    headers: {
      Authorization: "Bearer " + _0x352606,
      "authorizer-appid": "wx1ffbd6927043dff7",
      openId: _0x1b608e,
      unionId: _0x53202b,
      "content-type": "application/json",
      miniProgramVersion: "1.0.0"
    }
  });
  return _0x2b2f8d.post(_0x53cc9b, _0x10e7f5);
}
function delay(_0x58ac2f) {
  return new Promise(_0x3df330 => setTimeout(_0x3df330, _0x58ac2f));
}
function Env(_0x4d171c, _0x7ea76e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class _0x691bac {
    constructor(_0x5dd0ad) {
      this.env = _0x5dd0ad;
    }
    send(_0x3060ea, _0x101e7a = "GET") {
      _0x3060ea = "string" == typeof _0x3060ea ? {
        url: _0x3060ea
      } : _0x3060ea;
      let _0x48a9c3 = this.get;
      "POST" === _0x101e7a && (_0x48a9c3 = this.post);
      return new Promise((_0x33891c, _0x3e2e6e) => {
        _0x48a9c3.call(this, _0x3060ea, (_0x51e85e, _0x3f0875, _0x2786d1) => {
          _0x51e85e ? _0x3e2e6e(_0x51e85e) : _0x33891c(_0x3f0875);
        });
      });
    }
    get(_0xe8963a) {
      return this.send.call(this.env, _0xe8963a);
    }
    post(_0x1e3557) {
      return this.send.call(this.env, _0x1e3557, "POST");
    }
  }
  return new class {
    constructor(_0x62040e, _0x56f64f) {
      this.name = _0x62040e;
      this.http = new _0x691bac(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, _0x56f64f);
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
    toObj(_0x127628, _0x3d0138 = null) {
      try {
        return JSON.parse(_0x127628);
      } catch {
        return _0x3d0138;
      }
    }
    toStr(_0xb75e92, _0x3f496f = null) {
      try {
        return JSON.stringify(_0xb75e92);
      } catch {
        return _0x3f496f;
      }
    }
    getjson(_0x51956e, _0x687668) {
      let _0x1ee2d2 = _0x687668;
      const _0x2d914f = this.getdata(_0x51956e);
      if (_0x2d914f) {
        try {
          _0x1ee2d2 = JSON.parse(this.getdata(_0x51956e));
        } catch {}
      }
      return _0x1ee2d2;
    }
    setjson(_0xa5a478, _0x18c884) {
      try {
        return this.setdata(JSON.stringify(_0xa5a478), _0x18c884);
      } catch {
        return !1;
      }
    }
    getScript(_0x3c5c30) {
      return new Promise(_0x242cd => {
        this.get({
          url: _0x3c5c30
        }, (_0x1388fd, _0x4b4559, _0x5e375b) => _0x242cd(_0x5e375b));
      });
    }
    runScript(_0x46d9a0, _0x368b55) {
      return new Promise(_0x5be427 => {
        let _0x58b9b7 = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        _0x58b9b7 = _0x58b9b7 ? _0x58b9b7.replace(/\n/g, "").trim() : _0x58b9b7;
        let _0x20c169 = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        _0x20c169 = _0x20c169 ? 1 * _0x20c169 : 20;
        _0x20c169 = _0x368b55 && _0x368b55.timeout ? _0x368b55.timeout : _0x20c169;
        const [_0x15669a, _0x475522] = _0x58b9b7.split("@"),
          _0x314db2 = {
            url: "http://" + _0x475522 + "/v1/scripting/evaluate",
            body: {
              script_text: _0x46d9a0,
              mock_type: "cron",
              timeout: _0x20c169
            },
            headers: {
              "X-Key": _0x15669a,
              Accept: "*/*"
            }
          };
        this.post(_0x314db2, (_0x3854c4, _0x3c50be, _0x383293) => _0x5be427(_0x383293));
      }).catch(_0x1585e5 => this.logErr(_0x1585e5));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x5e71fa = this.path.resolve(this.dataFile),
          _0x510360 = this.path.resolve(process.cwd(), this.dataFile),
          _0x5d0291 = this.fs.existsSync(_0x5e71fa),
          _0x3a3375 = !_0x5d0291 && this.fs.existsSync(_0x510360);
        if (!_0x5d0291 && !_0x3a3375) {
          return {};
        }
        {
          const _0x218099 = _0x5d0291 ? _0x5e71fa : _0x510360;
          try {
            return JSON.parse(this.fs.readFileSync(_0x218099));
          } catch (_0xe8942c) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const _0x300454 = this.path.resolve(this.dataFile),
          _0xee8335 = this.path.resolve(process.cwd(), this.dataFile),
          _0x132857 = this.fs.existsSync(_0x300454),
          _0x6a7547 = !_0x132857 && this.fs.existsSync(_0xee8335),
          _0x59f7eb = JSON.stringify(this.data);
        _0x132857 ? this.fs.writeFileSync(_0x300454, _0x59f7eb) : _0x6a7547 ? this.fs.writeFileSync(_0xee8335, _0x59f7eb) : this.fs.writeFileSync(_0x300454, _0x59f7eb);
      }
    }
    lodash_get(_0x4349b1, _0x32defe, _0x56b0dc) {
      const _0x1e4c6d = _0x32defe.replace(/\[(\d+)\]/g, ".$1").split(".");
      let _0x16a96b = _0x4349b1;
      for (const _0xed29fa of _0x1e4c6d) if (_0x16a96b = Object(_0x16a96b)[_0xed29fa], void 0 === _0x16a96b) {
        return _0x56b0dc;
      }
      return _0x16a96b;
    }
    lodash_set(_0x48d9f8, _0x3ea1c0, _0x38064c) {
      return Object(_0x48d9f8) !== _0x48d9f8 ? _0x48d9f8 : (Array.isArray(_0x3ea1c0) || (_0x3ea1c0 = _0x3ea1c0.toString().match(/[^.[\]]+/g) || []), _0x3ea1c0.slice(0, -1).reduce((_0x32714d, _0x29405f, _0x4217a8) => Object(_0x32714d[_0x29405f]) === _0x32714d[_0x29405f] ? _0x32714d[_0x29405f] : _0x32714d[_0x29405f] = Math.abs(_0x3ea1c0[_0x4217a8 + 1]) >> 0 == +_0x3ea1c0[_0x4217a8 + 1] ? [] : {}, _0x48d9f8)[_0x3ea1c0[_0x3ea1c0.length - 1]] = _0x38064c, _0x48d9f8);
    }
    getdata(_0x295917) {
      let _0x3d0780 = this.getval(_0x295917);
      if (/^@/.test(_0x295917)) {
        const [, _0x828317, _0x5d1354] = /^@(.*?)\.(.*?)$/.exec(_0x295917),
          _0x38f2cb = _0x828317 ? this.getval(_0x828317) : "";
        if (_0x38f2cb) {
          try {
            const _0x5f1952 = JSON.parse(_0x38f2cb);
            _0x3d0780 = _0x5f1952 ? this.lodash_get(_0x5f1952, _0x5d1354, "") : _0x3d0780;
          } catch (_0x24fb92) {
            _0x3d0780 = "";
          }
        }
      }
      return _0x3d0780;
    }
    setdata(_0x3b9f8d, _0x32c0d4) {
      let _0x1fc7cc = !1;
      if (/^@/.test(_0x32c0d4)) {
        const [, _0x4d4e5f, _0x3d730b] = /^@(.*?)\.(.*?)$/.exec(_0x32c0d4),
          _0x8ca247 = this.getval(_0x4d4e5f),
          _0x311f46 = _0x4d4e5f ? "null" === _0x8ca247 ? null : _0x8ca247 || "{}" : "{}";
        try {
          const _0x33bb9e = JSON.parse(_0x311f46);
          this.lodash_set(_0x33bb9e, _0x3d730b, _0x3b9f8d);
          _0x1fc7cc = this.setval(JSON.stringify(_0x33bb9e), _0x4d4e5f);
        } catch (_0x417389) {
          const _0x5ec7c6 = {};
          this.lodash_set(_0x5ec7c6, _0x3d730b, _0x3b9f8d);
          _0x1fc7cc = this.setval(JSON.stringify(_0x5ec7c6), _0x4d4e5f);
        }
      } else {
        _0x1fc7cc = this.setval(_0x3b9f8d, _0x32c0d4);
      }
      return _0x1fc7cc;
    }
    getval(_0xaed411) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(_0xaed411) : this.isQuanX() ? $prefs.valueForKey(_0xaed411) : this.isNode() ? (this.data = this.loaddata(), this.data[_0xaed411]) : this.data && this.data[_0xaed411] || null;
    }
    setval(_0x5eccd7, _0x2ba048) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(_0x5eccd7, _0x2ba048) : this.isQuanX() ? $prefs.setValueForKey(_0x5eccd7, _0x2ba048) : this.isNode() ? (this.data = this.loaddata(), this.data[_0x2ba048] = _0x5eccd7, this.writedata(), !0) : this.data && this.data[_0x2ba048] || null;
    }
    initGotEnv(_0x578a84) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      _0x578a84 && (_0x578a84.headers = _0x578a84.headers ? _0x578a84.headers : {}, void 0 === _0x578a84.headers.Cookie && void 0 === _0x578a84.cookieJar && (_0x578a84.cookieJar = this.ckjar));
    }
    get(_0x3875d0, _0x41fb19 = () => {}) {
      _0x3875d0.headers && (delete _0x3875d0.headers["Content-Type"], delete _0x3875d0.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (_0x3875d0.headers = _0x3875d0.headers || {}, Object.assign(_0x3875d0.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(_0x3875d0, (_0x51094a, _0x2a3227, _0x1ff2f3) => {
        !_0x51094a && _0x2a3227 && (_0x2a3227.body = _0x1ff2f3, _0x2a3227.statusCode = _0x2a3227.status);
        _0x41fb19(_0x51094a, _0x2a3227, _0x1ff2f3);
      })) : this.isQuanX() ? (this.isNeedRewrite && (_0x3875d0.opts = _0x3875d0.opts || {}, Object.assign(_0x3875d0.opts, {
        hints: !1
      })), $task.fetch(_0x3875d0).then(_0x9dd72c => {
        const {
          statusCode: _0x14c51a,
          statusCode: _0x455b31,
          headers: _0x123168,
          body: _0x96a7ea
        } = _0x9dd72c;
        _0x41fb19(null, {
          status: _0x14c51a,
          statusCode: _0x455b31,
          headers: _0x123168,
          body: _0x96a7ea
        }, _0x96a7ea);
      }, _0x568caa => _0x41fb19(_0x568caa))) : this.isNode() && (this.initGotEnv(_0x3875d0), this.got(_0x3875d0).on("redirect", (_0x88354e, _0x14ce87) => {
        try {
          if (_0x88354e.headers["set-cookie"]) {
            const _0x5813c7 = _0x88354e.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            _0x5813c7 && this.ckjar.setCookieSync(_0x5813c7, null);
            _0x14ce87.cookieJar = this.ckjar;
          }
        } catch (_0x26a8d2) {
          this.logErr(_0x26a8d2);
        }
      }).then(_0x50b44d => {
        const {
          statusCode: _0x3f1994,
          statusCode: _0x1a859f,
          headers: _0x4d3758,
          body: _0x106dc7
        } = _0x50b44d;
        _0x41fb19(null, {
          status: _0x3f1994,
          statusCode: _0x1a859f,
          headers: _0x4d3758,
          body: _0x106dc7
        }, _0x106dc7);
      }, _0x1a7aa8 => {
        const {
          message: _0xd9243c,
          response: _0x12ab96
        } = _0x1a7aa8;
        _0x41fb19(_0xd9243c, _0x12ab96, _0x12ab96 && _0x12ab96.body);
      }));
    }
    post(_0x2a991d, _0x2ac828 = () => {}) {
      if (_0x2a991d.body && _0x2a991d.headers && !_0x2a991d.headers["Content-Type"] && (_0x2a991d.headers["Content-Type"] = "application/x-www-form-urlencoded"), _0x2a991d.headers && delete _0x2a991d.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (_0x2a991d.headers = _0x2a991d.headers || {}, Object.assign(_0x2a991d.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(_0x2a991d, (_0x12d40c, _0x243b72, _0x37fc47) => {
          !_0x12d40c && _0x243b72 && (_0x243b72.body = _0x37fc47, _0x243b72.statusCode = _0x243b72.status);
          _0x2ac828(_0x12d40c, _0x243b72, _0x37fc47);
        });
      } else {
        if (this.isQuanX()) {
          _0x2a991d.method = "POST";
          this.isNeedRewrite && (_0x2a991d.opts = _0x2a991d.opts || {}, Object.assign(_0x2a991d.opts, {
            hints: !1
          }));
          $task.fetch(_0x2a991d).then(_0x457882 => {
            const {
              statusCode: _0x5e30c3,
              statusCode: _0x56c9c2,
              headers: _0x7019b2,
              body: _0xdc8d9d
            } = _0x457882;
            _0x2ac828(null, {
              status: _0x5e30c3,
              statusCode: _0x56c9c2,
              headers: _0x7019b2,
              body: _0xdc8d9d
            }, _0xdc8d9d);
          }, _0x2d0455 => _0x2ac828(_0x2d0455));
        } else {
          if (this.isNode()) {
            this.initGotEnv(_0x2a991d);
            const {
              url: _0x27cda4,
              ..._0x23fba7
            } = _0x2a991d;
            this.got.post(_0x27cda4, _0x23fba7).then(_0x946a08 => {
              const {
                statusCode: _0x136d60,
                statusCode: _0x125af3,
                headers: _0x1cb788,
                body: _0x317879
              } = _0x946a08;
              _0x2ac828(null, {
                status: _0x136d60,
                statusCode: _0x125af3,
                headers: _0x1cb788,
                body: _0x317879
              }, _0x317879);
            }, _0x81a8b1 => {
              const {
                message: _0x2ed5b0,
                response: _0x452862
              } = _0x81a8b1;
              _0x2ac828(_0x2ed5b0, _0x452862, _0x452862 && _0x452862.body);
            });
          }
        }
      }
    }
    time(_0x279ec2, _0x11a121 = null) {
      const _0x4589bb = _0x11a121 ? new Date(_0x11a121) : new Date();
      let _0x7b0bf0 = {
        "M+": _0x4589bb.getMonth() + 1,
        "d+": _0x4589bb.getDate(),
        "H+": _0x4589bb.getHours(),
        "m+": _0x4589bb.getMinutes(),
        "s+": _0x4589bb.getSeconds(),
        "q+": Math.floor((_0x4589bb.getMonth() + 3) / 3),
        S: _0x4589bb.getMilliseconds()
      };
      /(y+)/.test(_0x279ec2) && (_0x279ec2 = _0x279ec2.replace(RegExp.$1, (_0x4589bb.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let _0x2cca7f in _0x7b0bf0) new RegExp("(" + _0x2cca7f + ")").test(_0x279ec2) && (_0x279ec2 = _0x279ec2.replace(RegExp.$1, 1 == RegExp.$1.length ? _0x7b0bf0[_0x2cca7f] : ("00" + _0x7b0bf0[_0x2cca7f]).substr(("" + _0x7b0bf0[_0x2cca7f]).length)));
      return _0x279ec2;
    }
    msg(_0x316583 = _0x4d171c, _0x3e44e9 = "", _0x1cf312 = "", _0x3fa667) {
      const _0x596aca = _0x234a51 => {
        if (!_0x234a51) {
          return _0x234a51;
        }
        if ("string" == typeof _0x234a51) {
          return this.isLoon() ? _0x234a51 : this.isQuanX() ? {
            "open-url": _0x234a51
          } : this.isSurge() ? {
            url: _0x234a51
          } : void 0;
        }
        if ("object" == typeof _0x234a51) {
          if (this.isLoon()) {
            let _0x10a814 = _0x234a51.openUrl || _0x234a51.url || _0x234a51["open-url"],
              _0x157d3c = _0x234a51.mediaUrl || _0x234a51["media-url"];
            return {
              openUrl: _0x10a814,
              mediaUrl: _0x157d3c
            };
          }
          if (this.isQuanX()) {
            let _0x10ffd1 = _0x234a51["open-url"] || _0x234a51.url || _0x234a51.openUrl,
              _0x50caea = _0x234a51["media-url"] || _0x234a51.mediaUrl;
            return {
              "open-url": _0x10ffd1,
              "media-url": _0x50caea
            };
          }
          if (this.isSurge()) {
            let _0x2e2ca9 = _0x234a51.url || _0x234a51.openUrl || _0x234a51["open-url"];
            return {
              url: _0x2e2ca9
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(_0x316583, _0x3e44e9, _0x1cf312, _0x596aca(_0x3fa667)) : this.isQuanX() && $notify(_0x316583, _0x3e44e9, _0x1cf312, _0x596aca(_0x3fa667))), !this.isMuteLog) {
        let _0x1a834b = ["", "==============📣系统通知📣=============="];
        _0x1a834b.push(_0x316583);
        _0x3e44e9 && _0x1a834b.push(_0x3e44e9);
        _0x1cf312 && _0x1a834b.push(_0x1cf312);
        console.log(_0x1a834b.join("\n"));
        this.logs = this.logs.concat(_0x1a834b);
      }
    }
    log(..._0xff51fe) {
      _0xff51fe.length > 0 && (this.logs = [...this.logs, ..._0xff51fe]);
      console.log(_0xff51fe.join(this.logSeparator));
    }
    logErr(_0x585acf, _0x2b5658) {
      const _0x446e58 = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      _0x446e58 ? this.log("", "❗️" + this.name + ", 错误!", _0x585acf.stack) : this.log("", "❗️" + this.name + ", 错误!", _0x585acf);
    }
    wait(_0x4108ba) {
      return new Promise(_0x355b6d => setTimeout(_0x355b6d, _0x4108ba));
    }
    done(_0x372a65 = {}) {
      const _0x153aee = new Date().getTime(),
        _0x137cda = (_0x153aee - this.startTime) / 1000;
      this.log("", "🔔" + this.name + ", 结束! 🕛 " + _0x137cda + " 秒");
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(_0x372a65);
    }
  }(_0x4d171c, _0x7ea76e);
}
function checkVersion(_0x7a1d6b, _0xe9a831) {
  try {
    logAndNotify("文件md5：" + _0xe9a831);
    const _0x47f043 = SyncRequest("GET", "https://checktoke.filegear-sg.me/api/update/check?fileName=" + _0x7a1d6b + "&fileMd5=" + _0xe9a831),
      _0x2f40e8 = JSON.parse(_0x47f043.getBody("utf8"));
    _0x2f40e8.code === 301 ? process.exit(0) : logAndNotify(_0x2f40e8.data);
  } catch (_0x13476c) {
    logAndNotify("版本检查失败:", _0x13476c);
  }
}