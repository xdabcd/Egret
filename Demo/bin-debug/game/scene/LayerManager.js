/**
 *
 * @author
 *
 */
var LayerManager = (function () {
    function LayerManager() {
        /**
         * 主游戏层
         */
        this.Game_Main = new BaseSpriteLayer;
        /**
         * 游戏UI层
         */
        this.Game_UI = new BaseSpriteLayer;
        /**
         * 主UI层
         */
        this.UI_Main = new BaseEuiLayer;
        /**
         * UI弹出层
         */
        this.UI_Pop = new BaseEuiLayer;
        /**
         * UI消息层
         */
        this.UI_Message = new BaseEuiLayer;
    }
    var d = __define,c=LayerManager,p=c.prototype;
    return LayerManager;
}());
egret.registerClass(LayerManager,'LayerManager');
