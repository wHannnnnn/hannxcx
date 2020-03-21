//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../utils/request.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
const watchBehavior = require("../../miniprogram_npm/miniprogram-watch/index.js")
Page({
  behaviors: [computedBehavior, watchBehavior],
  data: {
    loginTrue: null,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    bannerList: null,
    navList: [],
    pageNum: 1,
    pageSize: 10,
    shopList: [],
    errorShow: false,
    hideBottom: true,
    noLoad: false,
    loadMoreData: '加载中……' 
  },
  computed: {
    firstList(data) {
      var list = data.navList.filter((ele, index) => {
        return ele.level == 1
      })
      var result = []
      for (var i = 0; i < list.length; i += 10) {
        result.push(list.slice(i, i + 10));
      }
      return result
    },
    leftShopList(data) {
      return data.shopList.filter((ele, index) => {
        return index % 2 == 0
      })
    },
    rightShopList(data) {
      return data.shopList.filter((ele, index) => {
        return index % 2 !== 0
      })
    },
  },
  watch: {
  },
  //事件处理函数
  getBanner() {
    WXAPI.banner().then((res) => {
      if (res.data.code == 0) {
        this.setData({
          bannerList: res.data.data
        })
      }
    })
  },
  // 获取分类
  categoryList() {
    WXAPI.category().then((res) => {
      if (res.data.code == 0) {
        this.setData({
          navList: res.data.data
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      shopList: [],
      errorShow: false,
      hideBottom: true,
      noLoad: false,
      loadMoreData: '加载中...',
    })
    this.data.pageNum = 1
    this.onLoad()
  },
  // 上拉加载
  onReachBottom() {
    if (this.data.noLoad) {
      return
    }
    this.getShopList()
  },
  // 再次点击加载
  loadMore(){
    this.setData({
      errorShow: false,
    })
    this.getShopList()
  },
  // 获取商品
  getShopList(id) {
    var params = {
      page: this.data.pageNum,
      pageSize: this.data.pageSize,
      // category
    }
    WXAPI.shopList(params).then((res) => {
        wx.stopPullDownRefresh()
        if (res.data.code == 0) {
          this.setData({
            hideBottom: false,
            shopList: this.data.shopList.concat(res.data.data),
          })
          this.data.pageNum++
          if(res.data.data.length < this.data.pageSize) {
            this.setData({
              noLoad: true,
              loadMoreData: '已经到底了~~'
            })
          }
        }
        wx.hideLoading()
    }).catch(() => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
    })
  },
  // 添加购物车
  addCart(e){
    var params = {
      goodsId: e.currentTarget.dataset.id,
      number: 1
    }
    WXAPI.addCart(params).then((res) => {
      if(app.globalData.loginTrue) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
        app.globalData.cartRefresh = true
      } else {
          // this.login = this.selectComponent(".login")
          // this.login.showDialog()
      }
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
  // 去分类
  goProduct(){
    console.log(this.data.firstList,123)
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.getBanner()
    this.categoryList()
    this.getShopList()
  },
  onShow(){
    this.setData({
      loginTrue: app.globalData.loginTrue
    })
  }
})
