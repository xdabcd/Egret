module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class BattleScene extends egret.gui.UIAsset {
        public constructor() {
            super();
            this.touchChildren = true;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE,this.createCompleteEvent,this);
            this.addContainer();
            this.heroList = [];
            this.enemyList = [];
        }

        private addContainer(): void {
            this.container = new egret.Sprite();
            this.container.touchChildren = true;
            this.source = this.container;
        }

        public createCompleteEvent(event: egret.gui.UIEvent): void {
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE,this.createCompleteEvent,this);
            AppFacade.getInstance().registerMediator(new BattleSceneMediator(this));
        }

        private container: egret.Sprite;
        private heroList: Array<HeroUI>;
        private enemyList: Array<EnemyUI>;
        
        /**
        * 创建一个英雄
        */
        public createHeroUI(hero: Hero): void {
            var heroUI: HeroUI = <HeroUI>(ObjectPool.getPool("game.HeroUI").borrowObject());  //从对象池创建
            heroUI.reset();
            heroUI.index = hero.index;
            heroUI.setSize(this.heroWidth, this.heroHeight);
            var tp: Vector2 = this.getHeroPosition(heroUI.index);
            heroUI.x = tp.x;
            heroUI.y = tp.y;
            heroUI.id = hero.id;
            heroUI.type = hero.type;
            this.container.addChild(heroUI);
            this.heroList.push(heroUI);
        }
        
        /**
        * 英雄攻击
        */
        public heroToAttack(index: number, targetIndex: number, projTime: number): void {
            var heroUI: HeroUI = this.getHeroUI(index);
            var enemyUI: EnemyUI = this.getEnemyUI(targetIndex);
            heroUI.attack(GameData.hero_attack_time);
            egret.setTimeout(function(): void {
                var projUI: ProjUI = this.createProj(index);
                projUI.playmove(enemyUI.x,enemyUI.y,projTime);
                
                egret.setTimeout(function(): void {
                    this.removeProj(projUI);
                },this,projTime);
            },this,GameData.hero_attack_time);
        }
        
        /**
        * 创建一个敌人
        */
        public createEnemyUI(enemy: Enemy): void {
            var enemyUI: EnemyUI = <EnemyUI>(ObjectPool.getPool("game.EnemyUI").borrowObject());  //从对象池创建
            enemyUI.reset();
            enemyUI.cur_round = enemy.cur_round;
            enemyUI.index = enemy.index;
            enemyUI.setSize(this.enemySize,this.enemySize);
            var tp: Vector2 = this.getEnemyPosition(enemyUI.index);
            enemyUI.x = tp.x;
            enemyUI.y = tp.y;
            enemyUI.id = enemy.id;
            enemyUI.hp_per = 100;
            this.container.addChild(enemyUI);
            this.enemyList.push(enemyUI);
        }
        
        /**
        * 敌人攻击
        */
        public enemyToAttack(index: number): void {
            console.log(index);
            var enemyUI: EnemyUI = this.getEnemyUI(index);
            enemyUI.attack(GameData.enemy_attack_time);
        }
        
        /**
        * 更新敌人回合数
        */
        public updateEnemyRound(index: number,round: number): void {
            var enemyUI: EnemyUI = this.getEnemyUI(index);
            enemyUI.cur_round = round;
        }
        
        /**
        * 更新敌人血量百分比
        */
        public updateEnemyHpPer(index: number,per: number): void {
            var enemyUI: EnemyUI = this.getEnemyUI(index);
            enemyUI.hp_per = per;
        }
        
        /**
        * 敌人受伤
        */
        public enemyHurt(index: number): void {
            var enemyUI: EnemyUI = this.getEnemyUI(index);
            enemyUI.hurt(GameData.hurt_time);
        }
        
        /**
        *创建投射物
        */
        private createProj(index: number): ProjUI {
            var projUI: ProjUI = <ProjUI>(ObjectPool.getPool("game.ProjUI").borrowObject());  //从对象池创建
            projUI.setSize(this.projSize,this.projSize);
            var tp: Vector2 = this.getProjPosition(index);
            projUI.x = tp.x;
            projUI.y = tp.y;
            this.container.addChild(projUI);
            return projUI;
        }
        
        /**
        * 清除一个投射物
        */
        public removeProj(projUI: ProjUI): void {
            this.container.removeChild(projUI);
            ObjectPool.getPool("game.ProjUI").returnObject(projUI);
        }
        
        /**
        *获取指定位置的英雄
        */
        private getHeroUI(index: number): HeroUI {
            return this.heroList[index];
        }
        
        /**
        *获取指定位置的敌人
        */
        private getEnemyUI(index: number): EnemyUI {
            return this.enemyList[index];
        }
        
        /**
        * 获取英雄位置
        */
        private getHeroPosition(index: number): Vector2 {
            var border = (this.width - (GameData.heroCount * this.heroWidth + (GameData.heroCount - 1) * this.gap))/2;
            var x: number = border + index * (this.heroWidth + this.gap) + this.heroWidth / 2;
            var y: number = this.height - this.heroHeight / 2;
            return new Vector2(x, y);
        }
        
        /**
        * 获取投射物位置
        */
        private getProjPosition(index: number): Vector2 {
            var pos = this.getHeroPosition(index);
            return new Vector2(pos.x, pos.y- 50);
        }
        
        /**
        * 获取敌人位置
        */
        private getEnemyPosition(index: number): Vector2 {
            var width: number = this.width / GameData.enemyCount;
            var x: number = index * width + width / 2;
            var y: number = this.enemySize / 2 + 50;
            return new Vector2(x,y);
        }
        
        /**
        * 英雄宽
        */
        private get heroWidth(): number {
            return 96;
        }
        
        /**
        * 英雄高
        */
        private get heroHeight(): number {
            return 81;
        }
        
        /**
        * 投射物大小
        */
        private get projSize(): number {
            return 50;
        }
        
        /**
        * 敌人大小
        */
        private get enemySize(): number {
            return 250;
        }
        
        /**
        * 间距
        */
        private get gap(): number {
            return 25;
        }
    }
}
