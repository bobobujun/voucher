import {paymentDetailResult} from '../../services/api/makeOrder'
Page({
  data: {
    activeNames: ['1'],
    itemActiveNames:['1'],
    chelclopse:false,
    clopse:false,
    detailInfo:{}
  },
  // 显示隐藏券码
  onChange(event) {
    this.setData({
      clopse:!this.data.clopse,
      activeNames: event.detail
    });
  },
  //子收起
  itemOnChange(event){
    this.setData({
      chelclopse:!this.data.chelclopse,
      itemActiveNames: event.detail
    });
  },
  paymentDetailResult(){
    paymentDetailResult().then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        this.setData({
          detailInfo:res.content
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
  gotoVoucher() {
    wx.switchTab({
      url: '/pages/index/index',
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
    this.paymentDetailResult()
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