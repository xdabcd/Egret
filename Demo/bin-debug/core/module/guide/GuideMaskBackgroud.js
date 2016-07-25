/**
 * Created by yangsong on 14-12-2.
 * 引导背景层，实现的是一个类似不规则遮罩的功能
 */
var GuideMaskBackgroud = (function (_super) {
    __extends(GuideMaskBackgroud, _super);
    /**
     * 构造函数
     */
    function GuideMaskBackgroud() {
        _super.call(this);
        this._stageWidth = 0;
        this._stageHeight = 0;
        this._bgs = new Array();
        this.touchEnabled = true;
    }
    var d = __define,c=GuideMaskBackgroud,p=c.prototype;
    /**
     * 初始化游戏宽高
     * @param stageWidth 宽
     * @param stageHeight 高
     */
    p.init = function (stageWidth, stageHeight) {
        this._stageWidth = stageWidth;
        this._stageHeight = stageHeight;
    };
    /**
     * Draw
     * @param deductRec 抠出矩形区域
     */
    p.draw = function (deductRec) {
        this.cacheAsBitmap = false;
        this._deductRec = deductRec;
        this.removeAllChild();
        var minX = Math.max(deductRec.x, 0);
        var minY = Math.max(deductRec.y, 0);
        var maxX = Math.min(deductRec.x + deductRec.width, this._stageWidth);
        var maxY = Math.min(deductRec.y + deductRec.height, this._stageHeight);
        this.addBg(0, 0, this._stageWidth, minY);
        this.addBg(0, minY, minX, deductRec.height);
        this.addBg(maxX, minY, this._stageWidth - maxX, deductRec.height);
        this.addBg(0, maxY, this._stageWidth, this._stageHeight - maxY);
        this.width = this._stageWidth;
        this.height = this._stageHeight;
        this.cacheAsBitmap = true;
    };
    /**
     * 销毁
     */
    p.destroy = function () {
        this.removeChildren();
        this._bgs = [];
    };
    /**
     * 移除所有对象
     */
    p.removeAllChild = function () {
        while (this.numChildren) {
            var bg = this.removeChildAt(0);
            this._bgs.push(bg);
        }
    };
    /**
     * 添加一个bg
     * @param $x 初始X
     * @param $y 初始Y
     * @param $w 宽
     * @param $h 高
     */
    p.addBg = function ($x, $y, $w, $h) {
        var bg;
        if (this._bgs.length) {
            bg = this._bgs.pop();
            bg.graphics.clear();
        }
        else {
            bg = new egret.Shape();
        }
        bg.graphics.beginFill(0x000000, 0.5);
        bg.graphics.drawRect($x, $y, $w, $h);
        bg.graphics.endFill();
        this.addChild(bg);
    };
    /**
     * 重写hitTest
     * 检测指定坐标是否在显示对象内
     * @method egret.DisplayObject#hitTest
     * @param x {number} 检测坐标的x轴
     * @param y {number} 检测坐标的y轴
     * @param ignoreTouchEnabled {boolean} 是否忽略TouchEnabled
     * @returns {*}
     */
    p.hitTest = function (x, y, ignoreTouchEnabled) {
        if (this._deductRec && this._deductRec.contains(x, y)) {
            return null;
        }
        else {
            return this;
        }
    };
    return GuideMaskBackgroud;
}(egret.Sprite));
egret.registerClass(GuideMaskBackgroud,'GuideMaskBackgroud');
