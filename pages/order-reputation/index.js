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
    arr: [],
    orderIndex: null,
    detail: null
  },
  watch: {
    counter(val) {
      var number = 0
      this.data.orderDetail.goods.forEach((e, i) => {
        number += e.pics.length
      })
      if (val == number) {
        var this_ = this
        setTimeout(function(){
          this_.submitNext(this_.data.arr)
        },500)
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id,
      orderIndex: options.orderIndex,
      detail: options.detail
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
          ele.reputation = 3
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
      [`orderDetail.goods[${e.currentTarget.dataset.index}].reputation`]: e.detail
    })
  },
  fieldChange(e){
    this.setData({
      [`orderDetail.goods[${e.currentTarget.dataset.index}].remark`]: e.detail
    })
  },
  // 选择图片
  afterRead(e){
    const imgList = this.data.orderDetail.goods[e.currentTarget.dataset.index].pics
    this.setData({
      [`orderDetail.goods[${e.currentTarget.dataset.index}].pics`]: imgList.concat(e.detail.file)
    })
  },
  // 删除图片
  deleteImg(e){
    const imgList = this.data.orderDetail.goods[e.currentTarget.dataset.index].pics
    imgList.splice(e.detail.index,1)
    this.setData({
      [`orderDetail.goods[${e.currentTarget.dataset.index}].pics`]: imgList
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
    this.setData({ counter: 0 })
    this.data.orderDetail.goods.forEach((e, i) => {
      e.picArr = []
      e.pics.forEach(ele => {
        WXAPI.uploadFile(ele.path).then((res) => {
          const num = this.data.counter + 1
          this.setData({ counter: num})
          e.picArr.push(JSON.parse(res.data).data.url)
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
    var this_ = this
    WXAPI.orderReputation({ postJsonString: JSON.stringify(params) }).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '评论成功',
        })
        if (this_.options.detail){          
          var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          var prevPage = pages[pages.length - 3];
        } else {
          var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          var prevPage = pages[pages.length - 2];
        }
        prevPage.setData({
          changeData: {
            type: 'reputation',
            index: this_.data.orderIndex
          },
        })
        this_.options.detail ? wx.navigateBack({delta: 2}) : wx.navigateBack()
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