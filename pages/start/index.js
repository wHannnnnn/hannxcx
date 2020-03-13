// pages/start/start.js
var app = getApp();
var WXAPI = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      wx.login({
        success(res) {
          console.log(res)
          if (res.code) {
            // 登录
            WXAPI.methods.bindOpenid({ code: res.code }).then((data) => {

            })

            
            WXAPI.methods.wxLogin({ code: res.code, type: 2}).then((data) => {
              if (data.data.code == 10000) {
                // 去注册
                that.register(res)
                return;
              }
              if (data.data.code != 0) {
                wx.showModal({
                  title: '无法登录',
                  content: data.msg,
                  showCancel: false
                })
                return;
              }
              wx.setStorageSync('token', data.data.token)
              wx.setStorageSync('uid', data.data.uid)
              wx.setStorageSync('userInfo', e.detail)
            })
          } else {
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
            })
          }
        }
      })
  },
  register(res) {
    var params = {
      code: res.code,
      // referrer: app.globalData.launchOption //邀请人
    }
    var that = this
    WXAPI.methods.wxRegister(params).then((res) => {
      if (res.data.code == 0) {
        // that.login()
        console.log(res)
      } else {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
        })
      }
    })
  },
})