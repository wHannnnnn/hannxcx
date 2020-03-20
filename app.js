//app.js
const login = require('utils/login')
App({
  onLaunch: function () {
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
		/**
		 * 初次加载判断网络情况
		 * 无网络状态下根据实际情况进行调整
		 */
    wx.getNetworkType({
      success(res) {
        if (res.networkType === 'none') {
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
		/**
		 * 监听网络状态变化
		 * 可根据业务需求进行调整
		 */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
          }
        })
      } else {
        wx.hideToast()
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  goStartIndexPage: function () {
    setTimeout(function () {
      wx.redirectTo({
        url: "/pages/start/start"
      })
    }, 1000)
  },
  onShow(){
    this.globalData.loginTrue = login.hasLogin()
  },
  globalData: {
    userInfo: null,
    loginTrue: null,
    referrer: null,
    cartRefresh: true
  }
})