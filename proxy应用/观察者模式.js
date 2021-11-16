/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-09 11:48:49
 */

// 观察者模式：观察者(代理)，观察另一个对象中属性值的变化，变化时发出一个通知，会做一些事情
const target = {
    name: 'lishunxiang',
    age: 25
};

function observer(target, callback) {
    // 先初始化一次
    typeof callback === 'function' && callback(target);
    return new Proxy(target, {
        set(target, prop, value) {
            if (Reflect.get(target, prop) !== value) {
                Reflect.set(target, prop, value);
                typeof callback === 'function' && callback(target);
            }
        },
        get(target, prop) {
            return Reflect.get(target, prop);
        }
    }); // 返回观察者
}

const ob = observer(target, obj => {
    console.log(obj);
});