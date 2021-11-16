/**
 * 将url中的search部分解析为对象
 * @param {*} url window.location或url
 */
function parseSearch(url) {
    // 0. 判断传递参数的类型
    const urlType = Object.prototype.toString.call(url);

    if (urlType !== '[object Location]' && urlType === '[object String]') {
        url = new URL(url);
    }

    // 1. 解码，中文会转码，需要解码
    const queryStr = decodeURIComponent(url.search).slice(1);

    // 2. 解析为对象
    const kvObj = queryStr.split('&').reduce((obj, item) => {
        const [key, value] = item.split('=');
        obj[key] = value;
        return obj;
    }, {});

    return kvObj;
}
console.log(parseSearch(location));