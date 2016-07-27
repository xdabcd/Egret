module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class MoveInfo {
        public gemstone: Gemstone;
        public targetPos: Vector2;
        public duration: number;
        public constructor(gemstone: Gemstone, targetPos: Vector2, duration?: number) {
            this.gemstone = gemstone.clone();
            this.targetPos = targetPos;
            this.duration = duration;
        }
	}
}
