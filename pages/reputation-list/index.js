const WXAPI = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reputation: [],
    page: 1,
    pageSize: 5,
    goodsId: null,
    errorShow: false,
    hideBottom: true,
    noLoad: false,
    loadMoreData: '加载中……' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '加载中', })
    this.setData({ goodsId: options.goodsId }, function () { this.getReputation() })
  },
  // 上拉加载
  onReachBottom() {
    if (this.data.noLoad) {
      return
    }
    this.getReputation()
  },
  // 再次点击加载
  loadMore() {
    this.setData({
      errorShow: false,
    })
    this.getOrderList(this.data.active)
  },
  getReputation(){
      var params = {
          goodsId: this.data.goodsId,
          page: this.data.page,
          pageSize: this.data.pageSize
      }
      WXAPI.getReputation(params).then((res)=>{
        wx.stopPullDownRefresh()
        if(res.data.code == 0){
            res.data.data.forEach(element => {
                element.goods.goodReputation += 1
            })
            this.setData({
              reputation: this.data.reputation.concat(res.data.data),
              hideBottom: false,
            })
            this.data.page ++
            if (res.data.data.length < this.data.pageSize) {
              this.setData({
                noLoad: true,
                loadMoreData: '已经到底了~~'
              })
            }
        }
        if (res.data.code == 700) {
          this.setData({
            hideBottom: false,
            loadMoreData: '已经到底了，看看其他吧~~'
          })
        }
        wx.hideLoading()
      }).catch(()=>{
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
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      reputation: [],
      errorShow: false,
      hideBottom: true,
      noLoad: false,
      loadMoreData: '加载中...',
      page: 1
    },()=>{
      this.getReputation()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})