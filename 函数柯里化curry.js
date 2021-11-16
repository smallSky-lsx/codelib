function add(a, b, c, d) {
    return a + b + c + d;
}

const newAdd = curry(add);
console.log(newAdd(1)(2)(3)(4));

// 普通方式实现函数柯里化
/*function curry(func, ...fixedArgs) {
    return function(...argsList) {
        const allArgs = [...fixedArgs, ...argsList];
        if (allArgs.length >= func.length) {
            return func(...allArgs);
        }
        return curry(func, ...allArgs);
    }
}*/

// 代理实现函数柯里化
function curry(func, ...fixedArgs) {
    return new Proxy(func, {
        apply(target, thisArg, argArray) {
            const allArgs = [...fixedArgs, ...argArray];
            if (allArgs.length >= target.length) {
                return Reflect.apply(target, thisArg, allArgs);
            } else {
                return curry(func, ...allArgs);
            }
        }
    });
}