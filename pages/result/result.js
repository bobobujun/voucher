import {createPaymentOrder} from '../../services/api/makeOrder'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    clopse:false,
    totalNum:0,
    checkVoucherInfo:{},
    paymentSwitch:'',
    payShow:false,
  },
  // 关闭弹框
  payClose(){
    this.setData({
      payShow:false
    })
  },
  // 显示隐藏券码
  onChange(event) {
    this.setData({
      clopse:!this.data.clopse
    })
    this.setData({
      activeNames: event.detail
    });
  },
    // 再次添加优惠券  
    againCheck() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    // 确认收款
    paySure() {
      wx.showLoading({
        title: '请稍等',
        mask:true
      })
      createPaymentOrder({
        voucherIds:this.data.checkVoucherInfo.voucherIds,
        orderAmt:Number(this.data.checkVoucherInfo.orderAmount),
        payCashAmt:this.data.checkVoucherInfo.realAmount,
        tokenVal:this.data.checkVoucherInfo.tokenVal
      }).then(res=>{
        if (res.success) {
          wx.navigateTo({
            url: '/pages/code/code',
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
  // 发起收款
  getPay() {
    this.setData({
      payShow:true
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
    let totalNum = 0
    getApp().globalData.checkVoucherInfo.checkVoucherList.forEach(item=>{
      totalNum+=item.count
    })
    if(getApp().globalData.checkVoucherInfo.orderAmount==''){
      getApp().globalData.checkVoucherInfo.orderAmount = 0
    }
    this.setData({
      paymentSwitch:getApp().globalData.paymentSwitch,
      checkVoucherInfo:getApp().globalData.checkVoucherInfo,
      totalNum:totalNum,
      payShow:false
    })
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