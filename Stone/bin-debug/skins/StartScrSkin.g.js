var skins;
(function (skins) {
    var StartScrSkin = (function (_super) {
        __extends(StartScrSkin, _super);
        function StartScrSkin() {
            _super.call(this);
            this.__s = egret.gui.setProperties;
            this.__s(this, ["height", "width"], [960, 640]);
            this.elementsContent = [this.__3_i(), this.startBtn_i()];
            this.states = [
                new egret.gui.State("normal", []),
                new egret.gui.State("disabled", [])
            ];
        }
        var d = __define,c=StartScrSkin,p=c.prototype;
        d(p, "skinParts"
            ,function () {
                return StartScrSkin._skinParts;
            }
        );
        p.__3_i = function () {
            var t = new egret.gui.UIAsset();
            this.__s(t, ["bottom", "left", "right", "source", "top"], [0, 0, 0, "resource/assets/intro-p_08.png", 0]);
            return t;
        };
        p.startBtn_i = function () {
            var t = new egret.gui.Button();
            this.startBtn = t;
            t.setStyle("fontFamily", "Arial");
            t.setStyle("size", 30);
            this.__s(t, ["horizontalCenter", "label", "skinName", "verticalCenter", "width"], [0, "開始", skins.components.ButtonSkin, 233.5, 244]);
            return t;
        };
        StartScrSkin._skinParts = ["startBtn"];
        return StartScrSkin;
    }(egret.gui.Skin));
    skins.StartScrSkin = StartScrSkin;
    egret.registerClass(StartScrSkin,'skins.StartScrSkin');
})(skins || (skins = {}));
