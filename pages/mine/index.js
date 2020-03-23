// pages/mine/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [
      {
        status: '0',
        title: '待付款',
        icon: 'credit-pay',
        info: 0
      },
      {
        status: '1',
        title: '待发货',
        icon: 'logistics',
        info: 0
      },
      {
        status: '2',
        title: '待收货',
        icon: 'send-gift-o',
        info: 0
      },
      {
        status: '3',
        title: '待评价',
        icon: 'comment-o',
        info: 0
      },
      {
        status: '4',
        title: '全部订单',
        icon: 'label-o',
      },
    ],
    statistics: {},
    discountsLength: 0,
    loginTrue: null,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 订单统计
  orderStatistics() {
    WXAPI.orderStatistics().then((res) => {
      if (res.data.code == 0) {
        this.data.orderList[0].info = res.data.data.count_id_no_pay
        this.data.orderList[1].info = res.data.data.count_id_no_transfer
        this.data.orderList[2].info = res.data.data.count_id_no_confirm
        this.data.orderList[3].info = res.data.data.count_id_no_reputation
        this.setData({
          orderList: this.data.orderList
        })
      }
    })
  },
  // 去订单列表页
  goOrderList(e){
    wx.navigateTo({
      url: `/pages/order-list/index?status=${e.currentTarget.dataset.status}`,
    })
  },
  // 我的优惠券
  myDiscounts() {
    WXAPI.myDiscounts().then((res) => {
      if (res.data.code == 0) {
        this.setData({
          discountsLength: res.data.data.length,
          discountsList: res.data.data
        })
      }
    })
  },
  goAddress(){
    wx.navigateTo({
      url: '/pages/address/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loginTrue: app.globalData.loginTrue,
      userInfo: wx.getStorageSync('userInfo').userInfo
    })
    this.orderStatistics()
    this.myDiscounts()
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
      this.onShow()
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