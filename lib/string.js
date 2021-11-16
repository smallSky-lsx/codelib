/*
 * @Author: Admin_CXx
 * @Date:   2021-01-04 12:25:15
 * @Last Modified by:   Admin_CXx
 * @Last Modified time: 2021-01-29 21:54:14
 */

var str = 'aaaabbbddbbbbccc';
/**
 * [
 *     0: a: {
 *         value: 'a',
 *         currCount: 4
 *         prevCount: 0
 *     }
 * ]
 */
function getStrInfo(str) {
    var infoObj = [],
        tempObj = {},
        temp, //存储字符
        prevChar; //记录上一个出现
    for (var i = 0, len = str.length; i < len; i++) {
        temp = str.charAt(i);
        if (!tempObj[temp]) { //没有此属性, 初始化
            tempObj[temp] = {
                value: temp,
                count: 1
            };
            infoObj[infoObj.length] = tempObj[temp]; //存储到数组中，地址引用
        } else { //有此属性
            tempObj[temp].count++;
        }
    }
    return infoObj;
}
var arr = getStrInfo(str).sort(function(a, b) {
    return b.count - a.count;
});
console.log(arr);
console.log('char:' + arr[0].value + '\ncount:' + arr[0].count);

// 模拟indexOf
function getFirstIndex(str, substr, fromIndex) {
    fromIndex = fromIndex || 0;
    var originLen = str.length, //可遍历原串长度
        subLen = substr.length, //子串长度
        equalMaxCount = originLen - subLen + 1; //最多可比较次数
    for (var i = fromIndex; i < equalMaxCount; i++) { //控制比较次数
        var flag = true; //检测是否检测到
        for (var j = 0; j < subLen; j++) { //控制每次判断比较
            if (substr.charAt(j) != str.charAt(i + j)) {
                flag = false;
                break;
            }
        }
        if (flag) {
            return i;
        }
    }
    return -1;
}