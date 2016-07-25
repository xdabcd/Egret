/**
 *
 * @author 
 *
 */
class GameScene extends BaseScene{
	public constructor() {
	    super();
	}
	
	/**
     * 进入Scene调用
     */
    public onEnter(): void {
        super.onEnter();
            
        //添加该Scene使用的层级
        this.addLayer(LayerManager.Game_Main);
        this.addLayer(LayerManager.Game_UI);
        
        //初始打开Game和GameUI
        App.ViewManager.open(ViewConst.Game);
        App.ViewManager.open(ViewConst.GameUI);
        
        
    }

    /**
     * 退出Scene调用
     */
    public onExit(): void {
        super.onExit();
    }
}
