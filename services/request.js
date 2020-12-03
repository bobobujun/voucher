const config = require('./config.js')
const { getEnv } = require ('./tool.js')
const ENV = getEnv()
const wxRequest = (api, method, params,header) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.apiHost[ENV] + api,
      method: method,
      data: params,
      timeout:10000,
      header: {
        'content-type': header?header:'application/json',
        bankCode:wx.getStorageSync('bankCode')?wx.getStorageSync('bankCode'):'0417',
        'cookie': wx.getStorageSync('cookie')
            ? `MSESSIONID=${wx.getStorageSync('cookie')}`
            : ''
      },   
      success (res) {
        const response = res.data
        if (res.statusCode === 200) {
          if (response.status === 900){
            wx.showToast({
              title: "登录失效，请重新登录",
              duration: 2000,
              icon: 'none'
            });
            wx.redirectTo({
              url: '/pages/login/login'
            })
            reject(response)  
          }else if (response.status === 50000) {
            wx.showToast({
              title: '访问人数过多，请稍后尝试',
              duration: 2000,
              icon: 'none'
            });
          }else{
            resolve(response)
          }
          resolve(response)
        } else {
          wx.showToast({
            title: '访问人数过多，请稍后尝试',
            duration: 2000,
            icon: 'none'
          });
          setTimeout(()=>{
            wx.hideToast()
          },2000)
          reject(response)
        }
      },
      fail (err) {
        wx.showToast({
          title: '访问人数过多，请稍后尝试',
          duration: 2000,
          icon: 'none'
        });
        setTimeout(()=>{
          wx.hideToast()
        },2000) 
        reject(err)
      }
    })
  })
}

module.exports = wxRequest