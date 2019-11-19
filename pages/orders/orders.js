// pages/orders/orders.js
const request = require('../../utils/request.js')
const X2JS = require('../../utils/we-x2js.js')
var app = getApp()
const page_size = 5;
Page({
  data:{
    Left:'1%',
    hidden: false,
    prompt: true,
    ordersTitle: '暂无预定',
    col0:'',
    col1:'',
    col2:'',
    col3:'',
    col4:'',
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    totalResult:0,
    seach:{
      creator:"",
      currentPage:"",
      pageSize:""
    },
    
  },
  onLoad:function(){
    // getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
      this.setData({
        col0:'#be9d6d',
        borLeft:'3px solid #be9d6d'
      });
  },
  onShow: function(){
   
    this.setData({
      pageNumber: 1,
      orderDetailList: []
    }),
      this.queryData(null)
  },

  
  tabRight: function (e) {
    let id = e.currentTarget.id;
    let col0 = '';
    let col1 = '';
    let col2 = '';
    let col3 = '';
    let col4 = '';
    let left = '1%';
    if (id == 0){
      col0 ='#be9d6d';
      left='1%';
    }else if (id == 1 ){
      col1 = '#be9d6d';
      left = '21%';
    } else if (id == 2) {
      col2 = '#be9d6d';
      left = '61%';
    } else if (id == 3) {
      col3 = '#be9d6d';
      left = '81%';
    } else if (id == 4) {
      col4 = '#be9d6d';
      left = '41%';
    } 

    // 点击会议室 
    this.setData({
      col0: col0,
      col1: col1,
      col2: col2,
      col3: col3,
      col4: col4,
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
  queryData: function (errCode) {
    const that = this
    let userId = app.globalData.userId;
    request.meetList({ creator: userId, currentPage: this.data.pageNumber, errCode: errCode, pageSize: page_size }, function (res) {
      //debugger
      var x2js = new X2JS();
      let orderDetails = x2js.xml2js(res.data)
      let orderDetailList = orderDetails == null || orderDetails == '' || typeof (orderDetails) == 'undefined' ? '' : orderDetails.orderDetails.orderDetail;
      debugger
      let totalPage = orderDetailList == null ? 1 : orderDetailList[0] == null ? orderDetailList.pageCount.totalPage : orderDetailList[0].pageCount.totalPage;
      let totalResult = orderDetailList == null ? 0 : orderDetailList[0] == null ? orderDetailList.pageCount.totalResult : orderDetailList[0].pageCount.totalResult;
      
      that.setData({
        orderDetailList: typeof (orderDetailList) == 'undefined' ? '' :  orderDetailList,
        prompt: typeof (orderDetailList) == 'undefined' ? false:true,
        ordersTitle: '暂无预定会议室',
        totalPage: totalPage,
        totalResult: totalResult,
        stopLoadMoreTiem: false
      })
    })
  },
})