/**
 * ArrayBuffer => Blob
 * @param  {[File]} file [文件]
 * @param  {[String]} type [字符串]
 */
function arrayBufferToBlob(file, type, callback) {
    const reader = new FileReader(); // 创建文件读取器

    reader.onload = function() { // 文件读取完成时触发的事件
        const buffer = this.result; // 文件读取完存放在result属性中
        const blob = new Blob([buffer], { type }); // 创建二进制数据存储容器，存储buffer数据，并设置MIME类型
        callback && callback(blob);
    };
    reader.readAsArrayBuffer(file); // 将文件作为ArrayBuffer读取
}

/**
 * 文件 => Base64编码格式
 * @param  {[File或Blob]}   file        [文件或Blob]
 * @param  {[数值]}   maxKBSize [运行上传的最大KB]
 * @param  {Function} callback    [回调函数]
 * @param {Function} error {文件体积过大后续处理}
 */
function fileToBase64(file, maxKBSize, callback, error) {
    if (!file) {
        return;
    }
    console.log(file);
    const reader = new FileReader(); // 创建文件读取器
    const AllowFileSize = (maxKBSize ? maxKBSize : 256) * 1024; // 允许上传的最大字节数, 默认允许上传256kb

    reader.onload = function() {
        const base64Str = this.result; // 加上了前缀：data:MIME;base64,
        // const base64Data = this.result.split(',')[1]; // 去掉前缀，获取base64编码部分
        if (base64Str.length > AllowFileSize) {
            error && error();
            return;
        }
        callback && callback(base64Str);
    }
    reader.readAsDataURL(file); // 将文件作为base64编码读取
}

/**
 * 通过base64格式计算文件大小
 * @param  {[String]} base64Str [base64格式]
 * @return {[number]}           [字节数]
 */
function calcBase64FileSize(base64Str) {
    // 1. 判断是否存在“data:MIME;base64,”前缀，存在去掉
    base64Str = base64Str.includes('base64,') ? base64Str.split('base64,').slice(1).join('') : base64Str;
    // 2. 去掉“=”
    base64Str = base64Str.replace(/=/g, '');
    // 3. 原文件大小等于现base64编码的3/4
    const fileSize = Math.floor(base64Str.length / 4 * 3);
    return fileSize;
}

/**
 * base64 => File
 * @param  {[String]} base64Str [base64格式字符串]
 * @param  {[String]} filename  [文件名]
 * @return {[object]} {File}
 */
function base64ToFile(base64Str, filename) {
    const u8Arr = base64ToUnit8Arr(base64Str);
    return new File([u8Arr], filename, { type: mime });
}

/**
 * base64 => Blob
 * @param  {[String]} base64Str [base64格式字符串]
 * @return {[object]}           [Blob]
 */
function base64ToBlob(base64Str) {
    const u8Arr = base64ToUnit8Arr(base64Str);
    return new Blob([u8Arr], { type: mime });
}

/**
 * 将base64格式字符串中的base64编码，存储在Uint8Array中
 * @param  {[type]} base64Str [base64格式字符串]
 * @return {[object]}           [Uint8Array]
 */
function base64ToUnit8Arr(base64Str) {
    const arr = base64Str.split(','), // 将base64字符串分割为前缀与base64编码
        mime = arr[0].replace(/(data:)|(;base64)/g, ''), // 获取文件MIME类型
        bstr = atob(arr[1]), // 将base64编码解码为二进制字符串
        n = bstr.length, // 获取字符串中字符数量
        u8Arr = new Uint8Array(n); // 创建n个无符号8位整型数组，0~255，使用8位存储一个整数
    let i = n;
    while (i--) {
        u8Arr[i] = bstr.charCodeAt(i); // 将字符转换为ASCII编码
    }
    return u8Arr;
}