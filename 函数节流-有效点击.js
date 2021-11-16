// 获取元素
const oBox = document.getElementsByClassName('box')[0];
const oBtn = document.getElementsByClassName('btn')[0];

// 绑定事件
function addCount(e) {
    console.log(this, e);
    oBox.innerText = +oBox.innerText + 1;
}

oBtn.onclick = throttle(addCount, 500);
// 执行：oBtn.click()

/*function throttle(handler, delay) {
    let lastTime = 0; // 记录上一次有效行为时的时间戳，ms
    return function() {
        let nowTime = new Date().getTime(); //记录当前行为时的时间戳，ms
        if (nowTime - lastTime >= delay) {
            // 有效行为-执行相应的程序
            handler.apply(this, arguments);
            // 将当前有效行为时的时间戳，作为上一次有效行为时的时间戳，闭包完美解决
            lastTime = nowTime;
        }
    }
}*/

// 函数节流
function throttle(handler, delay) {
    // 记录上一次有效行为开始时的时间戳，使用到闭包
    let lastTime = 0;
    return new Proxy(handler, {
        /**
         * target表示代理对象，即handler
         * thisArg表示函数调用时，改变函数内this的指向
         * argArray表示函数调用时，传递的形参列表，类型为数组
         */
        apply(target, thisArg, argArray) {
            // 记录现今行为时的时间戳
            let nowTime = new Date().getTime();
            if (nowTime - lastTime >= delay) {
                Reflect.apply(target, thisArg, argArray);
                lastTime = nowTime;
            }
        }
    })
}