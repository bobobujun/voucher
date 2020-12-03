// pages/login/login.js
import {wxlogin,getAllSupportBank} from '../../services/api/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    bankShow:false,
    bankList:[],
    temBankList:[]
  },

  wxlogin (e) {           // 进行微信登录
    let _this = this;
    wx.login({
      success (res) {
        if (res.code) {
          _this.data.code = res.code
        } else {
          wx.showToast({
            title: '登录失败',
            duration: 2000,
            icon: 'none'
          });
        }
      }
    })
  },
  getPhoneNumber (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let data = {
        jsCode: this.data.code,
        encrypData: e.detail.encryptedData,
        ivData: e.detail.iv
      }
      wxlogin(data).then(res =>{
        if (res.success) {
          wx.setStorageSync('cookie', res.msg)
          if (res.content.status==0) {
            wx.navigateTo({
              url: `/pages/firstWxLogin/firstWxLogin?phone=${res.content.mobileNo}`,
            })
          }else{
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        } else if(res.content){
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
    }
  },
  // 账号密码登录
  phoneLogin(){
    wx.navigateTo({
      url: '/pages/phoneLogin/phoneLogin',
    })
  },
  //关闭弹框银行
  closeBank(){
    this.setData({
      bankShow:false
    })
    wx.removeStorageSync('bankCode')
  },
  //选择银行
  onConfirm(val){
    this.setData({
      bankShow:false
    })
    this.data.temBankList.forEach((item,index)=>{
      if(index===val.detail.index){
        wx.setStorageSync('bankCode', item.bankCode)
      }
    })
  },
  //获取银行列表
  getAllSupportBank(){
    getAllSupportBank().then(res=>{
      if (res.success) {
        this.data.temBankList = res.content//暂存银行列表，以便后面取值对比，去除银行号
        this.filterBank(res.content)
      }
    })
  },
  // 过滤转化列表
  filterBank(arr){
    let bankList = []
    arr.forEach(element => {
     bankList.push(element.bankName)//把银行名字放到picker数组
    });
    this.setData({
      bankList:bankList,
      bankShow:true
    })
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
    this.getAllSupportBank()
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