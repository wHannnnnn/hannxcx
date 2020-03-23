const app = getApp()
const WXAPI = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: '4',
    page: 1,
    pageSize: 10,
    goodsMap: {},
    logisticsMap: {},
    allData: {
      orderList: [],
      goodsMap: {},
      logisticsMap: {}
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.status ? this.setData({ active: options.status }) : this.setData({ active: '4' })
    this.getOrderList(options.status)
  },
  tabChange(e) {
    // this.$router.replace({ path: '/orderList', query: { status: e.detail.name } })
    this.setData({
      ['allData.orderList']: [],
      ['allData.goodsMap']: {},
      ['allData.logisticsMap']: {},
      page: 1
    })
    this.getOrderList(e.detail.name)
  },
  getOrderList(status) {
    var params = {
      status: status == '4' ? '' : status,
      page: this.data.page,
      pageSize: this.data.pageSize
    }
    WXAPI.orderList(params).then((res) => {
      if (res.data.code == 0) {
        const newdata = this.data.allData
        newdata.orderList = this.data.allData.orderList.concat(res.data.data.orderList)
        newdata.goodsMap = Object.assign(this.data.allData.goodsMap, res.data.data.goodsMap)
        newdata.logisticsMap = Object.assign(this.data.allData.logisticsMap, res.data.data.logisticsMap)
        this.setData({
          allData: newdata
        })
        console.log(this.data.allData)
        // this.allData.orderList = this.allData.orderList.concat(res.data.data.orderList)
        // this.allData.goodsMap = Object.assign(this.allData.goodsMap, res.data.data.goodsMap)
        // this.allData.logisticsMap = Object.assign(this.allData.logisticsMap, res.data.data.logisticsMap)
        this.data.page++
      } else {
      }
    }).catch(() => {
    })
  },
  // 确认收货
  orderDelivery(id, index) {
    this.$dialog.confirm({
      message: `确定商品已收到吗?`,
      cancelButtonText: '我再想想'
    }).then(() => {
      this.$http.orderDelivery({ orderId: id }).then((res) => {
        if (res.data.code == 0) {
          this.allData[index].status = 3
          this.$toast.success('收货成功')
        }
      })
    })
  },
  // 去评价
  goReputation(id) {
    this.$router.push({ path: '/orderReputation', query: { id: id } })
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