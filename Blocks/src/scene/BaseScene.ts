/**
 *
 * 基础界面
 *
 */
class BaseScene extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.init();
    }

    /**
     * 初始化
     */
    protected init() {
        TimerManager.doFrame(1, 0, this.update, this);
    }

    /**
     * 更新
     */
    protected update(time: number) {

    }

    /**
     * 销毁
     */
    public destroy() {
        TimerManager.remove(this.update, this);
        DisplayUtils.removeFromParent(this);
    }
}
