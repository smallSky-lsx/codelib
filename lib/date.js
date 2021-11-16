// 格式化日期时间对象,返回yyyy-MM-dd HH:mm:ss的形式
Date.prototype.formatDateTime = function() {
    /**
     * 年： 4位数
     * 月： 0-11
     * 日： 1-31
     * 时： 0-23
     * 分： 0-59
     * 秒： 0-59
     */
    var dateArr = []; //定义一个空数组用于存储年月日 时分秒
    // 存储数据
    dateArr[0] = this.getFullYear(); //存储年份
    dateArr[1] = this.getMonth(); //存储月份
    dateArr[2] = this.getDate(); //存储日数

    dateArr[3] = this.getHours(); //存储小时数
    dateArr[4] = this.getMinutes(); //存储分钟数
    dateArr[5] = this.getSeconds(); //存储秒数
    // 处理数据，加0
    var num; //用于咱叔存储数组中数据
    for (var i = 1, len = dateArr.length; i < len; i++) {
        num = dateArr[i];
        dateArr[i] = num < 10 ? '0' + num : num;
    }
    var dateStr = dateArr.slice(0, 3).join('-'); //yyyy-mm-dd 
    var timeStr = dateArr.slice(3).join(':'); //hh:mi:ss
    var result = dateStr + ' ' + timeStr;
    return result;
}

var date = new Date();
// console.log(date.formatDateTime());

/**
 * [获取两个日期时间的差，天数、小时、分钟、秒数]
 * @param  {[Date]} startDate [开始日期时间对象]
 * @param  {[Date]} endDate   [结束日期时间对象]
 * @return {[Object]}  [{day: xxx, hour: xxx, min: xxx, sec: xxx}]
 */
Date.getDateTimeDuration = function(startDate, endDate) {
    // 参数处理：传递的是日期时间对象
    if (!startDate instanceof Date && !endDate instanceof Date) {
        console.error('传递的参数类型错误');
        return;
    }
    var totalSec = Math.floor((endDate - startDate) / 1000); //相差总秒数
    var totalMin = totalSec / 60; //相差总分钟数，可能为浮点数
    var totalHour = totalMin / 60; //相差总小时数， 可能为浮点数
    var obj = { //存储相差的天、时、分、秒
        day: Math.floor(totalHour / 24), //相差的总天数
        hour: Math.floor(totalHour % 24), //相差的小时数
        min: Math.floor(totalMin % 60), //相差的分钟数
        sec: Math.floor(totalSec % 60) //相差的秒数
    };
    return obj;
};
// console.log(Date.getDateTimeDuration(new Date(), new Date(2020, 11, 31)));