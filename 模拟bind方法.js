/**
 * @param  {[type]}    thisArg  [指定函数内this指向]
 * @param  {...[type]} fixArgs [接收函数剩余参数的数组]
 * @return {[type]}             [新的函数]
 */
Function.prototype.newBind = function(thisArg, ...fixArgs) {
    // this指向调用newBind的函数
    const selfFunc = this;
    // 1. 由于返回的函数，能作为构造函数使用，不能返回箭头函数
    // 2. 新的函数的prototype指向selfFunc的prototype
    const newFunc = function(...listArgs) {
        // 1. 判断函数是否作为构造函数使用————
        // 作为构造函数使用：new.target指向函数
        // 作为普通函数使用：new.target为undefined
        // 2. this指向————
        // 作为普通函数，this默认指向window
        // 作为构造函数，this指向新创建的对象
        const allArgs = [...fixArgs, ...listArgs]; // 合并固定参数+传递参数
        return selfFunc.apply(new.target ? this : thisArg, allArgs);
    };
    newFunc.prototype = selfFunc.prototype;
    return newFunc;
};

// 测试代码
var value = 0;
var obj = {
    value: 1
};

function show(name, age) {
    console.log(this.value);
    console.log(name, age);
}

// 用法一： 仅改变函数内this指向
const newShow = show.newBind(obj);
newShow('lsx', 18);

// 用法二： 作为函数柯里化使用，用于固定函数前面的参数
const fixShow = show.newBind(null, 'lsx');
fixShow(18);

// 用法三： 改变函数内this指向，并固定函数前面的参数
const nfShow = show.newBind(obj, 'lsx');
nfShow(18);

// 用法四： 固定构造函数前面的参数，实例化不同的实例
show.prototype.lastName = 'ls';
const conShow = show.newBind(obj, 'lsx');
console.log(show === conShow); //false，返回的是一个新的函数
const cs1 = new conShow(18);
const cs2 = new conShow(19);
console.log(cs1 === cs2); // false
// 新的函数的prototype指向没变，constructor没变
console.log(cs1.__proto__ === show.prototype); // true
console.log(cs1.constructor === show); // true
console.log(cs1.lastName);