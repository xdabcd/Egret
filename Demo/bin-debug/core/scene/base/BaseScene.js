/**
 * Created by yangsong on 15-1-7.
 * Scene基类
 */
var BaseScene = (function () {
    /**
     * 构造函数
     */
    function BaseScene() {
        this._layers = new Array();
    }
    var d = __define,c=BaseScene,p=c.prototype;
    /**
     * 进入Scene调用
     */
    p.onEnter = function () {
    };
    /**
     * 退出Scene调用
     */
    p.onExit = function () {
        App.ViewManager.closeAll();
        this.removeAllLayer();
    };
    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    p.addLayer = function (layer) {
        if (layer instanceof BaseSpriteLayer) {
            App.StageUtils.getStage().addChild(layer);
            this._layers.push(layer);
        }
        else if (layer instanceof BaseEuiLayer) {
            App.StageUtils.getUIStage().addChild(layer);
            this._layers.push(layer);
        }
    };
    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    p.addLayerAt = function (layer, index) {
        if (layer instanceof BaseSpriteLayer) {
            App.StageUtils.getStage().addChildAt(layer, index);
            this._layers.push(layer);
        }
        else if (layer instanceof BaseEuiLayer) {
            App.StageUtils.getUIStage().addChildAt(layer, index);
            this._layers.push(layer);
        }
    };
    /**
     * 在舞台移除一个Layer
     * @param layer
     */
    p.removeLayer = function (layer) {
        if (layer instanceof BaseSpriteLayer) {
            App.StageUtils.getStage().removeChild(layer);
            this._layers.splice(this._layers.indexOf(layer), 1);
        }
        else if (layer instanceof BaseEuiLayer) {
            App.StageUtils.getUIStage().removeChild(layer);
            this._layers.splice(this._layers.indexOf(layer), 1);
        }
    };
    /**
     * Layer中移除所有
     * @param layer
     */
    p.layerRemoveAllChild = function (layer) {
        if (layer instanceof BaseSpriteLayer) {
            layer.removeChildren();
        }
        else if (layer instanceof BaseEuiLayer) {
            layer.removeChildren();
        }
    };
    /**
     * 移除所有Layer
     */
    p.removeAllLayer = function () {
        while (this._layers.length) {
            var layer = this._layers[0];
            this.layerRemoveAllChild(layer);
            this.removeLayer(layer);
        }
    };
    return BaseScene;
}());
egret.registerClass(BaseScene,'BaseScene');
