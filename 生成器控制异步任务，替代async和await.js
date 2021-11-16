/*
 * @Author: lsx
 * @Date:   2021-05-24 01:47:48
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-08-06 10:23:53
 */

// 生成器控制-异步任务



function run(generatorFunc) {
    const generator = generatorFunc(); // 创建生成器
    let result = generator.next(); // 运行生成器函数内代码，得到迭代数据
    // 处理迭代数据
    handleData();

    function handleData() {
        // 判断生成器函数内代码是否执行完
        if (result.done) {
            return;
        }
        // 迭代数据的值：Promise对象、其他数据
        const data = result.value;
        if (Object.prototype.toString.call(data) === '[object Promise]') {
            // 迭代数据为Promise对象
            data.then(data => {
                result = generator.next(data);
                handleData();
            }, err => {
                generator.return(err); // 发现错误，提前结束
            });
        } else {
            // 迭代数据为其他数据
            result = generator.next(data);
            handleData();
        }
    }
}

run(function*() {
    // 同步任务
    const a = yield 1;
    console.log(a);
    const b = yield 2;
    console.log(b);
    const c = yield 3;
    console.log(c);
    // 异步任务
    let result = yield fetch('http://open.duyiedu.com//api/student/findAll?appkey=cenxi_1612142272813');
    result = yield result.json();
    console.log(result);
});