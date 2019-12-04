// pages/booking/booking.js
const app = getApp();
const util = require('../../utils/util.js');
const request = require('../../utils/request.js')
const X2JS = require('../../utils/we-x2js.js')
const bindinput = require('../../utils/bindinput.js')
Page(Object.assign({
  data:{
    chosens: false,
    options: false,
    daytime: ['06:00', '06:30', '07:00', '07:30','08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
    roomArray: [],
    roomIndex:0,
    endTime: 0,
    startTime: 0,
    num: 0,
    regionDataSeat:[],
    regionDataRoom:[],
    searchTitle:'点击搜索商品...',
    userChosen: '',
    isSubmit:false,
    checkSubmit:false,
    hiddenPlan: true,
    addflag: true,  //判断是否显示搜索框右侧部分
    addimg: '../../images/activity_add.png',
    searchstr: '',
    page_size: 5,
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    totalResult: 0,
    orderDetailList: [],
    // input默认是1  
    pnumber: 1,
    proSum: 0,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    table: {
      meetDate:'',
      meetStartTime: '06:00',
      meetEndTime: '06:00',
      meetRoomID:'',
      meetName:'',
      specialdemand:'',
      emailNotification:'',
      goodsDetailList:[],
    },
    goodsList:[],
    prompt:'',
    goodsTitle: '',
    totalPage: '',
    totalResult: '',

  },
  onLoad:function(options){
    // getApp().auth();
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      'table.meetDate':util.formatTime(new Date)
    });
    this.queryRoomData();
  },

  //会议室查询方法
  queryRoomData: function () {
    const that = this
    // debugger
    //调用会议查询接口
    request.roomAllList( function (res) {
      //接口返回
      var x2js = new X2JS();
      let details = x2js.xml2js(res.data)
      let detailList = details == null || details == '' || typeof (details) == 'undefined' ? [] : details.meetRooms.meetRoom;
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
  bindDateChange: function(e) {
    // 日期
    this.setData({
      'table.meetDate': e.detail.value
    });
  },
  bindPickerOrderStrart: function(e) {
    // 开始暗
    this.setData({
      'table.meetStartTime': this.data.daytime[e.detail.value],
      startTime: e.detail.value
    });
  },
  bindPickerOrderEnd: function (e) {
    // 结束时间
    this.setData({
      'table.meetEndTime': this.data.daytime[e.detail.value],
      endTime: e.detail.value
    });
  },
  bindChooseRoom: function(e){
    console.log(e.detail.value + "----" + this.data.roomArray[e.detail.value].id)
    // 会议室
    this.setData({
      'table.meetRoomID': this.data.roomArray[e.detail.value].id,
       roomIndex: e.detail.value
    });
  },
  formSubmit: function(e){
    const that = this
    if (that.checkSubmit== true) {
      return 
    }else{
      that.setData({
        checkSubmit:true
      })
    }
      debugger
    //调用会议查询接口
    let x2js = new X2JS();
    let xmlStr = x2js.js2dom(that.data.table);
    debugger
    request.roomOrderAdd(that.data.table,function (res) {
      //接口返回
      debugger
    
      let details = x2js.xml2js(res.data)

    })
  },
  getScanning: function () {
    app.getScanning()
  },
  searchFocus: function (e) {
    console.log("聚焦。。");
  },
  openSearchFocus: function(e){
    this.setData({
      hiddenPlan: !this.data.hiddenPlan
    });
    //加载全部会议数据
    this.queryData(null);
  },
  // --------------------  商品列表事件 begin  ------------------------
  activity_clear:function(){
    this.triggerEvent("activity_clear");
  },
  // 搜索框右侧 事件
  addhandle() {
    //console.log('触发搜索框右侧事件')
    this.setData({
      hiddenPlan: !this.data.hiddenPlan
    })
  },
  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value
    })
    //this.queryData(searchstr);
  },
  //搜索回调
  endsearchList(e) {
    console.log('查询数据')
    this.queryData(searchstr);
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    });
    this.queryData(searchstr);
  },
  //清空搜索框
  activity_clear(e) {
    this.setData({
      searchstr: ''
    })
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
      this.queryData("");
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
  //商品数据查询方法
  queryData: function (info) {
    const that = this
    //获取userid公共变量
    let userId = app.globalData.userId;
    let page_size = that.data.page_size;
    // debugger
    //调用会议查询接口
    request.goodsList({
       creator: userId, status: "1", goodsName: info, pageCount: { currentPage: this.data.pageNumber, showCount: page_size }
      // creator: userId, errCode: "1", pageCount: { currentPage: this.data.pageNumber, showCount: page_size } 
    }, function (res) {
      //接口返回
      var x2js = new X2JS();
      let goods = x2js.xml2js(res.data);
      console.log(JSON.stringify(goods));
      // let goodsList = goods == null || goods == '' || typeof (goods) == 'undefined' ? [] : goods.goods.good;
      // // debugger      
      // let totalPage = goodsList == null ? 1 : goodsList[0].pageCount[0].totalPage;
      // let totalResult = goodsList == null ? 0 : goodsList[0].pageCount[0].totalResult;
      // //给页面赋值
      // that.setData({
      //   goodsList: that.data.goodsList.concat(goodsList),
      //   prompt: typeof (goodsList) == 'undefined' ? false : true,
      //   goodsTitle: goodsList == null ? '暂无预商品信息' : "",
      //   totalPage: totalPage,
      //   totalResult: totalResult,
      //   stopLoadMoreTiem: false
      // })
    })
  },
  /* 点击减号 */
  bindMinus: function () {
    var pnumber = e.detail.value;
    var proCount = this.data.proCount;
    var index = e.target.dataset.index;
    var pid = e.target.dataset.id;
    // 如果大于0时，才可以减
    if (proCount > 0) {
       proCount--
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = (pnumber - 1) <= 0 ? 'disabled' : 'normal';

    //更新商品明细
    this.updateGoodDetail(index, pnumber, pid);
    var searchTitle = '已预订商品数量:' + proSum + "件.";
    // 将数值与状态写回  
    this.setData({
      proCount: proCount,
      minusStatus: minusStatus,
      searchTitle: searchTitle,
    });
  },
  /* 点击加号 */
  bindPlus: function (e) {
    var pnumber = e.detail.value;
    var index = e.target.dataset.index;
    var proCount = this.data.proCount;
  
    // 不作过多考虑自增1  
    pnumber++;
    e.detail.value = pnumber;
    proSum++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = pnumber < 0 ? 'disabled' : 'normal';
    
    //更新商品明细
    this.updateGoodDetail(index, pnumber,null);
    var searchTitle = '已预订商品数量:' + proSum + "件.";
    // 将数值与状态写回  
    this.setData({
      proSum: proSum,
      minusStatus: minusStatus,
      'table.goodsDetailList': datalList,
       searchTitle: searchTitle,
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var pnumber = e.detail.value;
    var index = e.target.dataset.index;
    var proCount = this.data.proCount;

    //修改订单列表
    //updateGoodDetail(index, pnumber, );

    // 将数值与状态写回  
    this.setData({
      pnumber: pnumber
    });
    
  },
  updateGoodDetail: function (index, pnumber,proId){
    var datalList = this.data.table.goodsDetailList;
    var productlList = this.data.goodsList;
    var product = productlList[index];
    var pfind = false;
    //移除指定商品id，商品的数量
    if (proId != null){
      for (var i = 0; i < datalList.length;i++){
        if (datalList[i].id == proId){
          datalList[i].num--
          if (datalList[i].num <= 0)
            datalList[i].splice(i);
            break;
          }
      }
    }else{
      //添加商品信息到订单列表
      var detail = {
        'ginfoId': product.id,
        'goodsName': product.goodsName,
        'num': pnumber,
        'price': product.price,
        'storeCode': product.storeCode,
        'userID': app.globalData.userId,
        'typeCode': product.typeCode,
        'amount': toFixed(pnumber * (product.price), 2),
      };
      datalList.push(detail);
    }
    return datalList;
  }

  // --------------------  商品列表事件 end  ------------------------

},bindinput))