// pages/login/login.js
const request = require('../../utils/request.js')
const md5 = require('../../utils/md5.js')
var config = require('../../config.js')
const app = getApp();
Page({
  data:{
    netStatus: '',//网络情况
    errorMsg: '',//错误提示
    userId: '',
    loginPSW: ''
  },
  //检查网络是否连接
  checkNetStatus: function () {
    const that = this
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType == 'none') {
          that.setData({
            netStatus: '网络错误，请检查网络',
            errorMsg: ''
          })
        }
        else {
          that.setData({
            netStatus: ''
          })
        }
      }
    })
  },

  //监听页面加载
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.checkNetStatus()
    this.readuserNamepassWord()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },
  //从本地数据缓存中读取账号/密码
  readuserNamepassWord: function () {
    const that = this
    wx.getStorage({
      key: 'usernamepassword',
      success(res) {
        if (res.data.userId && res.data.loginPSW) {
          that.setData({
            userId: res.data.userId,
            loginPSW: res.data.loginPSW
          })
        }
      }
    })
  },
  formSubmit: function(e) {
    let that = this;
    this.checkNetStatus();
    const formData = e.detail.value
    if (formData.userId == '' ){
        this.setData({
          errorMsg: '请输入账号',
        })
        return false;
    } else if (formData.loginPSW == ''){
        this.setData({
          errorMsg: '请输入密码'
        })
        return false;
    }else{
        this.setData({
          errorMsg: ''
        })
    }
    //登陆
    if (this.data.netStatus == '' && typeof (this.data.netStatus) != "undefined") {
      request.login(formData,
        function (result) {
          //debugger
          if (result.statusCode == 200) {//登陆成功
            if (result.data ==null ){
              var msg = '请输入正确的用户名和密码'
              that.setData({
                errorMsg: msg
              })
            }
            else{
                getApp().globalData.isLogined = true,
                getApp().globalData.userId = result.data.userId,
                getApp().globalData.phone = result.data.phone,
                getApp().globalData.userHead = config.hostManage + result.data.photoUrl,
                wx.setStorage({
                  key: 'usernamepassword',
                  data: { userId: formData.userId, loginPSW: formData.loginPSW }
                })
                wx.reLaunch({
                  url: '../index/index',
                })
            }
          }
          else {
            var msg = '服务器错误'
            if (typeof (result.data.message) != 'undefined') {
              msg = result.data.message
            }
            that.setData({
              errorMsg: msg
            })
          }
        },
        function (error) {
          if (this.data.netStatus == '') {
            that.setData({
              errorMsg: '服务器未启动，请联系管理员'
            })
          }
        }
      );
    }
  }
})