// @ts-nocheck
import * as jwx from './jweixin-1.6.0'
var sign = require('./sign.js');

const wxconfig = {
  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  // appId: '', // 必填，公众号的唯一标识
  // timestamp:, // 必填，生成签名的时间戳
  // nonceStr: '', // 必填，生成签名的随机串
  // signature: '',// 必填，签名
  appId: 'wxedab40f7de6e19f4',
  jsApiList: [
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'playVoice',
    'pauseVoice',
    'stopVoice',
    'onVoicePlayEnd',
    'uploadVoice',
    'downloadVoice',
    'chooseImage',
    'previewImage',
    'uploadImage',
    'downloadImage',
    'translateVoice',
    'getNetworkType',
    'openLocation',
    'getLocation',
    'hideOptionMenu',
    'showOptionMenu',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'closeWindow',
    'scanQRCode',
    'chooseWXPay',
    'openProductSpecificView',
    'addCard',
    'chooseCard',
    'openCard'
  ], // 必填，需要使用的JS接口列表
  openTagList: ['wx-open-launch-weapp']
}

const wxApi = {
  /**
   * 新api
   * @param {Object} callback
   */
  init(callback) {
    let signObj = sign('kgt8ON7yVITDhtdwci0qeerXziagAtn1Lv6Q10K5JnUkdHrBhS0HP1Jt0bkgjcmKWs1-NMVMtQ5i7PyK3eleOQ',
      window.location.href)
    jwx.config(Object.assign(wxconfig, signObj))
    jwx.ready((res) => {
      // 隐藏菜单
      jwx.hideAllNonBaseMenuItem();
      if (callback) {
        callback()
      }
    })
  },
  /**
   * 旧api
   * @param {Object} callback
   */
  callApi(callback) {
    if (window.WeixinJSBridge) {
      callback()
    } else {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', callback, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', callback);
        document.attachEvent('onWeixinJSBridgeReady', callback);
      }
    }
  },
  /**
   * 新扫码
   * @param {Object} options
   */
  scanQrcode(options) {
    jwx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: options.success
    })
  },
  /**
   * 新支付
   * @param {Object} opt
   */
  chooseWXPay(opt) {
    jwx.chooseWXPay({
      timestamp: 1577606129,
      nonceStr: '1577606129389',
      package: 'prepay_id=wx29155529343928ec8df777001229234500',
      signType: 'MD5',
      paySign: 'A0FD3356EFAB5552EC521ABEA0443E5F',
      success: function(res) {
        // 支付成功后的回调函数
        console.log(ress)
      }
    });
  },
  /**
   * 支付-旧
   * @param {Object} options
   * @param {Object} orderId
   * @param {Function} callback
   * @param {Function} callbackFailed
   */
  wxPay(options, orderId, callback, callbackFailed) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      Object.assign({}, options, {
        package: options.package
      }),
      function(res) {
        console.log(res, "wxpay")
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          callback && callback()
        } else {
          callbackFailed && callbackFailed()
        }
      }
    );
  },
  /**
   * 旧隐藏菜单
   */
  hideOptionMenu() {
    WeixinJSBridge.invoke('hideOptionMenu')
  }
}

export default wxApi
