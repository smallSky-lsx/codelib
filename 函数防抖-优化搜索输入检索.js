// 获取元素
const oWd = document.getElementById('wd');

function getInputValue(e) {
    console.log(this, e);
    console.log(this.value);
}

oWd.oninput = debounce(getInputValue, 500);
// 函数防抖
// function debounce(handler, delay) {
//     return function() {
//         // 在开启定时器前，先清除之前的定时器(清除上一次事件触发想要执行的核心任务)
//         clearTimeout(handler.timerId);
//         handler.timerId = setTimeout(() => {
//             handler.apply(this, arguments);
//         }, delay);
//     }
// }

// 函数防抖
function debounce(handler, delay) {
    return new Proxy(handler, {
        apply(target, thisArg, argArray) {
            clearTimeout(target.timerId);
            target.timerId = setTimeout(() => {
                Reflect.apply(target, thisArg, argArray)
            }, delay);
        }
    })
}