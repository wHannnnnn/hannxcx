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
    loadMoreData: '加载中……',
    loginTrue: null,
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.categoryId) {
      this.setData({
        categoryId: app.globalData.categoryId + '',
        active: app.globalData.categoryId + ''
      })
      // this.getShopList(app.globalData.categoryId)
    }
    this.setData({
      loginTrue: app.globalData.loginTrue
    })
  },
  // 去搜索
  showInput() {
    wx.navigateTo({
      url: '/pages/product-list/index',
    })
  },
  categoryList() {
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.category().then((res) => {
      if (app.globalData.categoryId) {
        this.setData({
          allList: res.data.data,
          active: app.globalData.categoryId + '',
          categoryId: app.globalData.categoryId + ''
        })
      } else {
        this.setData({
          allList: res.data.data,
          active: res.data.data[0].id + '',
          categoryId: res.data.data[0].id + ''
        })
      }
    }).then(()=>{
      this.getShopList(this.data.active)
    })
  },
  // 左侧tab切换
  onChange(e) {
    this.setData({
      pageNum: 1,
      shopList: [],
      loadMoreData: '加载中...',
      noLoad: false,
      changeIndex: '-1',
      categoryId: e.detail.name,
      active: e.detail.name
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
      loadMoreData: '加载中...',
      noLoad: false,
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
      if(res.data.code == 700) {
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
  // 去详情
  goDetails(e) {
    wx.navigateTo({
      url: `/pages/goods-details/index?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 添加购物车
  addCart(e) {
    if (!this.data.loginTrue) return
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
      } else {
        wx.showToast({
          title: res.data.msg,
        })
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
          that.login(e.detail)
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        }
      }
    })
  },
  login(detail) {
    var this_ = this
    wx.login({
      success(res) {
        if (res.code) {
          WXAPI.wxLogin({ code: res.code, type: 2 }).then((data) => {
            if (data.data.code == 10000) {
              // 去注册
              this_.register(detail)
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
            this_.setData({
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
        }
      }
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
            let referrer = app.globalData.referrer ? app.globalData.referrer : '' // 推荐人
            var params = {
              code: code,
              encryptedData: encryptedData,
              iv: iv,
              referrer: referrer
            }
            WXAPI.wxRegister(params).then((res) => {
              // 登录
              setTimeout(function () {
                _this.login(detail)
              }, 1000)
            })
          }
        })
      }
    })
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