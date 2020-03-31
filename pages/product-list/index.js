const app = getApp()
const WXAPI = require('../../utils/request.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    loginTrue: null,
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
    historyList: [],
    errorShow: false,
    hideBottom: true,
    noLoad: false,
    loadMoreData: '加载中……' 
  },
  computed: {
    leftShopList(data) {
      return data.searchList.filter((ele, index) => {
        return index % 2 == 0
      })
    },
    rightShopList(data) {
      return data.searchList.filter((ele, index) => {
        return index % 2 !== 0
      })
    },
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
    this.setData({ historyList: wx.getStorageSync('searchValue'), loginTrue: app.globalData.loginTrue})
  },
  // 上拉加载
  onReachBottom() {
    if (this.data.noLoad) {
      return
    }
    this.search()
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
        searchCon: false,
        hideBottom: false,
        recommendStatus: '',
        orderBy: '',
        loadMoreData: '加载中...'
      }, () => { this.reset()})
    } else {
      wx.showToast({
        title: '请输入内容',
      })
    }
  },
  historyClick(e) {
    this.setData({productName: e.currentTarget.dataset.item, searchCon: false, loadMoreData: '加载中...', hideBottom: false, recommendStatus: '', orderBy: '',}, () => { this.reset() })
    var arr = wx.getStorageSync('searchValue')
    if (arr.indexOf(e.currentTarget.dataset.item) !== -1) {
      arr.splice(arr.indexOf(e.currentTarget.dataset.item), 1)
      arr.unshift(e.currentTarget.dataset.item)
      wx.setStorageSync('searchValue', arr)
      this.setData({ historyList: arr })
    }
  },
  deleteHistory() {
    var this_ = this
    wx.showModal({
      title: '提示',
      content: '确定要清空全部历史记录?',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('searchValue')
          this_.setData({ historyList: [] })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  searchFocus(e) {
    this.setData({ searchCon: true, hideBottom: true})
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
  // 去详情
  goDetails(e) {
    wx.navigateTo({
      url: `/pages/goods-details/index?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 添加购物车
  addCart(e) {
    if(!this.data.loginTrue) return
    var params = {
      goodsId: e.currentTarget.dataset.id,
      number: 1
    }
    WXAPI.addCart(params).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
        app.globalData.cartRefresh = true
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },
  // 去购物车
  goShop(){
    wx.switchTab({
      url: '/pages/shop/index',
    })
  },
  // 获取用户信息
  bindGetUserInfo(e) {
    var that = this
    // 用户允许授权
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      // 返回上一级
      return false;
    }
    var that = this
    wx.showLoading({
      title: '请稍等',
    })
    wx.login({
      success(res) {
        if (res.code) {
          that.login(res.code, e.detail)
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        }
      }
    })
  },
  login(code, detail) {
    WXAPI.wxLogin({ code: code, type: 2 }).then((data) => {
      if (data.data.code == 10000) {
        // 去注册
        wx.hideLoading()
        this.register(detail)
        return;
      }
      if (data.data.code != 0) {
        wx.showModal({
          title: '无法登录',
          content: data.msg,
          showCancel: false
        })
        wx.hideLoading()
        return;
      }
      this.setData({
        loginTrue: true
      })
      wx.showToast({
        title: '授权成功',
        icon: 'success',
      })
      app.globalData.loginTrue = true
      wx.setStorageSync('token', data.data.data.token)
      wx.setStorageSync('uid', data.data.data.uid)
      wx.setStorageSync('userInfo', detail)
      wx.hideLoading()
    })
  },
  register(detail) {
    let _this = this;
    wx.login({
      success: function (res) {
        let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            let iv = res.iv;
            let encryptedData = res.encryptedData;
            let referrer = app.globalData.referrer // 推荐人
            var params = {
              code: code,
              encryptedData: encryptedData,
              iv: iv,
              referrer: referrer
            }
            WXAPI.wxRegister(params).then((res) => {
              // 登录
              _this.login(code, detail)
            })
          }
        })
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})