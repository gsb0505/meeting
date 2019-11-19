/**
 * 网络请求
 */

var config = require('../config')

const login = (user, success, fail) => {
//  debugger
  var options = {
    url: config.service.loginUrl,
    data: { user: user },
    //method:'POST', //默认为 'GET'
    success(result) {
      debugger
      console.log(result)
      //JSON.stringify(result.data)
      success(result)
    },
    fail(error) {
      debugger
      console.log(error)
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}

const modifyPassword = (oldPassword, newPassword, success, fail) => {
  var options = {
    url: config.service.modifyPasswordUrl,
    data: {
      userId: getApp().globalData.userId,
      oldPassword: oldPassword, newPassword: newPassword
    },
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}

//查询已完成/未完成普查表数量
/*
响应：
data	
  completecounts
	nocompletecount
 */
const status = (success, fail) => {
  var options = {
    url: config.service.statusUrl,
    data: {
      userId: getApp().globalData.userId,
      // data:{}
    },
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}

//普查表列表查询
/*
输入参数：
status	integer	是	状态（1已完成 2未完成）
type	String	是	普查表类型(1道路停车场 2 公共停车场 3 居住类配建 4非居住配建  5路外公共/配建（非学校）6道路/学校类)。
支持多种类型查询，以逗号分隔。

响应：
data	
  id
	name
	address
	createTime
	updatetime
	type
	locationAmap
	photoUrl
	createUserId
	updateuserid
	carNo
	status
 */
const list = (params, success, fail) => {
  var options = {
    url: config.service.listUrl,
    data: {
      userId: getApp().globalData.userId,
      data: params
    },
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    },
  }
  wx.request(options)
}

//普查表列表分页查询
/*
输入参数：
status	integer	是	状态（1已完成 2未完成）
type	String	是	普查表类型(1道路停车场 2 公共停车场 3 居住类配建 4非居住配建  5路外公共/配建（非学校）6道路/学校类)。
支持多种类型查询，以逗号分隔。

响应：
data	
  id
	name
	address
	createTime
	updatetime
	type
	locationAmap
	photoUrl
	createUserId
	updateuserid
	carNo
	status
 */
const pageList = (params, success, fail) => {
  var options = {
    url: config.service.pageListUrl,
    data: {
      userId: getApp().globalData.userId,
      data: params
    },
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    },
  }
  wx.request(options)
}

//查询一个普查表详情
/* 
输入 id
输出
data	
  id	integer	否	编号
	name	String	否	名称
	address	String	是	道路名称
	createTime	timestamptz	否	创建时间
	updatetime	timestamptz	是	更新时间
	type	integer	否	普查表类型(1道路停车场 2 公共停车场 3 居住类配建 4非居住配建  5路外公共/配建（非学校）6道路/学校类)
	locationAmap	String	是	停车场高德经纬度
	photoUrl	String	是	照片地址
	createUserId	integer	是	创建用户ID
	updateuserid	integer	是	更新用户ID
	carNo	String	是	车位数
	roadParkingInfo 、 publicParkingInfo 、noHouseParkingInfo、houseParkingInfo、parkingFlowList	String	是	子表信息（json串） 具体参数详见10.1.1--10.1.4
	status	integer	否	状态（1已完成 2未完成）
	remark	text	是	备注
*/
const detail = (id, name, success, fail) => {
  var data = {}
  if (id != '') {
    data.id = id
  }
  if (name != '') {
    data.name = name
  }
  var options = {
    url: config.service.detailUrl,
    data: {
      userId: getApp().globalData.userId,
      data: data
    },
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}

//新增普查表
/*
输入
  data:{
    name	String	否
address	String	是
type	String	否
locationAmap	String	是
photoUrl	String	是
createUserId	integer	否
roadParkingInfo 、 publicParkingInfo 、noHouseParkingInfo、houseParkingInfo、parkingFlowList	String	是
  }

响应：
    "code": "200",
    "message": "OK",
    "data": "{\"id\":66}"
 */
const add = (data, success, fail) => {
  var options = {
    url: config.service.addUrl,
    data: {
      userId: getApp().globalData.userId,
      data: data
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}

//编辑普查表
/*
输入data{
  id	integer	否	编号
name	integer	是	名称
address	integer	是	道路名称
type	integer	是	普查表类型(1道路停车场 2 公共停车场 3 居住类配建 4非居住配建)
locationAmap	String	是	停车场高德经纬度
photoUrl	String	是	照片地址
createUserId	integer	是	创建用户ID
createTime	timestamptz	是	创建日期
roadParkingInfo 、 publicParkingInfo 、noHouseParkingInfo、houseParkingInfo、parkingFlowList	String	是	子表信息（json串）  具体参数详见10.1.1--10.1.4
} 

响应：
 "code": "200",
    "message": "OK",
    "data": ""
*/
const update = (data, success, fail) => {
  var options = {
    url: config.service.updateUrl,
    data: {
      userId: getApp().globalData.userId,
      data: data
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}

// 上传图片
const uploadPhoto = (data, success, fail) => {
  var options = {
    url: config.service.uploadphotoUrl,
    data: {
      // userId: getApp().globalData.userId,
      // data: data
    },
    method: 'POST',
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}


//获取街道列表
const streetList = (success, fail) => {
  // debugger
  var options = {
    url: config.service.streetListUrl,
    data: {
      userId: getApp().globalData.userId,
    },
    method: 'POST',
    success(result) {
      success(result)
    },
    fail(error) {
      if (typeof (fail) != 'undefined') {
        fail(error)
      }
    }
  }
  wx.request(options)
}

module.exports = {
  login: login,
  modifyPassword: modifyPassword,

  status: status,
  list: list,
  pageList: pageList,
  streetList: streetList,
  detail: detail,
  add: add,
  update: update,
  //编辑车辆记录
  // updateRecord: updateRecord,
  uploadPhoto: uploadPhoto
}