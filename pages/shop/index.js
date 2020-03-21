// pages/shop/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
const watchBehavior = require("../../miniprogram_npm/miniprogram-watch/index.js")
Page({
  behaviors: [computedBehavior, watchBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    loginUser: true,
    active: 0,
    statusTip: '管理', // 管理,完成
    checkedAll: false,
    checkedGoods: [],
    goods: [],
  },
  computed: {
    submitBarText(data) {
      const count = data.checkedGoods.length
      return '结算' + (count ? `(${count})` : '')
    },
    totalPrice(data) {
      const price = data.goods.reduce((total, item) => total + (data.checkedGoods.indexOf(item.key) !== -1 ? item.price * item.number : 0), 0)
      console.log(price)
      return parseFloat((price * 100).toFixed(2))
    },
    buyGoods(data) {
      return data.goods.filter((ele, index) => {
        return ele.stores > 0
      })
    },
    oldGoods(data) {
      return data.goods.filter((ele, index) => {
        return ele.stores <= 0
      })
    },
  },
  watch: {
    checkedAll() {
      if (this.data.checkedAll) {
        var arr = this.data.goods.map(item => item.key)
        this.setData({
          checkedGoods: arr
        })
      }
      if (!this.data.checkedAll && this.data.checkedGoods.length == this.data.goods.length) {
        this.setData({
          checkedGoods: []
        })
      }
    },
    checkedGoods(val) {
      val.length > 0 && val.length === this.data.goods.length ? this.setData({ checkedAll: true }) : this.setData({checkedAll: false})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() 
    app.globalData.cartRefresh = true
    this.onShow()
  },
  getCartInfo() {
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.getCartInfo().then((res) => {
      if (res.data.code == 0) {
        this.setData({
          checkedGoods: [],
          checkedAll: false,
          goods: res.data.data.items
        })
        app.globalData.cartRefresh = false
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      } else {
        app.globalData.cartRefresh = true
        this.setData({
          checkedGoods: [],
          checkedAll: false,
          goods: []
        })
      }
      wx.hideLoading()
    })
  },
  // 复选框
  onChange(e){
    this.setData({
      checkedGoods: e.detail
    });
  },

  changeAll(e){
    this.setData({
      checkedAll: e.detail
    })
  },
  // 数量
  changeNumber(e) {
    wx.showLoading({
      title: '加载中',
    })
    var params = {
      key: e.currentTarget.dataset.key,
      number: e.detail
    }
    WXAPI.cartNumber(params).then((res) => {
      if(res.data.code == 0){
        this.getCartInfo()
      }
    })
  },
  goDetails(e){
    wx.navigateTo({
      url: `/pages/goods-details/index?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 删除接口
  deleteOne(key){
    WXAPI.removeCart({ key: key }).then((res) => {
      if (res.data.code == 0) {
        this.getCartInfo()
      }
    })
  },
  // 删除商品
  deleteShop: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除商品？',
      success(res) {
        if (res.confirm) {
          that.deleteOne(e.currentTarget.dataset.key)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 多选删除
  moreDelete(){
    var that = this
    if(this.data.checkedGoods.length<=0){
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定删除商品？',
      success(res) {
        if (res.confirm) {
          that.data.checkedGoods.forEach((ele) => {
            // 删除接口
            that.deleteOne(ele)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  submit(){
    this.data.checkedGoods.forEach((ele) => {
      // this.goods.      
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
    if(!app.globalData.cartRefresh) return
    this.getCartInfo()
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