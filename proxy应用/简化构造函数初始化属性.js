/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-09 11:40:30
 */

// 简化构造函数中属性初始化
class User {}

function constructorProxy(Class, callback, ...propNames) {
    return new Proxy(Class, {
        construct(target, argsList) {
            // 执行target构造函数，返回新的空对象
            const emptyObj = Reflect.construct(target, argsList);
            // 为新的空对象初始化属性并赋值
            propNames.forEach((prop, i) => {
                emptyObj[prop] = argsList[i];
            });
            // 在构造函数中执行回调
            typeof callback === 'function' && callback(emptyObj);
            return emptyObj;
        }
    });
}

const UserProxy = constructorProxy(User, obj => {
    console.log(obj);
}, 'name', 'sex', 'age');
const user = new UserProxy('lisi', 'male', 23);
console.log(user);