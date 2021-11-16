/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-09 15:44:52
 */

// 检测是否是类数组(不包含数组对象)
function isLikeArray(data) {
    let len;
    if (data && // null、undefined、0、false、NaN、''
        typeof data === 'object' && // object
        !Array.isArray(data) && // 不是数组对象
        Number.isFinite(len = data.length) && // 存在length属性，且值为有效数值
        len === Math.floor(len) && // 整数
        len >= 0 && // 大于等于0
        len < Math.pow(2, 32)) {
        return true;
    }
    return false;
}

const testData = [undefined, null, 0, '', false, true, 'hello', 234, {},
    [],
    [1, 2, 3, 4],
    { length: undefined },
    { length: null },
    { length: -12 },
    { length: 0 }
];

testData.forEach(data => {
    console.log(isLikeArray(data));
});

/**
 * 类数组特点———
 * 1. 是对象，不是原始值
 * 2. 不是数组
 * 3. 对象中存在一个length属性：
 *     3.1 length属性值为数值，且是整数，范围在：[0, 2^32-1]
 */