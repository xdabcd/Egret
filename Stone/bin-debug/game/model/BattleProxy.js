var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var BattleProxy = (function (_super) {
        __extends(BattleProxy, _super);
        function BattleProxy() {
            _super.call(this, BattleProxy.NAME);
        }
        var d = __define,c=BattleProxy,p=c.prototype;
        /**
        * 初始化数据
        */
        p.reset = function () {
            var hid_arr = [520123, 310084, 330024, 340095, 320043];
            var eid_arr = [540085, 540162];
            game.GameData.enemyCount = 2;
            this.enemyList = [];
            for (var i = 0; i < game.GameData.enemyCount; i++) {
                var enemy = new game.Enemy();
                enemy.rounds = i + 2;
                enemy.cur_round = enemy.rounds;
                enemy.index = i;
                enemy.id = eid_arr[i];
                enemy.hp = enemy.max_hp = 3000;
                enemy.atk = 100;
                this.creatEnemy(enemy);
                this.enemyList.push(enemy);
            }
            game.GameData.heroCount = 5;
            this.heroList = [];
            for (var i = 0; i < game.GameData.heroCount; i++) {
                var hero = new game.Hero();
                hero.index = i;
                hero.id = hid_arr[i];
                hero.type = i + 1;
                hero.atk = 100;
                this.creatHero(hero);
                this.heroList.push(hero);
            }
            this.own_hp = this.own_max_hp = 3000;
            this.round = 0;
        };
        /**
         * 开始
         */
        p.start = function () {
            console.log("战斗开始！");
            this.nextRound();
        };
        /**
         * 下一回合
         */
        p.nextRound = function () {
            this.round += 1;
            var delay = 0;
            for (var i = 0; i < game.GameData.enemyCount; i++) {
                var enemy = this.enemyList[i];
                this.updateEnemyRound(i, enemy.cur_round);
                if (enemy.cur_round == 0) {
                    egret.setTimeout(function () {
                        this.thisObj.enemyAttack(this.index);
                    }, { "thisObj": this, "index": i }, delay);
                    delay += game.GameData.enemy_attack_time + game.GameData.interval_time;
                }
            }
            egret.setTimeout(function () {
                if (!this.checkFail()) {
                    this.toHandle();
                }
                else {
                    console.log("战斗失败！");
                }
            }, this, delay);
        };
        /**
         * 一回合结束
         */
        p.oneRoundEnd = function () {
            for (var i = 0; i < game.GameData.enemyCount; i++) {
                var enemy = this.enemyList[i];
                if (enemy.cur_round == 0) {
                    enemy.cur_round = enemy.rounds;
                }
                else {
                    enemy.cur_round -= 1;
                }
            }
            egret.setTimeout(function () {
                this.nextRound();
            }, this, game.GameData.round_time);
        };
        /**
        * 执行操作的效果
        */
        p.doHandleEffect = function (arr) {
            var delay = 0;
            for (var i = 0; i < this.heroList.length; i++) {
                var hero = this.heroList[i];
                var max = 0;
                var sum = 0;
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j][0] == hero.type) {
                        sum += arr[j][1];
                        max = Math.max(max, arr[j][1]);
                    }
                }
                if (max != 0) {
                    var targetIndex = Math.floor(Math.random() * game.GameData.enemyCount);
                    var pTime = this.projTime(hero.index, targetIndex);
                    var index = hero.index;
                    var damage = hero.atk * sum;
                    egret.setTimeout(function () {
                        this.thisObj.heroAttack(this.index, targetIndex, pTime, damage);
                    }, { "thisObj": this, "index": index }, delay);
                    delay += game.GameData.hero_attack_time + game.GameData.interval_time + pTime + game.GameData.hurt_time;
                }
            }
            egret.setTimeout(function () {
                if (!this.checkWin()) {
                    this.oneRoundEnd();
                }
                else {
                    console.log("战斗胜利！");
                }
            }, this, delay);
        };
        /**
        * 英雄攻击
        */
        p.heroAttack = function (index, targetIndex, projTime, damage) {
            var enemy = this.enemyList[targetIndex];
            enemy.hp -= damage;
            egret.setTimeout(function () {
                this.sendNotification(BattleProxy.ENEMY_HURT, targetIndex);
                this.sendNotification(BattleProxy.UPDATE_ENEMY_HP_PER, [targetIndex, (enemy.hp / enemy.max_hp) * 100]);
            }, this, projTime + game.GameData.hero_attack_time);
            this.sendNotification(BattleProxy.HERO_ATTACK, [index, targetIndex, projTime]);
        };
        /**
        * 敌人攻击
        */
        p.enemyAttack = function (index) {
            this.sendNotification(BattleProxy.ENEMY_ATTACK, index);
        };
        /**
        * 更新敌人回合数
        */
        p.updateEnemyRound = function (index, round) {
            this.sendNotification(BattleProxy.UPDATE_ENEMY_ROUND, [index, round]);
        };
        /**
        * 检查是否胜利
        */
        p.checkWin = function () {
            var isWIn = true;
            for (var i = 0; i < game.GameData.enemyCount; i++) {
                var enemy = this.enemyList[i];
                console.log(enemy.hp);
                if (enemy.hp > 0) {
                    isWIn = false;
                    break;
                }
            }
            return isWIn;
        };
        /**
        * 检查是否失败
        */
        p.checkFail = function () {
            return this.own_hp <= 0;
        };
        /**
         * 投射时间
         */
        p.projTime = function (index, targetIndex) {
            return (Math.abs(targetIndex / game.GameData.enemyCount - index / game.GameData.heroCount) + 1) * game.GameData.base_proj_time;
        };
        /**
         * 去操作
         */
        p.toHandle = function () {
            this.sendNotification(game.GameCommand.TO_HANDLE, null);
        };
        /**
        * 创建英雄
        */
        p.creatHero = function (hero) {
            this.sendNotification(BattleProxy.HERO_CREATE, hero.clone());
        };
        /**
        * 创建敌人
        */
        p.creatEnemy = function (enemy) {
            this.sendNotification(BattleProxy.ENEMY_CREATE, enemy.clone());
        };
        /** 创建英雄 */
        BattleProxy.HERO_CREATE = "hero_create";
        /** 创建敌人 */
        BattleProxy.ENEMY_CREATE = "enemy_create";
        /** 英雄攻击 */
        BattleProxy.HERO_ATTACK = "hero_attack";
        /** 敌人攻击 */
        BattleProxy.ENEMY_ATTACK = "enemy_attack";
        /** 更新敌人回合数 */
        BattleProxy.UPDATE_ENEMY_ROUND = "update_enemy_round";
        /** 更新敌人血量百分比 */
        BattleProxy.UPDATE_ENEMY_HP_PER = "update_enemy_hp_per";
        /** 敌人受伤 */
        BattleProxy.ENEMY_HURT = "enemy_hurt";
        BattleProxy.NAME = "BattleProxy";
        return BattleProxy;
    }(puremvc.Proxy));
    game.BattleProxy = BattleProxy;
    egret.registerClass(BattleProxy,'game.BattleProxy',["puremvc.IProxy","puremvc.INotifier"]);
})(game || (game = {}));
