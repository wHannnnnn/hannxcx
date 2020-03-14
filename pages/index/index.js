//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../utils/request.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
Page({
  behaviors: [computedBehavior],
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    bannerList: null,
    navList: [],
    pageNum: 1,
    pageSize: 2,
    shopList: [],
    errorShow: false,
    isLoadingMoreData: true
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
  //事件处理函数
  getBanner() {
    WXAPI.methods.banner().then((res) => {
      if (res.data.code == 0) {
        this.setData({
          bannerList: res.data.data
        })
      }
    })
  },
  // 获取分类
  categoryList() {
    WXAPI.methods.category().then((res) => {
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
      isLoadingMoreData: true
    })
    this.data.pageNum = 1
    this.getBanner()
    this.categoryList()
    this.getShopList()
  },
  // 上拉加载
  onReachBottom() {
    if (!this.data.isLoadingMoreData || this.data.errorShow) {
      return
    }
    this.getShopList()
  },
  loadMore(){
    this.setData({
      errorShow: false,
      isLoadingMoreData: true
    })
    this.getShopList()
  },
  // 获取商品
  getShopList(id) {
    wx.showLoading({
      title: '加载中',
    })
    var params = {
      page: this.data.pageNum,
      pageSize: this.data.pageSize,
      // category
    }
    WXAPI.methods.shopList(params).then((res) => {
        if (res.data.code == 0) {
          this.setData({
            shopList: this.data.shopList.concat(res.data.data),
            isLoadingMoreData: true
          })
          this.data.pageNum++
          if(res.data.data.length < this.data.pageSize) {
            this.setData({
              isLoadingMoreData: false
            })
          }
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
    }).catch(() => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
    })
  },
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

})
