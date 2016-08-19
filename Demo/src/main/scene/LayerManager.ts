/**
 *
 * @author 
 *
 */
class LayerManager {
    /**
     * 主游戏层
     */ 
	public static Game_Main: BaseSpriteLayer = new BaseSpriteLayer;
	
	/**
	 * 游戏UI层
	 */ 
    public static Game_UI: BaseSpriteLayer = new BaseSpriteLayer;
	
	/**
	 * 主UI层
	 */ 
    public static UI_Main: BaseEuiLayer = new BaseEuiLayer;
	
	/**
	 * UI弹出层
	 */
    public static UI_Pop: BaseSpriteLayer = new BaseSpriteLayer;
    
    /**
	 * UI消息层
	 */
    public static UI_Message: BaseEuiLayer = new BaseEuiLayer;
}
