/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-09 11:20:27
 */

// 可验证函数参数类型

function add(a, b){
    return a + b;
}

function validateFuncType(func, ...argsType){
    return new Proxy(func, {
        apply(target, argsThis, argsList){
            // target：函数
            // argsThis：函数内this
            // argsList：参数列表，数组
            argsType.forEach((type, i)=>{
                if(type !== typeof argsList[i]){
                    throw new TypeError(`第${i+1}个参数应是${type}类型`);
                }
            });
            return Reflect.apply(target, argsThis, argsList);
        }
    });
}

const funcProxy = validateFuncType(add, 'number', 'number');
const result = funcProxy(1);
console.log(result);