module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class Hero {
		public constructor() {
		}
		
        /** 攻击力 */
        public atk: number;
		
        /** 位置 */
        public index: number;
        /** 英雄ID */
        public id: number;
        /** 类型 */
        public type: number;

        public clone(): Hero {
            var hero = new Hero();
            hero.index = this.index;
            hero.id = this.id;
            hero.type = this.type;
            return hero;
        }
	}
}
