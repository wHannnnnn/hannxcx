const WXAPI = require('../../utils/request.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    discountsList: []
  },
  behaviors: [computedBehavior],
  computed: {
    normalList(data) {
      var newarr = data.discountsList.filter(item => {
        return item.status == 0
      })
      return newarr
    },
    effectList(data) {
      var newarr = data.discountsList.filter(item => {
        return item.status !== 0
      })
      return newarr
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdiscount()
  },
  getdiscount() {
    WXAPI.myDiscounts().then((res) => {
      this.setData({
        discountsList: res.data.data
      })
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