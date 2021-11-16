let str = 'sdfjkdfsdasdkjfjksfkfas232ASSJKDhkdfkmcdhjdfDDNKJnm3][,l;l.//.,12323+-/';

// 获取字符串中字母信息-方式一：
function getStrInfo1(str) {
    const strInfo = {}; // 存储字符串中字母相关信息
    // 1. 将字符串中非字母字符去掉
    str = str.replace(/[^a-zA-Z]/g, '');
    // 2. 将字符串全部转换为小写字母
    str = str.toLowerCase();
    // 3. 将字符串排序，按照ASCII升序排序
    str = str.split('').sort().join('');
    str = str.replace(/([a-z])\1*/g, function(findStr, letter) {
        strInfo[letter] = findStr.length;
        return letter;
    });
    // 4. 将对象转换为指定格式的数组
    const kvStrArr = Object.entries(strInfo);
    // 5. 将数组按照字母数量升序排序, 改变原数组
    kvStrArr.sort((a, b) => a[1] - b[1]);
    return kvStrArr;
}

console.log(getStrInfo1(str));

// 方式二：利用hash
function getStrInfo2(str) {
    const strInfo = {}; // 存储字符串中字符信息
    // 1. 将字符串中非字母字符去掉
    str = str.replace(/[^a-zA-Z]/g, '');
    // 2. 将字符串中所有
    str = str.toLowerCase();
    for (const letter of str) {
        const letterObj = strInfo[letter];
        if (letterObj === undefined) {
            strInfo[letter] = 1;
        } else {
            strInfo[letter]++;
        }
    }
    return strInfo;
}
console.log(getStrInfo2(str));