const app = getApp()
const host = 'https://api.it120.cc/guoguo/';
const getToken = function () {
  if (!wx.getStorageSync('token')) {
    return ''
  } else {
    return wx.getStorageSync('token')
  }
}
const get = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: host + url,
      data: Object.assign({ token: getToken() }, param),
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        if (res.data.code == 2000) {
          // 授权
          app.globalData.loginTrue = false
        }
        resolve(res)
      },
      error: (e) => {
        reject(e);
      }
    })
  })
}
const post = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: host + url,
      data: Object.assign({ token: getToken() }, data),
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        if (res.data.code == 2000) {
          // 授权
          app.globalData.loginTrue = false
        }
        resolve(res)
      },
      error: (e) => {
        reject(e);
      }
    })
  })
}
module.exports.get = get
module.exports.post = post