/**
 * Created by yangsong on 15-11-4.
 * 合并过的json文件解析
 */
var MergeJsonAnalyzer = (function (_super) {
    __extends(MergeJsonAnalyzer, _super);
    function MergeJsonAnalyzer() {
        _super.apply(this, arguments);
        //按名字指定要特殊处理的json数据
        this.mergeJsons = ["MergeConfig_json"];
    }
    var d = __define,c=MergeJsonAnalyzer,p=c.prototype;
    /**
     * 解析并缓存加载成功的数据
     */
    p.analyzeData = function (resItem, data) {
        var name = resItem.name;
        if (this.fileDic[name] || !data) {
            return;
        }
        try {
            var jsonData = JSON.parse(data);
            if (this.mergeJsons.indexOf(name) != -1) {
                for (var key in jsonData) {
                    this.fileDic[key] = jsonData[key];
                }
            }
            else {
                this.fileDic[name] = jsonData;
            }
        }
        catch (e) {
            egret.$warn(1017, resItem.url, data);
        }
    };
    return MergeJsonAnalyzer;
}(RES.JsonAnalyzer));
egret.registerClass(MergeJsonAnalyzer,'MergeJsonAnalyzer');
//# sourceMappingURL=MergeJsonAnalyzer.js.map