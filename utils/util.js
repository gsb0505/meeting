      function formatTime(date) {
         var year = date.getFullYear()
         var month = date.getMonth() + 1
         var day = date.getDate()
         
         var hour = date.getHours()
         var minute = date.getMinutes()
         var second = date.getSeconds()
         
         return [year, month, day].map(formatNumber).join('-')
          // + ' ' + [hour, minute, second].map(formatNumber).join(':')
      }
      function formatNumber(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
      }
      function getCurrentTime() {
        var currentDate = new Date();
        var h = currentDate.getHours(); //获取当前小时数(0-23)
        h = h < 10 ? '0' + h : h;
        var m = currentDate.getMinutes(); //获取当前分钟数(0-59)
        m = m < 10 ? '0' + m : m;
        return h + ':' + m;

        // var s = currentDate.getSeconds(); //获取当前秒数(0-59)
        // s = s < 10 ? '0' + s : s;
        // return h + ':' + m + ':' + s;
      }

// 时间格式转换 yyyy－mm－dd
function formatTime2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-')
}

function formatDate(date, split) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join(split || '')
}

// 两位数自动补零
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 两位数以内的数字自动补零
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 计算变化多少天后的日期
function DateAddDay(d, days) {

  var d = new Date(d);
  return new Date(d.setDate(d.getDate() + days));
}
// 获得本周周日的日期
function FirstDayInThisWeek(d) {

  var d = new Date(d);
  // console.log(formatTime(DateAddDay(d, 0 - d.getDay())));
  return DateAddDay(d, 0 - d.getDay());
}

// 判断类型
function Type(obj) {
  var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
  return typeStr.substr(0, typeStr.length - 1).toLowerCase();
}

 module.exports = {
  formatTime: formatTime,
  getCurrentTime: getCurrentTime
}