// pages/orders/orders.js
const request = require('../../utils/request.js')
const md5 = require('../../utils/we-x2js.js')
Page({
  data:{
    Left:'1%',
    hidden: false,
    prompt: true,
    ordersTitle: '暂无预定座位',
    
  },
  onLoad:function(){
    // getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
      this.setData({
        colLeft:'#be9d6d',
        borLeft:'3px solid #be9d6d'
      });
  },
  onShow: function(){
      const userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo)
      if(userInfo.length === 0){
        this.setData({
            hidden: true,
            prompt: false
        })
      }else{
        this.setData({
            hidden: false,
            prompt: true
        })
      }
  },
  tabLeft:function(){
    // 点击座位
      this.setData({
          ordersRoom:true,
          ordersSeat:false,
          colLeft:'#b02923',
          colRight:'',
          borRight:'',
          Left:'5%',
          ordersTitle: '暂无预定座位'
      });

  },
  tabRight:function(){
    // 点击会议室
      this.setData({
          ordersRoom:false,
          ordersSeat:true,
          colLeft:'',
          borLeft:'',
          colRight:'#b02923',
          Left:'55%',
          ordersTitle: '暂无预定会议室'
      });
  }
})