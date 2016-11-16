/**
 * 
 * 加载控制器
 * 
 */
class LoadingController extends BaseController {
	public constructor(scene: LoadingScene) {
		super(scene);
		ControllerManager.instance.register(ControllerID.Loading, this);
		this.registerFunc(LoadingCmd.SET_PROGRESS, this.setProgress, this);
	}

	/**
     * 设置加载进度
     */
    private setProgress(cur: number, total: number): void {
        this.scene.setProgress(cur, total);
    }

	/**
	 * 界面
	 */
	private get scene(): LoadingScene {
		return this._scene as LoadingScene;
	}
}