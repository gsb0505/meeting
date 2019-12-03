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
     // debugger
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

// const modifyPassword = (oldPassword, newPassword, success, fail) => {
//   var options = {
//     url: config.service.modifyPasswordUrl,
//     data: {
//       userId: getApp().globalData.userId,
//       oldPassword: oldPassword, newPassword: newPassword
//     },
//     success(result) {
//       success(result)
//     },
//     fail(error) {
//       if (typeof (fail) != 'undefined') {
//         fail(error)
//       }
//     }
//   }
//   wx.request(options)
// }



/*查询我的订单 */
const meetList = (params, success, fail) => {
  var options = {
    url: config.service.meetListUrl,
    data: {
      orderDetail: params
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

/*查询会议室列表 */
const roomList = (params, success, fail) => {
  var options = {
    url: config.service.roomListUrl,
    data: {
      meetRoom: params
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

/*查询会议室列表 */
const roomAllList = (success, fail) => {
  var options = {
    url: config.service.roomAllUrl,
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

/*查询会议预约*/
const meetDetailList = (params,success,fail) =>{
  // debugger
  var options = {
    url: config.service.meetDetailListUrl,
    data: {
      orderDetail: params
    },
    method: 'GET',
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

/*添加会议预约 */
const roomOrderAdd = (params,success, fail) => {
  var options = {
    url: config.service.roomOrderAddUrl,
    data: {
      orderDetail: params
    },
    method: 'POST',
    // header: {
    //   "Content-Type": "text/xml"
    // },
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
  //modifyPassword: modifyPassword,

 //status: status,
 // list: list,
  meetList: meetList,
  roomList: roomList,
  roomAllList: roomAllList,
  roomOrderAdd: roomOrderAdd,
  //编辑车辆记录
  // updateRecord: updateRecord,
  uploadPhoto: uploadPhoto,
  meetDetailList: meetDetailList
}