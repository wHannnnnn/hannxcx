const http = require('./http.js')
const name = 'guoguo/'
const api = {
  banner: name + 'banner/list',
  // 分类列表
  category: name + 'shop/goods/category/all',
  // 商品列表
  shopList: name + 'shop/goods/list',
  // 商品详情
  shopDetail: name + 'shop/goods/detail',
  // 获取价格库存
  getPrice: name + 'shop/goods/price',
  // 获取运费模板
  getlogistics: name + 'shop/goods/price/freight',
  // 获取评论列表
  getReputation: name + 'shop/goods/reputation',
  // 加入购物车
  addCart: name + 'shopping-cart/add',
  // 读取购物车数据
  getCartInfo: name + 'shopping-cart/info',
  // 修改购物车购买数量
  cartNumber: name + 'shopping-cart/modifyNumber',
  // 删除购物车一条数据
  removeCart: name + 'shopping-cart/remove',
  // 清空购物车
  emptyCartL: name + 'shopping-cart/empty',
  // 可领取的优惠券列表
  discountsList: name + 'discounts/coupons',
  // 领取优惠券
  discountsFetch: name + 'discounts/fetch',
  // 我的优惠券
  myDiscounts: name + '/discounts/my',
  // 创建订单
  creatOrder: name + 'order/create',
  // 订单列表
  orderList: name + 'order/list',
  // 订单详情
  orderDetail: name + 'order/detail',
  // 取消订单
  closeOrder: name + 'order/close',
  // 删除订单
  deleteOrder: name + 'order/delete',
  // 申请售后
  refundApply: name + 'order/refundApply/apply',
  // 订单统计
  orderStatistics: name + 'order/statistics',
  // 确认收货
  orderDelivery: name + 'order/delivery',
  // 上传图片至服务器
  uploadFile: name + 'dfs/upload/file',
  // 发布评价
  orderReputation: name + 'order/reputation',
  // 登录模块

  // 小程序用户注册
  wxRegister: name + 'user/wxapp/register/complex',
  wxLogin: name + 'user/wxapp/login',
  bindOpenid: name + 'user/wxapp/bindOpenid',
  // 获取短信验证码
  getSms: name + 'verification/sms/get',
  // 获取图形验证码
  getPic: name + 'verification/pic/get',
  // 校验验证码
  checkSms: name + 'verification/sms/check',
  // 校验图形验证码
  checkPic: name + 'verification/pic/check',
  // 用户注册（手机号）
  userRegister: name + 'user/m/register',
  // 修改用户信息
  userModify: name + 'user/modify',

  // 修改密码
  resetPwd: name + 'user/m/reset-pwd',
  // 用户登录token
  login: name + 'user/m/login',
  //获取用户详情
  userDetail: name + 'user/detail',
  // 获取地址列表
  getAddress: name + 'user/shipping-address/list',
  // 添加收货地址
  addAddress: name + 'user/shipping-address/add',
  // 获取地址详情
  addressDetail: name + 'user/shipping-address/detail/v2',
  // 删除地址
  delAddress: name + 'user/shipping-address/delete',
  // 修改地址
  updateAddress: name + 'user/shipping-address/update',
  // 默认地址
  defaultAddress: name + 'user/shipping-address/default/v2',
  // 经纬度解析
  mapAddress: 'common/map/qq/address',
  // 链接
  partner: name + 'friendly-partner/list'
}
// 请求方法
module.exports = {
  banner: (params) => {
    return http.get(api.banner, params)
  },
  // 商品分类
  category: (params) => {
    return http.get(api.category, params)
  },
  // 商品列表
  shopList: (params) => {
    return http.post(api.shopList, params)
  },
  // 商品详情
  shopDetail: (params) => {
    return http.get(api.shopDetail, params)
  },
  // 获取价格
  getPrice: (params) => {
    return http.post(api.getPrice, params)
  },
  // 获取运费模板
  getlogistics: (params) => {
    return http.get(api.getlogistics, params)
  },
  // 文件上传
  uploadFile: (params) => {
    return http.file(api.uploadFile, params)
  },
  // 获取评论
  getReputation: (params) => {
    return http.post(api.getReputation, params)
  },
  // 加入购物车
  addCart: (params) => {
    return http.post(api.addCart, params)
  },
  // 读取购物车数据
  getCartInfo: (params) => {
    return http.get(api.getCartInfo, params)
  },
  // 修改购物车购买数量
  cartNumber: (params) => {
    return http.post(api.cartNumber, params)
  },
  // 删除购物车一条数据
  removeCart: (params) => {
    return http.post(api.removeCart, params)
  },
  // 清空购物车
  emptyCart: (params) => {
    return http.post(api.emptyCart, params)
  },
  // 可领取的优惠券列表
  discountsList: (params) => {
    return http.get(api.discountsList, params)
  },
  // 领取优惠券
  discountsFetch: (params) => {
    return http.post(api.discountsFetch, params)
  },
  // 我的优惠券
  myDiscounts: (params) => {
    return http.get(api.myDiscounts, params)
  },
  // 下单
  creatOrder: (params) => {
    return http.post(api.creatOrder, params)
  },
  // 获取订单列表
  orderList: (params) => {
    return http.post(api.orderList, params)
  },
  // 订单详情
  orderDetail: (params) => {
    return http.get(api.orderDetail, params)
  },
  // 取消订单
  closeOrder: (params) => {
    return http.post(api.closeOrder, params)
  },
  // 删除订单
  deleteOrder: (params) => {
    return http.post(api.deleteOrder, params)
  },
  // 申请售后
  refundApply: (params) => {
    return http.post(api.refundApply, params)
  },
  // 订单统计
  orderStatistics: (params) => {
    return http.get(api.orderStatistics, params)
  },
  // 确认收货
  orderDelivery: (params) => {
    return http.post(api.orderDelivery, params)
  },
  // 发布评价
  orderReputation: (params) => {
    return http.post(api.orderReputation, params)
  },
  // 登录模块
  // 小程序用户注册
  wxRegister: (params) => {
    return http.post(api.wxRegister, params)
  },
  wxLogin: (params) => {
    return http.post(api.wxLogin, params)
  },
  bindOpenid: (params) => {
    return http.post(api.bindOpenid, params)
  },
  // 小程序用户登录
  // 获取验证码
  getSms: (params) => {
    return http.get(api.getSms, params)
  },
  // 校验验证码
  checkSms: (params) => {
    return http.post(api.checkSms, params)
  },
  // 用户注册（手机）
  userRegister: (params) => {
    return http.post(api.userRegister, params)
  },
  // 用户登录token
  login: (params) => {
    return http.post(api.login, params)
  },
  //用户详情
  userDetail: (params) => {
    return http.get(api.userDetail, params)
  },
  userModify: (params) => {
    return http.post(api.userModify, params)
  },
  // 修改密码
  resetPwd: (params) => {
    return http.post(api.resetPwd, params)
  },
  // 用户地址列表
  getAddress: (params) => {
    return http.get(api.getAddress, params)
  },
  // 添加地址
  addAddress: (params) => {
    return http.post(api.addAddress, params)
  },
  //地址详情
  addressDetail: (params) => {
    return http.get(api.addressDetail, params)
  },
  // 删除地址
  delAddress: (params) => {
    return http.post(api.delAddress, params)
  },
  // 修改地址
  updateAddress: (params) => {
    return http.post(api.updateAddress, params)
  },
  // 默认地址
  defaultAddress: (params) => {
    return http.get(api.defaultAddress, params)
  },
  mapAddress: (params) => {
    return http.get(api.mapAddress, params)
  },
  // 验证码
  getPic: (params) => {
    return http.pic(api.getPic, params)
  },
  checkPic: (params) => {
    return http.post(api.checkPic, params)
  },
  partner: (params) => {
    return http.post(api.partner, params)
  },
}