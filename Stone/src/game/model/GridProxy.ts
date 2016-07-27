module game {
	/**
	 *
	 * @author 
	 *
	 */
    enum GridState { 
        IDLE = 1,
        MOVE = 2,
        RESTORE = 3,
        REMOVE = 4,
        REPAIR = 5,
        REARRANGE = 6,
        GS_EFFECT = 7,
        MATCH_EFFECT = 8
    }
	
	
	export class GridProxy extends puremvc.Proxy implements puremvc.IProxy {
		public constructor() {
            super(GridProxy.NAME);
		}
		
        /** 创建宝石 */
        public static GEMSTONE_CREATE:string = "gemstone_create";
        /** 选中宝石 */
        public static GEMSTONE_SELECT:string = "gemstone_select";
        /** 取消选中宝石 */
        public static GEMSTONE_UNSELECT:string = "gemstone_unselect";
        /** 移动宝石 */
        public static GEMSTONE_MOVE:string = "gemstone_move";
        /** 移除宝石 */
        public static GEMSTONE_REMOVE:string = "gemstone_remove";
        /** 改变宝石效果 */
        public static GEMSTONE_CHANGE_EFFECT: string = "gemstone_change_effect";
		
		/** 横向长度 */
        private xSize: number;
        /** 纵向长度 */
        private ySize: number;
        /** 宝石列表 */
        private gemstoneList: Array<Array<Gemstone>>;
        /** 状态 */
        private state: GridState;
        /** 当前选中的宝石位置 */
        private selectPos: Vector2;
        /** 可消除宝石列表 */
        private matchesGemstone: Array<Array<Gemstone>>;
        /** 消除效果列表 */
        private matchEffectList: Array<Array<number>>;
        /** */
        
        private s_x: number;
        private s_y: number;
        private is_2x3: Boolean;
        private is_3x2: Boolean;
        private is_1x4: Boolean;
        private is_4x1: Boolean;
        
        /**
        * 初始化数据
        */
        public reset():void{
            this.xSize = GameData.xSize;
            this.ySize = GameData.ySize;
            this.initGemstoneList();
            this.createGemstoneInList();
        }

        /**
        * 点击宝石
        */
        public clickGemstone(pos: Vector2): void{
            if(this.state != GridState.IDLE){ 
                return;
            }
                        
            if(this.selectPos == null) {
                this.selectGemstone(pos);
            } else { 
                if(this.selectPos.equalTo(pos)) {
                    this.unSelectGemstone(this.selectPos);
                } else if(this.selectPos.borderUpon(pos)) {
                    this.exchangeGemstone(this.selectPos, pos);
                    this.unSelectGemstone(this.selectPos);
                } else { 
                    this.unSelectGemstone(this.selectPos);
                    this.selectGemstone(pos);
                }
            }
        }
        
        /**
        * 进入闲置状态
        */
        public toIdle(): void{
            this.state = GridState.IDLE;
            
            this.matchEffectList = [];
            
            var gemstoneArr:Array<Vector2> = this.getUsefulGemstone();
            if(gemstoneArr != null) {
//                egret.setTimeout(function(): void {
//                    this.exchangeGemstone(gemstoneArr[0], gemstoneArr[1]);                              
//                }, this , GameData.duration(100));
            } else { 
                this.rearrangeGemstone();
            }
        }
        
        /**
        * 选中宝石
        */
        private selectGemstone(pos: Vector2): void{
            this.selectPos = pos.clone();
            var gemstone: Gemstone = this.getGemstone(pos);
            if(gemstone != null){ 
                this.sendNotification(GridProxy.GEMSTONE_SELECT , pos.clone());
            }
        }
        
        /**
        * 取消选中宝石
        */
        private unSelectGemstone(pos: Vector2): void{
            this.selectPos = null;
            var gemstone: Gemstone = this.getGemstone(pos);
            if(gemstone != null){ 
                this.sendNotification(GridProxy.GEMSTONE_UNSELECT , pos.clone());
            }
        }
        
        /**
        * 交换宝石
        */
        private exchangeGemstone(pos1: Vector2, pos2: Vector2, isMove: Boolean = true): void{
            if(isMove) {
                this.state = GridState.MOVE;
            } else { 
                this.state = GridState.RESTORE;
            }
            var gemstone1: Gemstone = this.getGemstone(pos1);
            var gemstone2: Gemstone = this.getGemstone(pos2);
            if(gemstone1 != null && gemstone2 != null){
                var moveList: Array<MoveInfo> = [];
                moveList.push(this.moveGemstone(gemstone1,gemstone2.position));
                moveList.push(this.moveGemstone(gemstone2,gemstone1.position));
                var duration: number = this.getMaxMoveDuration(moveList);
                egret.setTimeout(function():void{
                    this.updateMovePosition(moveList);

                    if(this.state == GridState.RESTORE) {
                        this.toIdle();
                    } else { 
                        this.checkMatches();
                        if(this.matchesGemstone.length > 0) {
                            this.removeMatches();
                        } else { 
                            this.exchangeGemstone(pos1, pos2, false);
                        }
                    }
                                        
                } , this , duration + GameData.interval_time);
            }
        }
        
        /**
        * 消除
        */ 
        private removeMatches(): void { 
            this.state = GridState.REMOVE;

            var arr: Array<Gemstone> = [];
            for(var i:number = 0; i<this.matchesGemstone.length; i++){ 
                this.addMatchEffect([this.matchesGemstone[i][0].type,this.matchesGemstone[i].length]);
                for(var j: number = 0;j < this.matchesGemstone[i].length;j++) { 
                    var gemstone: Gemstone = this.matchesGemstone[i][j];
                    var pos: Vector2 = gemstone.position;
                    if(gemstone.effect != GemstoneEffect.NONE){ 
                        arr.push(gemstone);
                    }
                    this.removeGemstone(pos);
                } 
            }
            
            egret.setTimeout(function():void{
                this.doGemstoneEffect(arr);
            } , this , GameData.interval_time);
        }

        /**
         * 添加消除效果
         */ 
        private addMatchEffect(arr: Array<number>): void {
            this.matchEffectList.push(arr);
        }
        
        /**
         * 消除效果
         */ 
        private doMatchEffect(): void {
            this.state = GridState.MATCH_EFFECT;
            
            for(var i: number = 0;i < this.matchEffectList.length;i++) { 
                if(this.matchEffectList[i][1] >= 4){ 
                    this.matchesEffect_4(this.matchEffectList[i][0]);
                }
            } 
            
            egret.setTimeout(function(): void {
                this.handle_complete();
            },this, GameData.interval_time);
        }
        
        /**
         * 操作结束
         */
        private handle_complete(): void {
            this.sendNotification(GameCommand.HANDLE_COMPLETE, this.matchEffectList); 
        }
        
        /**
         * 4连效果
         */
        private matchesEffect_4(type: number): void {
            switch(type) {
                case GemstoneType.PINK: {
                    this.changeRandomGemstoneEffect(GemstoneEffect.NONE,GemstoneEffect.HOR);
                    break;
                }
                case GemstoneType.RED: {
                    this.changeRandomGemstoneEffect(GemstoneEffect.NONE,GemstoneEffect.VER);
                    break;
                }
                case GemstoneType.GREEN: {
                    this.changeRandomGemstoneEffect(GemstoneEffect.NONE,GemstoneEffect.SCOPE);
                    break;
                }
                case GemstoneType.YELLOW: {
                    this.changeRandomGemstoneEffect(GemstoneEffect.NONE,GemstoneEffect.VER);
                    break;
                }
                case GemstoneType.BLUE: {
                    this.changeRandomGemstoneEffect(GemstoneEffect.NONE,GemstoneEffect.HOR);
                    break;
                }
            }
        }
        
        /**
         * 转化随机宝石效果
         */
        private changeRandomGemstoneEffect(effect: number, targetEffect: number): void {
            var gemstone: Gemstone = this.getRandomGemstone();
            while(gemstone.effect != effect){ 
                gemstone = this.getRandomGemstone();
            }
            
            gemstone.effect = targetEffect;
            this.sendNotification(GridProxy.GEMSTONE_CHANGE_EFFECT,gemstone.clone()); 
        }
        
        /**
         * 获得随机宝石
         */
        private getRandomGemstone(): Gemstone {
            var xRand: number = Math.floor(Math.random() * this.xSize);
            var yRand: number = Math.floor(Math.random() * this.ySize);
            return this.gemstoneList[xRand][yRand];
        }
        
        /**
         * 宝石效果
         */
        private doGemstoneEffect(arr: Array<Gemstone>): void {
            this.state = GridState.GS_EFFECT;
            var arr1: Array<Gemstone> = [];
            for(var i: number = 0;i < arr.length;i++) {
                var temp: Array<Gemstone> = [];
                switch(arr[i].effect) {
                    case GemstoneEffect.HOR: {
                        temp = this.gamestoneHorEffect(arr[i]);
                        break;
                    }
                    case GemstoneEffect.VER: {
                        temp = this.gamestoneVerEffect(arr[i]);
                        break;
                    }
                    case GemstoneEffect.SCOPE: {
                        temp = this.gamestoneScopeEffect(arr[i]);
                        break;
                    }
                }
                for(var j: number = 0;j < temp.length;j++) { 
                    arr1.push(temp[j]);
                }
            }
            if(arr1.length > 0) {
                this.doGemstoneEffect(arr1);
            } else { 
                var duration = 0;
                if(arr.length > 0) {
                    duration = GameData.remove_time + GameData.interval_time;
                }
                egret.setTimeout(function(): void {
                    this.repairGemstones();
                },this,duration);
            }
        }
        
        /**
         * 横向消除效果
         */
        private gamestoneHorEffect(gemstone: Gemstone): Array<Gemstone> {
            var arr: Array<Gemstone> = [];
            for(var x: number = 0;x < this.xSize;x++) { 
                var pos: Vector2 = new Vector2(x, gemstone.position.y);
                var gs: Gemstone = this.getGemstone(pos);
                if(gs!= null){ 
                    this.removeGemstone(pos);
                    if(gs.effect != GemstoneEffect.NONE) {
                        arr.push(gs);
                    }
                }
            }
            return arr;
        }
        
        /**
         * 纵向消除效果
         */
        private gamestoneVerEffect(gemstone: Gemstone): Array<Gemstone> {
            var arr: Array<Gemstone> = [];
            for(var y: number = 0;y < this.ySize;y++) {
                var pos: Vector2 = new Vector2(gemstone.position.x,y);
                var gs: Gemstone = this.getGemstone(pos);
                if(gs != null) {
                    this.removeGemstone(pos);
                    if(gs.effect != GemstoneEffect.NONE) {
                        arr.push(gs);
                    }
                }
            }
            return arr;
        }
        
        /**
         * 范围消除效果
         */
        private gamestoneScopeEffect(gemstone: Gemstone): Array<Gemstone> {
            var arr: Array<Gemstone> = [];
            var min_x = Math.max(0,gemstone.position.x-1);
            var max_x = Math.min(this.xSize,gemstone.position.x + 1); 
            var min_y = Math.max(0,gemstone.position.y - 1);
            var max_y = Math.min(this.ySize,gemstone.position.y + 1);
            
            for(var x: number = min_x;x <= max_x;x++) {
                for(var y: number = min_y;y <= max_y;y++) { 
                    var pos: Vector2 = new Vector2(x,y);
                    var gs: Gemstone = this.getGemstone(pos);
                    if(gs != null) {
                        this.removeGemstone(pos);
                        if(gs.effect != GemstoneEffect.NONE) {
                            arr.push(gs);
                        }
                    }
                }
            }
            return arr;
        }
        
        /**
        * 修复
        */ 
        private repairGemstones(): void { 
            this.state = GridState.REPAIR;
            var moveList: Array<MoveInfo> = [];    
            
            var removeArr: Array<Array<number>> = [];
            for(var x: number = 0;x < this.xSize;x++) {
                var temp = [];
                removeArr.push(temp);
                for(var y: number = 0;y < this.ySize;y++) {
                    if(this.gemstoneList[x][y] == null){ 
                        temp.push(y);
                    }
                }
            }
                            
            for(var x:number = 0; x<removeArr.length; x++){          
                var tmpArr: Array<number> = removeArr[x];
                tmpArr.sort(SortUtils.sortNum);
                                    
                for(var i:number = 0; i<tmpArr.length; i++){ 
                    var gemstone: Gemstone = new Gemstone();
                    gemstone.position = new Vector2(x, i-tmpArr.length);
                    gemstone.type = this.randomGemstoneType();
                    this.creatGemstone(gemstone);
                    moveList.push(this.moveGemstone(gemstone, new Vector2(x, i)));
                }
                                    
                for(var y:number = 0; y<this.ySize; y++){
                    if(y < tmpArr[0]) {
                        moveList.push(this.moveGemstone(this.getGemstone(new Vector2(x, y)), new Vector2(x, y + tmpArr.length)));
                    } else { 
                        tmpArr.shift();
                        if(tmpArr.length == 0) break;
                    }
                }
            }
            
            var duration: number = this.getMaxMoveDuration(moveList);
            egret.setTimeout(function():void{
                this.updateMovePosition(moveList);
                
                this.checkMatches();
                if(this.matchesGemstone.length > 0) {
                    this.removeMatches();
                } else { 
                    this.doMatchEffect();
                }
            } , this , duration + GameData.interval_time);
        }
        
        /**
        * 移动格子宝石
        */ 
        private moveGemstone(gemstone: Gemstone, targetPos: Vector2): MoveInfo { 
            var dis = Math.sqrt(Math.pow(targetPos.x - gemstone.position.x, 2)
                + Math.pow(targetPos.y - gemstone.position.y, 2));
            var duration: number = Math.sqrt(dis) * GameData.base_move_time;
            var moveInfo = new MoveInfo(gemstone.clone(),targetPos.clone(),duration);
            this.sendNotification(GridProxy.GEMSTONE_MOVE, moveInfo);       
            return moveInfo;
        }
             
        /**
         * 移动花费的最长时间
         */ 
        private getMaxMoveDuration(moveList: Array<MoveInfo>): number { 
            var duration = 0;
            for(var i: number = 0; i < moveList.length; i++) { 
                duration = Math.max(duration,moveList[i].duration);
            }
            
            return duration;
        }
        
        /**
        * 更新移动后的位置
        */ 
        private updateMovePosition(moveList: Array<MoveInfo>): void { 
            var moveGemstoneList: Array<Gemstone> = []; 
            for(var i: number = 0; i < moveList.length; i++) { 
                moveGemstoneList.push(moveList[i].gemstone.clone());
            }

            for (var i:number = 0; i < moveList.length; i++) {
                var moveInfo: MoveInfo = moveList[i];
                moveGemstoneList[i].prePosition = moveInfo.gemstone.position.clone();
                moveGemstoneList[i].position = moveInfo.targetPos.clone();
                this.gemstoneList[moveInfo.targetPos.x][moveInfo.targetPos.y] = moveGemstoneList[i];
            }      
        }
        
        /**
         * 初始化宝石列表
         */ 
        private initGemstoneList(): void { 
            this.gemstoneList = [];
            for(var x: number = 0; x < this.xSize; x++){ 
                var temp: Array<Gemstone> = []; 
                this.gemstoneList.push(temp);
                for(var y: number = 0; y < this.ySize; y++){ 
                    var gemstone: Gemstone = new Gemstone();
                    gemstone.position = new Vector2(x, y);
                    gemstone.type = this.randomGemstoneType();
                    while(this.checkGemstoneMatches(gemstone.position, gemstone.type)){ 
                        gemstone.type = this.randomGemstoneType();
                    }
                    temp.push(gemstone);
                }
            }
            if(this.getUsefulGemstone() == null){
                this.initGemstoneList();
            }
        }
        
        /**
         * 创建列表中的宝石
         */ 
        private createGemstoneInList(): void { 
            for(var x: number = 0; x < this.xSize; x++){ 
                for(var y: number = 0; y < this.ySize; y++){ 
                    var gemstone: Gemstone = this.getGemstone(new Vector2(x, y));
                    if(gemstone){ 
                        this.creatGemstone(gemstone);
                    }
                }
            }
        }
        
        /**
         * 随机宝石类型
         */ 
        private randomGemstoneType(): number { 
            return GemstoneType.random;
        }
        
        /**
        * 重新排列宝石
        */ 
        private rearrangeGemstone(): void { 
            this.state = GridState.REARRANGE;
            var targetArr: Array<Array<Vector2>> = [];
            var temp: Array<Array<Gemstone>> = this.gemstoneList.slice(0);
            targetArr = this.upsetGemstoneList();
            this.checkMatches();
            while(this.matchesGemstone.length > 0 || this.getUsefulGemstone() == null){ 
                this.gemstoneList = temp.slice(0);
                targetArr = this.upsetGemstoneList();
                this.checkMatches();
            }
            this.gemstoneList = temp.slice(0);
            
            var fun:Function = function(){
                var moveList: Array<MoveInfo> = []; 
                for(var x: number = 0; x < this.xSize; x++){ 
                    for(var y: number = 0; y < this.ySize; y++){ 
                        moveList.push(this.moveGemstone(this.getGemstone(new Vector2(x, y)), targetArr[x][y]));
                    }
                }
                            
                var duration: number = this.getMaxMoveDuration(moveList);
                egret.setTimeout(function():void{
                    this.updateMovePosition(moveList);
                    this.toIdle();
                } , this , duration + GameData.interval_time);
            };
            
            egret.setTimeout(fun , this , GameData.rearrange_time);
        }
        
        /**
        * 打乱宝石序列
        */ 
        private upsetGemstoneList(): Array<Array<Vector2>> { 
            var arr: Array<Gemstone> = [];
            var targetArr: Array<Array<Vector2>> = [];
            for(var x: number = 0; x < this.xSize; x++){ 
                var temp: Array<Vector2> = [];
                targetArr.push(temp);
                for(var y: number = 0; y < this.ySize; y++){ 
                    var gemstone: Gemstone = this.getGemstone(new Vector2(x,y)).clone();
                    arr.push(gemstone);
                    temp.push(null);
                }
            }
            arr.sort(SortUtils.random);
            
            this.gemstoneList = [];
            for(var x: number = 0; x < this.xSize; x++){ 
                var temp1: Array<Gemstone> = []; 
                this.gemstoneList.push(temp1);
                for(var y: number = 0; y < this.ySize; y++){ 
                    var gemstone: Gemstone = arr[x*this.ySize + y];
                    targetArr[gemstone.position.x][gemstone.position.y] = new Vector2(x,y);
                    gemstone.position = new Vector2(x,y);
                    temp1.push(gemstone);
                }
            }
            return targetArr;
        }
        
        /**
        * 获取可交换的宝石
        */ 
        private getUsefulGemstone(): Array<Vector2> { 
            this.s_x = 0;
            this.s_y = 0;
            this.is_2x3 = true;
            this.is_3x2 = false;
            this.is_1x4 = false;
            this.is_4x1 = false;
            
            var gemstoneArr: Array<Vector2> = null;
            var sec: Array<Array<Gemstone>> = this.getNextSection();
            while(gemstoneArr == null && sec != null){ 
                if(sec.length == 1) {
                    //有两种情况
                    if(sec[0][0].type == sec[0][1].type && sec[0][0].type == sec[0][3].type) {
                        gemstoneArr = [sec[0][3].position, sec[0][2].position];
                    }
                    else if(sec[0][0].type == sec[0][2].type && sec[0][0].type == sec[0][3].type) {
                        gemstoneArr = [sec[0][0].position,sec[0][1].position];
                    }
                }
                else if(sec.length == 2) {
                    //只有6种可消除情况
                    if(sec[0][0].type == sec[1][1].type && sec[0][0].type == sec[1][2].type) {
                        gemstoneArr = [sec[0][0].position,sec[1][0].position];
                    }
                    else if(sec[0][1].type == sec[1][0].type && sec[0][1].type == sec[1][2].type) {
                        gemstoneArr = [sec[0][1].position,sec[1][1].position];
                    }
                    else if(sec[0][2].type == sec[1][0].type && sec[0][2].type == sec[1][1].type) {
                        gemstoneArr = [sec[0][2].position,sec[1][2].position];
                    }
                    else if(sec[1][0].type == sec[0][1].type && sec[1][0].type == sec[0][2].type) {
                        gemstoneArr = [sec[1][0].position,sec[0][0].position];
                    }
                    else if(sec[1][1].type == sec[0][0].type && sec[1][1].type == sec[0][2].type) {
                        gemstoneArr = [sec[1][1].position,sec[0][1].position];
                    }
                    else if(sec[1][2].type == sec[0][0].type && sec[1][2].type == sec[0][1].type) {
                        gemstoneArr = [sec[1][2].position,sec[0][2].position];
                    }
                    
                }  
                sec = this.getNextSection();   
            }

            return gemstoneArr;
        }
        
        /**
         * 获取下块选择区域
         */ 
        private getNextSection(): Array<Array<Gemstone>> { 
            var sec: Array<Array<Gemstone>> = [];
            //(2*3)遍历
            if (this.is_2x3 && this.s_x <= this.xSize-2 && this.s_y <= this.xSize-3)
            {
                for(var i: number = 0; i < 2; i++){ 
                    var temp: Array<Gemstone> = [];
                    sec.push(temp);
                    for(var j: number = 0; j < 3; j++){ 
                        temp.push(this.getGemstone(new Vector2(this.s_x + i,this.s_y + j)));                
                    }
                }

                this.s_x++;
                if (this.s_x == this.xSize-1)
                {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize-2) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = false;
                        this.is_3x2 = true;
                        this.is_1x4 = false;
                        this.is_4x1 = false;
                    }
                }
                return sec;
            }
            //(3*2)遍历
            if (this.is_3x2 && this.s_x <= this.xSize-3 && this.s_y <= this.xSize-2)
            {
                for(var j: number = 0; j < 2; j++){ 
                    var temp: Array<Gemstone> = [];
                    sec.push(temp);
                    for(var i: number = 0; i < 3; i++){ 
                        temp.push(this.getGemstone(new Vector2(this.s_x + i,this.s_y + j)));                
                    }
                }
                
                this.s_x++;
                if (this.s_x == this.xSize-2)
                {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize-1) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = false;
                        this.is_3x2 = false;
                        this.is_1x4 = true;
                        this.is_4x1 = false;
                    }
                }
                return sec;
            }
            //(1*4)遍历
            if (this.is_1x4 && this.s_x <= this.xSize-1 && this.s_y <= this.xSize-4)
            {
                var temp: Array<Gemstone> = [];
                sec.push(temp);
                for(var j: number = 0; j < 4; j++){ 
                    temp.push(this.getGemstone(new Vector2(this.s_x,this.s_y + j)));                
                }
                
                this.s_x++;
                if (this.s_x == this.xSize)
                {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize-3) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = false;
                        this.is_3x2 = false;
                        this.is_1x4 = false;
                        this.is_4x1 = true;
                    }
                }
                return sec;
            }
            //(4*1)遍历
            if (this.is_4x1 && this.s_x <= this.xSize-4 && this.s_y <= this.xSize-1)
            {
                var temp: Array<Gemstone> = [];
                sec.push(temp);
                for(var i: number = 0; i < 4; i++){ 
                    temp.push(this.getGemstone(new Vector2(this.s_x + i,this.s_y)));                
                }
                
                this.s_x++;
                if (this.s_x == this.xSize-3)
                {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = true;
                        this.is_3x2 = false;
                        this.is_1x4 = false;
                        this.is_4x1 = false;
                        
                        sec = null;
                    }
                }
                return sec;
            }
            
            return sec;
        }
        
        /**
         * 检测是否有宝石可消除
         */ 
        private checkMatches(): void{ 
            this.matchesGemstone = [];
            this.checkHorMatches();
            this.checkVerMatches();
        }
        
        /**
        * 纵向检测
        */ 
        private checkHorMatches(): Boolean { 
            var isMatched = false;
            for (var x:number = 0; x<this.xSize; x++) {
                for (var y:number = 0; y<this.ySize-2; y++) {
                    var gemstone1: Gemstone = this.getGemstone(new Vector2(x, y));
                    var gemstone2: Gemstone = this.getGemstone(new Vector2(x, y + 1));
                    var gemstone3: Gemstone = this.getGemstone(new Vector2(x, y + 2));    
                    if(gemstone1 != null && gemstone2 != null && gemstone3 != null){
                        if(gemstone1.type == gemstone2.type && gemstone1.type == gemstone3.type){ 
                            isMatched = true;
                            this.addMatches([gemstone1,gemstone2,gemstone3]);
                        }
                    }
                }
            }
            return isMatched;
        }
                
        /**
        * 横向检测
        */ 
        private checkVerMatches(): Boolean { 
            var isMatched = false;
            for (var y:number = 0; y<this.ySize; y++) {
                for (var x:number = 0; x<this.xSize-2; x++) {
                    var gemstone1: Gemstone = this.getGemstone(new Vector2(x, y));
                    var gemstone2: Gemstone = this.getGemstone(new Vector2(x + 1, y));
                    var gemstone3: Gemstone = this.getGemstone(new Vector2(x + 2, y));                                                   
                    if(gemstone1 != null && gemstone2 != null && gemstone3 != null){
                        if(gemstone1.type == gemstone2.type && gemstone1.type == gemstone3.type){ 
                            isMatched = true;
                            this.addMatches([gemstone1,gemstone2,gemstone3]);
                        }
                    }
                }
            }
            return isMatched;
        }
        
        /**
        * 加入消除序列
        */
        private addMatches(gemstones: Array<Gemstone>): void {
            var index = -1;
            for(var i: number = 0;i < this.matchesGemstone.length;i++) {
                for(var j: number = 0;j < gemstones.length;j++) { 
                    if(this.matchesGemstone[i].indexOf(gemstones[j]) >= 0) {
                        index = i;
                        break;
                    }
                }
                if(index >= 0) break; 
            }

            if(index >= 0) {
                for(var j: number = 0;j < gemstones.length;j++) {
                    if(this.matchesGemstone[index].indexOf(gemstones[j]) == -1) {
                        this.matchesGemstone[index].push(gemstones[j]);
                    }
                }
            } else { 
                this.matchesGemstone.push(gemstones);
            }
        }
        
        /**
        * 检查宝石是否可消除(初始化时)
        */ 
        private checkGemstoneMatches(pos: Vector2, type: number): Boolean{ 
            var isMatched = false;
            if(pos.x >= 2){ 
                var gemstone0 = this.getGemstone(new Vector2(pos.x-2, pos.y));
                var gemstone1 = this.getGemstone(new Vector2(pos.x-1, pos.y));
                if(gemstone0 != null && gemstone1 != null && gemstone0.type == type && gemstone1.type == type){ 
                    isMatched = true;
                }
            }
            if(!isMatched && pos.y >= 2){ 
                var gemstone0 = this.getGemstone(new Vector2(pos.x, pos.y-2));
                var gemstone1 = this.getGemstone(new Vector2(pos.x, pos.y-1));
                if(gemstone0 != null && gemstone1 != null && gemstone0.type == type && gemstone1.type == type){ 
                    isMatched = true;
                }            
            }
                        
            return isMatched;
        }
                
        /**
        * 创建宝石
        */
        private creatGemstone(gemstone:Gemstone):void{
            this.sendNotification(GridProxy.GEMSTONE_CREATE , gemstone.clone());
        }
                
        /**
        * 消除宝石
        */
        private removeGemstone(pos: Vector2): void{
            this.gemstoneList[pos.x][pos.y] = null; 
            this.sendNotification(GridProxy.GEMSTONE_REMOVE , pos.clone());
        }
                
        /**
        * 获取指定位置的宝石
        */
        private getGemstone(pos: Vector2): Gemstone{
            if (this.withinBounds(pos)) {
                return this.gemstoneList[pos.x][pos.y];
            } else {
                return null;
            }
        }
        
        /**
        * 检查位置是否合法
        */
        private withinBounds(pos: Vector2): boolean {
            return pos.x >= 0 && pos.x < this.xSize && pos.y >= 0 && pos.y < this.ySize;
        }
	}
}
