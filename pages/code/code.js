import {getQRcodeForUser,paymentDetailResult,cancelOrder} from '../../services/api/makeOrder'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrContent:'',
    popShow:false,
    timer:null
  },
  // 获取二维码
  getQRcodeForUser() {
    getQRcodeForUser().then(res=>{
      if (res.success) {
       let base64 = res.content.replace(/[\r\n]/g, "")
        this.setData({
          qrContent:base64
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
  //取消收款
  cancelPay() {
    this.setData({
      popShow:true
    })
  },
  //弹框取消
  close(){
    this.setData({
      popShow:false
    })
  },
  // 弹框确认
  sure(){ 
    cancelOrder().then(res=>{
    if (res.success) {
      wx.setStorageSync('cookie', res.msg)
      wx.navigateBack({
        delta: 1
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
  //查看支付订单
  lookPayOrder(){
    wx.showLoading({
      title: '请稍等',
      mask:true
    })
    paymentDetailResult().then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        wx.navigateTo({
          url: '/pages/codeResult/codeResult',
        })
        wx.hideLoading()
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
    this.getQRcodeForUser()
    let that = this
    this.data.timer = setInterval(()=>{
      that.getQRcodeForUser()
    },10*60*1000)
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