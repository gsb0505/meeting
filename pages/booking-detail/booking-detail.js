// pages/booking/booking.js
var util = require('../../utils/util.js');
const request = require('../../utils/request.js')
const X2JS = require('../../utils/we-x2js.js')
var app = getApp()
Page({
  data:{
    table: {
      id: '',
      meetDate: '',
      meetStartTime: '',
      meetEndTime: '',
      meetRoomID: '',
      meetRoomName:'',
      meetName: '',
      specialdemand: '',
      emailNotification: '',
      goodsDetailList: [],
    },
    index: 0,
    first: 0,
    picker:true
  },
  onLoad:function(options){
    // getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
    if(options.id == undefined){
      this.setData({
        picker: false,
        date:util.formatTime(new Date)
      })
    }else{
      console.log("dd=" + options.id)
      let id = options.id;
      this.queryData(id);
    }
    // this.queryRoomData();
  },
  //会议室查询方法
  queryRoomData: function () {
    const that = this
    // debugger
    //调用会议查询接口
    request.roomAllList(function (res) {
      //接口返回
      var x2js = new X2JS();
      let details = x2js.xml2js(res.data)
      let detailList = typeof (details) == 'undefined' ? [] : details.meetRooms.meetRoom.length == undefined ? [details.meetRooms.meetRoom]: details.meetRooms.meetRoom;
      //给页面赋值
      that.setData({
        roomArray: detailList,
        'table.meetRoomID': detailList[0].id,
      })
      var roomIndex = 0
      for (var i = 0; i < detailList.length; i++) {
        let detail = detailList[i];
        if (detail.id == that.data.roomIndex) {
          roomIndex = i
          break
        }
      }
      that.setData({
        roomIndex: roomIndex
      })
    })
  },
  //会议数据查询方法
  queryData: function (id) {
    let ids = id
    const that = this
    //调用会议查询接口
    request.meetDetailList({
      id: ids
    }, function (res) {
      debugger
      //接口返回
      var x2js = new X2JS();

      let orderDetails = x2js.xml2js(res.data)

      let orderDetail = orderDetails == null || orderDetails == '' || typeof (orderDetails) == 'undefined' ? [] : orderDetails.orderDetail;
      // debugger
      orderDetail.meetDate = util.formatTime(new Date(orderDetail.meetDate));
      console.log(orderDetail.meetDate);
      //给页面赋值
      that.setData({
        table: orderDetail
      })
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 读取用户信息
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo.length !== 0){
      this.setData({
        userName: userInfo.userName,
        userPhone: userInfo.userPhone,
        login: true,
        btnSubmit: '确认预定'
      })
    }else{
      this.setData({
        userName: '',
        userPhone: '',
        login: false,
        btnSubmit: '登录'
      })
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
   bindDateChange: function(e) {
    // 日期    
    console.log(e);
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerOrder: function(e) {
    this.setData({
      first: e.detail.value
    })
  },
  btnSubmit:function(){
    if(this.data.login){
      wx.showToast({
        title: '预定成功',
        icon: 'success',
        duration: 1000,
        success:function(){
            setTimeout(function(){
              console.log('预定成功')
              wx.switchTab({
                url: '../index/index'
              })
            },1000)   
        }
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  }
})