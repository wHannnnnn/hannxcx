const app = getApp()
const WXAPI = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productName: '',
    searchList: [],
    option: [
      { text: '全部商品', value: '' },
      { text: '推荐商品', value: 1 },
    ],
    recommendStatus: '',
    orderBy: '',
    page: 1,
    pageSize: 10,
    searchCon: true, //搜索显示
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ historyList: wx.getStorageSync('searchValue')})
  },
  goSearch(e) {
    if (e.detail) {
      if (wx.getStorageSync('searchValue')) {
        var arr = wx.getStorageSync('searchValue')
        if (arr.indexOf(e.detail) !== -1) {
          arr.splice(arr.indexOf(e.detail), 1)
        } else {
          arr.length >= 10 && arr.pop()
        }
        arr.unshift(e.detail)
      } else {
        var arr = []
        arr.push(e.detail)
      }
      wx.setStorageSync('searchValue', arr)
      this.setData({
        historyList: arr,
        productName: e.detail,
        searchCon: false
      }, () => { this.reset()})
    } else {
      wx.showToast({
        title: '请输入内容',
      })
    }
  },
  historyClick(e) {
    this.setData({ productName: e.currentTarget.dataset.item, searchCon: false }, () => { this.reset() })
    var arr = wx.getStorageSync('searchValue')
    if (arr.indexOf(value) !== -1) {
      arr.splice(arr.indexOf(value), 1)
      arr.unshift(value)
      wx.setStorageSync('searchValue', arr)
      this.setData({ historyList: arr })
    }
  },
  deleteHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空全部历史记录?',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('searchValue')
          this.setData({ historyList: [] })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  searchFocus(e) {
    this.setData({ searchCon: true})
  },
  reset() {
    this.setData({ 
      searchList: [],
      page: 1
    }, () => { this.search()})
  },
  ordersUp() {
    this.setData({ orderBy: 'ordersDown' }, () => { this.reset() })
  },
  changeStatus(e) {
    this.setData({ recommendStatus: e.detail }, () => { this.reset() })
  },
  priceUp() {
    this.data.orderBy == 'priceUp' ? this.setData({ orderBy: 'priceDown' }, () => { this.reset() }) : this.setData({ orderBy: 'priceUp' }, () => { this.reset() })
  },
  addedUp() {
    this.data.orderBy == 'addedUp' ? this.setData({ orderBy: 'addedDown' }, () => { this.reset() }) : this.setData({ orderBy: 'addedUp' }, () => { this.reset() })
  },
  search() {
    wx.showLoading({
      title: '加载中',
    })
    var params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      orderBy: this.data.orderBy,
      recommendStatus: this.data.recommendStatus,
      nameLike: this.data.productName
    }
    WXAPI.shopList(params).then((res) => {
      if (res.data.code == 0) {
        this.setData({ searchList: this.data.searchList.concat(res.data.data)})
        this.data.page++
        if (res.data.data.length < this.data.pageSize) {
          this.setData({
            noLoad: true,
            loadMoreData: '已经到底了~~'
          })
        }
      }
      if (res.data.code == 700) {
        this.setData({
          loadMoreData: '已经到底了，看看其他吧~~'
        })
      }
      wx.hideLoading()
    }).catch(() => {
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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