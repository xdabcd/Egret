module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class GemstoneUI extends egret.Sprite{
        public constructor() {
            super();
            //使描点在中心
            this.position = new Vector2(0,0);
        }
		
        /** 位置 */
        public position: Vector2;
        /** 类型 */
        private _type: number;
        /** 是否被选中 */
        private _select: Boolean;
        /** 图标 */
        private _icon: egret.Bitmap; 
        /** 效果 */
        private _effect: egret.MovieClip;
        /** 效果背景 */
        private _effect_bg: egret.Bitmap;
        /** 大小 */
        private _size: number;
        
        /**
         * 设置宝石类型
         */ 
        public set type(type:number){
            if(type == this._type){
                return;
            }
            this._type = type;
            this.updateType();
        }
        
        /**
         * 重置
         */ 
        public reset(): void { 
            if(this._icon != null){ 
                this._icon.scaleX = this._icon.scaleY = 1;
            }
            this.changeEffect(GemstoneEffect.NONE);
        }
        
        public setSize(size: number): void{
            this._size = size;
            this.width = this.height = size;
            this.anchorOffsetX = this.anchorOffsetY = size / 2;
        }
        
        private updateType():void{
            if(this._icon == null){ 
                this.initIcon();
            }
            
            this._icon.texture = RES.getRes(this._type + "_png");
        }
        
        /**
        * 移动宝石
        */
        public playmove(xTo:number, yTo:number, duration: number): void{
            egret.Tween.get(this).to({x:xTo , y:yTo} , duration);
        }
        
        /**
        * 选中宝石
        */
        public select():void{
            this._select = true;
            this.playRotate();
        }
        
        /**
        * 取消选中宝石
        */
        public unSelect():void{
            this._select = false;
        }
        
        private playRotate(): void { 
            egret.Tween.get(this._icon).to({rotation: 360}, 300).call(function():void{
                if(this._select){ 
                    this.playRotate();
                }
            } , this);
        }
        
        /**
         * 宝石消失
         */ 
        public playDisappear(duration: number): void{ 
            egret.Tween.get(this._icon).to({scaleX:0.5 , scaleY:0.5} , duration);
        }
        
        /**
         * 改变效果
         */
        public changeEffect(effect: number): void {
            switch(effect) {
                case GemstoneEffect.NONE: {
                    if(this._effect != null) {
                        this._effect.visible = false;
                        this._effect_bg.visible = false;
                    }
                    break;
                }
                case GemstoneEffect.HOR: {
                    this.addEffect();
                    this._effect.rotation = 0;
                    break;
                }
                case GemstoneEffect.VER: {
                    this.addEffect();
                    this._effect.rotation = 90;
                    break;
                }
                case GemstoneEffect.SCOPE: {
                    this.addEffect();
                    this._effect.visible = false;
                    break;
                }
            }
        }
        
        /**
         * 添加效果
         */
        private addEffect(): void {
            if(this._effect == null) {
                this.initEffect();
            } else { 
                this._effect.visible = true;
                this._effect_bg.visible = true;
            }
        }
        
        /**
         * 初始化效果
         */ 
        public initEffect(): void {
            this._effect_bg = new egret.Bitmap;
            this.addChild(this._effect_bg);
            this._effect_bg.texture = RES.getRes("effect_bg_png");
            egret.Tween.get(this._effect_bg,{ loop: true, }).to({ rotation: 360 },2000);
            this._effect_bg.width = this._effect_bg.height = this._size * 1;
            this.setCenter(this._effect_bg);
            
            this._effect = new egret.MovieClip;
            this.addChild(this._effect);
            var data = RES.getRes("effect_json");
            var texture = RES.getRes("effect_png");
            var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,texture);
            this._effect.movieClipData = mcf.generateMovieClipData("effect");
            this._effect.gotoAndPlay("g1",-1);
            this._effect.scaleY = this._effect.scaleX = this.width / this._effect.width;
            this.setCenter(this._effect);
        }
        
        /**
         * 初始化图标
         */
        private initIcon(): void {
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.width = this._icon.height = this._size * 0.9;
            this.setCenter(this._icon);
        }
        
        /**
         * 设置居中
         */ 
        private setCenter(obj: egret.DisplayObject): void { 
            obj.x = obj.y = this._size / 2;
            obj.anchorOffsetX = obj.width / 2;
            obj.anchorOffsetY = obj.height / 2;
        }
	}
}
