const app = getApp()
const WXAPI = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginTrue: null,
    discountsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDiscountsList()
  },
  //获取优惠券列表
  getDiscountsList() {
    WXAPI.discountsList().then((res) => {
      this.setData({
        discountsList: res.data.data
      })
    })
  },
  // 领取优惠券
  getDiscount(e) {
    if (!this.data.loginTrue) return
    WXAPI.discountsFetch({ id: e.currentTarget.dataset.id }).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
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
          that.login(e.detail)
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        }
      }
    })
  },
  login(detail) {
    var this_ = this
    wx.login({
      success(res) {
        if (res.code) {
          WXAPI.wxLogin({ code: res.code, type: 2 }).then((data) => {
            if (data.data.code == 10000) {
              // 去注册
              this_.register(detail)
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
            this_.setData({
              loginTrue: true
            })
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
        }
      }
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
            let referrer = app.globalData.referrer ? app.globalData.referrer : '' // 推荐人
            var params = {
              code: code,
              encryptedData: encryptedData,
              iv: iv,
              referrer: referrer
            }
            WXAPI.wxRegister(params).then((res) => {
              // 登录
              setTimeout(function () {
                _this.login(detail)
              }, 1000)
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ loginTrue: app.globalData.loginTrue })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})