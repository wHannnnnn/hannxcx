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
    pageSize: 10,
    categoryId: null,
    shopList: [],
    hideBottom: true,
    loadMoreData: '加载中……' 
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
    WXAPI.category().then((res) => {
      this.setData({
        allList: res.data.data,
        active: res.data.data[0].id + '',
        categoryId: res.data.data[0].id + ''
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
      hideBottom: true,
      loadMoreData: '加载中...',
      changeIndex: '-1',
      categoryId: e.detail.name
    },function(){
      this.getShopList(e.detail.name)
    })
  },
  // 右侧导航切换
  changeRightNav(e){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNum: 1,
      shopList: [],
      hideBottom: true,
      loadMoreData: '加载中...',
      changeIndex: e.currentTarget.dataset.index+'',
      categoryId: e.currentTarget.dataset.id
    },function(){
      // 获取商品接口
      this.getShopList(e.currentTarget.dataset.id)
    })
  },
  // 上拉加载
  loadMore(){
    this.getShopList(this.data.categoryId)
  },
  // 获取列表
  getShopList(id){
    var params = {
      page: this.data.pageNum,
      pageSize: this.data.pageSize,
      categoryId: id,
    }
    WXAPI.shopList(params).then((res) => {
      if (res.data.code == 0) {
        this.setData({
          hideBottom: false,
          shopList: this.data.shopList.concat(res.data.data),
        })
        this.data.pageNum++
        if (res.data.data.length < this.data.pageSize) {
          this.setData({
            loadMoreData: '已经到底了，看看其他分类吧~~'
          })
        }
      }
      if(res.data.code == 700 && this.data.shopList.length <= 0) {
        this.setData({
          hideBottom: false,
          loadMoreData: '已经到底了，看看其他分类吧~~'
        })
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