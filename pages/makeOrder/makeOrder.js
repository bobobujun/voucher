import {checkAllVoucherCode,queryAllVoucher} from '../../services/api/makeOrder'
import {encryptSpeciExpMod} from '../../utils/security.js'
let vocherSets = new Set()
let vocherIds = new Set()
let totalAmount = 0
Page({
  data: {
    toGetvoucherListCode:'',//接收首页传过来的券码号
    sourceType:0,//判断是否从首页进入
    orderAmount:'',//订单金额
    voucherAmount:0,//选中券码数量
    totalCheckNum:0,//总共券码数量
    realAmount:0,//实付金额
    isSmallChecked:false,//是否选中同意协议圈圈
    voucherList:[],//券码列表
    firstVoucherList:[]//临时券码列表，便于操作
  },
  // 获取券码列表
  queryAllVoucher() {
    if (this.data.sourceType!=1) {//不是从首页进入，不显示券码列表
      this.setData({
        voucherList:[]
      })
      return
    } 
    queryAllVoucher({
      voucherCode:this.data.toGetvoucherListCode
    }).then(res=>{
      if (res.success) {
        this.addChecked(res.content,1)
        this.data.firstVoucherList = res.content
        wx.setStorageSync('cookie', res.msg)
      }else if(res.content){
        wx.showToast({
          title: res.content,
          duration: 2000,
          icon: 'none'
        });
        const timer = setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
            clearTimeout(timer)
        },2000)
      }else{
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        });
        const timer = setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
            clearTimeout(timer)
        },2000)
      }
    })
  },
  //订单金额改变
  changeMoney(val) {
    // this.data.voucherList.forEach(item=>{
    //   if(item.merchantProductVoucher[0].rechargeAmt>val.detail){
    //     item.notUse = true
    //   }else{
    //     item.notUse = false
    //   }
    // })
    if (this.data.sourceType==1) {
      this.addChecked(this.data.firstVoucherList)
      let value = this.validateNumber(val.detail)//过滤输入框，防止输入特殊字符
      this.setData({//重新输入金额时，恢复到原状
        totalCheckNum:0,
        orderAmount:value,
        realAmount:0,
        isSmallChecked:false
      })
      totalAmount = 0
      vocherSets.clear()
    }
  
  },
  // 校验输入框
  validateNumber(val) {
    val = val.replace(/^(\-)*(\d+)\.(\d{6}).*$/, '$1$2.$3')
    val = val.replace(/[\u4e00-\u9fa5]+/g, ""); //清除汉字
    val = val.replace(/[^\d.]/g, ""); //清楚非数字和小数点
    val = val.replace(/^\./g, ""); //验证第一个字符是数字而不是  
    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //只保留第
    return val
  },
  // 确认券码
  checkSmall() {
    this.setData({
      isSmallChecked:!this.data.isSmallChecked
    })
  },
  // 选中代金券
  checkBig(val) {
    let dataItem = val.currentTarget.dataset.itemdata
    if (!this.data.orderAmount&&dataItem.merchantProductVoucher[0].rechargeAmt!=null&&dataItem.merchantProductVoucher[0].rechargeAmt!=0&&getApp().globalData.paymentSwitch==1) {//没有输入订单金额且优惠券金额不为0时提示
      wx.showToast({
        title: "请先选择订单金额",
        duration: 2000,
        icon: 'none'
      });
      return
    }
    let i = val.currentTarget.dataset.voucherindex
    let currentAmount = dataItem.merchantProductVoucher[0].rechargeAmt*dataItem.checkNum
    if(vocherSets.has(i)){
      vocherSets.delete(i)
      this.data.voucherList[i].checked = false//选中券码取消
      totalAmount -= currentAmount
      // this.data.totalCheckNum -= dataItem.checkNum
      for (let k = 0; k < dataItem.checkNum; k++) {
        vocherIds.delete(dataItem.merchantProductVoucher[k].orderProductVoucherId)//券码列表删除取消选中的券码
      }
    }else{
      vocherSets.add(i)
      this.data.voucherList[i].checked = true
      totalAmount += currentAmount
      // this.data.totalCheckNum += dataItem.checkNum
      for (let k = 0; k < dataItem.checkNum; k++) {
        vocherIds.add(dataItem.merchantProductVoucher[k].orderProductVoucherId)
      }
    }
    if (totalAmount>this.data.orderAmount&&dataItem.merchantProductVoucher[0].rechargeAmt!=null&&dataItem.merchantProductVoucher[0].rechargeAmt!=0&&getApp().globalData.paymentSwitch==1) {
      wx.showToast({
        title: "您选中的优惠券已大于订单金额",
        duration: 2000,
        icon: 'none'
      });
    }
    this.data.totalCheckNum = vocherIds.size
    this.setData({
      voucherList:this.data.voucherList,
      totalCheckNum:this.data.totalCheckNum,
      realAmount:this.data.orderAmount - totalAmount<0?0:this.data.orderAmount - totalAmount
    })
  },
  //确认核销
  confirm() {
    if (this.data.isSmallChecked) {
      wx.showLoading({
        title: '请稍等',
        mask:true
      })
      let voucherIds = Array.from(vocherIds).join(',')
      
      getApp().globalData.checkVoucherInfo.voucherIds = voucherIds
      checkAllVoucherCode({voucherParam:encryptSpeciExpMod(voucherIds)}).then(res=>{
        if (res.success) {
          getApp().globalData.checkVoucherInfo.checkVoucherList = res.content.frontMerchantVoucherVos
          getApp().globalData.checkVoucherInfo.tokenVal = res.content.tokenVal
          getApp().globalData.checkVoucherInfo.orderAmount = this.data.orderAmount
          getApp().globalData.checkVoucherInfo.realAmount = this.data.realAmount
          getApp().globalData.checkVoucherInfo.totalAmount = totalAmount
          wx.navigateTo({
            url: '/pages/result/result'
          })
          wx.hideLoading()
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
    }
    
   
  },
  // 计数器改变
  changeStep(val) {
    let temTotalAmount = totalAmount
    let i = val.currentTarget.dataset.voucherindex
    this.data.voucherList[i].checkNum = val.detail
    if (val.currentTarget.dataset.itemdata.checked) {
      let dataItem = val.currentTarget.dataset.itemdata
      let numStep = Number(val.detail) - Number(dataItem.checkNum)
      // this.data.totalCheckNum =Number(this.data.totalCheckNum)+ Number(numStep)
      let currentAmount = dataItem.merchantProductVoucher[0].rechargeAmt*numStep
      temTotalAmount += currentAmount
      if (temTotalAmount>=Number(this.data.orderAmount)&&dataItem.merchantProductVoucher[0].rechargeAmt!=null&&dataItem.merchantProductVoucher[0].rechargeAmt!=0&&getApp().globalData.paymentSwitch==1) {
        wx.showToast({
          title: "您选中的优惠券已大于订单金额",
          duration: 2000,
          icon: 'none'
        });
      }
      if (numStep>0) {
        for (let k = dataItem.checkNum; k < (dataItem.checkNum+numStep); k++) {
          vocherIds.add(dataItem.merchantProductVoucher[k].orderProductVoucherId)
        }
      }else{
        for (let k = dataItem.checkNum; k > (dataItem.checkNum+numStep); k--) {
          vocherIds.delete(dataItem.merchantProductVoucher[k-1].orderProductVoucherId)
        }
      }
      
    }
    this.data.totalCheckNum = vocherIds.size
    this.setData({
      voucherList:this.data.voucherList,
      totalCheckNum:this.data.totalCheckNum,
      realAmount:this.data.orderAmount - temTotalAmount<0?0:this.data.orderAmount - temTotalAmount
    })
    totalAmount = temTotalAmount
  },
// 给列表加上checked
  addChecked(arr,type) {
    let totalVocherAmount = 0
    arr.forEach(item=>{
      totalVocherAmount += item.count
      item.checked = false
      if(type==1)item.notUse = false
      item.checkNum = 1
    })
    this.setData({
      voucherList:arr,
      voucherAmount:totalVocherAmount
    })
  },
  // 再次添加优惠券  
  againCheck() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onLoad: function (options) {
    this.data.toGetvoucherListCode = options.voucherCode
    this.data.sourceType = options.sourceType
  },

  onReady: function () {

  },

  onShow: function () {
    this.setData({
      voucherAmount:0,
      orderAmount:'',
      realAmount:0,
      totalCheckNum:0,
      isSmallChecked:false
    })
    vocherIds.clear()
    vocherSets.clear()
    this.queryAllVoucher()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.sourceType = 0
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