var skins;
(function (skins) {
    var components;
    (function (components) {
        var ButtonSkin = (function (_super) {
            __extends(ButtonSkin, _super);
            function ButtonSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.elementsContent = [this.__4_i(), this.labelDisplay_i()];
                this.states = [
                    new egret.gui.State("up", []),
                    new egret.gui.State("down", [
                        new egret.gui.SetProperty("__4", "source", "resource/assets/custom_down.png")
                    ]),
                    new egret.gui.State("disabled", [])
                ];
            }
            var d = __define,c=ButtonSkin,p=c.prototype;
            d(p, "skinParts"
                ,function () {
                    return ButtonSkin._skinParts;
                }
            );
            p.labelDisplay_i = function () {
                var t = new egret.gui.Label();
                this.labelDisplay = t;
                this.__s(t, ["bold", "bottom", "fontFamily", "left", "right", "text", "textAlign", "textColor", "top", "verticalAlign"], [true, 30, "Arial", 30, 30, "Button", "center", 100887, 30, "middle"]);
                return t;
            };
            p.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__4 = t;
                this.__s(t, ["bottom", "left", "right", "scale9Grid", "source", "top"], [0, 0, 0, egret.gui.getScale9Grid("42,38,11,9"), "resource/assets/custom_normal.png", 0]);
                return t;
            };
            ButtonSkin._skinParts = ["labelDisplay"];
            return ButtonSkin;
        }(egret.gui.Skin));
        components.ButtonSkin = ButtonSkin;
        egret.registerClass(ButtonSkin,'skins.components.ButtonSkin');
    })(components = skins.components || (skins.components = {}));
})(skins || (skins = {}));
