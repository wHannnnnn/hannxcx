// pages/category/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    allList: [],
    childrenList: [],
    active: null,
    changeIndex: -1,
    pageNum: 1,
    pageSize: 5,
    shopList: []
  },
  computed: {
    allData(data) {
      var newArr = []
      data.allList.forEach(ele => {
        if (ele.level == 1) {
          let level2Arr = data.allList.filter(v => {
            return ele.id == v.pid
          })
          if (level2Arr.length > 0) {
            level2Arr.forEach(e => {
              let level3Arr = data.allList.filter(v => {
                return e.id == v.pid
              })
              e.children = level3Arr
            })
          }
          ele.children = level2Arr
          newArr.push(ele)
        }
      });
      return newArr
    },

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.categoryList()
  },
  categoryList() {
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.methods.category().then((res) => {
      this.setData({
        allList: res.data.data,
        active: res.data.data[0].id + ''
      })
    }).then(()=>{
      this.getShopList(this.data.active)
    })
  },
  // 左侧tab切换
  onChange(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNum: 1,
      shopList: [],
      changeIndex: '-1'
    })
    this.getShopList(e.detail.name)
  },
  // 右侧导航切换
  changeRightNav(e){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNum: 1,
      shopList: [],
      changeIndex: e.currentTarget.dataset.index+''
    })
    // 获取商品接口
    this.getShopList(e.currentTarget.dataset.id)
  },
  // 获取列表
  getShopList(id){
    var params = {
      page: this.data.pageNum,
      pageSize: this.data.pageSize,
      categoryId: id,
    }
    WXAPI.methods.shopList(params).then((res) => {
      if (res.data.code == 0) {
        this.setData({
          pageNum: this.data.pageNum++,
          shopList: this.data.shopList.concat(res.data.data)
        })
        if (res.data.data.length < this.data.pageSize) {
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
  addCart(){},
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