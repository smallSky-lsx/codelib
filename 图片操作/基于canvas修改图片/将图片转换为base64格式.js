/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-13 23:50:20
 */

// 1.获取元素
const oContainer = document.getElementsByClassName('container')[0];
const oImg = document.getElementById('img');
const oBtn = document.getElementById('btn');

/**
 * 原理——
 * 1.canvas画布是由像素点组成的。
 * 2.每个像素点是由红、绿、蓝、透明度组成的，值的取值范围：0~255。
 * 3.可以将图片画入canvas指定位置，并指定图片显示的宽度和高度。
 * 4.可以获取canvas指定区域的像素点数据，为类型化数组。
 * 5.可以对获取的像素点数据进行操作。(算法)
 * 5.可以将像素点数据载入到canvas画布中显示。
 * 6.可以将canvas画布转换为Base64格式的图片地址。
 */
/**
 * 通过canvas修改图片或将图片转换为base64格式
 * @param  {[object]} img [img元素]
 * @param  {[function]} callback [修改图片算法]
 * @return {[object]} [Promise对象，状态数据为base64格式图片地址]
 */
function modifyImage(img, callback) {
    return new Promise((resolve, reject) => {
        // 获取图片元素显示的宽度和高度
        const imgWidth = img.width,
            imgHeight = img.height;
        // 创建canvas元素
        const canvas = document.createElement('canvas');
        // 设置canvas宽度和高度，比例尺1:1
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        // 获得canvas 2d上下文
        const ctx = canvas.getContext('2d');
        // 将图片画入canvas指定位置，并显示指定宽度和高度
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        // 获取canvas指定区域的像素点数据，类型化数组
        let imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
        // 使用修改图片算法，修改像素点数据
        callback(imgData);
        // 将修改后的像素点数据，画入canvas中指定位置显示
        ctx.putImageData(imgData, 0, 0);
        // 将canvas画布转换为base64格式的图片地址，可以选择图片类型，图片质量：0-1
        const ext = img.src.slice(img.src.lastIndexOf('.') + 1).toLowerCase();
        const base64Url = canvas.toDataURL(`image/${ext==='jpg'?'jpeg':ext}`); // 参数：图片类型, 图片质量
        /**
         * 图片类型，默认值为：image/png, 应该与传入的图片格式对应
         * 图片质量： [0, 1]取值，默认即可
         */
        // 改变Promise状态，并传入状态数据
        resolve(base64Url);
    })
}

oBtn.onclick = async function() {
    const url = await modifyImage(oImg, toDarken);
    const imgEle = new Image();
    imgEle.src = url;
    oContainer.appendChild(imgEle);
};

/**
 * 修改图片像素点数据为黑白照像素点数据
 * @param  {[type]} imgData [图片像素点数据]
 * @return {[type]}         [黑白照像素点数据]
 */
function toDarken(imgData) {
    /**
     * 1. 每个像素点是由四个值组成的，每个值取值范围为：[0, 255]
     * 2. 分别为：red、green、blue、alpha
     * 3. 黑白照：将每个像素点的red、green、blue三个值的平均数，作为red、green、blue的值即可
     */
    const { data } = imgData;
    for (let i = 0, len = data.length; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
    }
    return imgData;
}