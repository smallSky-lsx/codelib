/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-11 19:55:20
 */

console.dir(Number);

// 判断两个浮点数是否相等
console.log(0.1 + 0.2); // 0.30000000000000004

// 判断两个浮点数是否相等
function isEqual(a, b) {
    return Math.abs(a - b) < Number.EPSILON;
}
console.log(isEqual(0.1 + 0.2, 0.3));