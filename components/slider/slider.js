// components/slider/slider.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    slideLeft:10,
    isClick:false,//判断是否点击
    isRecover:true,//是否回到原点
    startX:0,//起始坐标
    endX:0,//结束坐标
    tips:'',//提示字段
    isTransition:false,//启动滑块回到原点的动画
    isRed:false,//错误字体颜色
    isGreen:false,//成功字体颜色
  },

  /**
   * 组件的方法列表
   */
  methods: {
    slideStart(e){
      if(!this.data.isRecover)return
      this.setData({
        tips:'',
        isRed:false,
        isGreen:false,
        isTransition:false,
        isClick:true
      })
      this.data.startX = e.touches[0].clientX
      // console.log(this.data.startX)
      
    },
    slideEnd(e){
      if(!this.data.isRecover)return
      this.data.endX = e.changedTouches[0].clientX
      this.setData({
        isClick:false
      })
      this.data.isRecover = false
      let xpos =  this.data.endX-this.data.startX
      if (this.data.slideLeft>10) {
        this.triggerEvent('checkSlide', {xpos:xpos},{} )
      }else{
        this.data.isRecover = true
      }
    },
    slideMove(e){
      if (!this.data.isClick||!this.data.isRecover) return
      let leftX = e.touches[0].clientX
      let wrapWidth = 300
      const query = this.createSelectorQuery()
      query.select('#slideWrap').boundingClientRect()
      query.exec(function(res){
        wrapWidth = res[0].width
      })
      let slidewidth = leftX-this.data.startX
      if (leftX>this.data.startX&&slidewidth<(wrapWidth-60)) {
        this.setData({
          slideLeft:slidewidth
        })
      }
    },
    closeSlide(){
      this.triggerEvent('closeSlide', {},{} )
    }
  }
})
