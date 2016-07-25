/**
 * Created by yangsong on 15-8-19.
 * 平均数工具类
 */
var AverageUtils = (function () {
    /**
     * 构造函数
     * @param $maxNum 参与计算的最大值
     */
    function AverageUtils($maxNum) {
        if ($maxNum === void 0) { $maxNum = 10; }
        this.nums = [];
        this.numsLen = 0;
        this.numSum = 0;
        this.maxNum = $maxNum;
    }
    var d = __define,c=AverageUtils,p=c.prototype;
    /**
     * 加入一个值
     * @param value
     */
    p.push = function (value) {
        if (this.numsLen > this.maxNum) {
            this.numsLen--;
            this.numSum -= this.nums.shift();
        }
        this.nums.push(value);
        this.numSum += value;
        this.numsLen++;
    };
    /**
     * 获取平均值
     * @returns {number}
     */
    p.getValue = function () {
        return this.numSum / this.numsLen;
    };
    /**
     * 清空
     */
    p.clear = function () {
        this.nums.splice(0);
        this.numsLen = 0;
        this.numSum = 0;
    };
    return AverageUtils;
}());
egret.registerClass(AverageUtils,'AverageUtils');
