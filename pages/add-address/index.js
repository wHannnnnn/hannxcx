// pages/add-address/index.js
const app = getApp()
const WXAPI = require('../../utils/request.js')
import areaList from '../../utils/area.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaShow: false,
    areaStr: '',
    areaList: null,
    provinceId: null,
    cityId: null,
    districtId: null,
    addressData: {},
    isDefault: false,
    addressId: null,
    mapAddress: null,
    latitude: null,
    longitude: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      addressId: options.id,
      areaList: areaList
    })
    if (options.id){
      this.getAddressDetail()
    }
  },

  // 地址详情
  getAddressDetail() {
    WXAPI.addressDetail({ id: this.data.addressId }).then((res) => {
      if (res.data.code == 0) {
        this.setData({
          addressData: {
            linkMan: res.data.data.info.linkMan,
            mobile: res.data.data.info.mobile,
            address: res.data.data.info.code,
          },
          areaStr: res.data.data.info.address,
          isDefault: res.data.data.info.isDefault,
          provinceId: res.data.data.info.provinceId,
          cityId: res.data.data.info.cityId,
          districtId: res.data.data.info.districtId,
          latitude: res.data.data.info.latitude,
          longitude: res.data.data.info.longitude
        })
      }
    })
  },
  // 选择地区
  changArea(){
    this.setData({
      areaShow: true
    })
  },
  // 取消地区选择
  onClose(){
    this.setData({
      areaShow: false
    })
  },
  // 是否默认地址
  onChangeDefault(){
    this.setData({ isDefault: !this.data.isDefault });
  },
  // 去地图
  goMap(){
    var that = this
    wx.getSetting({
      success: function (res) {
        // 已授权
        if(res.authSetting['scope.userLocation']){
          if (that.data.addressId) {
            console.log(that.data.latitude, 999)
            wx.navigateTo({
              url: `/pages/map/index?latitude=${that.data.latitude}&longitude=${that.data.longitude}`,
            })
          } else {
            console.log(that.data.latitude, 888)
            wx.getLocation({
              type: 'wgs84',
              success: function (res) {
                console.log(res)
                var latitude = res.latitude
                var longitude = res.longitude
                wx.navigateTo({
                  url: `/pages/map/index?latitude=${res.latitude}&longitude=${res.longitude}`,
                })
              },
            })
          }
        } else {
          console.log(that.data.latitude, 777)
          // wx.navigateTo({
          //   url: `/pages/map/index?latitude=${that.data.latitude}&longitude=${that.data.longitude}`,
          // })
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              if (that.data.addressId) {
                wx.navigateTo({
                  url: `/pages/map/index?latitude=${that.data.latitude}&longitude=${that.data.longitude}`,
                })
              } else {
                var latitude = res.latitude
                var longitude = res.longitude
                wx.navigateTo({
                  url: `/pages/map/index?latitude=${res.latitude}&longitude=${res.longitude}`,
                })
              }
            },
            fail: function(res) {
              wx.showModal({
                title: '提示',
                content: '开通位置权限',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function(){
                        if(data.authSetting['scope.userLocation'] == true) {
                          wx.showToast({
                            title: '成功 ',
                            icon: 'none',
                          })
                          wx.getLocation({
                            type: 'wgs84',
                            success: function (res) {
                              var latitude = res.latitude
                              var longitude = res.longitude
                              wx.navigateTo({
                                url: `/pages/map/index?latitude=${res.latitude}&longitude=${res.longitude}`,
                              })
                            },
                          })
                        }
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  // 提交
  bindSave(e) {
    var data = e.detail.value
    if (!data.linkMan || !data.mobile || !data.address || !this.data.areaStr) {
      wx.showToast({
        title: '请填完信息！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var params = {
      linkMan: data.linkMan,
      mobile: data.mobile,
      provinceId: this.data.provinceId,
      cityId: this.data.cityId,
      districtId: this.data.districtId,
      address: this.data.areaStr,
      isDefault: this.data.isDefault,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      code: data.address
    }

    // if (this.$route.query.id) {
    //   // 修改
    //   this.$http.updateAddress(Object.assign(params, { id: this.$route.query.id })).then((res) => {
    //     if (res.data.code == 0) {
    //       this.$notify({ type: 'success', message: '添加成功' });
    //       this.$router.go(-1)
    //     } else {
    //       this.$notify({ type: 'danger', message: res.data.msg });
    //     }
    //   })
    // } else {
    //   // 添加
    WXAPI.addAddress(params).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
    // }
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
    if (this.data.mapAddress) {
      // 根据经纬度获取code
      var params = {
        location: `${this.data.mapAddress.latitude},${this.data.mapAddress.longitude}`
      }
      var that = this
      console.log(this.data.mapAddress)
      WXAPI.mapAddress(params).then((res) => {
        if(res.data.code == 0) {
          // 查找code
          this.setData({
            provinceId: that.findKey(areaList.province_list,res.data.data.result.address_component.province),
            cityId: that.findKey(areaList.city_list, res.data.data.result.address_component.city),
            districtId: that.findKey(areaList.county_list, res.data.data.result.address_component.district),
            latitude: res.data.data.result.location.lat,
            longitude: res.data.data.result.location.lng,
            areaStr: that.data.mapAddress.addr
          })
          // areaList
        } else {

        }
      })
    }
  },
  findKey(obj,value,compare=(a,b)=>a===b){
    return Object.keys(obj).find(k=>compare(obj[k],value))
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