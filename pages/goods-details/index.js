// pages/goos-details/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
const WxParse = require('../../wxParse/wxParse.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
Page({
  /**
   * 页面的初始数据
   */
  behaviors: [computedBehavior],
  data: {
    dialog1: false,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    shopId: null,
    detailsList: [],
    reputation: [], //评论数据
    discountsList: [],
    Height: ""  
  },
  imgHeight: function (e) {
    var imgh = e.detail.height,
      imgw = e.detail.width,
      ratio = imgw / imgh;
    var viewHeight = 750 / ratio;
    this.setData({
      Height: viewHeight//设置高度
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  close: function () {
    this.setData({
      dialog1: false,
    });
  },
  open1() {
    this.setData({
      dialog1: true
    });
  },
  onLoad: function (options) {
      this.setData({
        shopId: options.id
      })
      this.getDetails()
  },
  // 商品详情
  getDetails() {
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.shopDetail({ id: this.data.shopId }).then((res) => {
      if (res.statusCode == 200) {
        this.setData({
          detailsList: res.data.data //详情
        })
        wx.hideLoading()
        this.getReputation(this.data.detailsList)
        this.getDiscountsList()
        WxParse.wxParse('article', 'html', res.data.data.content, this, 5)
      }
    })
  },
  // 获取两条评论
  getReputation(data) {
    var params = {
      goodsId: data.basicInfo.id,
      page: 1,
      pageSize: 2
    }
    WXAPI.getReputation(params).then((res) => {
      if (res.data.code == 0) {
        res.data.data.forEach(element => {
          element.goods.goodReputation += 1
        })
        this.setData({
          reputation: res.data.data
        })
      }
    })
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
    WXAPI.discountsFetch({ id: e.currentTarget.dataset.id }).then((res) => {
      if (app.globalData.loginTrue) {
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
      } else {
        this.login = this.selectComponent(".login")
        this.login.showDialog()
        // wx.navigateTo({
        //   url: '/pages/start/index',
        // })
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