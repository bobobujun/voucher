// pages/phoneLogin/phoneLogin.js
import {getPhoneCode,phoneLogin} from '../../services/api/login'
import {encryptSpeciExpMod} from '../../utils/security.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    password: '',
    smsCode:'',
    codeText:'发送验证码', 
    isclick:false,
    isCorect:false,
    codeTips:'',
    showSlide:true
  },
  //获取手机号
  getPhone(val){
    this.setData({
      mobile:val.detail
    })
  },
  // 获取密码
  getPwd(val){
    this.setData({
      password:val.detail
    })
  },
  //获取验证码
  getCode(val){
    this.data.smsCode = val.detail
  },
  //发送验证码
  sendCode(){
    if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(this.data.mobile))) {
      wx.showToast({
        title: '手机号码格式有误!',
        duration: 2000,
        icon: 'none'
      });
      return
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码不能为空!',
        duration: 2000,
        icon: 'none'
      });
      return
    }
    if (!this.data.isclick) {
      this.getPhoneCode()
    }
  },
    //获取后台验证码
  getPhoneCode() {
    let data = {
      mobile: this.data.mobile,
      password:encryptSpeciExpMod(this.data.password)
    }
    getPhoneCode(data).then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        let that = this
        let count = 60
        let timer = setInterval(function(){
          that.setData({
            isclick:true,
            codeText: count + 's后重发',
            codeTips:res.content
          })
          count--
          if (count==0) {
            clearInterval(timer)
            that.setData({
              codeText: '发送验证码',
              isclick:false
            })
          }
        },1000)
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
  // 登录
  login() {
    if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(this.data.mobile))) {
      wx.showToast({
        title: '手机号码格式有误!',
        duration: 2000,
        icon: 'none'
      });
      return
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码不能为空!',
        duration: 2000,
        icon: 'none'
      });
      return
    }
    if (!this.data.smsCode) {
      wx.showToast({
        title: '验证码不能为空!',
        duration: 2000,
        icon: 'none'
      });
      return
    }
    phoneLogin(
      {
        mobile:this.data.mobile,
        password:encryptSpeciExpMod(this.data.password),
        smsCode:this.data.smsCode
      }
    ).then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        wx.switchTab({
          url: '/pages/index/index',
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
  //关闭滑动验证码
  closeSlide(e){

    this.setData({
      showSlide:false
    })
  },
  //验证滑动验证码
  checkSlide(e){
    // console.log(e)
    const slide = this.selectComponent('#slides');
    slide.setData({
      slideLeft:10,
      isTransition:true
    })
    slide.data.isRecover = true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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