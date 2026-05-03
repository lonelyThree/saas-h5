// 获取微信配置签名
const getWxConfig = async (vm, url) => {
  try {
    const { data } = await vm.$axios.get(vm.$config.domain+  '/User/GetTicketSign?url='+ encodeURIComponent(url))
    return data.data
  } catch (error) {
    console.error('获取微信签名失败', error)
    throw error
  }
}

// 初始化微信配置
export const initWechatShare = async (vm, currentUrl) => {
  const config = await getWxConfig(vm, currentUrl)
  wx.config({
    debug: false, // 生产环境关闭
    appId: config.appId,
    timestamp: config.timestamp,
    nonceStr: config.nonceStr,
    signature: config.signature,
    jsApiList: [
      'updateAppMessageShareData', // 分享好友
      'updateTimelineShareData',    // 分享朋友圈
      'hideMenuItems'
    ]
  })
}

// 设置分享内容
export const setShareConfig = (options) => {
  wx.ready(() => {
    wx.hideMenuItems({
      menuList: ['menuItem:copyUrl', 'menuItem:originPage', 'menuItem:openWithQQBrowser',
        'menuItem:openWithSafari', 'menuItem:share:email', 'menuItem:share:brand'
      ]
    })
    // 分享给朋友
    wx.updateAppMessageShareData({
      title: options.title,
      desc: options.desc,
      link: options.link,
      imgUrl: options.imgUrl,
      success: options.success || (() => {}),
      fail: options.fail || (() => {})
    })

    // 分享到朋友圈
    wx.updateTimelineShareData({
      title: options.title,
      link: options.link,
      imgUrl: options.imgUrl,
      success: options.success || (() => {}),
      fail: options.fail || (() => {})
    })
  })
}
