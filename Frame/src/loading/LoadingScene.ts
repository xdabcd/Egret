/**
 * 
 * 加载界面
 * 
 */
class LoadingScene extends BaseScene {
	public constructor() {
		super();
		this._controller = new LoadingController(this);
	}

	public setProgress(cur: number, total: number) {
		// console.log(cur + "/" + total);
	}

	/**
     * 屏幕尺寸变化时调用
     */
    protected onResize(): void {

    }

    /**
     * 打开
     */
    public open(): void {
		this.visible = true;
    }

    /**
     * 关闭
     */
    public close(): void {
		this.visible = false;
    }
}