import wx, { IConfigOptions, IchooseWXPay } from 'weixin-js-sdk';

declare function useWxJsSdk(options: IConfigOptions | undefined): {
    getLocation: () => Promise<{
        latitude: number;
        longitude: number;
        speed: number;
        accuracy: number;
    }>;
    wxPay: (otpions: wx.IchooseWXPay) => Promise<any>;
    wxScanQRCode: ({ needResult }: {
        needResult?: undefined;
    }) => Promise<string>;
};
declare const useDebug: (debug: boolean) => void;
declare const config: (options: IConfigOptions) => Promise<typeof wx>;
/**
 * 获取地理位置
 * @param {*} wx
 */
declare const getLocation: () => Promise<{
    latitude: number;
    longitude: number;
    speed: number;
    accuracy: number;
}>;
/**
 * 微信支付
 * @param {*} wx
 * @param {*} otpions
 */
declare const wxPay: (otpions: IchooseWXPay) => Promise<any>;
/**
 * 微信扫码
 * @param {*} wx
 * @param {*} otpions
 */
declare const wxScanQRCode: ({ needResult }: {
    needResult?: undefined;
}) => Promise<string>;

export { config, getLocation, useDebug, useWxJsSdk, wxPay, wxScanQRCode };
