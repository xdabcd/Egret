var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var BattleScene = (function (_super) {
        __extends(BattleScene, _super);
        function BattleScene() {
            _super.call(this);
            this.touchChildren = true;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.addContainer();
            this.heroList = [];
            this.enemyList = [];
        }
        var d = __define,c=BattleScene,p=c.prototype;
        p.addContainer = function () {
            this.container = new egret.Sprite();
            this.container.touchChildren = true;
            this.source = this.container;
        };
        p.createCompleteEvent = function (event) {
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            game.AppFacade.getInstance().registerMediator(new game.BattleSceneMediator(this));
        };
        /**
        * 创建一个英雄
        */
        p.createHeroUI = function (hero) {
            var heroUI = (game.ObjectPool.getPool("game.HeroUI").borrowObject()); //从对象池创建
            heroUI.reset();
            heroUI.index = hero.index;
            heroUI.setSize(this.heroWidth, this.heroHeight);
            var tp = this.getHeroPosition(heroUI.index);
            heroUI.x = tp.x;
            heroUI.y = tp.y;
            heroUI.id = hero.id;
            heroUI.type = hero.type;
            this.container.addChild(heroUI);
            this.heroList.push(heroUI);
        };
        /**
        * 英雄攻击
        */
        p.heroToAttack = function (index, targetIndex, projTime) {
            var heroUI = this.getHeroUI(index);
            var enemyUI = this.getEnemyUI(targetIndex);
            heroUI.attack(game.GameData.hero_attack_time);
            egret.setTimeout(function () {
                var projUI = this.createProj(index);
                projUI.playmove(enemyUI.x, enemyUI.y, projTime);
                egret.setTimeout(function () {
                    this.removeProj(projUI);
                }, this, projTime);
            }, this, game.GameData.hero_attack_time);
        };
        /**
        * 创建一个敌人
        */
        p.createEnemyUI = function (enemy) {
            var enemyUI = (game.ObjectPool.getPool("game.EnemyUI").borrowObject()); //从对象池创建
            enemyUI.reset();
            enemyUI.cur_round = enemy.cur_round;
            enemyUI.index = enemy.index;
            enemyUI.setSize(this.enemySize, this.enemySize);
            var tp = this.getEnemyPosition(enemyUI.index);
            enemyUI.x = tp.x;
            enemyUI.y = tp.y;
            enemyUI.id = enemy.id;
            enemyUI.hp_per = 100;
            this.container.addChild(enemyUI);
            this.enemyList.push(enemyUI);
        };
        /**
        * 敌人攻击
        */
        p.enemyToAttack = function (index) {
            console.log(index);
            var enemyUI = this.getEnemyUI(index);
            enemyUI.attack(game.GameData.enemy_attack_time);
        };
        /**
        * 更新敌人回合数
        */
        p.updateEnemyRound = function (index, round) {
            var enemyUI = this.getEnemyUI(index);
            enemyUI.cur_round = round;
        };
        /**
        * 更新敌人血量百分比
        */
        p.updateEnemyHpPer = function (index, per) {
            var enemyUI = this.getEnemyUI(index);
            enemyUI.hp_per = per;
        };
        /**
        * 敌人受伤
        */
        p.enemyHurt = function (index) {
            var enemyUI = this.getEnemyUI(index);
            enemyUI.hurt(game.GameData.hurt_time);
        };
        /**
        *创建投射物
        */
        p.createProj = function (index) {
            var projUI = (game.ObjectPool.getPool("game.ProjUI").borrowObject()); //从对象池创建
            projUI.setSize(this.projSize, this.projSize);
            var tp = this.getProjPosition(index);
            projUI.x = tp.x;
            projUI.y = tp.y;
            this.container.addChild(projUI);
            return projUI;
        };
        /**
        * 清除一个投射物
        */
        p.removeProj = function (projUI) {
            this.container.removeChild(projUI);
            game.ObjectPool.getPool("game.ProjUI").returnObject(projUI);
        };
        /**
        *获取指定位置的英雄
        */
        p.getHeroUI = function (index) {
            return this.heroList[index];
        };
        /**
        *获取指定位置的敌人
        */
        p.getEnemyUI = function (index) {
            return this.enemyList[index];
        };
        /**
        * 获取英雄位置
        */
        p.getHeroPosition = function (index) {
            var border = (this.width - (game.GameData.heroCount * this.heroWidth + (game.GameData.heroCount - 1) * this.gap)) / 2;
            var x = border + index * (this.heroWidth + this.gap) + this.heroWidth / 2;
            var y = this.height - this.heroHeight / 2;
            return new game.Vector2(x, y);
        };
        /**
        * 获取投射物位置
        */
        p.getProjPosition = function (index) {
            var pos = this.getHeroPosition(index);
            return new game.Vector2(pos.x, pos.y - 50);
        };
        /**
        * 获取敌人位置
        */
        p.getEnemyPosition = function (index) {
            var width = this.width / game.GameData.enemyCount;
            var x = index * width + width / 2;
            var y = this.enemySize / 2 + 50;
            return new game.Vector2(x, y);
        };
        d(p, "heroWidth"
            /**
            * 英雄宽
            */
            ,function () {
                return 96;
            }
        );
        d(p, "heroHeight"
            /**
            * 英雄高
            */
            ,function () {
                return 81;
            }
        );
        d(p, "projSize"
            /**
            * 投射物大小
            */
            ,function () {
                return 50;
            }
        );
        d(p, "enemySize"
            /**
            * 敌人大小
            */
            ,function () {
                return 250;
            }
        );
        d(p, "gap"
            /**
            * 间距
            */
            ,function () {
                return 25;
            }
        );
        return BattleScene;
    }(egret.gui.UIAsset));
    game.BattleScene = BattleScene;
    egret.registerClass(BattleScene,'game.BattleScene');
})(game || (game = {}));
