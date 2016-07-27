module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class GemstoneType {
        public static PINK: number = 1;
        public static RED: number = 2;
        public static GREEN: number = 3;
        public static YELLOW: number = 4;
        public static BLUE: number = 5;
        
        public static get random(): number { 
            return Math.ceil(Math.random() * 5);
        }
	}
}
