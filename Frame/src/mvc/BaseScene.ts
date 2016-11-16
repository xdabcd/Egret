/**
 * 
 * Scene基类
 * 
 */
class BaseScene extends egret.DisplayObjectContainer {
    protected _controller: BaseController;
    protected _isInit: boolean;

    /**
     * 构造函数（初始化controller）
     */
    public constructor() {
        super();
        this._isInit = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        StageUtils.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
    }

    private onAddToStage(event: egret.Event) {
        if (!this._isInit) {
            this.init();
            this._isInit = true;
        }
    }

    /**
     * 初始化
     */
    protected init() {

    }

    /**
     * 屏幕尺寸变化时调用
     */
    protected onResize(): void {

    }

    /**
     * 打开
     */
    public open(...param: any[]): void {

    }

    /**
     * 关闭
     */
    public close(...param: any[]): void {

    }

    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    protected applyFunc(key: any, ...param: any[]): any {
        return this._controller.applyFunc.apply(this._controller, arguments);
    }

    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    protected applyControllerFunc(controllerKey: number, key: any, ...param: any[]): any {
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    }

    /**
     * 设置是否隐藏
     * @param value
     */
    public setVisible(value: boolean): void {
        this.visible = value;
    }
}
