/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-07 14:49:48
 */

/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-05 11:43:48
 */

// 检测是否是迭代器
function hasIterator(obj) {
    const next = typeof obj === 'object' && obj !== null && obj.next; // next方法
    const data = typeof next === 'function' && obj.next(); // 下一个数据
    const isValueandDone = typeof data === 'object' && data.hasOwnProperty('value') && data.hasOwnProperty('done'); // 对象中是否存在value和done属性
    return isValueandDone;
}
console.log(hasIterator());


// 检测是否是可迭代对象
function hasIterableObject(obj) {
    const func = typeof obj === 'object' && obj !== null && obj[Symbol.iterator]; // 迭代器创建函数
    const iterator = typeof func === 'function' && obj[Symbol.iterator](); // 迭代器
    return hasIterator(iterator) || typeof obj === 'string'; // 字符串对象为可迭代对象
}
console.log(hasIterableObject({
    [Symbol.iterator]() {
        return {
            next() {
                return {
                    value: 0,
                    done: true
                };
            }
        };
    }
}));
console.log(hasIterableObject([]));
console.log(hasIterableObject(new String()));

// 自定义可迭代对象
// 每次迭代输出的数据格式：{key: 'a', value: 1}
const obj = {
    a: 1,
    b: 2,
    c: 3,
    [Symbol.iterator]() {
        const keys = Object.keys(this);
        let i = 0;
        return {
            next: () => {
                const key = keys[i++];
                const value = this[key];
                return {
                    value: { key, value },
                    done: i > keys.length
                }
            }
        }
    }
};
console.log(hasIterableObject(obj));
const iterator = obj[Symbol.iterator]();

for (const item of obj) {
    console.log(item);
}

// 检测是否是生成器
function hasGenerator(obj) {
    // 生成器既是一个迭代器又是一个可迭代对象
    return hasIterator(obj) && hasIterableObject(obj);
}