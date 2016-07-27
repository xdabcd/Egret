var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var ProjUI = (function (_super) {
        __extends(ProjUI, _super);
        function ProjUI() {
            _super.call(this);
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.texture = RES.getRes("fx31003_w_b_png");
        }
        var d = __define,c=ProjUI,p=c.prototype;
        p.setSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.anchorOffsetX = width / 2;
            this.anchorOffsetY = height / 2;
            this._icon.width = this.width;
            this._icon.height = this.height;
        };
        /**
        * 移动宝石
        */
        p.playmove = function (xTo, yTo, duration) {
            this.rotation = -Math.atan((xTo - this.x) / (yTo - this.y)) / Math.PI * 180;
            egret.Tween.get(this).to({ x: xTo, y: yTo }, duration);
        };
        return ProjUI;
    }(egret.Sprite));
    game.ProjUI = ProjUI;
    egret.registerClass(ProjUI,'game.ProjUI');
})(game || (game = {}));
