var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GemstoneUI = (function (_super) {
        __extends(GemstoneUI, _super);
        function GemstoneUI() {
            _super.call(this);
            //使描点在中心
            this.position = new game.Vector2(0, 0);
        }
        var d = __define,c=GemstoneUI,p=c.prototype;
        d(p, "type",undefined
            /**
             * 设置宝石类型
             */
            ,function (type) {
                if (type == this._type) {
                    return;
                }
                this._type = type;
                this.updateType();
            }
        );
        /**
         * 重置
         */
        p.reset = function () {
            if (this._icon != null) {
                this._icon.scaleX = this._icon.scaleY = 1;
            }
            this.changeEffect(game.GemstoneEffect.NONE);
        };
        p.setSize = function (size) {
            this._size = size;
            this.width = this.height = size;
            this.anchorOffsetX = this.anchorOffsetY = size / 2;
        };
        p.updateType = function () {
            if (this._icon == null) {
                this.initIcon();
            }
            this._icon.texture = RES.getRes(this._type + "_png");
        };
        /**
        * 移动宝石
        */
        p.playmove = function (xTo, yTo, duration) {
            egret.Tween.get(this).to({ x: xTo, y: yTo }, duration);
        };
        /**
        * 选中宝石
        */
        p.select = function () {
            this._select = true;
            this.playRotate();
        };
        /**
        * 取消选中宝石
        */
        p.unSelect = function () {
            this._select = false;
        };
        p.playRotate = function () {
            egret.Tween.get(this._icon).to({ rotation: 360 }, 300).call(function () {
                if (this._select) {
                    this.playRotate();
                }
            }, this);
        };
        /**
         * 宝石消失
         */
        p.playDisappear = function (duration) {
            egret.Tween.get(this._icon).to({ scaleX: 0.5, scaleY: 0.5 }, duration);
        };
        /**
         * 改变效果
         */
        p.changeEffect = function (effect) {
            switch (effect) {
                case game.GemstoneEffect.NONE: {
                    if (this._effect != null) {
                        this._effect.visible = false;
                        this._effect_bg.visible = false;
                    }
                    break;
                }
                case game.GemstoneEffect.HOR: {
                    this.addEffect();
                    this._effect.rotation = 0;
                    break;
                }
                case game.GemstoneEffect.VER: {
                    this.addEffect();
                    this._effect.rotation = 90;
                    break;
                }
                case game.GemstoneEffect.SCOPE: {
                    this.addEffect();
                    this._effect.visible = false;
                    break;
                }
            }
        };
        /**
         * 添加效果
         */
        p.addEffect = function () {
            if (this._effect == null) {
                this.initEffect();
            }
            else {
                this._effect.visible = true;
                this._effect_bg.visible = true;
            }
        };
        /**
         * 初始化效果
         */
        p.initEffect = function () {
            this._effect_bg = new egret.Bitmap;
            this.addChild(this._effect_bg);
            this._effect_bg.texture = RES.getRes("effect_bg_png");
            egret.Tween.get(this._effect_bg, { loop: true, }).to({ rotation: 360 }, 2000);
            this._effect_bg.width = this._effect_bg.height = this._size * 1;
            this.setCenter(this._effect_bg);
            this._effect = new egret.MovieClip;
            this.addChild(this._effect);
            var data = RES.getRes("effect_json");
            var texture = RES.getRes("effect_png");
            var mcf = new egret.MovieClipDataFactory(data, texture);
            this._effect.movieClipData = mcf.generateMovieClipData("effect");
            this._effect.gotoAndPlay("g1", -1);
            this._effect.scaleY = this._effect.scaleX = this.width / this._effect.width;
            this.setCenter(this._effect);
        };
        /**
         * 初始化图标
         */
        p.initIcon = function () {
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.width = this._icon.height = this._size * 0.9;
            this.setCenter(this._icon);
        };
        /**
         * 设置居中
         */
        p.setCenter = function (obj) {
            obj.x = obj.y = this._size / 2;
            obj.anchorOffsetX = obj.width / 2;
            obj.anchorOffsetY = obj.height / 2;
        };
        return GemstoneUI;
    }(egret.Sprite));
    game.GemstoneUI = GemstoneUI;
    egret.registerClass(GemstoneUI,'game.GemstoneUI');
})(game || (game = {}));
