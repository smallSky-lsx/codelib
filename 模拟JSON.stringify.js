/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-12 10:22:44
 */
/**
 * 将传入的数据转换为 JSON 格式的字符串
 * @param {any} data 要转换的数据
 * @returns {String} 返回转换后的 JSON 字符串
 */
function toJSON(data) {
    // 判断是否是BigInt类型
    const isBigInt = function(data) {
        if (typeof data === "bigint") {
            throw new TypeError("Do not know how to serialize a BigInt");
        }
    };
    // 判断是否是NaN、Infinity(或无穷数)、null
    const isNull = function(data) {
        return (
            Object.is(data, NaN) ||
            (!Number.isFinite(data) && typeof data === 'number') ||
            null === data
        );
    };
    // 判断是否是undefined、函数、符号
    const isUndefined = function(data) {
        return (
            undefined === data ||
            typeof data === "function" ||
            typeof data === "symbol"
        );
    };
    // 判断是否是字符串
    const isString = function(data) {
        return typeof data === "string";
    };
    // 判断是否是非数组对象
    const isObject = function(data) {
        return typeof data === 'object' && data !== null && !Array.isArray(data);
    }
    // 1. 基本数据类型格式化
    const simpleFormat = function(data) {
        isBigInt(data);
        if (isNull(data)) { // null、无穷数、NaN、Infinity
            return 'null';
        } else if (isUndefined(data)) { // undefined、符号、函数
            return undefined;
        } else if (isString(data)) { // 字符串
            return `\"${data}\"`;
        } else { // 其他
            return `${data}`;
        }
    }
    // 2. 对象格式化
    const objFormat = function(data) {
        // 键值对连接成字符串
        const concatStr = function(key, value) {
            return `\"${key}\":${value}`;
        }
        let result = [];
        for (const key in data) {
            const value = data[key];
            isBigInt(value); //判断是否为bigint
            if (Object.hasOwnProperty.call(data, key) && !isUndefined(value)) { //去除：undefined、函数、符号
                let str;
                if (isNull(value)) { // NaN、Infinity、null
                    str = null;
                } else if (isString(value)) { // 字符串
                    str = `\"${value}\"`;
                } else if (Array.isArray(value)) { // 数组
                    str = arrayFormat(value);
                } else if (isObject(value)) { // 对象
                    str = objFormat(value);
                } else { //其他
                    str = value;
                }
                result.push(concatStr(key, str));
            }
        }
        return `{${result.join(',')}}`;
    }
    // 3. 数组格式化
    const arrayFormat = function(data) {
        let result = [],
            str;
        for (let i = 0, len = data.length; i < len; i++) {
            const value = data[i];
            isBigInt(value); // 判断是否位bigint
            if (isNull(value) || isUndefined(value)) { // null、undefined、无穷数、NaN、Infinity、符号、函数
                str = `null`;
            } else if (isString(value)) { // 字符串
                str = `\"${value}\"`;
            } else if (Array.isArray(value)) { // 数组
                str = `${arrayFormat(value)}`;
            } else if (isObject(value)) { // 对象: 其他对象可做详细处理
                str = `${objFormat(value)}`;
            } else { // 其他
                str = `${value}`;
            }
            result.push(str);
        }
        return `[${result.join(',')}]`;
    }
    // 1. 基本数据类型
    if (typeof data != 'object' || data === null) {
        return simpleFormat(data);
    }
    // 2. 对象
    if (isObject(data)) {
        switch (Object.prototype.toString.call(data)) {
            case '[object Number]':
            case '[object String]':
            case '[object Boolean]':
                return simpleFormat(data.valueOf());
            case '[object Date]':
                return simpleFormat(data.toISOString());
            default:
                return objFormat(data);
        }
    }
    // 3. 数组
    if (Array.isArray(data)) {
        return arrayFormat(data);
    }
}

console.log(toJSON(NaN));
console.log(toJSON(Infinity));
console.log(toJSON(-Infinity));
console.log(toJSON(Number.MAX_VALUE * 10000));
// console.log(toJSON(BigInt(1)))
console.log(toJSON(0));
console.log(toJSON(1234556));
console.log(toJSON(-2345465))
console.log('***************')

console.log(toJSON(null));
console.log(toJSON(undefined));
console.log(toJSON(function() {}));
console.log(toJSON(Symbol()));
console.log(toJSON("hello"));
console.log(toJSON("    hello    world   "));
console.log(toJSON(""));
console.log(toJSON());
console.log(toJSON(''));
console.log('**********************')

console.log(toJSON(true));
console.log(toJSON(false));
console.log('************************')

console.log(toJSON([]))
console.log(toJSON([1, 2, 3, 4, 5, 6, 7, , 8, 9]))
console.log(toJSON([NaN]))
console.log(toJSON([NaN, Infinity, null, undefined, Symbol(), function() {}]))
console.log(toJSON(['', ' hello', '  world   ', true, false, 123, 0]))
console.log(toJSON(['', ' hello', '  world   ', true, false, 123, 0, [],
    [, []],
    ['', ' hello', '  world   ', true, [NaN, Infinity, null, undefined, Symbol(), function() {}], false, 123, 0], { a: NaN, b: Infinity, c: null, d: undefined, e: Symbol(), f: function() {}, a1: 111, b1: '', c1: true, d1: false, e1: 'hello', f1: undefined, d2: { a: 1, b: 2, c: 'hello' } }
]))

console.log(toJSON(new Number(1)));

console.log(JSON.stringify(new Number()));
console.log(JSON.stringify(new String()));
console.log(JSON.stringify(new Boolean(true)));
console.log(JSON.stringify(new Date()));
console.log(JSON.stringify(new Function()));
console.log(toJSON(new Number()));
console.log(toJSON(new String()));
console.log(toJSON(new Boolean(true)));
console.log(toJSON(new Date()));
console.log(toJSON(new Function()));