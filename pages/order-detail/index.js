const WXAPI = require('../../utils/request.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderIndex: null,
    orderDetail: {},
  },
  computed: {
    // 倒计时
    time(data) {
      if (data.orderDetail.orderInfo) {
        let newTime = new Date().getTime()
        let closeTime = new Date(data.orderDetail.orderInfo.dateClose).getTime()
        return closeTime - newTime
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      orderIndex: options.orderIndex
    },function(){
        this.getOrderDetails()
    })
  },
  getOrderDetails() {
    WXAPI.orderDetail({ id: this.data.orderId }).then((res) => {
      if (res.data.code == 0) {
        this.setData({
          orderDetail: res.data.data
        })
      }
    })
  },
  // goDetails(id) {
  //   this.$router.push({ path: '/detailsIndex', query: { id: id } })
  // },
  // 删除订单
  deleteOrder(e) {
    var this_ = this
    wx.showModal({
      title: '提示',
      content: '确定要删除订单吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
          })
          WXAPI.deleteOrder({ orderId: this_.data.orderId }).then((res) => {
            if (res.data.code == 0) {
              let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
              let prevPage = pages[pages.length - 2];
              prevPage.setData({
                changeData: {
                  type: 'delete',
                  index: this_.data.orderIndex
                },
              })
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack()
            } else {
              wx.showToast({
                title: res.data.msg,
              })
            }
            wx.hideLoading()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 关闭订单
  closeOrder(orderId) {
    var this_ = this
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
          })
          WXAPI.closeOrder({ orderId: this_.data.orderId }).then((res) => {
            if (res.data.code == 0) {
              let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
              let prevPage = pages[pages.length - 2];
              prevPage.setData({
                changeData: {
                  type: 'close',
                  index: this_.data.orderIndex
                },
              })
              wx.showToast({
                title: '订单取消成功',
              })
              wx.navigateBack()
            } else {
              wx.showToast({
                title: res.data.msg,
              })
            }
            wx.hideLoading()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 确认收货
  orderDelivery(id) {
    var this_ = this
    wx.showModal({
      title: '提示',
      content: '确定商品已收到吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
          })
          WXAPI.orderDelivery({ orderId: this_.data.orderId }).then((res) => {
            if (res.data.code == 0) {
              let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
              let prevPage = pages[pages.length - 2];
              prevPage.setData({
                changeData: {
                  type: 'confrim',
                  index: this_.data.orderIndex
                },
              })
              wx.showToast({
                title: '收货成功',
              })
              wx.navigateBack()
            } else {
              wx.showToast({
                title: res.data.msg,
              })
            }
            wx.hideLoading()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 去评价
  goReputation(id) {
    // this.$router.push({ path: '/orderReputation', query: { id: id } })
  },
  goRefundApply() {
    wx.showToast({
      title: '当前功能仅针对专业版或者增值版开放',
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