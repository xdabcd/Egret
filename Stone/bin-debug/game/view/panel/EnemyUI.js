var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var EnemyUI = (function (_super) {
        __extends(EnemyUI, _super);
        function EnemyUI() {
            _super.call(this);
        }
        var d = __define,c=EnemyUI,p=c.prototype;
        /**
         * 重置
         */
        p.reset = function () {
        };
        p.setSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.anchorOffsetX = width / 2;
            this.anchorOffsetY = height / 2;
        };
        /**
         * 攻击
         */
        p.attack = function (duration) {
            EffectUtils.shakeObj1(this._icon, duration);
        };
        /**
         * 受伤
         */
        p.hurt = function (duration) {
            EffectUtils.shakeObj(this._icon, duration);
        };
        d(p, "cur_round",undefined
            /**
             * 设置当前回合数
             */
            ,function (cur_round) {
                if (cur_round == this._cur_round) {
                    return;
                }
                this._cur_round = cur_round;
                this.updateRound();
            }
        );
        p.updateRound = function () {
            if (this._round_text == null) {
                this.initRoundText();
            }
            if (this._cur_round > 0) {
                this._round_text.text = "" + this._cur_round;
            }
            else {
                this._round_text.text = "";
            }
        };
        d(p, "id",undefined
            /**
             * 设置敌人
             */
            ,function (id) {
                if (id == this._id) {
                    return;
                }
                this._id = id;
                this.updateEnemy();
            }
        );
        p.updateEnemy = function () {
            if (this._icon == null) {
                this.initIcon();
            }
            this._icon.texture = RES.getRes("c" + this._id + "_c_png");
        };
        d(p, "hp_per",undefined
            /**
             * 设置血量
             */
            ,function (per) {
                if (per == this._hp_per) {
                    return;
                }
                this._hp_per = per;
                this.updateHp();
            }
        );
        p.updateHp = function () {
            if (this._hp_bar == null) {
                this.initHpBar();
            }
            this._hp_bar.setValue(this._hp_per);
        };
        /**
         * 初始化敌人图片
         */
        p.initIcon = function () {
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.width = this.width;
            this._icon.height = this.height;
        };
        /**
         * 初始化会和数字
         */
        p.initRoundText = function () {
            this._round_text = new egret.TextField;
            this.addChild(this._round_text);
            this._round_text.width = 30;
            this._round_text.height = 30;
            this._round_text.textColor = 0xff0000;
        };
        /**
         * 初始化血条
         */
        p.initHpBar = function () {
            this._hp_bar = new egret.gui.ProgressBar();
            this._hp_bar.skinName = skins.components.ProgressBarSkin;
            this.addChild(this._hp_bar);
            this._hp_bar.height = 10;
            this._hp_bar.width = 150;
            this._hp_bar.x = this.width / 2 - this._hp_bar.width / 2;
            this._hp_bar.y = -20;
        };
        return EnemyUI;
    }(egret.Sprite));
    game.EnemyUI = EnemyUI;
    egret.registerClass(EnemyUI,'game.EnemyUI');
})(game || (game = {}));
