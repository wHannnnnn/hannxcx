const app = getApp()
const WXAPI = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    discountsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDiscountsList()
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