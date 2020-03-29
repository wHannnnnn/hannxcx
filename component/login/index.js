// compontent/login/index.js
var app = getApp();
var WXAPI = require("../../utils/request.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取用户信息
    bindGetUserInfo(e) {
      var that = this
      // 用户允许授权
      if (e.detail.errMsg !== 'getUserInfo:ok') {
        // 返回上一级
        return false;
      }
      var that = this
      wx.showLoading({
        title: '请稍等',
      })
      wx.login({
        success(res) {
          if (res.code) {
            that.login(res.code, e.detail)
          } else {
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
            })
          }
        }
      })
    },
    login(code, detail) {
      WXAPI.wxLogin({ code: code, type: 2 }).then((data) => {
        if (data.data.code == 10000) {
          // 去注册
          wx.hideLoading()
          this.register(detail)
          return;
        }
        if (data.data.code != 0) {
          wx.showModal({
            title: '无法登录',
            content: data.msg,
            showCancel: false
          })
          wx.hideLoading()
          return;
        }
        wx.showToast({
          title: '授权成功',
          icon: 'success',
        })
        app.globalData.loginTrue = true
        wx.setStorageSync('token', data.data.data.token)
        wx.setStorageSync('uid', data.data.data.uid)
        wx.setStorageSync('userInfo', detail)
        wx.hideLoading()
      })
    },
    register(detail) {
      let _this = this;
      wx.login({
        success: function (res) {
          let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
          wx.getUserInfo({
            success: function (res) {
              let iv = res.iv;
              let encryptedData = res.encryptedData;
              let referrer = app.globalData.referrer // 推荐人
              var params = {
                code: code,
                encryptedData: encryptedData,
                iv: iv,
                referrer: referrer
              }
              WXAPI.wxRegister(params).then((res) => {
                // 登录
                _this.login(code, detail)
              })
            }
          })
        }
      })
    },
  }
})
