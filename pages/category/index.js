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
    isActive: 0,
    activeName: null,
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
    WXAPI.methods.category().then((res) => {
      this.setData({
        allList: res.data.data
      })
    })
  },
  changeRightNav(e){
    console.log(e.currentTarget.dataset)
    this.data.pageNum = 1
    this.setData({
      shopList: [],
      changeIndex: e.currentTarget.dataset.index+''
    })
    // 获取商品接口
    this.getShopList(e.currentTarget.dataset.id)
  },
  getShopList(id){
    var params = {
      page: this.data.pageNum,
      pageSize: this.data.pageSize,
      categoryId: id,
    }
    WXAPI.methods.shopList(params).then((res) => {
      if (res.data.code == 0) {
        this.setData({
          shopList: this.data.shopList.concat(res.data.data),
          isLoadingMoreData: true
        })
        this.data.pageNum++
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