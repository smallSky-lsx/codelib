/*
 * @Author: Admin_CXx
 * @Date:   2021-01-08 10:17:05
 * @Last Modified by:   Admin_CXx
 * @Last Modified time: 2021-01-08 11:33:00
 */
// 伪随机数生成器[min, max]
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}