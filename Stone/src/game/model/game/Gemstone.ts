module game {
    /**
    *
    * @author 
    *
    */
    export class Gemstone {
        public constructor() {
            
        }
		        
        /** 位置 */
        public position: Vector2;
        /** 类型 */
        public type:number;
        /** 前一个位置 */
        public prePosition: Vector2;
        /** 宝石效果 */
        public effect: number = GemstoneEffect.NONE;
        
        public clone():Gemstone{
            var gs = new Gemstone();
            gs.position = this.position.clone();
            gs.type = this.type;
            gs.prePosition = this.prePosition;
            gs.effect = this.effect;
            return gs;
        }
    }
}
