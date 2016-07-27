module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class BattleProxy extends puremvc.Proxy implements puremvc.IProxy {
        public constructor() {
            super(BattleProxy.NAME);
        }
        
        /** 创建英雄 */
        public static HERO_CREATE: string = "hero_create";
        
        /** 创建敌人 */
        public static ENEMY_CREATE: string = "enemy_create";
        
        /** 英雄攻击 */
        public static HERO_ATTACK: string = "hero_attack";
        
        /** 敌人攻击 */
        public static ENEMY_ATTACK: string = "enemy_attack";
        
        /** 更新敌人回合数 */
        public static UPDATE_ENEMY_ROUND: string = "update_enemy_round";

        /** 更新敌人血量百分比 */
        public static UPDATE_ENEMY_HP_PER: string = "update_enemy_hp_per";
        
        /** 敌人受伤 */
        public static ENEMY_HURT: string = "enemy_hurt";
        
        public static NAME: string = "BattleProxy";
        
        /** 英雄列表 */
        private heroList: Array<Hero>;
        /** 敌人列表 */
        private enemyList: Array<Enemy>;
        /** 回合数 */
        private round: number;
        /** 己方生命值 */
        private own_hp: number;
        /** 己方最大生命值 */
        private own_max_hp: number;
        
        /**
        * 初始化数据
        */
        public reset(): void {
            var hid_arr: Array<number> = [520123,310084,330024,340095, 320043];
            var eid_arr: Array<number> = [540085,540162];
            
            GameData.enemyCount = 2;
            this.enemyList = [];
            for(var i: number = 0;i < GameData.enemyCount;i++) {
                var enemy: Enemy = new Enemy();
                enemy.rounds = i + 2;
                enemy.cur_round = enemy.rounds;
                enemy.index = i;
                enemy.id = eid_arr[i];
                enemy.hp = enemy.max_hp = 3000;
                enemy.atk = 100;
                this.creatEnemy(enemy);
                this.enemyList.push(enemy);
            }
            
            GameData.heroCount = 5;
            this.heroList = [];
            for(var i: number = 0;i < GameData.heroCount; i++){ 
                var hero: Hero = new Hero();
                hero.index = i;
                hero.id = hid_arr[i];
                hero.type = i + 1;
                hero.atk = 100;
                this.creatHero(hero);
                this.heroList.push(hero);
            }
            this.own_hp = this.own_max_hp = 3000;
            
            this.round = 0;
        }
        
        /**
         * 开始
         */ 
        public start(): void { 
            console.log("战斗开始！");
            this.nextRound();
        }
        
        /**
         * 下一回合
         */
        public nextRound(): void { 
            this.round += 1;
            var delay:number = 0;
            for(var i: number = 0;i < GameData.enemyCount;i++) {
                var enemy: Enemy = this.enemyList[i];
                this.updateEnemyRound(i,enemy.cur_round);
                if(enemy.cur_round == 0) { 
                    egret.setTimeout(function() {
                        this.thisObj.enemyAttack(this.index);
                    },{ "thisObj": this, "index" : i}, delay);  
                    delay += GameData.enemy_attack_time + GameData.interval_time;
                }
            }

            egret.setTimeout(function() {
                if(!this.checkFail()) {
                    this.toHandle();
                } else {
                    console.log("战斗失败！");
                } 
            },this,delay);
        }
        
        /**
         * 一回合结束
         */ 
        private oneRoundEnd(): void { 
            for(var i: number = 0;i < GameData.enemyCount;i++) {
                var enemy: Enemy = this.enemyList[i];
                if(enemy.cur_round == 0) {
                    enemy.cur_round = enemy.rounds;
                } else { 
                    enemy.cur_round -= 1;
                }
            }
            
            egret.setTimeout(function() {
                this.nextRound();
            },this,GameData.round_time);
            
        }
        
        /**
        * 执行操作的效果
        */
        public doHandleEffect(arr: Array<Array<number>>): void {
            var delay: number = 0;
            for(var i: number = 0;i < this.heroList.length;i++) {
                var hero: Hero = this.heroList[i];
                var max = 0;
                var sum = 0;
                for(var j: number = 0;j < arr.length;j++) {
                    if(arr[j][0] == hero.type) {
                        sum += arr[j][1];
                        max = Math.max(max,arr[j][1]);
                    }
                }
                if(max != 0) {
                    var targetIndex = Math.floor(Math.random() * GameData.enemyCount);
                    var pTime = this.projTime(hero.index,targetIndex);
                    var index = hero.index;
                    var damage = hero.atk * sum;
                    egret.setTimeout(function() {
                        this.thisObj.heroAttack(this.index,targetIndex,pTime,damage);
                    },{ "thisObj": this,"index": index },delay);
                    delay += GameData.hero_attack_time + GameData.interval_time + pTime + GameData.hurt_time;
                }
            }

            egret.setTimeout(function(): void {
                if(!this.checkWin()) {
                    this.oneRoundEnd();
                } else {
                    console.log("战斗胜利！");
                } 
            },this,delay);
        }
        
        /**
        * 英雄攻击
        */
        private heroAttack(index: number, targetIndex: number, projTime: number, damage: number): void {
            var enemy: Enemy = this.enemyList[targetIndex];
            enemy.hp -= damage;
            egret.setTimeout(function(): void {
                this.sendNotification(BattleProxy.ENEMY_HURT,targetIndex);
                this.sendNotification(BattleProxy.UPDATE_ENEMY_HP_PER,[targetIndex,(enemy.hp / enemy.max_hp) * 100]);
            },this,projTime + GameData.hero_attack_time);
            
            this.sendNotification(BattleProxy.HERO_ATTACK,[index,targetIndex,projTime]);
        }
        
        /**
        * 敌人攻击
        */
        private enemyAttack(index: number): void {
            this.sendNotification(BattleProxy.ENEMY_ATTACK,index);
        }
        
        /**
        * 更新敌人回合数
        */
        private updateEnemyRound(index: number, round: number): void {
            this.sendNotification(BattleProxy.UPDATE_ENEMY_ROUND,[index, round]);
        }
        
        /**
        * 检查是否胜利
        */
        private checkWin(): Boolean {
            var isWIn: Boolean = true;
            for(var i: number = 0;i < GameData.enemyCount;i++) {
                var enemy: Enemy = this.enemyList[i];
                console.log(enemy.hp);
                if(enemy.hp > 0){ 
                    isWIn = false;
                    break;
                }
            }
            
            return isWIn;
        }
        
        /**
        * 检查是否失败
        */
        private checkFail(): Boolean {
            return this.own_hp <= 0;
        }
        
        /**
         * 投射时间
         */ 
        private projTime(index: number, targetIndex: number): number { 
                
            return (Math.abs(targetIndex / GameData.enemyCount - index/ GameData.heroCount) + 1) * GameData.base_proj_time;
        }
        
        /**
         * 去操作
         */ 
        private toHandle(): void {
            this.sendNotification(GameCommand.TO_HANDLE, null);
        }
        
        
        /**
        * 创建英雄
        */
        private creatHero(hero: Hero): void {
            this.sendNotification(BattleProxy.HERO_CREATE,hero.clone());
        }
        
        /**
        * 创建敌人
        */
        private creatEnemy(enemy: Enemy): void {
            this.sendNotification(BattleProxy.ENEMY_CREATE,enemy.clone());
        }
    }
}
