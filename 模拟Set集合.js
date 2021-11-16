/*
 * @Author: lsx
 * @Date:   2021-08-07 14:27:27
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-07 20:40:49
 */
// 模拟Set集合
const MySet = (() => {
    const Entries = Symbol('Entries'); // 存储数据，类数组
    let count = 0; // 记录Set集合数据数量
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
        return hasIterator(iterator) || typeof obj === 'string';
    }
    // 检测Set集合中是否存在此数据
    function hasData(obj, data) {
        let i = -1;
        for (const item of obj) {
            i++;
            if (Object.is(item, data) || item === data) {
                return {
                    index: i,
                    data: item
                };
            }
        }
        return null;
    }
    // 删除对象中指定位置的数据
    function deleteData(obj, { data, index }) {
        // info：删除数据的信息
        const flag = delete obj[index];
        if (flag) {
            // 移位
            for (let i = index, len = count - 1; i < len; i++) {
                obj[i] = obj[i + 1];
            }
            index !== count - 1 && delete obj[count - 1];
            // 计数减1
            count--;
        }
        return flag;
    }
    return class MySet {
        [Entries] = Object.create(null);
        *[Symbol.iterator]() {
            for (let i = 0; i < count; i++) {
                yield this[Entries][i];
            }
        }
        constructor(iterable) {
            // 过滤undefined与null
            if(iterable == undefined){
                return this;
            }
            // 判断是否是可迭代对象
            if (!hasIterableObject(iterable)) {
                throw new TypeError('传递的不是可迭代对象');
            }
            // 添加数据
            for (const data of iterable) {
                this.add(data);
            }
        }
        get size() {
            return count;
        }
        add(data) {
            if (hasData(this, data)) {
                return this;
            }
            this[Entries][count++] = data;
            return this;
        }
        has(data) {
            return !!hasData(this, data);
        }
        delete(data) {
            const dataInfo = hasData(this, data);
            return !!dataInfo && deleteData(this[Entries], dataInfo);
        }
        clear() {
            this[Entries] = Object.create(null);
            count = 0;
        }
        forEach(callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('传递的不是一个函数');
            }
            for (const item of this) {
                callback(item, item, this);
            }
        }
    }
})();