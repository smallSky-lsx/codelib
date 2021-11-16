/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-13 23:51:42
 */

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
