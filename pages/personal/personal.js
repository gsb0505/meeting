// pages/personal/personal.js
const app = getApp();
Page({
  data:{
    userId:"",
    phone:""
  },
  onLoad:function(options){
     getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    
    let phone = "";
    if (app.globalData.phone != null){
      debugger
      phone = app.globalData.phone,
      phone = phone.substring(0, 3) + "****" + phone.substring(phone.length - 4, phone.length);
    }
    // 页面显示.
      this.setData({
        operation: '退出',
        login: true,
        userId: app.globalData.userId == null ? "" : app.globalData.userId,
        phone: phone,
        userHead: '../../images/userhead.jpg'
      })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  defaultLogin:function(e){
    let login = e.currentTarget.dataset.login;
    if(login == true){
      // 点击退出
      wx.showToast({
        title: '退出中',
        icon: 'loading'
      })
      setTimeout(function(){
        wx.hideToast();
        wx.removeStorageSync('userInfo');
        wx.switchTab({
          url: '../index/index'
        })
      },2000);
    }else{
      // 点击登录
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  listFirst:function(){
    // 我的预订
    if(this.data.login){
      wx.switchTab({
        url: '../orders/orders'
      })
    }else{
      wx.showToast({
        title: '请登录',
        icon: 'loading',
        duration: 800
      })
    }
  },
  getScanning: function () {
    app.getScanning()
  }
})