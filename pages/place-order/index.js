// pages/place-order/index.js
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
    loading: true,
    logisticsShow: false,
    discountsShow: false,
    discountId: null,
    discountName: null,
    discountPrice: null,
    defaultAddress: {},
    addAddressShow: false,
    allOrderData: [], //全部数据
    goodsData: [], //提交的商品信息数组
    pushData: {}, //提交的全部数据
    payData: [], //订单数据
    logisticsData: [], //地址列表
    logisticsIndex: null, //选中的索引
    discountData: [],
    addressId: false,
  },
  computed: {
    disabled(data) {
      return Object.keys(data.defaultAddress).length == 0 ? true : false
    },
    allPrice(data) {
      var price = 0
      const arr = data.allOrderData.map(v => {
        return v.price * v.number
      })
      arr.forEach(val => {
        price += val
      })
      price >= 99 ? price+= 0 : price+= 6
      price -= data.discountPrice
      return price * 100
    },
    oldPrice(data){
      var price = 0
      const arr = data.allOrderData.map(v => {
        return v.price * v.number
      })
      arr.forEach(val => {
        price += val
      })
      return price.toFixed(2)
    },
    allNumber(data) {
      var number = 0
      data.allOrderData.forEach(val => {
        number += val.number
      })
      return number
    }
  },
  goAddress(){
    wx.navigateTo({
      url: '/pages/address/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      allOrderData: JSON.parse(options.shopdata)
    },function(){
      this.myDiscounts()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDefaultAddress()
  },
  // 默认地址
  getDefaultAddress() {
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync("addressId")) {
      WXAPI.addressDetail({ id: wx.getStorageSync("addressId")}).then((res) => {
        if (res.data.code == 0) {
          this.setData({
            defaultAddress: res.data.data.info,
            addAddressShow: false
          })
        } else {
          this.setData({
            addAddressShow: true
          })
        }
        wx.hideLoading()
      })
    } else {
      WXAPI.defaultAddress().then((res) => {
        if (res.data.code == 700) {
          this.setData({
            addAddressShow: true
          })
        } else {
          this.setData({
            addAddressShow: false,
            defaultAddress: res.data.data.info
          })
        }
        wx.hideLoading()
      })
    }
  },
  // 优惠券
  myDiscounts() {
    var price = 0
    const arr = this.data.allOrderData.map(v => {
      return v.price * v.number
    })
    arr.forEach(val => {
      price += val
    })
    var params = {
      consumAmount: price,
      status: 0
    }
    WXAPI.myDiscounts(params).then((res) => {
      if (res.data.code == 0) {
        this.setData({
          discountData: res.data.data
        }, function() {
          let data = res.data.data.reduce((p, v) => p.money < v.money ? v : p)
          this.setData({
            discountId: data.id,
            discountName: data.name,
            discountPrice: data.money
          })
        })
      }
    })
  },
  discountClick() {
    this.setData({
      discountsShow: true
    })
  },
  changLog(e) {
    this.setData({
      discountId: e.currentTarget.dataset.item.id,
      discountName: e.currentTarget.dataset.item.name,
      discountPrice: e.currentTarget.dataset.item.money,
      discountsShow: false
    })
  },
  onClose(){
    this.setData({
      discountsShow: false
    })
  },
  // 提交订单
  onSubmit() {
    var goodsData = [],
        pushData = {}
    this.data.allOrderData.forEach(ele=>{
        const obj = {
          goodsId: ele.goodsId,
          number: ele.number,
          propertyChildIds: '',
          logisticsType: 0
        }
        goodsData.push(obj)
    })
    const ortherData = {
      couponId: this.data.discountId ? this.data.discountId:'',
      peisongType: 'kd',
      expireMinutes: '30',
      payOnDelivery: 0
    }
    pushData['goodsJsonStr'] = JSON.stringify(goodsData)
    Object.assign(pushData, this.data.defaultAddress, ortherData)
    wx.showLoading({
      title: '加载中',
    })
    // 下单接口
    WXAPI.creatOrder(pushData).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '暂不支持支付 请联系管理员支付',
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      } 
      wx.hideLoading()
      // 支付接口再说
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})