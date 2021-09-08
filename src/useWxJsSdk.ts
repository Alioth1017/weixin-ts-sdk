import wx, { ApiMethod, IchooseWXPay, IConfigOptions } from "weixin-js-sdk";

export async function useWxJsSdk(options: IConfigOptions | undefined) {
  options && (await config(options));
  return { wx, getLocation, wxPay, wxScanQRCode };
}

const defaultJsApiList: ApiMethod[] = [
  "updateAppMessageShareData",
  "updateTimelineShareData",
  "onMenuShareTimeline",
  "onMenuShareAppMessage",
  "getLocation",
  "chooseWXPay",
  "scanQRCode",
];

let isDebug: boolean = false;
const myConsole = {
  log(...args: any[]) {
    isDebug && console.log(...args);
  },
  error(...args: any[]) {
    console.error(...args);
  },
};
export const useDebug = (debug: boolean) => {
  isDebug = debug;
};

let $wx: typeof wx;
export const config = (options: IConfigOptions) => {
  const promise = (resolve: (arg0: typeof wx) => void, reject: any) => {
    try {
      let { signature, nonceStr, timestamp, appId, jsApiList, openTagList } =
        options;
      jsApiList = jsApiList || defaultJsApiList;
      wx.config({
        debug: false,
        signature,
        nonceStr,
        timestamp,
        appId,
        jsApiList,
        openTagList,
      });
      wx.ready(() => {
        myConsole.log("[JS-SDK] Ready-config");
        $wx = wx;
        resolve(wx);
      });
      wx.error(function (wxError) {
        myConsole.error("[JS-SDK] Error-config:", wxError);
        throw wxError;
      });
    } catch (error) {
      myConsole.log("useWxJsSdkError:", error);
      reject(error);
    }
  };

  return new Promise(promise);
};

/**
 * 获取地理位置
 * @param {*} wx
 */
export const getLocation = () => {
  const promise = (
    resolve: (arg0: {
      latitude: number;
      longitude: number;
      speed: number;
      accuracy: number;
    }) => void,
    reject: (arg0: any) => void
  ) => {
    if (!$wx) {
      return reject("[JS-SDK] 未初始化完毕");
    }
    $wx.getLocation({
      type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: (res) => {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        myConsole.log("[JS-SDK] Success-getLocation:", latitude, longitude);
        resolve(res);
      },
      fail: (err) => {
        myConsole.error("[JS-SDK] Error-getLocation:", err);
        reject(err);
      },
    });
  };
  return new Promise(promise);
};

/**
 * 微信支付
 * @param {*} wx
 * @param {*} otpions
 */
export const wxPay = (otpions: IchooseWXPay) => {
  const promise = (
    resolve: (arg0: any) => void,
    reject: (arg0: string) => void
  ) => {
    if (!$wx) {
      return reject("[JS-SDK] 未初始化完毕");
    }
    let { nonceStr, paySign, signType, timestamp } = otpions;
    $wx.chooseWXPay({
      timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
      package: otpions.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: paySign, // 支付签名
      success: function (res) {
        myConsole.log("[JS-SDK] Success-chooseWXPay:", res);
        resolve(res);
      },
      // 支付取消回调函数
      cancel: function (res) {
        myConsole.error("[JS-SDK] Cancel-chooseWXPay:", res);
        resolve(res);
      },
      fail: function (err) {
        myConsole.error("[JS-SDK] Error-chooseWXPay:", err);
        reject(err);
      },
    });
  };

  return new Promise(promise);
};

/**
 * 微信扫码
 * @param {*} wx
 * @param {*} otpions
 */
export const wxScanQRCode = ({ needResult = undefined }) => {
  const promise = (
    resolve: (arg0: string) => void,
    reject: (arg0: string) => void
  ) => {
    if (!$wx) {
      return reject("[JS-SDK] 未初始化完毕");
    }
    wx.scanQRCode({
      needResult: needResult === undefined ? 1 : 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        myConsole.log("[JS-SDK] Success-scanQRCode:", res);
        let result: string = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        resolve(result);
      },
      fail: function (err) {
        myConsole.error("[JS-SDK] Error-scanQRCode:", err);
        reject(err);
      },
    });
  };

  return new Promise(promise);
};
