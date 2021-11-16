/*
 * @Author: lsx
 * @Date:   2021-07-30 11:17:56
 * @Last Modified by:   smallsky
 * @Last Modified time: 2021-07-30 19:03:48
 */

const MyPromise = (() => {
    const PromiseState = Symbol('PromiseState'); // Promise状态
    const PromiseResult = Symbol('PromiseResult'); // Promise状态数据
    // Promise状态
    const PENDING = 'pending';
    const FULFILLED = 'fulfilled';
    const REJECTED = 'rejected';
    // 私有方法名
    const changeState = Symbol('changeState'); // 改变Promise状态方法名
    const thengroups = Symbol('thengroups'); // thenable作业队列名名
    const catchgroups = Symbol('catchgroups'); // catchable作业队列名
    const handleFunc = Symbol('handleFunc'); // 处理后续处理函数名

    return class MyPromise {
        constructor(callback) {
            // 定义resolve，reject函数：改变Promise状态、传递状态数据, 状态一旦改变不可逆
            const reject = err => {
                // 判断当前Promise状态是否不是pending
                this[changeState](REJECTED, err, this[catchgroups]);
            };
            const resolve = data => {
                // 判断当前Promise状态是否不是pending
                if (data instanceof MyPromise) {
                    // data = data的数据
                    // state = data的状态
                    // 如何获取data状态和状态数据？？？
                    data.then(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    });
                } else {
                    this[changeState](FULFILLED, data, this[thengroups]);
                }
            };
            // 执行callback函数，同步代码
            // 若是callback中出现未捕获错误，则Promise立即推向为rejected
            try {
                callback(resolve, reject);
            } catch (e) {
                this[changeState](REJECTED, e, this[catchgroups]);
            }
        }
        // 作业队列初始化
        [thengroups] = [];
        [catchgroups] = [];
        // 初始化 Promise状态、状态数据
        [PromiseState] = PENDING;
        [PromiseResult] = undefined;
        // Promise状态改变、状态数据
        [changeState](state, data, groups) {
            if (this[PromiseState] !== PENDING) {
                return;
            }
            this[PromiseState] = state;
            this[PromiseResult] = data;
            // Promise状态一旦改变，能将相应作业队列的后续处理函数加入到事件队列的微队列中等待执行
            groups.forEach(func => {
                // 使用setTimeout模拟加入事件队列的宏队列中
                setTimeout(() => {
                    func(data); // 后续处理函数执行完， 新的Promise状态会发生改变
                }, 0);
            });
            groups.length = 0; // 清空作业队列后续处理函数
        }
        // 执行Promise后续处理作业队列中异步函数
        [handleFunc](thenable, catchable, fulfilled, rejected) {
            const stateData = this[PromiseResult],
                thenLists = this[thengroups],
                catchLists = this[catchgroups];
            // 封装后续处理函数：
            const execFunc = (hFunc, data, resolve, reject) => {
                try {
                    const returnValue = hFunc(data); // 后续处理函数，及返回值
                    if (returnValue instanceof MyPromise) {
                        returnValue.then(rData => {
                            resolve(rData);
                        }, rErr => {
                            reject(rErr);
                        });
                    } else {
                        resolve(returnValue); // 改变新的Promise状态、传递状态数据
                    }
                } catch (e) {
                    reject(e);
                }
            };
            // 将后续处理函数加入到相应的作业队列中
            const pushGroups = (groups, hFunc, resolve, reject) => {
                groups.push(data => {
                    if (hFunc === undefined && this[PromiseState] === FULFILLED) {
                        resolve(data);
                        return;
                    }
                    if (hFunc === undefined && this[PromiseState] === REJECTED) {
                        reject(data);
                        return;
                    }
                    execFunc(hFunc, data, resolve, reject);
                });
            };
            // 将后续处理函数立即加入到事件队列的微队列中，模拟
            const pushEventQueue = (hFunc, data, resolve, reject, nowState) => {
                if (hFunc === undefined && nowState === REJECTED) {
                    reject(data);
                    return;
                }
                if (hFunc === undefined && nowState === FULFILLED) {
                    resolve(data);
                    return;
                }
                setTimeout(() => {
                    execFunc(hFunc, data, resolve, reject);
                }, 0);
            };
            return new MyPromise((resolve, reject) => {
                switch (this[PromiseState]) {
                    case PENDING: // 加入到相应的作业队列中
                        pushGroups(thenLists, thenable, resolve, reject);
                        pushGroups(catchLists, catchable, resolve, reject);
                        break;
                    case FULFILLED:
                        pushGroups(catchLists, catchable, resolve, reject);
                        pushEventQueue(thenable, stateData, resolve, reject, FULFILLED);
                        break;
                    case REJECTED:
                        pushGroups(thenLists, thenable, resolve, reject);
                        pushEventQueue(catchable, stateData, resolve, reject, REJECTED);
                }
            });
        }
        then(thenable, catchable) {
            // 若是fulfilled，执行thenable
            // 若是rejected，执行catchable
            return this[handleFunc](thenable, catchable);
        }
        catch (catchable) {
            return this[handleFunc](undefined, catchable);
        }
        static resolve(data) {
            if (data instanceof MyPromise) {
                return data;
            }
            return new MyPromise((resolve, reject) => {
                resolve(data);
            });
        }
        static reject(data) {
            return new MyPromise((resolve, reject) => {
                reject(data);
            });
        }
        static all(iterator) {
            return new MyPromise((resolve, reject) => {
                const markObj = Array.from(iterator).reduce((markObj, pro, i) => {
                    // 初始化
                    const obj = markObj[i] = {
                        isFulfilled: false,
                        data: null
                    };
                    pro.then(data => {
                        obj.isFulfilled = true;
                        obj.data = data;
                        const mark = markObj.every(obj => obj.isFulfilled);
                        if (mark) {
                            const returnData = markObj.reduce((arr, obj) => {
                                arr.push(obj.data);
                                return arr;
                            }, []);
                            resolve(returnData);
                        }
                    }, err => {
                        obj.data = err;
                        reject(err);
                    });
                    return markObj;
                }, []);
                console.log(markObj);
            });
        }
        static race(iterator) {
            return new MyPromise((resolve, reject) => {
                Array.from(iterator).forEach(pro => {
                    pro.then(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    });
                });
            });
        }
    }
})();