// 将data转换为a=1&b=2格式的字符串
const toData = (data = null) => {
    if (!data || typeof data !== 'object') {
        return '';
    }
    // 将对象转换为键值对数组
    const kvArr = Object.entries(data);
    // 将键值对数组转换为key=value数组
    const strArr = kvArr.reduce((arr, [key, value]) => {
        arr.push(`${key}=${value}`);
        return arr;
    }, []);
    // 将数组使用&连接成字符串
    return strArr.join('&');
};
// 默认导出一个函数，用于ajax请求
export default ({
    url = './',
    method = 'get',
    async = true,
    data = null,
    success,
    error
} = {}) => {
    // 1. 创建xhr对象
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    // 2. xhr绑定onreadystatechange事件
    xhr.onreadystatechange = function() {
        // 请求完成，接收到数据
        if (this.readyState === 4) {
            const status = this.status;
            if (status >= 200 && status < 300 || status === 304) {
                success && success(JSON.parse(this.responseText))
            } else {
                error && error(status);
            }
        }
    };
    // 3. 准备请求资源
    method = method.toUpperCase();
    data = toData(data);
    if (method === 'GET') {
        // url处理，将参数附加到url上
        data && (url += url.includes('?') ? `&${data}` : `?${data}`);
        xhr.open(method, url, async);
        xhr.send();
    } else if (method === 'POST') {
        xhr.open(method, url, async);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
    // 4. 发送请求
};


export const jsonp = ({ url = './', data = null, ckey = 'callback', success } = {}) => {
    const oScript = document.createElement('script');

    data = toData(data);
    data && (url += url.includes('?') ? `&${data}` : `?${data}`);

    const funcName = `jsonp${new Date().getTime().toString().substr(0, 10)}`;
    url += `&${ckey}=${funcName}`
    window[funcName] = function(data) {
        success && success(data);
    };
    oScript.src = url;
    document.head.appendChild(oScript);
    oScript.remove();
};