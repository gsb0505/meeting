//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    banners:["../../images/index-focus-1.png","../../images/index-focus-2.png"],
  },
  onLoad: function () {
    getApp().auth();
  },
  getScanning: function () {
    app.getScanning()
  }
})
