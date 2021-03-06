//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    isLogined: false,
    userId: null, 
    phone:null,
    meetRoomID:null
  },
  auth: function () {
    if (this.globalData.isLogined == false) {
      wx.showModal({
        title: '未登陆',
        content: '请先登陆',
        confirmText: '知道了',
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
    }
  },
  //检查网络是否连接
  checkNetStatus: function (callback) {
    wx.getNetworkType({
      success(res) {
        if (typeof (callback) == 'function') {
          const networkType = res.networkType
          callback(networkType == 'none' ? '网络错误，请检查网络' : '')
        }
      }
    })
  },
  getRequest: function(url,callback){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      success: function(res) {
        if(callback && typeof callback == 'function'){
          callback(res)
          wx.hideToast()
        }
      }
    })
  },
  getScanning: function(){
    wx.scanCode({
      success: (res) => {
        var result = res.result
        result = result.replace('http://','')
        wx.navigateTo({
          url: '../'+result
        })
      }
    })
  },
  setStorageUser: function(params,callback){
    wx.setStorage({
      key:'userInfo',
      data:params,
      success: function(res) {
        if(callback && typeof callback == 'function'){
          callback(res)
        }
      }
    });
  }
})