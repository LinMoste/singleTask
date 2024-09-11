#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Date : 2024/8/25 下午1:31
Author : StarSink
File : 喜茶.py
cron : 20 10 * * *
new Env('喜茶')
"""
import os
import requests
import json
import cusSendNotify as notify
import time


class Run():
    def __init__(self, token):
        self.token = token
        self.headers = {
            'User-Agent': "okhttp/3.12.1",
            'Accept': "application/json",
            'Accept-Encoding': "gzip",
            'Content-Type': "application/json",
            'client': "2",
            'version': "3.7.9",
            'x-client': "app",
            'x-version': "3.7.9",
            'gtm-zone': "GMT+08:00",
            'accept-language': "zh-CN",
            'authorization': self.token,
        }

    def qd(self):
        url = "https://go.heytea.com/api/service-member/vip/task/award/114"
        payload = json.dumps({})
        response = requests.post(url, data=payload, headers=self.headers)
        r = response.json()
        if r["code"] == 0 and r["message"] == "success":
            msg = f"签到成功，获得{r['data']['score']}积分"
            message.append(msg)
            print(msg)
        elif r["code"] == 400045 and r["message"] == "今天已签到!":
            msg = f"{r['message']}"
            message.append(msg)
            print(msg)
        elif r["code"] == 1002 and r["message"] == "TOKEN_INVALID":
            msg = f"token已经失效，请重新去获取authorization的值"
            message.append(msg)
            print(msg)
            # 推送两次失效信息
            notify.sendNotify("喜茶", "token失效请重新获取")
            notify.sendNotify("喜茶", "token失效请重新获取")
        else:
            msg = f"{r}"
            message.append(msg)
            print(msg)

    def user(self):
        url = "https://go.heytea.com/api/service-member/vip/task/member"
        response = requests.get(url, headers=self.headers)
        r = response.json()
        if r["code"] == 0 and r["message"] == "success":
            msg = f"用户‘{r['data']['memberName']}’，当前积分为‘{r['data']['usableScore']}’,"
            message.append(msg)
            print(msg)
        else:
            msg = f"{r}"
            message.append(msg)
            print(msg)


if __name__ == '__main__':
    message = []
    tokens = os.environ.get('xcck')
    if not tokens:
        print("获取账号失败，请填写变量xcck,多账号用@隔开")
    else:
        token_list = tokens.split('@')
        for index, token in enumerate(token_list, start=1):
            print(f"=====开始执行第{index}个账号任务=====")
            message.append(f"=====开始执行第{index}个账号任务=====")
            run = Run(token)
            run.qd()
            time.sleep(4)
            run.user()
            time.sleep(4)
    notify.sendNotify("喜茶", "\n".join(message))
