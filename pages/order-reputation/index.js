// pages/order-reputation/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
const watchBehavior = require("../../miniprogram_npm/miniprogram-watch/index.js")
Page({
  behaviors: [watchBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderDetail: {},
    counter: 0,
    arr: []
  },
  watch: {
    counter(val, oldval) {
      console.log(val)
      var number = 0
      this.data.orderDetail.goods.forEach((e, i) => {
        number += e.pics.length
      })
      if (val == number) {
        this.submitNext(this.data.arr)
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    },function(){
      this.getOrderDetails()
    })
  },
  getOrderDetails() {
    WXAPI.orderDetail({ id: this.data.orderId }).then((res) => {
      if (res.data.code == 0) {
        res.data.data.goods.forEach(ele => {
          ele.pics = []
          ele.remark = ''
          ele.reputation = 1
        })
        this.setData({ orderDetail: res.data.data})
        // this.orderDetail = res.data.data
      } else {
        wx.showToast({
          title: res.data.msg,
        })
        wx.navigateBack()
      }
    })
  },
  // 提交
  rateChange(e){
    this.setData({
      [`orderDetail[${e.currentTarget.dataset.index}].reputation`]: e.detail
    })
  },
  fieldChange(e){
    this.setData({
      [`orderDetail[${e.currentTarget.dataset.index}].remark`]: e.detail
    })
  },
  submit() {
    wx.showLoading({
      title: '请稍等',
    })
    var imgLength = 0
    var next = true
    this.data.orderDetail.goods.forEach(e=>{
      if (e.remark == ''){
        wx.showToast({
          title: '请输入内容',
        })
        next = false
      }
      imgLength += e.pics.length
    })
    if(!next) return
    if (imgLength == 0){
      this.data.orderDetail.goods.forEach((e, i) => {
        var obj = {
          id: e.id,
          reputation: e.reputation - 1,
          remark: e.remark,
          pics: e.picArr
        }
        this.data.arr.push(obj)
      })
      this.submitNext(this.data.arr)
      return
    }
    this.data.counter = 0
    this.data.orderDetail.goods.forEach((e, i) => {
      e.picArr = []
      e.pics.forEach(ele => {
        console.log(ele)
        let formData = new FormData()
        formData.append('upfile', ele.file);
        WXAPI.uploadFile(formData).then((res) => {
          this.data.counter += 1
          e.picArr.push(res.data.data.url)
        })
      })
      var obj = {
        id: e.id,
        reputation: e.reputation - 1,
        remark: e.remark,
        pics: e.picArr
      }
      this.data.arr.push(obj)
    })
  },
  submitNext(arr) {
    var params = {
      token: wx.getStorageSync('token'),
      orderId: this.data.orderId,
      reputations: arr
    }
    WXAPI.orderReputation({ postJsonString: JSON.stringify(params) }).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '评论成功',
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
      wx.hideLoading()
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