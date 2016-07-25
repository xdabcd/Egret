/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
var StageUtils = (function (_super) {
    __extends(StageUtils, _super);
    /**
     * 构造函数
     */
    function StageUtils() {
        _super.call(this);
        if (StageUtils._uiStage == null) {
            StageUtils._uiStage = new eui.UILayer();
            StageUtils._uiStage.percentHeight = 100;
            StageUtils._uiStage.percentWidth = 100;
            StageUtils._uiStage.touchEnabled = false;
            this.getStage().addChild(StageUtils._uiStage);
        }
    }
    var d = __define,c=StageUtils,p=c.prototype;
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    p.getHeight = function () {
        return this.getStage().stageHeight;
    };
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    p.getWidth = function () {
        return this.getStage().stageWidth;
    };
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    p.setTouchChildren = function (value) {
        this.getStage().touchChildren = value;
    };
    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    p.setMaxTouches = function (value) {
        this.getStage().maxTouches = value;
    };
    /**
     * 设置帧频
     * @param value
     */
    p.setFrameRate = function (value) {
        this.getStage().frameRate = value;
    };
    /**
     * 设置适配方式
     * @param value
     */
    p.setScaleMode = function (value) {
        this.getStage().scaleMode = value;
    };
    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    p.getStage = function () {
        return egret.MainContext.instance.stage;
    };
    /**
     * 获取唯一UIStage
     * @returns {eui.UILayer}
     */
    p.getUIStage = function () {
        return StageUtils._uiStage;
    };
    return StageUtils;
}(BaseClass));
egret.registerClass(StageUtils,'StageUtils');
