/**
 * 小程序配置文件
 */

//服务端http api 的host
const host = 'http://106.14.61.179:8090/meetCore';
var config = {
  host: host,
  //服务端http api
  service: {
    // 登录接口
    loginUrl: `${host}/user/wxLogin`,

    modifyPasswordUrl: `${host}/user/updatePassWord`,

    //完成情况查询：已完成/未完成
    statusUrl: `${host}/survey/getSurveyStatus`,

    //普查表列表查询
    listUrl: `${host}/survey/surveyList`,
    //普查表列表查询
    pageListUrl: `${host}/survey/surveyPage`,
    //查询一个普查表详情
    detailUrl: `${host}/survey/getSurveyInfo`,

    //新增普查表
    addUrl: `${host}/survey/addSurvey`,

    //编辑普查表
    updateUrl: `${host}/survey/updateSurvey`,

    //编辑车辆记录
    updateRecordUrl: `${host}/survey/updateParkingFlow`,

    // 上传图片
    uploadPhotoUrl: `${host}/survey/photoUpload`,

    //违停车辆路线查询
    illegalparkingroadListUrl: `${host}/survey/illegalParkingRoadList`,
    //违停车辆路侧统计信息查询
    illegalparkingroadinfoListUrl: `${host}/survey/illegalParkingRoadInfoList`,
    //违停车辆路线添加
    addIllegalparkingroadUrl: `${host}/survey/addIllegalParkingRoad`,

    //违停车辆路线统计修改/删除/增加
    updateIllegalparkingroadUrl: `${host}/survey/updateIllegalParkingRoad`,
    //街道列表查询
    streetListUrl: `${host}/survey/streetList`
  },

  //硬编码的词典
  dictionary: {
    wholeDay: '全天24小时'
  }
};

module.exports = config;