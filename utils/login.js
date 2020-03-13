// 登录逻辑： token > sessionKey是否过期 > token是否过期 > wx.login获取code > 接口获取用户信息
// 检测登录状态
 function hasLogin(){
  const token = wx.getStorageSync('token')
  if(!token) {
    return false
  }
  const loggined =  checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  // 接口校验
  // const checkTokenRes = await WXAPI.checkToken(token)
  // if (checkTokenRes.code != 0) {
  //   wx.removeStorageSync('token')
  //   return false
  // }
  return true
}
 function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}
module.exports = {
  hasLogin: hasLogin,
}