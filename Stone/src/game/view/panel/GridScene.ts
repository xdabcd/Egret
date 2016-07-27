module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class GridScene extends egret.gui.UIAsset {
        public constructor() {
            super();
            this.touchChildren = true;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE,this.createCompleteEvent,this);
            this.addContainer();
        }

        private addContainer(): void {
            this.gemstoneGroup = new egret.Sprite();
            this.gemstoneGroup.touchChildren = true;
            this.source = this.gemstoneGroup;
        }

        public createCompleteEvent(event: egret.gui.UIEvent): void {
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE,this.createCompleteEvent,this);
            AppFacade.getInstance().registerMediator(new GridSceneMediator(this));
        }

        private gemstoneGroup: egret.Sprite;
        /** 当前选中的宝石位置 */
        private selectPos: Vector2;

        private touched: Boolean;
        
        /**
        * 创建一个宝石
        */
        public createGemstoneUI(gemstone: Gemstone): void {
            var gsUI: GemstoneUI = <GemstoneUI>(ObjectPool.getPool("game.GemstoneUI").borrowObject());  //从对象池创建
            gsUI.reset();
            gsUI.position.x = gemstone.position.x;
            gsUI.position.y = gemstone.position.y;
            gsUI.setSize(this.gemstoneSize);
            var tp: Vector2 = this.getTruePosition(gemstone.position);
            gsUI.x = tp.x;
            gsUI.y = tp.y;
            gsUI.type = gemstone.type;
            gsUI.touchEnabled = true;
            this.gemstoneGroup.addChild(gsUI);
            gsUI.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.gemstoneOnTouch,this);
            gsUI.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gemstoneOnClick,this);
            gsUI.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.gemstoneOnMove,this);
        }
        
        /**
        * 选中一个宝石
        */
        public selectGemstoneUI(pos: Vector2): void {
            var gsUI: GemstoneUI = this.getGemstoneUI(pos);
            if(gsUI) {
                this.selectPos = pos.clone();
                gsUI.select();
            }
        }
                
        /**
        * 取消选中一个格子
        */
        public unGemstoneUI(pos: Vector2): void {
            var gsUI: GemstoneUI = this.getGemstoneUI(pos);
            if(gsUI) {
                if(this.selectPos.equalTo(pos)) {
                    this.selectPos = null;
                }
                gsUI.unSelect();
            }
        }
        
        /**
        * 移动一个宝石
        */
        public moveGemstone(moveInfo: MoveInfo): void {
            var gsUI: GemstoneUI = this.getGemstoneUI(moveInfo.gemstone.position);
            if(gsUI) {
                var tp: Vector2 = this.getTruePosition(moveInfo.targetPos);
                gsUI.playmove(tp.x,tp.y,moveInfo.duration);
                egret.setTimeout(function(): void {
                    gsUI.position.x = moveInfo.targetPos.x;
                    gsUI.position.y = moveInfo.targetPos.y;
                },this,moveInfo.duration);
            }
        }
        
        /**
        * 改变宝石效果
        */
        public changeGemstoneEffect(gemstone: Gemstone): void {
            var gsUI: GemstoneUI = this.getGemstoneUI(gemstone.position);
            if(gsUI) {
                gsUI.changeEffect(gemstone.effect);
            }
        }
                
        /**
         * 宝石触摸事件
         */
        private gemstoneOnTouch(event: egret.TouchEvent) {
            var pos = (<GemstoneUI>event.target).position;
            if(this.selectPos == null || !this.selectPos.equalTo(pos)) {
                this.sendNotification(GameCommand.CLICK_GEMSTONE,pos.clone());
                this.touched = true;
            }
        }
        
        /**
        * 宝石点击事件
        */
        private gemstoneOnClick(event: egret.TouchEvent) {
            if(!this.touched) {
                this.sendNotification(GameCommand.CLICK_GEMSTONE,(<GemstoneUI>event.target).position.clone());
            }
            this.touched = false;
        }
        
        /**
        * 宝石移动事件
        */
        private gemstoneOnMove(event: egret.TouchEvent) {
            var pos = (<GemstoneUI>event.target).position;
            if(this.selectPos != null && !this.selectPos.equalTo(pos)) {
                this.sendNotification(GameCommand.CLICK_GEMSTONE,pos.clone());
            }
        }

        /**
        * 清除一个宝石
        */
        public removeGemstone(pos: Vector2): void {
            var gsUI: GemstoneUI = this.getGemstoneUI(pos);
            if(gsUI) {
                gsUI.playDisappear(GameData.remove_time);
                egret.setTimeout(function(): void {
                    this.gemstoneGroup.removeChild(gsUI);
                    gsUI.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.gemstoneOnTouch,this);
                    gsUI.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.gemstoneOnClick,this);
                    gsUI.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.gemstoneOnMove,this);
                    ObjectPool.getPool("game.GemstoneUI").returnObject(gsUI);
                },this,GameData.remove_time);
            }
        }
        
        /**
        *获取指定位置的宝石
        */
        public getGemstoneUI(pos: Vector2): GemstoneUI {
            for(var i: number = 0;i < this.gemstoneGroup.numChildren;i++) {
                var gsUI: GemstoneUI = <GemstoneUI><any> (this.gemstoneGroup.getChildAt(i));
                if(gsUI.position.x == pos.x && gsUI.position.y == pos.y) {
                    return gsUI;
                }
            }
            return null;
        }
        
        /**
        * 获取真实位置
        */
        private getTruePosition(pos: Vector2): Vector2 {
            var x: number = pos.x * (this.gemstoneSize) + this.gemstoneSize / 2 + this.border;
            var y: number = pos.y * (this.gemstoneSize) + this.gemstoneSize / 2 + this.border;
            return new Vector2(x,y);
        }
        
        
        /**
        *发消息
        */
        private sendNotification(name: string,body?: any,type?: string): void {
            AppFacade.getInstance().sendNotification(name,body,type);
        }
        
        /**
        * 宝石的大小
        */
        private get gemstoneSize(): number {
            return (this.width - this.border * 2) / GameData.xSize;
        }
        
        /**
        * 边距
        */
        private get border(): number {
            return 8;
        }
    }
}
