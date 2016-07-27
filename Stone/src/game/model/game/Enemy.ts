module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class Enemy {
        public constructor() {
        }
		
        /** 最大生命值 */
        public max_hp: number;
        
        /** 生命值 */
        public hp: number;
        
        /** 攻击力 */
        public atk: number;
        
        /** 回合数 */
        public rounds: number;
        /** 当前回合数 */
        public cur_round: number;
        
        /** 位置 */
        public index: number;
        /** 敌人ID */
        public id: number;

        public clone(): Enemy {
            var enemy = new Enemy();
            enemy.rounds = this.rounds;
            enemy.cur_round = this.cur_round;
            enemy.index = this.index;
            enemy.id = this.id;
            return enemy;
        }
    }
}
