/**
 * Created by yangsong on 2014/6/16.
 * StarlingSwf工厂类
 */
var StarlingSwfFactory = (function (_super) {
    __extends(StarlingSwfFactory, _super);
    /**
     * 构造函数
     */
    function StarlingSwfFactory() {
        _super.call(this);
        this.swfAssetsManager = new starlingswf.SwfAssetManager();
        this.swfAssetsNames = new Array();
        this.swfAssets = new Array();
        this.swfData = {};
    }
    var d = __define,c=StarlingSwfFactory,p=c.prototype;
    /**
     * 添加一个swf
     * @param name 唯一标识
     * @param swfData swf配置数据
     * @param spriteSheep 资源配置数据
     */
    p.addSwf = function (name, swfData, spriteSheep) {
        if (this.swfAssetsNames.indexOf(name) != -1)
            return;
        if (swfData == null || spriteSheep == null) {
            console.log("SWF加载失败:" + name);
            return;
        }
        this.swfAssetsManager.addSpriteSheet(name, spriteSheep);
        var swf = new starlingswf.Swf(swfData, this.swfAssetsManager, 24);
        swf.name = name;
        StarlingSwfUtils.addSwf(swf);
        this.swfAssetsNames.push(name);
        this.swfAssets.push(swf);
    };
    /**
     * 停止列表中的swf
     * @param arr
     */
    p.stopSwfs = function (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var swf = StarlingSwfUtils.getSwf(arr[i]);
            if (swf) {
                swf.swfUpdateManager.stop();
            }
        }
    };
    /**
     * 播放列表中的swf
     * @param arr
     */
    p.playSwfs = function (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var swf = StarlingSwfUtils.getSwf(arr[i]);
            if (swf) {
                swf.swfUpdateManager.play();
            }
        }
    };
    /**
     * 清空所有swf
     */
    p.clearSwfs = function () {
        while (this.swfAssets.length) {
            StarlingSwfUtils.removeSwf(this.swfAssets.pop());
        }
        while (this.swfAssetsNames.length) {
            this.swfAssetsNames.pop();
        }
        this.swfAssetsManager = new starlingswf.SwfAssetManager();
    };
    /**
     * 清空
     */
    p.clear = function () {
        this.clearSwfs();
    };
    /**
     * 创建一个StarlingSwfMovieClip
     * @param name mc的名字
     * @returns {StarlingSwfMovieClip}
     */
    p.makeMc = function (name) {
        var mc = StarlingSwfUtils.createMovie("mc_" + name, null, StarlingSwfMovieClip);
        if (mc == null) {
            console.log("SWF创建失败: " + name);
        }
        return mc;
    };
    /**
     * 创建一个Bitmap
     * @param name 图片的名称
     * @returns {egret.Bitmap}
     */
    p.makeImage = function (name) {
        return StarlingSwfUtils.createImage("img_" + name);
    };
    /**
     * 获取材质
     * @param name 材质名称
     * @returns {egret.Texture}
     */
    p.getTexture = function (name) {
        return StarlingSwfUtils.getTexture("img_" + name);
    };
    return StarlingSwfFactory;
}(BaseClass));
egret.registerClass(StarlingSwfFactory,'StarlingSwfFactory');
