var skins;
(function (skins) {
    var components;
    (function (components) {
        var ProgressBarSkin = (function (_super) {
            __extends(ProgressBarSkin, _super);
            function ProgressBarSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "width"], [20, 100]);
                this.elementsContent = [this.track_i(), this.thumb_i()];
                this.states = [
                    new egret.gui.State("normal", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            var d = __define,c=ProgressBarSkin,p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return ProgressBarSkin._skinParts;
                }
            );
            p.thumb_i = function () {
                var t = new egret.gui.Rect();
                this.thumb = t;
                this.__s(t, ["bottom", "fillColor", "left", "top", "width"], [0, 0x22988e, 1, 0, 20]);
                return t;
            };
            p.track_i = function () {
                var t = new egret.gui.Rect();
                this.track = t;
                this.__s(t, ["bottom", "fillColor", "left", "right", "strokeAlpha", "strokeColor", "top"], [0, 0xe6e6e6, 0, 0, 1, 0xa9a9a9, 0]);
                return t;
            };
            ProgressBarSkin._skinParts = ["track", "thumb"];
            return ProgressBarSkin;
        }(egret.gui.Skin));
        components.ProgressBarSkin = ProgressBarSkin;
        egret.registerClass(ProgressBarSkin,'skins.components.ProgressBarSkin');
    })(components = skins.components || (skins.components = {}));
})(skins || (skins = {}));
