// component/alldata/index.js
const WXAPI = require('../../utils/request.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    alldata: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 删除订单
    deleteOrder(e) {
      var this_ = this
      wx.showModal({
        title: '提示',
        content: '确定要删除订单吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请稍等',
            })
            WXAPI.deleteOrder({ orderId: e.currentTarget.dataset.id }).then((res) => {
              if (res.data.code == 0) {
                this_.data.alldata.orderList.splice(e.currentTarget.dataset.index, 1)
                this_.triggerEvent('update', this_.data.alldata.orderList)
                wx.showToast({
                  title: '删除成功',
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                })
              }
              wx.hideLoading()
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 确认收货
    orderDelivery(e) {
      var this_ = this
      wx.showModal({
        title: '提示',
        content: '确定商品已收到？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请稍等',
            })
            WXAPI.orderDelivery({ orderId: e.currentTarget.dataset.id }).then((res) => {
              if (res.data.code == 0) {
                const params = {
                  index: e.currentTarget.dataset.index,
                  status: '3',
                  statusStr: '待评价'
                }
                this_.triggerEvent('deliveryUpdate', params)
                wx.showToast({
                  title: '收货成功',
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                })
              }
              wx.hideLoading()
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 详情页
    goOrderDetail(e){
      wx.navigateTo({
        url: `/pages/order-detail/index?orderId=${e.currentTarget.dataset.id}&orderIndex=${e.currentTarget.dataset.index}`,
      })
    },
    // 评价                                                                                   
    goReputation(e){
      wx.navigateTo({
        url: `/pages/order-reputation/index?id=${e.currentTarget.dataset.id}&orderIndex=${e.currentTarget.dataset.index}`,
      })
    }
  }
})
