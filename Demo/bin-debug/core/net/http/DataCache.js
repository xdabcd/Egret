/**
 * Created by yangsong on 2014/11/22.
 * Http数据缓存类
 */
var DynamicChange = (function () {
    function DynamicChange() {
        this._dataCache = [];
        this._pUpdate = new ProxyUpdate(this._dataCache);
    }
    var d = __define,c=DynamicChange,p=c.prototype;
    d(p, "pUpdate"
        ,function () {
            return this._pUpdate;
        }
    );
    p.getCacheData = function (key) {
        if (this._dataCache[key]) {
            return this._dataCache[key];
        }
        return null;
    };
    p.clearCache = function () {
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this._dataCache[key] = null;
            delete this._dataCache[key];
        }
    };
    p.getCacheKeyInfos = function () {
        var results = [];
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var k = this._dataCache[key];
            results.push(k);
        }
        return results;
    };
    p.isCache = function (key) {
        return this._dataCache[key];
    };
    return DynamicChange;
}());
egret.registerClass(DynamicChange,'DynamicChange');
