var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GridScene = (function (_super) {
        __extends(GridScene, _super);
        function GridScene() {
            _super.call(this);
            this.touchChildren = true;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.addContainer();
        }
        var d = __define,c=GridScene,p=c.prototype;
        p.addContainer = function () {
            this.gemstoneGroup = new egret.Sprite();
            this.gemstoneGroup.touchChildren = true;
            this.source = this.gemstoneGroup;
        };
        p.createCompleteEvent = function (event) {
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            game.AppFacade.getInstance().registerMediator(new game.GridSceneMediator(this));
        };
        /**
        * 创建一个宝石
        */
        p.createGemstoneUI = function (gemstone) {
            var gsUI = (game.ObjectPool.getPool("game.GemstoneUI").borrowObject()); //从对象池创建
            gsUI.reset();
            gsUI.position.x = gemstone.position.x;
            gsUI.position.y = gemstone.position.y;
            gsUI.setSize(this.gemstoneSize);
            var tp = this.getTruePosition(gemstone.position);
            gsUI.x = tp.x;
            gsUI.y = tp.y;
            gsUI.type = gemstone.type;
            gsUI.touchEnabled = true;
            this.gemstoneGroup.addChild(gsUI);
            gsUI.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.gemstoneOnTouch, this);
            gsUI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gemstoneOnClick, this);
            gsUI.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.gemstoneOnMove, this);
        };
        /**
        * 选中一个宝石
        */
        p.selectGemstoneUI = function (pos) {
            var gsUI = this.getGemstoneUI(pos);
            if (gsUI) {
                this.selectPos = pos.clone();
                gsUI.select();
            }
        };
        /**
        * 取消选中一个格子
        */
        p.unGemstoneUI = function (pos) {
            var gsUI = this.getGemstoneUI(pos);
            if (gsUI) {
                if (this.selectPos.equalTo(pos)) {
                    this.selectPos = null;
                }
                gsUI.unSelect();
            }
        };
        /**
        * 移动一个宝石
        */
        p.moveGemstone = function (moveInfo) {
            var gsUI = this.getGemstoneUI(moveInfo.gemstone.position);
            if (gsUI) {
                var tp = this.getTruePosition(moveInfo.targetPos);
                gsUI.playmove(tp.x, tp.y, moveInfo.duration);
                egret.setTimeout(function () {
                    gsUI.position.x = moveInfo.targetPos.x;
                    gsUI.position.y = moveInfo.targetPos.y;
                }, this, moveInfo.duration);
            }
        };
        /**
        * 改变宝石效果
        */
        p.changeGemstoneEffect = function (gemstone) {
            var gsUI = this.getGemstoneUI(gemstone.position);
            if (gsUI) {
                gsUI.changeEffect(gemstone.effect);
            }
        };
        /**
         * 宝石触摸事件
         */
        p.gemstoneOnTouch = function (event) {
            var pos = event.target.position;
            if (this.selectPos == null || !this.selectPos.equalTo(pos)) {
                this.sendNotification(game.GameCommand.CLICK_GEMSTONE, pos.clone());
                this.touched = true;
            }
        };
        /**
        * 宝石点击事件
        */
        p.gemstoneOnClick = function (event) {
            if (!this.touched) {
                this.sendNotification(game.GameCommand.CLICK_GEMSTONE, event.target.position.clone());
            }
            this.touched = false;
        };
        /**
        * 宝石移动事件
        */
        p.gemstoneOnMove = function (event) {
            var pos = event.target.position;
            if (this.selectPos != null && !this.selectPos.equalTo(pos)) {
                this.sendNotification(game.GameCommand.CLICK_GEMSTONE, pos.clone());
            }
        };
        /**
        * 清除一个宝石
        */
        p.removeGemstone = function (pos) {
            var gsUI = this.getGemstoneUI(pos);
            if (gsUI) {
                gsUI.playDisappear(game.GameData.remove_time);
                egret.setTimeout(function () {
                    this.gemstoneGroup.removeChild(gsUI);
                    gsUI.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.gemstoneOnTouch, this);
                    gsUI.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gemstoneOnClick, this);
                    gsUI.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.gemstoneOnMove, this);
                    game.ObjectPool.getPool("game.GemstoneUI").returnObject(gsUI);
                }, this, game.GameData.remove_time);
            }
        };
        /**
        *获取指定位置的宝石
        */
        p.getGemstoneUI = function (pos) {
            for (var i = 0; i < this.gemstoneGroup.numChildren; i++) {
                var gsUI = (this.gemstoneGroup.getChildAt(i));
                if (gsUI.position.x == pos.x && gsUI.position.y == pos.y) {
                    return gsUI;
                }
            }
            return null;
        };
        /**
        * 获取真实位置
        */
        p.getTruePosition = function (pos) {
            var x = pos.x * (this.gemstoneSize) + this.gemstoneSize / 2 + this.border;
            var y = pos.y * (this.gemstoneSize) + this.gemstoneSize / 2 + this.border;
            return new game.Vector2(x, y);
        };
        /**
        *发消息
        */
        p.sendNotification = function (name, body, type) {
            game.AppFacade.getInstance().sendNotification(name, body, type);
        };
        d(p, "gemstoneSize"
            /**
            * 宝石的大小
            */
            ,function () {
                return (this.width - this.border * 2) / game.GameData.xSize;
            }
        );
        d(p, "border"
            /**
            * 边距
            */
            ,function () {
                return 8;
            }
        );
        return GridScene;
    }(egret.gui.UIAsset));
    game.GridScene = GridScene;
    egret.registerClass(GridScene,'game.GridScene');
})(game || (game = {}));
