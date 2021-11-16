/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-09 11:32:04
 */

// 函数柯里化，固定函数参数
function add(a, b, c, d) {
    return a + b - c * d;
}
/**
 * [使用代理完成函数柯里化，固定函数前面参数]
 * @param  {[type]}    func  [柯里化函数]
 * @param  {...[type]} fargs [需要固定的形参]
 * @return {[type]}          [代理对象]
 */
function curryProxy(func, ...fargs) {
    return new Proxy(func, {
        apply(target, argsThis, argsList){
            const allArgs = [...fargs, ...argsList];
            if(allArgs.length >= target.length){
                return Reflect.apply(target, argsThis, allArgs);
            }else {
                return curryProxy(target, ...allArgs);
            }
        }
    });
}

const func1 = curryProxy(add, 1, 2);
let result = func1(3);
console.log(result(4));