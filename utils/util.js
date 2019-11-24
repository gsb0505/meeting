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

        module.exports = {
          formatTime: formatTime,
          getCurrentTime: getCurrentTime
        }