/*
 * @Author: lsx
 * @Date:   2021-08-07 20:21:31
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-07 22:03:04
 */
// 模拟Map集合
const MyMap = (() => {
    const Entries = Symbol('Entries'); // 存储Map集合键值对数据
    let count = 0; // 记录Map集合中键值对数量
    // 检测是否是迭代器
    function hasIterator(obj) {
        const next = typeof obj === 'object' && obj !== null && obj.next; // next方法
        const data = typeof next === 'function' && obj.next(); // 下一个数据
        const isValueandDone = typeof data === 'object' && data.hasOwnProperty('value') && data.hasOwnProperty('done'); // 对象中是否存在value和done属性
        return isValueandDone;
    }
    // 检测是否是可迭代对象
    function hasIterableObject(obj) {
        const func = typeof obj === 'object' && obj !== null && obj[Symbol.iterator]; // 迭代器创建函数
        const iterator = typeof func === 'function' && obj[Symbol.iterator](); // 迭代器
        return hasIterator(iterator) || typeof obj === 'string'; // 字符串对象为可迭代对象
    }
    // 检测Map集合中是否存在此键值对
    function hasKey(obj, key) {
        let i = -1;
        for (const item of obj) {
            i++;
            if (Object.is(key, item.key) || key === item.key) {
                return {
                    index: i,
                    data: item
                }
            }
        }
        return null;
    }
    // 删除指定键的数据
    function deleteData(obj, info) {
        const { index, data } = info;
        const flag = delete obj[index];
        if (flag) {
            // 移位
            for (let i = index, len = count - 1; i < len; i++) {
                obj[i] = obj[i + 1];
            }
            // 删除最后一位
            index !== count - 1 && delete obj[count - 1];
            // 数量减一
            count--;
        }
        return flag;
    }
    return class MyMap {
        [Entries] = Object.create(null);
        *[Symbol.iterator]() {
            for (let i = 0; i < count; i++) {
                yield this[Entries][i];
            }
        };
        constructor(iterable) {
            // 过滤undefined与null
            if (iterable == undefined) {
                return this;
            }
            // 检测iterable是否是可迭代对象
            if (!hasIterableObject(iterable)) {
                throw new TypeError('不可迭代对象');
            }
            // 检测iterable迭代数据是否对象，且对象中至少有两个属性
            for (const item of iterable) {
                if (typeof item !== 'object' || item === null) {
                    throw new TypeError('迭代数据不是入口对象');
                }
                // 添加键值对数据
                let { 0: key, 1: value } = item;
                this.set(key, value);
            }
        }
        get size() {
            return count;
        }
        set(key, value) {
            const info = hasKey(this, key);
            if (info) {
                info.data.value = value;
            } else {
                this[Entries][count++] = {
                    key,
                    value
                };
            }
            return this;
        }
        has(key) {
            return !!hasKey(this, key);
        }
        get(key) {
            const info = hasKey(this, key);
            if (!info) {
                return undefined;
            }
            return info.data.value;
        }
        clear() {
            this[Entries] = Object.create(null);
            count = 0;
        }
        delete(key) {
            const info = hasKey(this, key);
            return !!info && deleteData(this[Entries], info);
        }
        forEach(callback){
            if(typeof callback !== 'function'){
                throw new TypeError('传递的是参数不是函数');
            }
            for(const {key, value} of this){
                callback(value, key, this);
            }
        }
    }
})();