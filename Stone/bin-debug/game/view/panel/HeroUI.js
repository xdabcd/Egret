var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var HeroUI = (function (_super) {
        __extends(HeroUI, _super);
        function HeroUI() {
            _super.call(this);
        }
        var d = __define,c=HeroUI,p=c.prototype;
        /**
         * 重置
         */
        p.reset = function () {
        };
        /**
         * 攻击
         */
        p.attack = function (duration) {
            egret.Tween.get(this).to({ x: this.x, y: this.y - 50 }, duration, egret.Ease.cubicIn).to({ x: this.x, y: this.y }, duration);
        };
        p.setSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.anchorOffsetX = width / 2;
            this.anchorOffsetY = height / 2;
        };
        d(p, "type",undefined
            /**
             * 设置英雄类型
             */
            ,function (type) {
                if (type == this._type) {
                    return;
                }
                this._type = type;
                this.updateType();
            }
        );
        p.updateType = function () {
            if (this._frame == null) {
                this.initFrame();
            }
            this._frame.texture = RES.getRes("hf_" + this._type + "_png");
        };
        d(p, "id",undefined
            /**
             * 设置英雄
             */
            ,function (id) {
                if (id == this._id) {
                    return;
                }
                this._id = id;
                this.updateHero();
            }
        );
        p.updateHero = function () {
            if (this._icon == null) {
                this.initIcon();
            }
            this._icon.texture = RES.getRes("c" + this._id + "_p_png");
        };
        /**
         * 初始化边框
         */
        p.initFrame = function () {
            this._frame = new egret.Bitmap;
            this.addChild(this._frame);
            this._frame.width = this.width;
            this._frame.height = this.height;
        };
        /**
         * 初始化英雄头像
         */
        p.initIcon = function () {
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.width = this.width;
            this._icon.height = this.height;
        };
        return HeroUI;
    }(egret.Sprite));
    game.HeroUI = HeroUI;
    egret.registerClass(HeroUI,'game.HeroUI');
})(game || (game = {}));
