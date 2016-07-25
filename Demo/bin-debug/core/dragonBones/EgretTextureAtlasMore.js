/**
 * Created by Saco on 2015/2/4.
 */
var EgretTextureAtlasMore = (function (_super) {
    __extends(EgretTextureAtlasMore, _super);
    function EgretTextureAtlasMore(texture, textureAtlasRawData, textureName, scale) {
        if (scale === void 0) { scale = 1; }
        _super.call(this, texture, textureAtlasRawData, scale);
        this._datas = [];
        this._textureIndex = {};
        this.name = textureName;
        this.register(texture, textureAtlasRawData);
    }
    var d = __define,c=EgretTextureAtlasMore,p=c.prototype;
    p.register = function (texture, textureAtlasRawData) {
        var sheetData = this.parseSingleData(textureAtlasRawData);
        this.analysisSheet(sheetData, this._datas.length);
        this._datas.push([new egret.SpriteSheet(texture), sheetData]);
    };
    p.analysisSheet = function (sheet, index) {
        var keys = Object.keys(sheet);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (key && key != "")
                this.addTextureDic(index, key);
        }
    };
    p.addTextureDic = function (index, textureName) {
        this._textureIndex[textureName] = index;
    };
    p.getTexture = function (fullName) {
        var result = null;
        var arr = this._datas[this._textureIndex[fullName]];
        if (arr == null) {
            return null;
        }
        var spriteSheet = arr[0];
        var data = arr[1][fullName];
        if (data) {
            result = spriteSheet.getTexture(fullName);
            if (!result) {
                result = spriteSheet.createTexture(fullName, data.region.x, data.region.y, data.region.width, data.region.height);
            }
        }
        return result;
    };
    p.dispose = function () {
        _super.prototype.dispose.call(this);
        this._datas.length = 0;
        this._datas = null;
        this._textureIndex = null;
    };
    p.getRegion = function (subTextureName) {
        for (var i = 0, len = this._datas.length; i < len; i++) {
            var arr = this._datas[i];
            var spriteSheet = arr[0];
            var data = arr[1][subTextureName];
            if (data) {
                return data.region;
            }
        }
        return null;
    };
    p.getFrame = function (subTextureName) {
        for (var i = 0, len = this._datas.length; i < len; i++) {
            var arr = this._datas[i];
            var spriteSheet = arr[0];
            var data = arr[1][subTextureName];
            if (data) {
                return data.frame;
            }
        }
        return null;
    };
    p.parseSingleData = function (textureAtlasRawData) {
        return dragonBones.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
    };
    return EgretTextureAtlasMore;
}(dragonBones.EgretTextureAtlas));
egret.registerClass(EgretTextureAtlasMore,'EgretTextureAtlasMore');
