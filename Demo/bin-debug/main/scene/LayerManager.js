/**
 *
 * @author
 *
 */
var LayerManager = (function () {
    function LayerManager() {
    }
    var d = __define,c=LayerManager,p=c.prototype;
    /**
     * 主游戏层
     */
    LayerManager.Game_Main = new BaseSpriteLayer;
    /**
     * 游戏UI层
     */
    LayerManager.Game_UI = new BaseSpriteLayer;
    /**
     * 主UI层
     */
    LayerManager.UI_Main = new BaseEuiLayer;
    /**
     * UI弹出层
     */
    LayerManager.UI_Pop = new BaseSpriteLayer;
    /**
     * UI消息层
     */
    LayerManager.UI_Message = new BaseEuiLayer;
    return LayerManager;
}());
egret.registerClass(LayerManager,'LayerManager');
//# sourceMappingURL=LayerManager.js.map