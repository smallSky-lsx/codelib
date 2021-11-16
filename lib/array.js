/*
 * @Author: Admin_CXx
 * @Date:   2020-12-17 15:44:11
 * @Last Modified by:   Admin_CXx
 * @Last Modified time: 2021-01-30 16:23:36
 */

/**
 * 兼容Array.isArray()
 * @param  {[type]}  arg [要检测的参数]
 * @return {Boolean}     [是数组返回true，不是数组返回false]
 */
Array.isArray = Array.isArray ? Array.isArray : function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

/**
 * 兼容Array.of()
 * @return {[type]} [返回一个新数组]
 */
Array.of = Array.of ? Array.of : function() {
    return Array.prototype.slice.call(arguments);
};

// 检测是否是标准类数组对象，非数组对象
function isArrayLike(param) {
    /**
     * 1. 传递参数类型判断：
     *     a. 非对象 或 数组对象 --> 返回false
     * 2. 对象拥有一个length属性, 且length属性值：先检测是否拥有length属性
     *     a. 有效数值。
     *     b. 整数。
     *     c. 大于或等于0。
     *     d. 小于2的32次方
     * 标准类数组对象：{length: 0};
     */
    // 注意null, typeof null --> 'object'
    if (param === null || typeof param !== 'object' || {}.toString.call(param) === '[object Array]') {
        return false;
    }
    if (param.hasOwnProperty('length')) { //对象是否存在length属性
        var len = param.length; //静态化
        return isFinite(len) && //是否能转换为有效数值
            len === Math.floor(len) && //是否是数值且是整数
            len >= 0 && //是否大于或等于0
            len < Math.pow(2, 32); //是否小于2的32次方
    }
    return false;
    /* return !!param && //null、undefined、0、NaN、''、false  --> false
         typeof param === 'object' && //function、非空字符串、非0非NaN数值、true --> false
         {}.toString.call(param) !== '[object Array]' && // 数组对象 --> false
         param.hasOwnProperty('length') && // 对象中不存在length属性  --> false
         isFinite(param.length) && //不能转换为有效数值  --> false
         param.length === Math.floor(param.length) && //不是数值或整数 --> false
         param.length >= 0 && //负数值 --> false 
         param.length < Math.pow(2, 32); //大于或等于2的32次方 --> false*/
}
// =====================================================================
// 模拟数组中Array.prototype.sort
Array.prototype.mySort = function(fn) {
    //参数处理
    var fn = fn && typeof fn === 'function' ? fn : function(a, b) {
        return String(a) > String(b); //true --> 1, false --> 0
    };
    /**
     * 1. 未传递参数时，以字符编码从大到小排序
     * 2. 冒泡排序
     * 3. 改变原数组，返回原数组
     */
    var temp, // 用于数据交换 
        flag, // 数据排序是否完成的标记，true：完成，false：未完成
        len = this.length; // 获取数组长度
    for (var i = 0; i < len - 1; i++) { // 控制数组排序的趟数，n个数排序，只需确定n-1个数，每趟排序确定一个数
        flag = true; //假设每趟排序完成
        for (var j = 0; j < len - 1 - i; j++) { // 控制每趟排序的次数，n个数排序，只需要比较n-1次，再减去确定的个数 
            if (fn(this[j], this[j + 1]) < 0) { // 制定排序规则，关键
                // 进行数据交换
                temp = this[j];
                this[j] = this[j + 1];
                this[j + 1] = temp;
                flag = false;
            }
        }
        // 检测是否排序完
        if (flag) {
            break;
        }
    }
    return this;
};

// 模拟Array.prototype.reverse方法
Array.prototype.myReverse = function() {
    /**
     * 1. 改变原数组
     * 2. 返回原数组
     */
    var temp, // 用于数据交换
        len = this.length, // 获取数组长度
        startIndex = 0, // 起始索引
        endIndex = len - 1; // 末尾索引
    for (var i = 0, leni = Math.floor(len / 2); i < leni; i++) {
        // 前后数据交换
        temp = this[startIndex];
        this[startIndex] = this[endIndex];
        startIndex++;
        endIndex--;
    }
    return this;
};

// 模拟数组Array.prototype.join方法
Array.prototype.myJoin = function(connector) {
    /**
     * 1. 将null、undefined转换为空字符串
     * 2. 将数组按照指定连接符连成字符串
     * 3. 未传递参数时，等价于Array.prototype.toString
     */
    //定义内部函数，处理null和undefined
    function ideaData(data) {
        return data === null || data === undefined ? '' : data;
    }
    // 未传递参数处理
    if (arguments.length === 0) {
        var connector = ',';
    }
    var result = ideaData(this[0]), // 存储字符串结果
        len = this.length, // 获取数组长度
        value; // 存储数组中数据
    for (var i = 1; i < len; i++) {
        value = ideaData(this[i]);
        result += connector + value;
    }
    return result;
};

// 模拟数组覆写的Array.prototype.toString方法
Array.prototype.myToString = function() {
    return this.myJoin();
};

/**
 * 1. 迭代方法，不改变原数组
 * 2. 不推荐在回调函数中，对原数组进行新增、删除操作
 * 3. 不遍历数组中未初始化、删除的数组项，使用in操作符检测，返回false
 */
// 模拟数组的Array.prototype.filter方法
Array.prototype.myFilter = function(callback, thisArg) {
    /**
     * 创建一个新的空数组，存储过滤的数据
     */
    // 参数处理：callback，必须参数。thisArg可选参数
    if (arguments.length === 0) {
        throw new Error('请传递callback必需参数');
    }
    if (typeof callback !== 'function') {
        throw new Error('传递的不是函数');
    }
    var arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        // 数组中未初始化或已删除的项，不执行回调函数
        if (this.hasOwnProperty(i)) {
            callback.call(thisArg, this[i], i, this) && (arr[arr.length] = this[i]);
        }
    }
    return arr;
}
// 模拟数组的Array.prototype.forEach方法
Array.prototype.myForEach = function(callback, thisArg) {
    /**
     * 数组中的每个元素(已初始化且未删除的项)调用一次构造函数
     * 返回undefined
     */
    // 参数处理：callback，必须参数。thisArg可选参数
    if (arguments.length === 0) {
        throw new Error('请传递callback必需参数');
    }
    if (typeof callback !== 'function') {
        throw new Error('传递的不是函数');
    }
    var len = this.length;
    /**
     * 数组长度存储在len变量中，不能实时获取：
     * 1. 在回调函数执行前，遍历范围已确定。
     * 2. 调用此方法后，添加到数组中的元素，不会访问。
     * 3. 若是数组中的值改变，传入到回调函数中值为方法访问到那一刻的值。
     * 4. 不会遍历未初始化的元素。
     */
    for (var i = 0; i < len; i++) {
        if (this.hasOwnProperty(i)) {
            callback.call(thisArg, this[i], i, this);
        }
    }
};
// 模拟数组的Array.prototype.every方法
Array.prototype.myEvery = function(callback, thisArg) {
    /**
     * 空数组，返回true
     * 数组中所有元素满足条件，则返回true。否则立即返回false
     */
    // 参数处理：callback，必须参数。thisArg可选参数
    if (arguments.length === 0) {
        throw new Error('请传递callback必需参数');
    }
    if (typeof callback !== 'function') {
        throw new Error('传递的不是函数');
    }
    var len = this.length; //在调用回调函数前遍历范围已确定，数组长度存储在len中，不能实时获取
    for (var i = 0; i < len; i++) {
        if (this.hasOwnProperty(i)) { //数组中未初始化的项、被delete删除的项，返回false
            if (!callback.call(thisArg, this[i], i, this)) {
                return false;
            }
        }
    }
    return true;
};

// 模拟数组的Array.prototype.some方法
Array.prototype.mySome = function(callback, thisArg) {
    /**
     * 空数组，返回false
     * 数组中至少有一个元素满足条件，则立即返回true，否则返回false。
     */
    // 参数处理：callback，必须参数。thisArg可选参数
    if (arguments.length === 0) {
        throw new Error('请传递callback必需参数');
    }
    if (typeof callback !== 'function') {
        throw new Error('传递的不是函数');
    }
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (this.hasOwnProperty(i)) { //数组中未初始化的项、被delete删除的项，返回false
            if (callback.call(thisArg, this[i], i, this)) {
                return true;
            }
        }
    }
    return false;
};
//模拟Array.prototype.find方法
Array.prototype.myFind = function(callback, thisArg) {
    /**
     * 注意：此回调函数对于数组中的未初始化、删除的项也会调用回调函数
     * 返回满足条件的第一个数组元素，否则返回undefined
     */
    // 参数处理：callback，必须参数。thisArg可选参数
    if (arguments.length === 0) {
        throw new Error('请传递callback必需参数');
    }
    if (typeof callback !== 'function') {
        throw new Error('传递的不是函数');
    }
    var len = this.length,
        result = undefined;
    for (var i = 0; i < len; i++) { //数组的长度已经固定，不能动态变化
        if (callback.call(thisArg, this[i], i, this)) {
            result = this[i];
            break;
        }
    }
    return result;
};

// 模拟Array.prototype.findIndex方法
Array.prototype.myFindIndex = function(callback, thisArg) {
    /**
     * 注意：此回调函数对于数组中的未初始化、删除的项也会调用回调函数
     * 返回满足条件的第一个数组元素的索引值，否则返回-1
     */
    // 参数处理：callback，必须参数。thisArg可选参数
    if (arguments.length === 0) {
        throw new Error('请传递callback必需参数');
    }
    if (typeof callback !== 'function') {
        throw new Error('传递的不是函数');
    }
    var len = this.length,
        index = -1;
    for (var i = 0; i < len; i++) { //数组的长度已经固定，不能动态变化
        if (callback.call(thisArg, this[i], i, this)) {
            index = i;
            break;
        }
    }
    return index;
};
// 模拟Array.prototype.map方法
Array.prototype.myMap = function(callback, thisArg) {
    // 参数处理：callback，必须参数。thisArg可选参数
    if (arguments.length === 0) {
        throw new Error('请传递callback必需参数');
    }
    if (typeof callback !== 'function') {
        throw new Error('传递的不是函数');
    }
    var len = this.length,
        arr = [];
    for (var i = 0; i < len; i++) { //数组的长度已经固定，不能实时变化
        if (this.hasOwnProperty(i)) {
            //未初始化、已删除的元素，不调用回调函数
            arr[i] = callback.call(thisArg, this[i], i, this);
        } else {
            // 新创建数组的索引，与原数组的索引保持一致
            arr[i] = undefined; //未初始化、已删除的元素占位
            delete arr[i]; //回归到原来状态，占空位
        }
    }
    return arr;
};
/**
 * reduce:
 * 1. 针对于数组或类数组，关键在于length属性。
 * 2. 不改变原数组对象
 * 3. 返回值，即为accumulator
 * 4. 数组对象中未初始化或已删除的属性，不调用回调函数。
 * 5. 若是未传入initialValue，则accumulator为数组中第一个已初始化项的值。
 * 6. 空数组，未给初始值会报类型错误
 */
Array.prototype.myReduce = function(callback, initialValue) {
    var len = this.length,
        that = this,
        start = 0; //起始位置
    function iteratorArr() {
        for (var i = 0; i < len; i++) {
            if (that.hasOwnProperty(i)) {
                start = i + 1;
                return that[i];
            }
        }
    }
    // initialValue处理
    initialValue = arguments.length === 1 ? iteratorArr() : initialValue;
    // 回调返回值处理
    var accumulator = initialValue;
    // 回调函数
    for (var i = start; i < len; i++) {
        if (that.hasOwnProperty(i)) {
            accumulator = callback(accumulator, that[i], i, that);
        }
    }
    return accumulator;
};

/**
 * reduce: left --> right
 * 1. 针对于数组或类数组对象，关键在于length属性
 * 2. 不改变原数组对象
 * 3. 返回accumulator
 * 4. 数组对象中未初始化或已删除的属性，不调用回调函数。
 * 5. 若是未传入初始值，则accumulator为数组中第一个已初始化项的值
 * 6. 若是空数组，未传递初始值，则会报类型错误
 */
Array.prototype.myReduce = function(callback, initialValue) {
    var len = this.length,
        that = this,
        startIndex = 0, //遍历的起始索引
        flag = true; //监控是否继续遍历执行回调函数,true:结束遍历，false：继续遍历
    function iteratorArr(fn) {
        var result;
        for (var i = startIndex; i < len; i++) {
            if (that.hasOwnProperty(i)) {
                result = fn(i);
                if (flag) {
                    break;
                }
            }
        }
        return result;
    }
    // initialValue处理
    var accumulator = arguments.length === 1 ? iteratorArr(function(i) {
        flag = true; //满足条件，结束遍历
        startIndex = i + 1;
        return that[i];
    }) : initialValue;
    // 遍历回调函数
    iteratorArr(function(i) {
        flag = false; //满足条件，继续遍历
        accumulator = callback(accumulator, that[i], i, that);
    });
    return accumulator;
};
/**
 * reduceRight: right --> left
 * 1. 针对于数组或类数组，关键在于length属性。
 * 2. 不改变原数组对象
 * 3. 返回值，即为accumulator
 * 4. 数组对象中未初始化或已删除的属性，不调用回调函数。
 * 5. 若是未传入initialValue，则accumulator为数组中最后一个已初始化项的值。
 * 6. 若是空数组，未传递初始值，则会报类型错误
 */
Array.prototype.myReduceRight = function(callback, initialValue) {
    var len = this.length,
        that = this,
        startIndex = that.length - 1, //起始位置
        flag = true; //监控是否继续遍历执行回调函数, true:结束遍历，false：继续遍历
    function iteratorArr(fn) {
        var result;
        for (var i = startIndex; i >= 0; i--) {
            if (that.hasOwnProperty(i)) {
                result = fn(i);
                if (flag) {
                    break;
                }
            }
        }
        return result;
    }
    // initialValue处理
    var accumulator = arguments.length === 1 ? iteratorArr(function(i) {
        flag = true; //满足条件跳出循环
        startIndex = i - 1;
        return that[i];
    }) : initialValue;
    // 遍历回调函数
    iteratorArr(function(i) {
        flag = false; //满足条件不跳出循环
        accumulator = callback(accumulator, that[i], i, that);
    });
    return accumulator;
};

// 模拟Array.prototype.pop方法
Array.prototype.myPop = function() {
    /**
     * 1. 通过length属性，确定数组或类数组对象中最后一个位置。
     * 2. 如果不包含length属性或其值不能转换为数值，将length置为0，并返回undefined。
     * 3. 先取出最后一个位置的值，再通过length删除最后一个位置
     * 4. 返回删除元素的值
     * @type {[type]}
     */
    this.length = this.hasOwnProperty('length') &&
        isFinite(this.length) &&
        Number(this.length) > 0 ? Math.floor(this.length) : 0;
    var delPos = this.length - 1; //确定最后一个位置索引
    var delValue = this[delPos]; //取出最后一个位置的值, 对象中不存在的属性，返回undefined
    if (this.length) {
        delete this[delPos]; // 删除元素
        this.length = delPos; // 改变对象length属性值
    }
    return delValue;
};
// 模拟Array.prototype.push方法
Array.prototype.myPush = function() {
    /**
     * 添加元素的位置是通过length确定的。
     * 若是对象不存在length属性，则创建length属性；
     * 若是其值不能转换为有效数值，置为0。
     */
    this.length = this.hasOwnProperty('length') &&
        isFinite(this.length) &&
        Number(this.length) > 0 ? Math.floor(this.length) : 0;
    var insertPos = this.length; //插入元素的首位置
    for (var i = 0, len = arguments.length; i < len; i++) {
        this[insertPos++] = arguments[i];
    }
    this.length = insertPos; //数组最后的长度
    return this.length;
};
// 模拟Array.prototype.shift方法
Array.prototype.myShift = function() {
    /**
     * 1. 若是空数组，返回undefined。
     * 2. 取值--> 第二个元素开始往前1 --> 改变length属性值。
     * 3. 若是对象中不存在length属性，创建length属性，并初始化为数值0。
     *    若是对象中存在length属性，其值不能转换为有效值，置为数值0。
     *    若this.length转换为浮点数，向下取整。
     *    若this.length转换为负值，置为数值0。
     */
    // 对象length属性处理，此处可以直接以isFinite(this.length)&& Number(this.length) > 0判断即可
    this.length = this.hasOwnProperty('length') &&
        isFinite(this.length) &&
        Number(this.length) > 0 ? Math.floor(this.length) : 0;
    var delValue = undefined;
    if (this.length) {
        delValue = this[0]; //删除元素的值，取值
        // 从第二个位置开始，往前移动一位
        for (var i = 0, len = this.length - 1; i < len; i++) { //n个数，只需交换n-1次即可
            if (!this.hasOwnProperty(i + 1)) {
                delete this[i]; //删除未初始化、未定义、已删除的元素
                continue;
            }
            this[i] = this[i + 1];
        }
        delete this[this.length - 1]; //删除最后一个多余位置
        this.length -= 1; //改变length属性值
    }
    return delValue; //返回删除元素的值
};

// 模拟Array.prototype.unshift方法
Array.prototype.myUnshift = function() {
    // 对象的length属性处理
    this.length = this.hasOwnProperty('length') &&
        isFinite(this.length) &&
        Number(this.length) > 0 ? Math.floor(this.length) : 0;
    var lenj = this.length, //未添加元素前数组长度
        count = arguments.length; //添加元素的数量
    // 改变对象length属性值
    this.length = count + lenj;
    //元素移位，保留移动前状态
    for (var j = lenj - 1; j >= 0; j--) {
        if (!this.hasOwnProperty(j)) {
            delete this[j + count];
            continue;
        }
        this[j + count] = this[j];
    }
    // 初始化元素
    for (var i = 0; i < count; i++) {
        this[i] = arguments[i]; //初始化
    }
    return this.length;
};

// 数组去重：方式一，冒泡排序, 改变原数组，返回改变后原数组, 全等去重
Array.prototype.uniqueBubbleSort = function() {
    for (var i = 0, len = this.length; i < len - 1; i++) {
        for (var j = i + 1; j < len; j++) {
            if (this[i] === this[j]) {
                this.splice(j, 1);
                j--;
                len = this.length;
            }
        }
    }
    return this;
};

// var arr = [0, 1, 2, 0, 1, 2, 0, 'a', '0', '1', 3, 2, 1];
// arr.uniqueBubbleSort();

// 数组去重方式二：Hash，值等去重, 返回新数组,【推荐】
Array.prototype.uniqueHash = function() {
    var temp = {}, //临时对象
        arr = [], //去重后数组
        data;
    for (var i = 0, len = this.length; i < len; i++) {
        data = this[i];
        if (!temp[data]) {
            temp[data] = 'define';
            arr[arr.length] = data;
        }
    }
    return arr;
};
// var arr = [0, 1, 2, 0, 1, 2, 0, 'a', '0', '1', 3, 2, 1];
// console.log(arr.uniqueHash());

// 判断数组是否是对称数组
Array.prototype.isSymmetry = function() {
    var len = this.length, //数组长度
        startIndex = 0, //起始索引
        endIndex = len - 1; //末尾索引
    for (var i = 0, lenI = Math.floor(len / 2); i < lenI; i++) {
        if (this[startIndex++] != this[endIndex--]) {
            return false;
        }
    }
    return true;
};

// 有序数组，二分查找首次出现的索引
Array.prototype.binaryFindIndex = function(val) {
    var startIndex = 0, //起始索引
        endIndex = this.length - 1, //末尾索引
        midIndex; //中间索引
    while (startIndex <= endIndex) {
        midIndex = Math.floor((startIndex + endIndex) / 2);
        if (val == this[midIndex]) {
            return midIndex;
        } else if (val > this[midIndex]) { //右侧
            startIndex = midIndex + 1;
        } else { //左侧
            endIndex = midIndex - 1;
        }
        console.log(startIndex, midIndex, endIndex);
    }
    return -1;
};
// 获取数组中连续增长的最大长度
Array.prototype.getMaxIncreaseLen = function() {
    var count = 1, //统计连续增长
        maxLen = 0; //假设数组连续增长最大长度
    for (var i = 0, lenI = this.length; i < lenI; i++) {
        if (this[i] < this[i + 1]) {
            count++;
        } else {
            maxLen = maxLen > count ? maxLen : count;
            count = 1;
        }
    }
    return maxLen;
};