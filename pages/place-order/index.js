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
    counter: 0,
  },
  computed: {
    disabled(data) {
      return Object.keys(data.defaultAddress).length == 0 ? true : false
    },
    allPrice(data) {
        var price = 0
        return price * 100
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDefaultAddress()
    this.myDiscounts()
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
  // 默认地址
  getDefaultAddress() {
    if (wx.getStorageInfoSync('addressId')) {
      WXAPI.addressDetail({ id: wx.getStorageInfoSync('addressId') }).then((res) => {
        if(res.data.code == 0) {
          this.setData({
            defaultAddress: res.data.data.info
          })
        } else {
          this.setData({
            addAddressShow: false
          })
        }
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
      })
    }
  },
  // 优惠券
  myDiscounts() {
    var price = 0
    const arr = this.data.allOrderData.map(v => {
      return v.price * v.number
    })
    price += eval(arr.join("+"))
    var params = {
      consumAmount: price,
      status: 0
    }
    WXAPI.myDiscounts(params).then((res) => {
      if (res.data.code == 0) {
        this.setData({
          discountData: res.data.data
        },function(){
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
  // 价格计算
  // priceCal(item) {
  //   const arr = item.map((v) => {
  //     return v.price * v.number
  //   })
  //   return eval(arr.join("+"))
  // },
  // discountClick() {
  //   this.discountsShow = true
  // },
  // changLog(item) {
  //   this.discountId = item.id
  //   this.discountName = item.name
  //   this.discountPrice = item.money
  //   this.discountsShow = false
  // },
  // 提交订单
  onSubmit() {
    // this.allData.forEach(ele => {
    //   ele.origin.forEach(v => {
    //     const obj = {
    //       goodsId: v.id,
    //       number: v.number,
    //       propertyChildIds: v.propertyChildIds,
    //       logisticsType: ele.logisticsType
    //     }
    //     this.goodsData.push(obj)
    //   })
    // });
    // const ortherData = {
    //   couponId: this.discountId,
    //   peisongType: 'kd',
    //   expireMinutes: '30',
    //   payOnDelivery: 0,
    //   code: 111
    // }
    // this.pushData['goodsJsonStr'] = JSON.stringify(this.goodsData)
    // Object.assign(this.pushData, this.defaultAddress, ortherData)
    // // 下单接口
    // this.$http.creatOrder(this.pushData).then((res) => {
    //   if (res.data.code == 0) {
    //     this.pushData['goodsJsonStr'] = []
    //     this.$toast.success('添加成功，暂不支持支付，请联系管理员')
    //   } else {
    //     this.$toast(res.data.msg)
    //   }
    //   // 支付接口再说
    // })
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