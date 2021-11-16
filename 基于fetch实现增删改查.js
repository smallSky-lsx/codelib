/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-13 11:17:38
 */

// 基于fetch实现增删改查
const EasyHttp = (() => {
    // 请求基本配置
    const baseRequestConfig = function(data = {}) {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    };
    // fetch请求
    const baseFetch = async function(url = './', config = {}) {
        try {
            const response = await fetch(url, config);
            return await response.json();
        } catch (e) {
            throw e;
        }
    };
    return class EasyHttp {
        // GET请求：查询数据
        async get(url) {
            return await baseFetch(url);
        }
        // POST请求：查询数据、上传数据
        async post(url, data) {
            return await baseFetch(url, baseRequestConfig(data));
        }
        // PUT请求：更新数据
        async put(url, data) {
            return await baseFetch(url, {
                ...baseRequestConfig(data),
                method: 'PUT'
            });
        }
        // DELETE请求：删除数据
        async delete(url) {
            return await baseFetch(url, {
                ...baseRequestConfig(),
                method: 'DELETE'
            });
        }
    }
})();

const easyHttp = new EasyHttp();
easyHttp.post('https://api.apiopen.top/getJoke').then(data => {
    console.log(data);
});