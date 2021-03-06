//index.js
//获取应用实例
var app = getApp()
const request = require('../../utils/request.js')
const util = require('../../utils/util.js')
const X2JS = require('../../utils/we-x2js.js')
var config = require('../../config.js')
Page({
  data: {
    roomList:[],
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    totalResult: 0,
    page_size: 5,
    stopLoadMoreTiem:false,
    imageUrlHost: config.hostManage,
  },
  onLoad: function () {
    //getApp().auth();
   
  },
  onShow:function(){
    console.log(this.data.imageUrlHost)
    this.setData({
      roomList: [],
      pageNumber:1
    });
    this.queryData();
  },

  //会议数据查询方法
  queryData: function () {
    const that = this
    let page_size = that.data.page_size;
    // debugger
    //调用会议查询接口
    request.roomList({
      pageCount: { currentPage: this.data.pageNumber, showCount: page_size }
    }, function (res) {
      console.log(res.data);
      //接口返回
      var x2js = new X2JS();
      let details = x2js.xml2js(res.data)
      let detailList = typeof (details) == 'undefined' ? [] : details.meetRooms.meetRoom.length == undefined ? [details.meetRooms.meetRoom]: details.meetRooms.meetRoom;
      console.log(detailList);
      //  debugger      
      let totalPage = detailList.length == 0 ? 1 : detailList[0].pageCount.totalPage;
      let totalResult = detailList.length == 0 ? 0 : detailList[0].pageCount.totalResult;
      let roomList = that.data.roomList.concat(detailList);
     // debugger
      for (let i = 0; i < roomList.length; i++) {
        let roomItem = roomList[i]; 
        let orderfirst = typeof (roomItem.orderDetailList) == 'undefined' || roomItem.orderDetailList == undefined ? [] : roomItem.orderDetailList.length == undefined ? roomItem.orderDetailList :roomItem.orderDetailList[0];
        let curDate = util.getCurrentTime();
        // debugger
        if (orderfirst != null && orderfirst.meetStartTime != null && orderfirst.meetStartTime <= curDate && orderfirst.meetEndTime > curDate){
          roomItem.currentMeet = orderfirst.meetStartTime + ' - ' + orderfirst.meetEndTime;
          if (orderfirst.specialdemand != null){
            roomItem.specialdemand = orderfirst.specialdemand;
          }else{
            roomItem.specialdemand ='不需要';
          }
          roomItem.nextMeet = "";
        } else if (orderfirst !=null && orderfirst.meetStartTime != null && orderfirst.meetStartTime > curDate) {
          roomItem.nextMeet = orderfirst.meetStartTime + ' - ' + orderfirst.meetEndTime;
          if (orderfirst.specialdemand != null) {
            roomItem.specialdemand = orderfirst.specialdemand;
          } else {
            roomItem.specialdemand = '不需要';
          }
          roomItem.currentMeet = "";
        }else{
          roomItem.currentMeet='空闲';
          roomItem.nextMeet = "";
          roomItem.specialdemand = '不需要';
        }
      }
      //给页面赋值
      that.setData({
        roomList: roomList,
        prompt: typeof (roomList) == 'undefined' ? false : true,
        ordersTitle: roomList == null ? '暂无会议室' : "",
        totalPage: totalPage,
        totalResult: totalResult,
        stopLoadMoreTiem: false
      })
    })
  },
  getScanning: function () {
    app.getScanning()
  },
  /**
   * 滚动条加载
   */
  lower: function () {
    var that = this;
    if (that.data.stopLoadMoreTiem) {
      return;
    }
    // 当前页+1
    let pageNumber = that.data.pageNumber + 1;
    that.setData({
      pageNumber: pageNumber,
      stopLoadMoreTiem: false
    })

    if (pageNumber <= that.data.totalPage) {
      wx.showLoading({
        title: '玩命加载中',
      })
      this.queryData();
      wx.hideLoading();
    } else {
      wx.showLoading({
        title: '已到最后一页',
      })
      setTimeout(() => {
        wx.hideLoading();
        return
      }, 1000)

    }

  },
  itemClick:function(e){
    getApp().globalData.meetRoomID = e.currentTarget.id;
    console.log(getApp().globalData.meetRoomID);
    wx.navigateTo({
      url: '/pages/room/room'
    });
  }
})
