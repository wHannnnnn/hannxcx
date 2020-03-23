// pages/address/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    fromOrder: null
  },
  getAddress() {
    WXAPI.getAddress().then((res) => {
      if (res.data.code == 0) {
        this.setData({
          addressList: res.data.data
        })
      } else {
        this.setData({
          addressList: []
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }

    })
  },
  // 添加地址
  addAddress(){
    wx.navigateTo({
      url: '/pages/add-address/index',
    })
  },
  // 编辑地址
  edidAddress(e){
    wx.navigateTo({
      url: `/pages/add-address/index?id=${e.currentTarget.dataset.id}`,
    })
  },
  deleteAddress(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除地址？',
      success(res) {
        if (res.confirm) {
          WXAPI.delAddress({ id: e.currentTarget.dataset.id }).then((res) => {
            if (res.data.code == 0) {
              that.onShow()
              wx.showToast({
                title: '删除成功',
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
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeAddress(e){
    wx.setStorageSync('addressId', e.currentTarget.dataset.id)
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();//页面对象
    let prevpage = pages[pages.length - 2];//上一个页面对象
    if (prevpage.route == 'pages/place-order/index'){
      this.setData({
        fromOrder: true
      })
    }
    console.log(prevpage.route)
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
    this.getAddress()
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