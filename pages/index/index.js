//index.js
import {getStoreIndexDetail,getVoucherName} from '../../services/api/vecher'
import {queryAllVoucher} from '../../services/api/makeOrder'
import {loginOut} from '../../services/api/login'
import Dialog from '../../components/vant/dialog/dialog';
console.log(11)
Page({
  data: {
    storeInfo:'',//店铺信息
    code:'',//券码号
    popShow: false,
    susShow:false,
    textResult:'',
    loginoutShow:false,
    isLoginout:true,
    checkVouPop:false
  },
  // 获取商户信息
  getStoreIndexDetail(){
    getStoreIndexDetail().then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        this.setData({
          storeInfo:res.content
        })
        getApp().globalData.paymentSwitch = res.content.paymentSwitch
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
  // 退出登录弹框
  loginout() {
    this.setData({
      loginoutShow:true,
      isLoginout:false
    })
  },
  // 取消登录弹框
  loginClose() {
    this.setData({
      loginoutShow:false,
      isLoginout:true
    })
  },
  // 确定退出登录
  loginSure() {
    loginOut().then(res=>{
      if (res.success) {
        wx.navigateTo({
          url: '/pages/login/login',
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
  // 开始扫码
  scan() {
    let that = this
    wx.scanCode({
      scanType: ['qrCode'],
      success (res) {
        that.setData({
          code:res.result
        })
      }
    })
  },
  // 获取输入框
  getCodeValue(val) {
    this.setData({
      code:val.detail
    })
  },
  // 确定按钮
  sure() {
    if (this.data.code == '') {
      this.setData({
        popShow:true,
        textResult:'请先输入券码!'
      })
    }else{
      wx.showLoading({
        title: '请稍等',
        mask:true
      })
      getVoucherName({
        voucherCode:this.data.code
      }).then(res=>{
        if (res.success) {
          wx.hideLoading()
          wx.setStorageSync('cookie', res.msg)
          this.confirmVoucher(res.content)
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
    }
  },
  //确认核销券码
  confirmVoucher(name){
    var me = this
    Dialog.confirm({
      message: '您当前正在核销的券码为'+name+'一张,请再次确认！',
      customStyle:'font-size:16px'
    })
      .then(() => {
        wx.showLoading({
          title: '请稍等',
          mask:true
        })
        queryAllVoucher({
          voucherCode:me.data.code
        }).then(res=>{
          if (res.success) {
            wx.navigateTo({
              url: `/pages/makeOrder/makeOrder?voucherCode=${me.data.code}&sourceType=1`,
            })
            wx.hideLoading()
            wx.setStorageSync('cookie', res.msg)
            this.setData({
              code:''
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
      })
      .catch(() => {
        Dialog.close();
      });
  },
  //弹框关闭
  onClose(){
    this.setData({
      popShow:false,
      susShow:false
    })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStoreIndexDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      loginoutShow:false,
      isLoginout:true
    })
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
