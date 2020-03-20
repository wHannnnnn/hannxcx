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