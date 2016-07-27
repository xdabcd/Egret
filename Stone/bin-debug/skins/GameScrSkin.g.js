var skins;
(function (skins) {
    var GameScrSkin = (function (_super) {
        __extends(GameScrSkin, _super);
        function GameScrSkin() {
            _super.call(this);
            this.__s = egret.gui.setProperties;
            this.__s(this, ["height", "width"], [960, 640]);
            this.elementsContent = [this.__3_i(), this.gridSceneUI_i(), this.__4_i(), this.__5_i(), this.battleSceneUI_i(), this.__6_i(), this.__7_i()];
            this.states = [
                new egret.gui.State("normal", []),
                new egret.gui.State("disabled", [])
            ];
        }
        var d = __define,c=GameScrSkin,p=c.prototype;
        d(p, "skinParts"
            ,function () {
                return GameScrSkin._skinParts;
            }
        );
        p.__4_i = function () {
            var t = new egret.gui.UIAsset();
            this.__s(t, ["height", "left", "right", "source"], [427, 0, 0, "resource/assets/m0105b.png"]);
            return t;
        };
        p.__5_i = function () {
            var t = new egret.gui.UIAsset();
            this.__s(t, ["height", "left", "right", "source"], [427, 0, 0, "resource/assets/m0105a.png"]);
            return t;
        };
        p.__6_i = function () {
            var t = new egret.gui.UIAsset();
            this.__s(t, ["left", "right", "scale9Grid", "source", "x", "y"], [0, 0, egret.gui.getScale9Grid("56,20,10,1"), "resource/assets/hp_bar_bg.png", 20, 387]);
            return t;
        };
        p.__7_i = function () {
            var t = new egret.gui.UIAsset();
            this.__s(t, ["left", "right", "scale9Grid", "source", "x", "y"], [38, 30, egret.gui.getScale9Grid("25,8,596,7"), "resource/assets/hp_bar.png", 20, 395]);
            return t;
        };
        p.battleSceneUI_i = function () {
            var t = new game.BattleScene();
            this.battleSceneUI = t;
            this.__s(t, ["height", "left", "right"], [390, 0, 0]);
            return t;
        };
        p.gridSceneUI_i = function () {
            var t = new game.GridScene();
            this.gridSceneUI = t;
            this.__s(t, ["bottom", "height", "horizontalCenter", "width"], [0, 533, 0, 640]);
            return t;
        };
        p.__3_i = function () {
            var t = new egret.gui.UIAsset();
            this.__s(t, ["bottom", "height", "left", "right", "source"], [0, 533, 0, 0, "resource/assets/grid_bg.jpg"]);
            return t;
        };
        GameScrSkin._skinParts = ["gridSceneUI", "battleSceneUI"];
        return GameScrSkin;
    }(egret.gui.Skin));
    skins.GameScrSkin = GameScrSkin;
    egret.registerClass(GameScrSkin,'skins.GameScrSkin');
})(skins || (skins = {}));
