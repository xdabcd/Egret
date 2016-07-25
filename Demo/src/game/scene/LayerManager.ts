/**
 *
 * @author 
 *
 */
class LayerManager {
    /**
     * 主游戏层
     */ 
	public Game_Main: BaseSpriteLayer = new BaseSpriteLayer;
	
	/**
	 * 游戏UI层
	 */ 
	public Game_UI: BaseSpriteLayer = new BaseSpriteLayer;
	
	/**
	 * 主UI层
	 */ 
	public UI_Main: BaseEuiLayer = new BaseEuiLayer;
	
	/**
	 * UI弹出层
	 */
    public UI_Pop: BaseEuiLayer = new BaseEuiLayer;
    
    /**
	 * UI消息层
	 */
    public UI_Message: BaseEuiLayer = new BaseEuiLayer;
}
