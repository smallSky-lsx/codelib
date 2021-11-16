/*
 * @Author: Admin_CXx
 * @Date:   2021-01-05 21:09:34
 * @Last Modified by:   Admin_CXx
 * @Last Modified time: 2021-01-27 13:59:44
 */
// 兼容window.getComputedStyle
function getEleStyle(ele, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null)[attr];
    }
    return ele.currentStyle[attr];
}

// 取消元素事件默认行为
function cancelDefault(e) {
    if (e.preventDefault) { //标准浏览器
        e.preventDefault();
    } else {
        e.returnValue = false; //IE678
        return false; //仅适合事件处理器, 不适合事件监听器
    }
}

// 兼容innerText
function getInnerText(ele) {
    return (typeof ele.innerText === 'string') ? ele.innerText : ele.textContent;
}

function setInnerText(ele, txt) {
    /**
     * ele.innerText, 不兼容返回undefined, typeof undefined => 'undefined'
     * ele.innerText, 兼容(注意：获取可能返回空字符串)，typeof '' ==> 'string'
     */
    (typeof ele.innerText === 'string') ? ele.innerText = txt: ele.textContent = txt;
}

// 兼容firstElementChild
function getFirstElementChild(element) {
    var node, // 当前节点
        nodes = element.childNodes, //获取元素所有子节点：包括：元素节点、文本节点、注释节点
        i = 0;
    while (node = nodes[i++]) { //i++, 表达式会产生一个值。表达式值为i，即0。i = i + 1, i为1
        if (node.nodeType === 1) {
            return node;
        }
    }
    return null; //若是没有元素节点返回null
}
// 兼容lastElementChild
function getLastElementChild(element) {
    var node,
        nodes = element.childNodes,
        i = nodes.length - 1;
    while (node = nodes[i--]) {
        if (node.nodeType === 1) {
            return node;
        }
    }
    return null;
}
// 兼容previousElementSibling
function getPreviousElementSibling(element) {
    var node = element;
    while (node = node.previousSibling) {
        if (node.nodeType === 1) {
            return node;
        }
    }
    return null;
}
// 兼容nextElementSibling
function getNextElementSibling(element) {
    var node = element;
    while (node = node.nextSibling) {
        if (node.nodeType === 1) {
            return node;
        }
    }
    return null;
}
// 兼容addEventListener
function addEventHandler(ele, type, callback) {
    if (ele.addEventListener) {
        ele.addEventListener(type, callback, false);
    } else if (ele.attachEvent) {
        ele.attachEvent('on' + type, callback);
    } else {
        type = 'on' + type;
        if (typeof ele[type] === 'function') {
            // 元素已注册此事件
            var oldHandler = ele[type]; //存储旧的处理程序
            // 注册新的处理程序
            ele[type] = function() {
                oldHandler();
                callback();
            };
        } else {
            // 元素未注册此事件
            ele[type] = callback;
        }
    }
}

function removeEventHandler(ele, type, callbackName) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, callbackName, false);
    } else if (ele.detachEvent) {
        ele.detachEvent('on' + type, callbackName);
    } else {
        ele['on' + type] = null;
    }
}

// 取消事件冒泡
function cancelEventBubble(e) {
    if (e.stopPropagation) { //标准浏览器
        e.stopPropagation();
    } else { //IE678
        e.cancleBubble = true;
    }
}
// 获取页面滚动距离
/**
 * 1. IE9+等最新浏览器
 * 2. 标准模式浏览器(已声明DTD)：Firefox、其他浏览器
 * 3. 怪异模式(混杂模式)浏览器(未声明DTD)、Chrome浏览器(自认为未声明DTD)
 * 注意：页面未滚动时，默认值为0。不兼容返回undefined
 * 0 != null ==> true
 * undefined != null ==> false
 */
function getScroll() {
    // IE9+等最新浏览器
    if (window.pageXOffset != null) {
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        };
    }
    // 标准模式浏览器(已声明DTD): Firefox、其他浏览器
    if (document.compatMode === 'CSS1Compat') {
        // CSS1Compat: 标准模式(已声明DTD)
        // BackCompat: 混杂模式(未声明DTD)
        return {
            left: document.documentElement.scrollLeft,
            top: document.documentElement.scrollTop
        };
    }
    // 混杂模式浏览器(未声明DTD)、Chrome(自认为未声明DTD)
    return {
        left: document.body.scrollLeft,
        top: document.body.scrollTop
    };
}


// 事件对象pageX与pageY兼容处理: 可视区域的位置+滚动距离
function getPage(e) {
    if (e.pageX != null) {
        return {
            x: e.pageX,
            y: e.pageY
        }
    }
    // 兼容低版本IE浏览器
    return {
        x: e.clientX + getScroll().left,
        y: e.clientY + getScroll().top
    };
}

// 获取浏览器可视区域的宽度和高度
/**
 * 1. IE9+等最新浏览器
 * 2. 标准模式浏览器(已声明DTD): Firefox、其他浏览器
 * 3. 混杂模式浏览器(未声明DTD)、Chrome(自认为未声明DTD)
 */
function getClient() {
    // IE9+等最新浏览器
    if (window.innerWidth != null) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    // 标准模式浏览器(已声明DTD): Firefox、其他浏览器
    if (document.compatMode === 'CSS1Compat') {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
    // 混杂模式浏览器(未声明DTD)、Chrome(自认为未声明DTD)
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
    };
}

// JS层面，取消页面选中文本的状态
function cancelSelection() {
    // 标准浏览器
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else {
        document.selection.empty(); //IE678
    }
}

// 获取页面选中的文本内容
function getSelection() {
    // 标准浏览器
    if (window.getSelection) {
        return window.getSelection().toString();
    }
    // IE678
    return document.selection.createRange().text;
}

// 兼容低版本IE，document.getElementsByClassName()
Document.prototype.getElementsByClassName = Document.getElementsByClassName || function(_className) {
    /**
     * 1. 获取所有元素
     * 2. 获取所有元素的className属性值
     * 3. 对获取的className属性值进行空格处理
     * 4. 对每个className进行空格拆分。
     * 5. 判断
     */
    function trimSpace(str) {
        /**
         * 1. 取消字符串前后空格。
         * 2. 将字符串中一个或多个空格，替换为一个空格。
         */
        return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    }
    _className = _className || undefined;
    var classObj = {
            length: 0
        },
        allEle = this.getElementsByTagName('*');
    for (var i = 0, len = allEle.length; i < len; i++) {
        var classStr = trimSpace(allEle[i].className),
            classArr = classStr.split(' ');
        for (var j = 0, lenj = classArr.length; j < lenj; j++) {
            if (classArr[j] === _className) {
                [].push.call(classObj, allEle[i]);
                break;
            }
        }
    }
    return classObj;
};
Element.prototype.getElementsByClassName = Document.prototype.getElementsByClassName;

// HTMLDivElement扩展-预加载+懒加载
HTMLDivElement.prototype.checkSelf = function(url) {
    if (this.offsetTop < getScroll().top + getClient().height) {
        if (!this.lock) { //锁
            this.lock = true; //上锁
            var oImg = new Image(); //在内存中创建一个img元素
            oImg.src = url; //设置图片地址，并开始加载
            var that = this;
            oImg.onload = function() { //图片加载完那一瞬触发
                that.appendChild(this);
            };
        }
    }
};

// 元素的单个属性运动：匀速+缓冲(减速)
function animateSingle(params, callback) {
    /**
     * params {
     *      ele: ele//运动元素
     *      target: target,//运动目标
     *      style: 'width',//运动样式
     *      step: 7//匀速运动步长，可选.忽略为缓动动画，正值即可
     * }
     */
    // 在开启定时器前先关闭定时器，避免定时器叠加
    var ele = params.ele,
        attr = params.style,
        targetLen = params.target, //目标值
        currLen = getEleStyle(ele, attr), //当前值
        stepLen; //步长

    if (attr === 'opacity') {
        currLen = parseInt(currLen * 100) || 0;
        targetLen = parseInt(targetLen * 100) || 0;
    } else {
        currLen = parseFloat(currLen) || 0;
        targetLen = parseFloat(targetLen) || 0;
    }
    //清除定时器
    function closeTimer(mark, callback) {
        if (mark) {
            // console.log('关闭定时器');
            clearInterval(ele.timerId); //关闭定时器
            ele.timerId = null;
            callback && callback();
        }
    }
    closeTimer(ele.timerId); //检测是否开启定时器, 定时器标识为正整数
    // 开启定时器, 并存储ele元素开启的定时器标识,正整数
    (currLen != targetLen) && (ele.timerId = window.setInterval(function() {
        var isStop = false; //是否停止运动
        // console.log('启动定时器', ele.flag);
        // 处理步长
        if (params.step) {
            stepLen = params.step;
            // 传递有效步长，匀速运动
            stepLen = currLen < targetLen ? stepLen : -stepLen;
        } else {
            // 传递无效步长，或未传递步长，缓冲运动
            stepLen = (targetLen - currLen) / 7;
        }
        // 步长大于0，向上取整。步长小于0，向下取整
        stepLen = stepLen > 0 ? Math.ceil(stepLen) : Math.floor(stepLen);
        currLen += stepLen;
        // 检测是否达到目标位置
        if (Math.abs(targetLen - currLen) < Math.abs(stepLen)) {
            // 达到目标位置，行为
            isStop = true;
            currLen = targetLen;
            // ele.flag = false; //可以制作为回调函数传入
            // console.log('关闭定时器', ele.flag);
            // 在每个元素动画执行完，再去执行回调函数
        }
        if (attr === 'opacity') {
            ele.style[attr] = currLen / 100;
            ele.style['filter'] = 'alpha(' + attr + '=' + currLen + ')';
        } else if (attr === 'zIndex') {
            ele.style[attr] = targetLen;
        } else {
            ele.style[attr] = currLen + 'px';
        }
        isStop && closeTimer(true, callback); //关闭定时器，停止运动
    }, 30));
}
// 元素的多个属性运动，支持width、height、left、top、opacity、zIndex属性：匀速+缓冲(减速)
function animateMultiple(params, callback) {
    /**
     * params = {
     *         ele: ele, // 运动元素
     *         style: {
     *             width: 100,
     *             height: 100,
     *             left: 100,
     *             top: 100,
     *             opacity: 1,
     *             zIndex: 0
     *         },
     *         step: 7, 忽略则为缓冲运动
     * };
     */
    var currValue, //当前值
        targetValue, //目标值
        stepLen, //步长
        ele = params.ele, // 运动元素
        sStyle = params.style; // 运动属性
    function closeTimer(mark, callback) {
        if (mark) {
            // console.log('关闭定时器');
            clearInterval(ele.timerId); //关闭定时器
            ele.timerId = null;
            callback && callback();
        }
    }
    closeTimer(ele.timerId); //检测是否开启定时器, 定时器标识为正整数
    ele.timerId = setInterval(function() {
        ele.flag = true; //假设运动完成
        for (var attr in sStyle) {
            // 当前值, width/height/top/left/opacity/zIndex
            currValue = getEleStyle(ele, attr);
            // 目标值
            targetValue = sStyle[attr];
            if (attr === 'opacity') {
                currValue = parseInt(currValue * 100) || 0;
                targetValue = parseInt(targetValue * 100) || 0;
            } else {
                currValue = parseInt(currValue) || 0;
            }
            // console.log(attr+',curr:' + currValue);
            // console.log(attr+',target:' + targetValue);
            // console.log('===========');
            // 步长
            if (params.step) {
                stepLen = params.step;
                // 传递有效步长，匀速运动
                stepLen = currValue < targetValue ? stepLen : -stepLen; //处理传递参数
            } else {
                // 传递无效步长或未传递步长，缓存运动
                stepLen = (targetValue - currValue) / 10;
            }
            stepLen = stepLen > 0 ? Math.ceil(stepLen) : Math.floor(stepLen); //步长取整
            // console.log(stepLen);
            // 当前值 += 步长, 
            currValue += stepLen;
            // console.log(attr + ':' + currValue);
            // 检测是否到达目标位置
            if (Math.abs(targetValue - currValue) <= Math.abs(stepLen)) {
                // 到达目标位置
                currValue = targetValue;
            } else {
                // 未到达目标位置
                ele.flag = false;
            }
            // 设置元素对应属性值
            if (attr === 'opacity') {
                ele.style['filter'] = 'alpha(' + attr + '=' + currValue + ')';
                ele.style[attr] = currValue / 100;
            } else if (attr === 'zIndex') {
                ele.style[attr] = targetValue;
            } else {
                ele.style[attr] = currValue + 'px';
            }
        }
        closeTimer(ele.flag, callback); //关闭定时器，停止运动
    }, 30);
}
// 弹性运动
function animateSpring(ele, attr, targetValue, callback) {
    // 检测是否清除定时器
    function closeTimer(mark, callback) {
        if (mark) {
            clearInterval(ele.timerId);
            ele.timerId = null;
            callback && callback();
        }
    }
    closeTimer(ele.timerId);
    var a = 3, //加速度
        iSpeed = 0, //初速度
        loss = 0.8, //每次运动，速度损耗值
        currentValue = parseFloat(getEleStyle(ele, attr)); //当前值
    ele.timerId = setInterval(function() {
        var isStop = false; //是否停止运动
        /**
         * 向左运动 : ==>, a为正，v为正
         * 向右运动 : <==, a为负，v为负
         * 1. 以目标位置为参考点，参考点左边a为正，参考点右边a为负。
         *         a. 刚开始a减小，v增大。当物体越过目标位置，a为负，a增大，v开始减少到0为止，开始反向运动。
         *         b. 反向运动，a为负，a减少，v为负不断增大。当越过目标位置，a为正，a增大，v开始减少到0为止，开始正向运动。
         * 2. 每次运动，速度都会有损耗。
         * 3. 运动什么时候停止，当物体速度接近于0，且物体接近目标位置，此时物体运动停止。
         */
        /*if (currentValue < targetValue) {
            a = (targetValue - currentValue) / 5; //为正值
        } else {
            a = (targetValue - currentValue) / 5; //为负值
        }*/
        a = (targetValue - currentValue) / 5;
        iSpeed += a; //当前理想速度
        iSpeed *= loss; //运动损耗后真实速度
        currentValue += iSpeed; //当前位置
        // 检测运动是否可停止,当运动速度的绝对值小于1，且当前位置与目标位置差的绝对值小于1时，物体可停止运动
        if (Math.abs(iSpeed) < 1 && Math.abs(targetValue - currentValue) < 1) {
            isStop = true;
            currentValue = targetValue;
            console.log('清除定时器');
        }
        ele.style[attr] = currentValue + 'px';
        isStop && closeTimer(true, callback);
    }, 50);
}
// 模拟重力场：多方向运动+碰撞检测+重力加速度+碰撞能量损耗
function animateGravity(ele, iSpeedX, iSpeedY, callback) {
    // 检测是否清除定时器
    function closeTimer(mark, callback) {
        if (mark) {
            clearInterval(ele.timerId);
            ele.timerId = null;
            callback && callback();
        }
    }
    closeTimer(ele.timerId);
    iSpeedX = iSpeedX || 0; //水平方向初速度
    iSpeedY = iSpeedY || 0; //垂直方向初速度
    var g = 3, //重力加速度恒定，方向始终向下
        lose = 0.8, //碰撞能力损耗
        currentX = ele.offsetLeft, //水平方向当前值
        currentY = ele.offsetTop, //垂直方向当前值
        crashBottom = getClient().height - ele.offsetHeight, //底部碰撞临界点
        crashTop = 0, //顶部碰撞临界点
        crashLeft = 0, //左墙碰撞临界点
        crashRight = getClient().width - ele.offsetWidth; //右墙碰撞临界点
    // 检测是否发生碰撞
    function isCrash(direction, callback, crashCValue) { //注意：值传递
        if (callback()) {
            if (direction === 'y') { //水平方向
                iSpeedY *= -1;
                currentY = crashCValue;
            } else { //垂直方向
                iSpeedX *= -1;
                currentX = crashCValue;
            }
            // 碰撞能量损耗
            iSpeedX *= lose;
            iSpeedY *= lose;
        }
    }
    //物体向下运动(为正)、向左运动(为正)，向上运动(为负)、向右运动(为负)
    ele.timerId = setInterval(function() {
        // 权重加速度，改变垂直方向运动速度
        iSpeedY += g;
        // 多方向运动，矢量
        currentX += iSpeedX;
        currentY += iSpeedY;

        // 碰撞检测：底部+顶部、左墙+右墙
        /*if (currentY >= crashBottom) { //底部碰撞检测
            console.log('底部碰撞');
            iSpeedY *= -1; //反向运动
            currentY = crashBottom;
            // 碰撞能量损耗
            iSpeedX *= lose;
            iSpeedY *= lose;
        }*/
        isCrash('y', function() {
            return currentY >= crashBottom;
        }, crashBottom);
        /*if (currentY <= crashTop) { //顶部碰撞检测
            console.log('顶部碰撞');
            iSpeedY *= -1; //反向运动
            currentY = crashTop;
            // 碰撞能量损耗
            iSpeedX *= lose;
            iSpeedY *= lose;
        }*/
        isCrash('y', function() {
            return currentY <= crashTop;
        }, crashTop);
        /*if (currentX >= crashRight) { //右墙碰撞检测
            console.log('右墙碰撞');
            iSpeedX *= -1;
            currentX = crashRight;
            // 碰撞能量损耗
            iSpeedX *= lose;
            iSpeedY *= lose;
        }*/
        isCrash('x', function() {
            return currentX >= crashRight;
        }, crashRight);
        /*if (currentX <= crashLeft) { //左墙碰撞检测
            console.log('左墙碰撞');
            iSpeedX *= -1;
            currentX = crashLeft;
            // 碰撞能量损耗
            iSpeedX *= lose;
            iSpeedY *= lose;
        }*/
        isCrash('x', function() {
            return currentX <= crashLeft;
        }, crashLeft);
        // 停止运动检测:水平方向速度和垂直方向速度为0，且物体停在底部
        Math.abs(iSpeedX) < 1 && (iSpeedX = 0);
        Math.abs(iSpeedY) < 1 && (iSpeedY = 0);
        if (iSpeedX === 0 && iSpeedY === 0 && crashBottom === currentY) {
            closeTimer(true, callback);
            console.log('清除定时器');
        } else {
            ele.style.left = currentX + 'px';
            ele.style.top = currentY + 'px';
        }
    }, 30);
}