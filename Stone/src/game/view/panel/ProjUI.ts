module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class ProjUI extends egret.Sprite {
        public constructor() {
            super();
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.texture = RES.getRes("fx31003_w_b_png");
        }
        
        /** 图标 */
        private _icon: egret.Bitmap;
        
        public setSize(width: number,height: number): void {
            this.width = width;
            this.height = height;
            this.anchorOffsetX = width / 2;
            this.anchorOffsetY = height / 2;
            this._icon.width = this.width;
            this._icon.height = this.height;
        }
        
        /**
        * 移动宝石
        */
        public playmove(xTo: number,yTo: number,duration: number): void {
            this.rotation = - Math.atan((xTo - this.x) / (yTo - this.y)) / Math.PI * 180;
            egret.Tween.get(this).to({ x: xTo,y: yTo },duration);
        }
	}
}
