// pages/firstWxLogin/firstWxLogin.js
import {firstLoginCode,firstLogin} from '../../services/api/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    valueCode:'',
    isFocus:false,
    codeDown:60,
    isSendCode:false,
    timer:null
  },
  // 获取验证码
  getCode() {
    firstLoginCode().then(res=>{
      if (res.success) {
        this.setData({
          isSendCode:false
        })
        this.countDown()
        wx.setStorageSync('cookie', res.msg)
      }else if(res.content){
        wx.showToast({
          title: res.content,
          duration: 2000,
          icon: 'none'
        });
      }else{
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        });
      }
    })
  },
  //倒计时
  countDown() {
    let that = this
    let count = 60
    this.data.timer = setInterval(()=>{
      count--
      that.setData({
        codeDown:count
      })
      if(count<=0){
        that.setData({
          codeDown:60,
          isSendCode:true
        })
        clearInterval(that.data.timer)
      }
    },1000)
  },
  // 获取输入框焦点
  getFocus() {
    this.setData({
      isFocus:true
    })
  },
  //输入框改变
  change(val) {
    this.setData({
      valueCode:val.detail
    })
  },
  // 获取焦点
  login() {
    if (this.data.valueCode.length<6) {
      wx.showToast({
        title: '验证码错误',
        duration: 2000,
        icon: 'none'
      });
      return
    }
    firstLogin({
      smsCode:this.data.valueCode
    }).then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        wx.switchTab({
          url: '/pages/index/index'
        })
      }else if(res.content){
        wx.showToast({
          title: res.content,
          duration: 2000,
          icon: 'none'
        });
      }else{
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        });
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone:options.phone
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
   this.getCode()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer)
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