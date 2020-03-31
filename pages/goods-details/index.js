// pages/goos-details/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
const WxParse = require('../../wxParse/wxParse.js')
import computedBehavior from '../../miniprogram_npm/miniprogram-computed/index.js'
Page({
  /**
   * 页面的初始数据
   */
  behaviors: [computedBehavior],
  data: {
    dialog1: false,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    shopId: null,
    detailsList: [],
    reputation: [], //评论数据
    discountsList: [],
    Height: "",
    loginTrue: null, 
  },
  imgHeight: function (e) {
    var imgh = e.detail.height,
      imgw = e.detail.width,
      ratio = imgw / imgh;
    var viewHeight = 750 / ratio;
    this.setData({
      Height: viewHeight//设置高度
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  close: function () {
    this.setData({
      dialog1: false,
    });
  },
  open1() {
    this.setData({
      dialog1: true
    });
  },
  onLoad: function (options) {
    wx.showModal({
      title: '邀请人Id',
      content: options.referrer
    })
    this.setData({
      shopId: options.id
    })
    this.getDetails()
  },
  // 商品详情
  getDetails() {
    wx.showLoading({
      title: '加载中',
    })
    WXAPI.shopDetail({ id: this.data.shopId }).then((res) => {
      if (res.statusCode == 200) {
        this.setData({
          detailsList: res.data.data //详情
        })
        wx.hideLoading()
        this.getReputation(this.data.detailsList)
        this.getDiscountsList()
        WxParse.wxParse('article', 'html', res.data.data.content, this, 5)
      }
    })
  },
  // 获取两条评论
  getReputation(data) {
    var params = {
      goodsId: data.basicInfo.id,
      page: 1,
      pageSize: 2
    }
    WXAPI.getReputation(params).then((res) => {
      if (res.data.code == 0) {
        res.data.data.forEach(element => {
          element.goods.goodReputation += 1
        })
        this.setData({
          reputation: res.data.data
        })
      }
    })
  },
  // 去评论页
  goReputation(){
    wx.navigateTo({
      url: `/pages/reputation-list/index?goodsId=${this.data.shopId}`,
    })
  },
  //获取优惠券列表
  getDiscountsList() {
    WXAPI.discountsList().then((res) => {
      this.setData({
        discountsList: res.data.data
      })
    })
  },
  // 领取优惠券
  getDiscount(e) {
    if (!this.data.loginTrue) return
    WXAPI.discountsFetch({ id: e.currentTarget.dataset.id }).then((res) => {
      if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功',
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
  },
  // 添加购物车
  addCart() {
    if(!this.data.loginTrue) return
    var params = {
      goodsId: this.data.shopId,
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
      wx.showToast({
        title: '授权成功',
        icon: 'success',
      })
      app.globalData.loginTrue = true
      wx.setStorageSync('token', data.data.data.token)
      wx.setStorageSync('uid', data.data.data.uid)
      wx.setStorageSync('userInfo', detail)
      this.onShow()
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loginTrue: app.globalData.loginTrue
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
    return {
      title: 'hann的小店',
      path: `/pages/goods-details/index?id=${this.data.shopId}&referrer=${wx.getStorageSync('uid')}`
    }
  }
})