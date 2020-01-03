// pages/orders/orders.js
const request = require('../../utils/request.js')
const X2JS = require('../../utils/we-x2js.js')
const utils = require('../../utils/utils.js')
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data:{
    Left:'1%',
    page_size : 5,
    hidden: false,
    prompt: true,
    ordersTitle: '暂无预定',
    col0: '#be9d6d',
    col1:'',
    col2:'',
    col3:'',
    col4:'',
    col5:'',
    borLeft: '3px solid #be9d6d',
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    totalResult:0,
    orderDetailList: [],
    stopLoadMoreTiem:false,
    errCode:null
  },
  onLoad:function(){
    //登录验证
     // getApp().auth();
  },
  onShow: function(){
    this.setData({
      orderDetailList: []
    });
    let errCode = this.data.errCode;
      //加载全部会议数据
    this.queryData(errCode)
  },
  //菜单按钮
  tabRight: function (e) {
    let id = e.currentTarget.id;
    let col0 = '';
    let col1 = '';
    let col2 = '';
    let col3 = '';
    let col4 = '';
    let col5 = '';
    let left = '1%';
    if (id == 0){
      col0 ='#be9d6d';
      left='1%';
    }else if (id == 1 ){
      col1 = '#be9d6d';
      left = '16.6%';
    } else if (id == 2) {
      col2 = '#be9d6d';
      left = '33.3%';
    } else if (id == 3) {
      col3 = '#be9d6d';
      left = '82.1%';
    } else if (id == 4) {
      col4 = '#be9d6d';
      left = '65.5%';
    } else if (id == 5) {
      col5 = '#be9d6d';
      left = '49.9%';
    } 

    // 选择会议类型
    this.setData({
      col0: col0,
      col1: col1,
      col2: col2,
      col3: col3,
      col4: col4,
      col5: col5,
      Left: left,
      pageNumber: 1,
      orderDetailList: []
    });
    if (id == 0){
      this.queryData(null);
    }else{
      this.queryData(id);
    }
  } ,
  //会议数据查询方法
  queryData: function (errCode) {
    const that = this
    //获取userid公共变量
    let userId = app.globalData.userId;
    let page_size =  that.data.page_size;
    // debugger
    //调用会议查询接口
    request.meetList({
      creator: userId, errCode: errCode, pageCount: { currentPage: this.data.pageNumber, showCount: page_size} }, function (res) {
      //接口返回
      var x2js = new X2JS();
      let orderDetails = x2js.xml2js(res.data);
        console.log(orderDetails);
        console.log(orderDetails.orderDetails=='');
        let orderDetailList = orderDetails == undefined || orderDetails.orderDetails == '' ? [] : orderDetails.orderDetails.orderDetail.length == undefined ?[orderDetails.orderDetails.orderDetail]:orderDetails.orderDetails.orderDetail;
        console.log(orderDetailList)
            
      let totalPage = orderDetailList.length==0 ? 1 :orderDetailList[0].pageCount.totalPage;
      let totalResult = orderDetailList.length == 0 ? 0 : orderDetailList[0].pageCount.totalResult;
        console.log(orderDetails);
      //    debugger
      // var today = utils.formatTime2(new Date());
      // for (let i = 0; i < orderDetailList.length; i++) {
      //   let orderDetail = orderDetailList[i];
      //   let curDate = util.getCurrentTime();
      //   if (orderDetail != null && orderDetail.meetDate == today && orderDetail.meetStartTime != null && orderDetail.meetStartTime <= curDate && orderDetail.meetEndTime > curDate && orderDetail.errCode==2) {
      //      orderDetail.errCode = 5;
      //   }else{
      //     if (errCode==5){
      //       orderDetailList.splice(i,1) ;
      //       i--;
      //     }
      //   }
      // }
      //给页面赋值
      that.setData({
        orderDetailList: that.data.orderDetailList.concat(orderDetailList),
        prompt: typeof (orderDetailList) == 'undefined' ? false:true,
        ordersTitle: orderDetailList == null ? '暂无预定会议室':"",
        totalPage: totalPage,
        totalResult: totalResult,
        stopLoadMoreTiem: false,
        errCode: errCode
      })
    })
  },
  //撤消会议按钮
  cancelMeet:function(e){
    let that = this;
    let id = e.currentTarget.id;

    let detail = {
      'glideNo': id,
      'errCode':3
    };
    request.roomOrderCancel(detail, function (res) {
      //接口返回
      if (res.data == true) {
        wx.showModal({
          title: '预约撤消成功!',
          content: '会议预约撤消成功',
          confirmText: '知道了',
          showCancel: false,
          success: function (res) {
            that.onShow();
          }
        })
      } else {
        wx.showModal({
          title: '预约撤消失败!',
          content: '会议预约撤消失败，请重试！',
          confirmText: '知道了',
          showCancel: false
        })
      }
    })
    console.log(id)
  },
  /**
    * 滚动条加载
    */
  lower: function () {
    var that = this;
    // debugger
    if (that.data.stopLoadMoreTiem) {
      return;
    }
    // 当前页+1
    let pageNumber = that.data.pageNumber + 1;
    let errCode = that.data.errCode;
    
    that.setData({
      pageNumber: pageNumber,
      stopLoadMoreTiem: false
    })

    if (pageNumber <= that.data.totalPage) {
      wx.showLoading({
        title: '玩命加载中',
      })
      this.queryData(errCode);
      wx.hideLoading();
    }else{
      wx.showLoading({
        title: '已到最后一页',
      })
      setTimeout(() => {
        wx.hideLoading();
        return
      },1000)

    }

  },
  modiMeet:function(e){
    const id = e.currentTarget.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/booking/booking?id='+id
    });
  },
  lookMeet: function (e) {
    const id = e.currentTarget.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/booking-detail/booking-detail?id=' + id
    });
  },
})