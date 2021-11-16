/*
 * @Author: Admin_CXx
 * @Date:   2021-01-02 15:42:22
 * @Last Modified by:   Admin_CXx
 * @Last Modified time: 2021-02-11 19:40:33
 */

// 浅克隆
/**
 * 克隆对象，对象中的引用数据，克隆的是地址
 * 注意：只克隆对象本身属性，不可隆其原型属性
 * 不克隆方法
 */
function clone(origin, target) {
    // 若是用户未传递target, 由系统提供一个空对象
    target = target || {};
    var data;
    for (var key in origin) {
        data = origin[key];
        if (origin.hasOwnProperty(key) && typeof data !== 'function') {
            target[key] = data;
        }
    }
    return target;
}
/*var obj = {
    name: 'lsx',
    age: 24,
    sex: 'male',
    hobby: ['read', 'sports', 'travel'],
    say: function() {
        console.log(this.name);
    }
}
var newObj = clone(obj);
console.log(newObj);*/

// 深层克隆
/**
 * 深层克隆，克隆的仅仅是属性数据，不克隆方法
 */
function deepClone(origin, target) {
    target = target || {};
    var data;
    for (var key in origin) {
        data = origin[key];
        if (origin.hasOwnProperty(key) && typeof data !== 'function') { //仅克隆对象本身的属性
            // 判断不是对象
            if (data === null || typeof data !== 'object') {
                // 拷贝数据
                target[key] = data;
            } else {
                // 是对象或数组
                if ({}.toString.call(data) === '[object Array]') {
                    target[key] = [];
                } else if (data instanceof Object) {
                    target[key] = {};
                }
                arguments.callee(data, target[key]);
            }
        }
    }
    return target;
}

// var newObj1 = deepClone(obj);


// 获取数据的类型 
var getType = (function() {
    // 引用值
    var dataType = {
        'Object': 'object',
        'Array': 'array',
        'Number': 'number obj',
        'String': 'string obj',
        'Boolean': 'boolean obj',
        'RegExp': 'regexp',
        'Date': 'date',
        'Math': 'math',
        'Null': 'null'
    };
    return function(data) {
        var str = Object.prototype.toString.call(data).slice(8, -1),
            ret = typeof data;
        return ret !== 'object' ? ret : dataType[str];
    };
}());
// 测试代码
// var typeTest = [12, 'hello', true, undefined, null, new String(), new Number(), new Boolean(), [], {}, alert, Math, /1234/, new Date()];
// typeTest.forEach(function(ele) {
//     console.log(getType(ele));
// });
// 封装原生ajax
function ajax(options) {
    var url = options.url || '',
        type = options.type || 'get',
        data = options.data || '',
        async = options.async || true,
            success = options.success,
            error = options.error;
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            success && success(this.responseText);
        }
    };
    xhr.onerror = function(e) {
        error && error(new Error(e));
    };
    type = type.toUpperCase();
    if (type === 'GET') {
        url = data ? url + '?' + data : url;
        xhr.open(type, url, async);
        xhr.send();
    } else if (type === 'POST') {
        xhr.open(type, url, async);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
}
/*ajax({
    url: 'http://developer.duyiedu.com/edu/testAjaxCrossOrigin',
    type: 'get',
    success: function(data) {
        console.log(data);
    }
});*/
// 操作cookie工具
var ManageCookie = {
    /**
     * [新增、修改cookie]
     * @param {[String]} name  [cookie的name属性]
     * @param {[String]} value [cookie的value属性]
     * @param {[Number]} date  [cookie的max-age属性]
     */
    set: function(name, value, date) {
        // 通过expires设置到期日期时间
        /*var endDate = new Date();
        endDate.setSeconds(endDate.getSeconds()+date);
        document.cookie = name+'='+value+'; expires='+endDate;*/
        // 通过max-age设置存活秒数
        document.cookie = name + '=' + value + '; max-age=' + date;
    },
    /**
     * [删除指定name的cookie]
     * @param  {[String]} name [cookie的name属性]
     */
    remove: function(name) {
        // max-age等于0，表示失效cookie，浏览器会自动删除
        this.set(name, '', 0);
    },
    /**
     * [获取指定name的cookie]
     * @param  {[String]} name [cookie的name属性]
     * @return {[String]}      [cookie的value属性值，没有返回undefined]
     */
    get: function(name) {
        return this.all()[name];
    },
    // 获取所有cookie，对象
    all: function() {
        var cookies = document.cookie.split('; '),
            obj = {};
        for (var i = 0, len = cookies.length; i < len; i++) {
            var item = cookies[i].split('=');
            obj[item[0]] = item[1];
        }
        return obj;
    }
};
/*// 测试：新增cookie
ManageCookie.set('key', 'value', 100);
ManageCookie.set('key1', 'value1', 100);
ManageCookie.set('key2', 'value2', 100);
ManageCookie.set('key3', 'value3', 100);
ManageCookie.set('key4', 'value4', 100);
ManageCookie.set('key5', 'value5', 100);
// 测试：修改cookie
ManageCookie.set('key', 'lsx', 1000);
// 检测：删除cookie
ManageCookie.remove('key');
// 测试：获取所有cookie，返回为对象
console.log(ManageCookie.all());
// 测试：获取指定name的cookie值
console.log(ManageCookie.get('key'));*/