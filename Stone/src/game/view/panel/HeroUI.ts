module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class HeroUI extends egret.Sprite{
        public constructor() {
            super();
        }
        
        /** 位置 */
        public index: number;
        /** 英雄ID */
        private _id: number;
        /** 类型 */
        private _type: number;
        /** 图标 */
        private _icon: egret.Bitmap;
        /** 边框 */
        private _frame: egret.Bitmap;
        
        /**
         * 重置
         */
        public reset(): void {

        }
        
        /**
         * 攻击
         */                      
        public attack(duration: number): void{
            egret.Tween.get(this).to({ x: this.x,y: this.y - 50 },duration,egret.Ease.cubicIn).to({ x: this.x,y: this.y}, duration);
        
        }
        
        public setSize(width: number, height:number): void {
            this.width = width;
            this.height = height;
            this.anchorOffsetX = width / 2;
            this.anchorOffsetY = height / 2;
        }
        
        /**
         * 设置英雄类型
         */
        public set type(type: number) {
            if(type == this._type) {
                return;
            }
            this._type = type;
            this.updateType();
        }
        
        private updateType(): void {
            if(this._frame == null) {
                this.initFrame();
            }

            this._frame.texture = RES.getRes("hf_" + this._type + "_png");
        }
        
        /**
         * 设置英雄
         */
        public set id(id: number) {
            if(id == this._id) {
                return;
            }
            this._id = id;
            this.updateHero();
        }
        
        private updateHero(): void {
            if(this._icon == null) {
                this.initIcon();
            }

            this._icon.texture = RES.getRes("c" + this._id + "_p_png");
        }
        
        /**
         * 初始化边框
         */
        private initFrame(): void {
            this._frame = new egret.Bitmap;
            this.addChild(this._frame);
            this._frame.width = this.width;
            this._frame.height = this.height;
        }
        
        /**
         * 初始化英雄头像
         */
        private initIcon(): void {
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.width = this.width;
            this._icon.height = this.height;
        }       
	}
}
