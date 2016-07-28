/**
 *
 * @author 
 *
 */
class StageUtils {
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    public static getHeight():number {
        return this.getStage().stageHeight;
    }

    /**
     * 获取游戏宽度
     * @returns {number}
     */
    public static getWidth():number {
        return this.getStage().stageWidth;
    }

    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    public static setTouchChildren(value:boolean):void {
        this.getStage().touchChildren = value;
    }

    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    public static setMaxTouches(value:number):void {
        this.getStage().maxTouches = value;
    }

    /**
     * 设置帧频
     * @param value
     */
    public static setFrameRate(value:number):void {
        this.getStage().frameRate = value;
    }

    /**
     * 设置适配方式
     * @param value
     */
    public static setScaleMode(value:string):void {
        this.getStage().scaleMode = value;
    }

    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    public static getStage():egret.Stage {
        return egret.MainContext.instance.stage;
    }
}
