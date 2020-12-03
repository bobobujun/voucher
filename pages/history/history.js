// pages/history/history.js
import {qHistoryList,queryVoucherCount,pageForPayment} from '../../services/api/history'
import {formatTime} from '../../utils/util'
let payorder = new Set()
Page({
  data: {
    qList:[],//未支付券码列表
    payList:[],//已支付列表
    activeNames:null,
    voucherNumList:[],//筛选未支付券码列表
    voucherIndex:'',
    productId:'',
    promotionId:'',
    item:2,
    timeType:'',//开始时间和结束时间标记
    dropTitle: '券码',
    dateShow:false,
    startTimes:'请选择时间',
    startTime:'',
    endTime:'',
    endTimes:'请选择时间',
    voucherPageNum:1,//未支付分页页数
    payPageNum:1,//已支付分页页数
    voucherHasNextPage:false,//false时为最后一页
    payHasNextPage:false,//false时为最后一页
    currentDate: new Date().getTime()
  },
  //获取券码数量列表
  queryVoucherCount() {
    queryVoucherCount().then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        let count = 0
        res.content.forEach(item => {
          count +=item.voucherCount
        })
        let data  = {
          productId: null,
          productName: null,
          promotionId: null,
          promotionName: '全部',
          voucherCount: count,
        }
        res.content.unshift(data)
        this.setData({
          voucherNumList:res.content
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
  //获取券码列表
  getQlist(type) {
    let data = {
      pageNum:this.data.voucherPageNum,
      useTimeBegin:this.data.startTime,
      useTimeEnd:this.data.endTime,
      promotionId:this.data.promotionId,
      productId:this.data.productId
    }
    qHistoryList(data).then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        res.content.list.map(item=>{
          item.useTime = formatTime(item.useTime)
        })
        this.data.voucherHasNextPage = res.content.hasNextPage
        if (type === 1) {//为1表示下拉获取分页列表
          this.setData({
            qList:this.data.qList.concat(res.content.list)
          })
        } else {//最新的列表，第一页
          this.setData({
            qList:res.content.list
          })
        }
        
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
  //获取买单列表
  pageForPayment(type) {
    let data = {
      pageNum:this.data.payPageNum,
      payDateBegin:this.data.startTime,
      payDateEnd:this.data.endTime,
    }
    pageForPayment(data).then(res=>{
      if (res.success) {
        wx.setStorageSync('cookie', res.msg)
        res.content.list.map(item=>{
          item.payDate = formatTime(item.payDate)//修改时间格式
          item.collapse = false//增加是否展开字段
        })
        this.data.payHasNextPage = res.content.hasNextPage
        if (type === 1) {//type和上一样
          this.setData({
            payList:this.data.payList.concat(res.content.list)
          })
        } else {
          this.setData({
            payList:res.content.list
          })
        }
        
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
  // 显示时间弹框
  getDatePop(val){
    this.data.timeType = val.currentTarget.dataset.time
    this.setData({
      dateShow:true
    })
  },
  //点击切换tab
  getItem(val) {
    this.data.payPageNum = 1//切换时获取列表均为第一页
    this.data.voucherPageNum = 1//切换时获取列表均为第一页
    this.setData({
      item:val.currentTarget.dataset.item
    })
    if(this.data.item==2){
      // this.getQlist(2)
    }else{
      this.selectComponent('#item').toggle(false);
      this.pageForPayment(2)
    }
  },
  // 选中下拉选项
  chooseItem(val) {
    let item = val.currentTarget.dataset.item
    this.data.voucherPageNum = 1//选中时列表为第一页
    if(item.promotionName){
      this.setData({
        voucherIndex:val.currentTarget.dataset.index,
        dropTitle:item.promotionName==null?item.productName:item.promotionName,
        promotionId:item.promotionId,
        productId:''
      })
    }else{
      this.setData({
        voucherIndex:val.currentTarget.dataset.index,
        dropTitle:item.promotionName==null?item.productName:item.promotionName,
        productId:item.productId,
        promotionId:''
      })
    }
    this.selectComponent('#item').toggle();
    this.getQlist(2) 
  },
  //关闭下拉框
  closeTabItem(){
    this.getQlist(2)
  },
// 券码展开
  onChange(event) {
    if(payorder.has(event.currentTarget.dataset.index)){
      payorder.delete(event.currentTarget.dataset.index)
      this.data.payList[event.currentTarget.dataset.index].collapse = false
    }else{
      payorder.add(event.currentTarget.dataset.index)
      this.data.payList[event.currentTarget.dataset.index].collapse = true
    }
    this.setData({
      payList:this.data.payList,
      activeNames: event.detail
    })
  },
  // 关闭时间选择器
  closeDate(){
    this.setData({
      dateShow:false
    })
  },
  // 点击确定时间
  confirmDate(val) {
    let year = new Date(val.detail).getFullYear()
    let month = new Date(val.detail).getMonth()+1
    let day = new Date(val.detail).getDate()
    let hour = new Date(val.detail).getHours()
    let minus = new Date(val.detail).getMinutes()
    let seconds = new Date(val.detail).getSeconds()
    let startTime = val.detail-hour* 60 * 60 * 1000-minus*60*1000-seconds*1000
    let endTime = val.detail+(24-hour)* 60 * 60 * 1000-minus*60*1000-seconds*1000
    if (this.data.timeType==1) {
      this.setData({
        dateShow: false,
        startTimes:year+"."+month+"."+day,
        startTime:startTime
      });
    } else {
      this.setData({
        dateShow: false,
        endTimes:year+"."+month+"."+day,
        endTime:endTime
      });
    }
    
  },
  //取消时间
  cancelDate() {
    this.setData({
      dateShow:false
    })
  },
  //开始筛选
  filterDate() {
    this.data.payPageNum = 1
    this.data.voucherPageNum = 1
    if(this.data.item==2){
      this.getQlist(2)
    }else{
      this.pageForPayment(2)
    }
   
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
    this.setData({
      qList:[],
      payList:[],
      activeNames:null,
      voucherNumList:[],
      voucherIndex:'',
      productId:'',
      promotionId:'',
      item:2,
      timeType:'',
      dropTitle: '券码',
      dateShow:false,
      startTimes:'请选择时间',
      startTime:'',
      endTime:'',
      endTimes:'请选择时间',
      voucherPageNum:1,
      payPageNum:1,
      voucherHasNextPage:false,
      payHasNextPage:false,
    })
    this.getQlist(2)
    this.queryVoucherCount()
    this.pageForPayment(2)
  },

  onPageScroll:function(e){
    if(e.scrollTop<0){
      wx.pageScrollTo({
        scrollTop: 0,
        duration:0
      })
    }
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
    if(this.data.item==2){
      let crPageno = this.data.voucherPageNum
      crPageno++
      this.setData({
        voucherPageNum:crPageno
      })
      if (!this.data.voucherHasNextPage) {
        wx.showToast({
          title: '没有更多了···',
          icon: 'none'
      })
      } else {
        this.getQlist(1)
      }
    }else{
      let crPageno = this.data.payPageNum
      crPageno++
      this.setData({
        payPageNum:crPageno
      })
      if (!this.data.payHasNextPage) {
        wx.showToast({
          title: '没有更多了···',
          icon: 'none'
      })
      } else {
        this.pageForPayment(1)
      }
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})