/**
 * 选择相册图片/调用拍照/上传文件
 */

var config = require('../config')

//把图片文件保存到相册
const saveImageToAlbum = (path, success, fail) => {
  wx.saveImageToPhotosAlbum({
    filePath: path,
    success(res) {
      if(typeof(success) == 'function'){
        success(res)
      }
    },
    fail(error){
      if(typeof (fail) == 'function') {
        fail('图片保存相册错误:' + JSON.stringify(error))
      }
    }
  })
}

/**
 * path
 * url
 * formName 表单名称
 */
const uploadFile = (path, url, formName, success, fail) => {
  wx.uploadFile({
    url: url,
    filePath: path,
    name: formName,
    success(res) {
      console.log('uploadFile res', res)
      const data = JSON.parse(res.data)    
      if (typeof (data.code) != 'undefined' && data.code == 200) {
        const _data = JSON.parse(data.data)
        success(_data.filePath)
      }
      else {
        const error = typeof (data.message) != 'undefined' ? data.message : '图片服务器出错'
        if(typeof (fail) == 'function') {
          fail(error)
        }
      }
    },
    fail(error) {
      if(typeof (fail) == 'function') {
        fail('请求图片服务器错误' + JSON.stringify(error))
      }
    }
  })
}

//浏览相册或者拍照
const takePhoto =  (success, fail) => {
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      success(res.tempFilePaths[0])
    },
    fail(error){
      if (typeof (fail) == 'function' && typeof(fail.errMsg) != 'undefined' 
        && fail.errMsg.indexOf('cancel') < 0) {
        fail('选择图片/拍照错误:' + JSON.stringify(error))
      }
    }
  })
}

const tabkePhotoAndUpload = (success, fail, getPath) => {
  takePhoto(
    function(path){
      if(typeof(getPath) == 'function'){
        getPath(path)
      }
      
      uploadFile(path, config.service.uploadPhotoUrl, 'file', success, fail)
    }, fail)
}

const upload = (path, success, fail) => {
  uploadFile(path, config.service.uploadPhotoUrl, 'file', success, fail)
}

module.exports = {
  tabkePhotoAndUpload: tabkePhotoAndUpload,
  takePhoto: takePhoto,
  upload: upload
}