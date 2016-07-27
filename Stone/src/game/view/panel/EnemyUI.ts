module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class EnemyUI extends egret.Sprite {
        public constructor() {
            super();
        }
        
        /** 当前回合数 */
        private _cur_round: number;
        /** 回合数字 */
        private _round_text: egret.TextField;
        /** 位置 */
        public index: number;
        /** 敌人ID */
        private _id: number;
        /** 图标 */
        private _icon: egret.Bitmap;
        /** 血量百分比 */
        private _hp_per: number;
        /** 血条 */
        private _hp_bar: egret.gui.ProgressBar;

        /**
         * 重置
         */
        public reset(): void {
            
        }
        
        public setSize(width: number,height: number): void {
            this.width = width;
            this.height = height;
            this.anchorOffsetX = width / 2;
            this.anchorOffsetY = height / 2;
        }
        
        /**
         * 攻击
         */
        public attack(duration: number): void {
            EffectUtils.shakeObj1(this._icon,duration);
        }
        
        /**
         * 受伤
         */
        public hurt(duration: number): void {
            EffectUtils.shakeObj(this._icon,duration);
        }
        
        /**
         * 设置当前回合数
         */
        public set cur_round(cur_round: number) {
            if(cur_round == this._cur_round) {
                return;
            }
            this._cur_round = cur_round;
            this.updateRound();
        }
        
        private updateRound(): void {
            if(this._round_text == null) {
                this.initRoundText();
            }
            
            if(this._cur_round > 0) {
                this._round_text.text = "" + this._cur_round;
            } else { 
                this._round_text.text = "";
            }
        }
        
        /**
         * 设置敌人
         */
        public set id(id: number) {
            if(id == this._id) {
                return;
            }
            this._id = id;
            this.updateEnemy();
        }

        private updateEnemy(): void {
            if(this._icon == null) {
                this.initIcon();
            }

            this._icon.texture = RES.getRes("c" + this._id + "_c_png");
        }
        
        /**
         * 设置血量
         */
        public set hp_per(per: number) {
            if(per == this._hp_per) {
                return;
            }
            this._hp_per = per;
            this.updateHp();
        }
        
        private updateHp(): void {
            if(this._hp_bar == null) {
                this.initHpBar();
            }

            this._hp_bar.setValue(this._hp_per);
        }
        
        /**
         * 初始化敌人图片
         */
        private initIcon(): void {
            this._icon = new egret.Bitmap;
            this.addChild(this._icon);
            this._icon.width = this.width;
            this._icon.height = this.height;
        } 
        
        /**
         * 初始化会和数字
         */
        private initRoundText(): void {
            this._round_text = new egret.TextField;
            this.addChild(this._round_text);
            this._round_text.width = 30;
            this._round_text.height = 30;
            this._round_text.textColor = 0xff0000;
        } 
        
        /**
         * 初始化血条
         */ 
        private initHpBar(): void { 
            this._hp_bar = new egret.gui.ProgressBar();
            this._hp_bar.skinName = skins.components.ProgressBarSkin;
            this.addChild(this._hp_bar);
            this._hp_bar.height = 10;
            this._hp_bar.width = 150;
            this._hp_bar.x = this.width / 2 - this._hp_bar.width / 2;
            this._hp_bar.y = -20;
        }
    }
}
