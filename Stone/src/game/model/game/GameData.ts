module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class GameData {
		public constructor() {
		}
		
        private static DURATION_MUL = 0.8;
		
        private static HERO_COUNT = 5;
        private static ENEMY_COUNT = 2;
        
        /**
        * 英雄个数
        */
        public static get heroCount(): number {
            return GameData.HERO_COUNT;
        }
        
        /**
        * 设置英雄个数
        */
        public static set heroCount(count: number) {
            GameData.HERO_COUNT = count;
        }
        
        /**
        * 敌人个数
        */
        public static get enemyCount(): number {
            return GameData.ENEMY_COUNT;
        }
        
        /**
       * 设置敌人个数
       */
        public static set enemyCount(count: number) {
            GameData.ENEMY_COUNT = count;
        }
        
        /**
        * 横向长度
        */
        public static get xSize():number
        {
            return 6;
        }
        
        /**
        * 纵向长度
        */
        public static get ySize():number
        {
            return 5;
        }
        
        /**
         * 间隔时间
         */ 
        public static get interval_time(): number {
            return GameData.DURATION_MUL * 100;
        }
        
        /**
         * 基础移动时间
         */
        public static get base_move_time(): number {
            return GameData.DURATION_MUL * 200;
        }
        
        /**
         * 消除时间
         */
        public static get remove_time(): number {
            return GameData.DURATION_MUL * 200;
        }
        
        /**
         * 重新排列时间
         */
        public static get rearrange_time(): number {
            return GameData.DURATION_MUL * 500;
        }
        
        /**
         * 攻击时间
         */
        public static get hero_attack_time(): number {
            return GameData.DURATION_MUL * 250;
        }
        
        /**
         * 攻击时间
         */
        public static get enemy_attack_time(): number {
            return GameData.DURATION_MUL * 500;
        }
        
        /*
         * 基础投射时间
         */ 
        public static get base_proj_time(): number { 
            return GameData.DURATION_MUL * 500;
        }
        
        /**
         * 回合切换时间
         */
        public static get round_time(): number {
            return GameData.DURATION_MUL * 500;
        }
        
        /**
         * 受伤
         */
        public static get hurt_time(): number {
            return GameData.DURATION_MUL * 300;
        }
	}
}
