/**
 *
 * @author 
 *
 */
class Hero extends Unit{
    
    private heroData: HeroData;
    private gunData: GunData;
    private isUp: Boolean;
    private speed: number;
    private aiType: AiType;
    private hurtTime: number;
    private releaseTime: number;
    private targetPos: egret.Point;
    private aiDodgeInterval: number = 5;
    private aiDodgeCd: number;
    
    private img: egret.Bitmap;
    private gun: egret.Bitmap;
    private hpArr: Array<egret.Shape> = [];
    private freezImg: egret.Bitmap;
    
    private shootCd: number;
    
    private posArr: Array<number> = [];
    private curPosIndex: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number, side: Side): void {
        super.init(id, side);

        if(this.side == Side.Own){
            this.scaleX = 1;
        } else if(this.side == Side.Enemy){
            this.scaleX = -1;
        }
        this.heroData = GameManager.GetHeroData(id);
        this.width = this.heroData.width;
        this.height = this.heroData.height;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2
        //设置动画，并装上枪
        this.setImg(this.heroData.anim);
        this.setGun(this.heroData.gun);
        this.isUp = false;
        this.speed = 0;
        //血条
        this.hp = 0;
        this.addHp(this.heroData.hp);
        
        this.showFreez(false);
        this.rotation = 0;
    }
    
    private setImg(img: string) {
        if(this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
        this.img.x = this.heroData.width / 2;
        this.img.y = this.heroData.height / 2;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    }

    private setGun(id: number) {
        if(this.gun == null) {
            this.gun = new egret.Bitmap;
            this.gun.x = this.heroData.gunX;
            this.gun.y = this.heroData.gunY;
            this.addChild(this.gun);
        }
        this.gun.visible = true;
        this.gunData = GameManager.GetGunData(id);
        this.gun.texture = RES.getRes(this.gunData.img);
        this.shootCd = this.shootInterval;
    }

    protected addHp(value: number) {
        for(let i = this.hp;i < this.hp + value;i++) {
            let bar: egret.Shape;
            if(this.hpArr.length > i) {
                bar = this.hpArr[i];
            } else {
                bar = new egret.Shape();
                bar.graphics.beginFill(0xff00ff);
                bar.graphics.drawRect(0,0,20,15);
                bar.graphics.endFill();
                bar.x = -40;
                bar.y = i * 25;
                this.addChild(bar);
                this.hpArr.push(bar);
            }
            bar.visible = true;
            bar.scaleX = bar.scaleY = 0.01;
            egret.setTimeout(() => {
                egret.Tween.get(bar).to({ scaleX: 1,scaleY: 1 },300,egret.Ease.elasticOut)
            },this,50 * i);
        }
        this.hp += value;
    }

    protected subHp(value: number) {
        for(let i = this.hp - 1;i >= Math.max(0,this.hp - value);i--) {
            let bar = this.hpArr[i];
            egret.setTimeout(() => {
                egret.Tween.get(bar).to({ scaleX: 0.01,scaleY: 0.01 },300,egret.Ease.elasticOut)
                    .call(() => {
                        bar.visible = false;
                    });
            },this,50 * (this.hp - 1 - i));
        }
        this.hp = Math.max(0,this.hp - value);
        if(this.hp <= 0) {
            this.state = UnitState.Die;
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.HeroDie,this);
        }
    }

    private showFreez(v: boolean) {
        if(this.freezImg == null) {
            this.freezImg = App.DisplayUtils.createBitmap("freez_png");
            this.addChild(this.freezImg);
            this.freezImg.anchorOffsetX = this.freezImg.width / 2;
            this.freezImg.anchorOffsetY = this.freezImg.height / 2;
        }
        this.freezImg.x = this.width / 2;
        this.freezImg.y = this.height / 2;
        this.freezImg.visible = v;
    }
    
    public SetAI(aiType: AiType){
        this.aiType = aiType;
    }
    
    public SetPosArr(posX_1: number, posX_2: number){
        this.posArr = [posX_1, posX_2];
    }
    
    public ChangeGun(id: number){
        this.setGun(id);
    }
    
    public Entrance(){
        this.Move(new egret.Point(this.posArr[0], this.y));
        this.curPosIndex = 0;
    }
    
    public Move(pos: egret.Point){
        this.state = UnitState.Move;
        this.targetPos = pos;
    }
    
    public ToIdle() {
        this.state = UnitState.Idle;
    }
    
    public Hurt(damage: number) {
        if(damage <= 0) {
            return;
        }
        App.ShockUtils.shock(App.ShockUtils.SPRITE,this,1);
        this.state = UnitState.Hurt;
        this.hurtTime = 0;
        this.subHp(damage);
    }

    public Release(duration: number) {
        this.state = UnitState.Release;
        this.releaseTime = duration;
    }
	
	public Dodge(): boolean {
	    if(this.state != UnitState.Idle){
	        return false;
	    }
    	this.state = UnitState.Dodge; 
    	if(this.curPosIndex == 0){
            this.curPosIndex = 1;
    	}else{
    	    this.curPosIndex = 0;
    	}
        this.targetPos = new egret.Point(this.posArr[this.curPosIndex], this.y);
        return true;
	}
	
    public Shoot() {
        if(this.state != UnitState.Idle){
            return;
        }
	    if(this.shootCd <= 0){
            var bulletId = this.gunData.bullet
            var createFunc = (type, direction)=>{
                let x = this.x + (this.gun.x + this.gunData.bulletX - this.anchorOffsetX) * this.scaleX;
                let y = this.y - this.anchorOffsetY + this.gun.y + this.gunData.bulletY;
                let moveData = new MoveData(direction);
                App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.CeateBullet,bulletId,type,this,x,y,moveData);
	        };
	        switch(this.gunData.type){
	            case GunType.Normal:
                    createFunc("NormalBullet", 0);
                    this.shootCd = this.shootInterval;
                    break;
	            case GunType.Running:
	                var info = this.gunData.info;
                    var count = info.count;
                    var interval = info.interval * 1000;
                    App.TimerManager.doTimer(interval,count,() => createFunc("NormalBullet",0), this);
                    this.ResetGun();
                    break;
                case GunType.Shot:
                    var info = this.gunData.info;
	                var count = info.count;
	                var angle = info.angle;
                    var ini_angle = -(count - 1) / 2 * angle;
	                for(let i = 0; i < count; i++){
                        createFunc("NormalBullet",ini_angle + i * angle);
	                }
                    this.ResetGun();
                    break;
                case GunType.Boomerang:
                    this.gun.visible = false;
                    createFunc("BoomerangBullet", 0);
                    this.shootCd = 100;
                    break;
                case GunType.Laser:
                    createFunc("LaserBullet",0);
                    this.shootCd = 100;
                    break;
                case GunType.Freez:
                    createFunc("FreezBullet",0);
                    this.ResetGun();
                    break;
                case GunType.Grenade:
                    var info = this.gunData.info;
                    var direction = info.direction;
                    createFunc("GrenadeBullet",direction);
                    this.ResetGun();
                    break;
                case GunType.Wave:
                    createFunc("WaveBullet",direction);
                    this.ResetGun();
                    break;
                default:
	                break;
	        }
	    }
	}
	
	public GunReturn(){
	    this.gun.visible = true;
	    this.shootCd = this.shootInterval;
	}
	
	public ResetGun(){
	    this.ChangeGun(this.heroData.gun);
	}
	
    public update(time: number){
        super.update(time);
        var t = time / 1000;
        switch(this.state){
            case UnitState.Move:
                var xa = time / 2;
                var ya = xa * (this.targetPos.y - this.y) / (this.targetPos.x - this.x);
                var ra = time / 2;
                var r = 45;
                if(this.scaleX == 1){
                    if(this.x < this.targetPos.x){
                        this.x = Math.min(this.targetPos.x, this.x + xa);
                        if(this.rotation < r) {
                            this.rotation = Math.min(r,this.rotation + ra);
                        }
                    }else{
                        this.rotation = Math.max(0, this.rotation - ra);
                        if(this.rotation == 0){
                            this.state = UnitState.Idle;
                        }
                    }
                }else{
                    if(this.x > this.targetPos.x) {
                        this.x = Math.max(this.targetPos.x,this.x - xa);
                        if(this.rotation > -r) {
                            this.rotation = Math.max(-r,this.rotation - ra);
                        }
                    } else {
                        this.rotation = Math.min(0,this.rotation + ra);
                        if(this.rotation == 0) {
                            this.state = UnitState.Idle;
                        }
                    }
                }
                if(this.y < this.targetPos.y){
                    this.y = Math.min(this.y + Math.abs(ya), this.targetPos.y);
                }else if(this.y > this.targetPos.y){
                    this.y = Math.max(this.y - Math.abs(ya),this.targetPos.y);
                }

                return;
            case UnitState.Dodge:
                var xa = time * 1.5;
                var ra = time * 1.5;
                
                var r = 45;
                if(this.x > this.targetPos.x){
                    this.x = Math.max(this.targetPos.x,this.x - xa);
                    if(this.rotation > -r) {
                        this.rotation = Math.max(-r,this.rotation - ra);
                    }
                }else if(this.x < this.targetPos.x){
                    this.x = Math.min(this.targetPos.x,this.x + xa);
                    if(this.rotation < r) {
                        this.rotation = Math.min(r,this.rotation + ra);
                    }
                }else{
                    if(this.rotation > 0){
                        this.rotation = Math.max(0,this.rotation - ra);
                    }else if(this.rotation < 0){
                        this.rotation = Math.min(0,this.rotation + ra);
                    }else{
                        this.state = UnitState.Idle;
                        this.speed = 0;
                    }
                }
                return; 
            case UnitState.Idle:
                if(this.side == Side.Enemy) {
                    switch(this.aiType) {
                        case AiType.Follow:
                            this.followAi(t);
                            break;
                        default:
                            break;
                    }
                }
                break;
            case UnitState.Hurt:
                this.hurtTime -= t;

                if(this.hurtTime <= 0) {
                    this.state = UnitState.Idle;
                }
                break;
            case UnitState.Freez:
                this.isUp = false;
                this.freezTime -= t;
                this.showFreez(true);
                this.speed = 0;
                if(this.freezTime <= 0) {
                    this.state = UnitState.Idle;
                    this.showFreez(false);
                }
                break;
            case UnitState.Release:
                this.isUp = false;
                this.releaseTime -= t;
                this.speed = 0;
                if(this.releaseTime <= 0) {
                    this.state = UnitState.Idle;
                }
                break;
        }
        if(this.shootCd > 0) {
            if(this.aiType == AiType.Follow){
                this.shootCd -= t * 0.5;
            }else{
                this.shootCd -= t;
            }
        }
        let as = this.heroData.downAs;
        if(this.isUp){
	        as = this.heroData.upAs;
	    }
	    let s = this.speed;
	    this.speed = Math.max(Math.min(this.speed + as * t, this.heroData.maxSpeed), this.heroData.minSpeed);
        this.y -= (s + this.speed) / 2 * t;
	    if(this.gameController.CheckHeroOut(this)){
	        this.speed = 0;
	    }
	    
	    
	}
	
	public set IsUp(value: Boolean){
	    this.isUp = value;
	}
	
	private followAi(t :number){
    	if(this.aiDodgeCd == null){
    	    this.aiDodgeCd = 0;
    	}
    	if(this.aiDodgeCd > 0){
    	    this.aiDodgeCd -= t;
    	}else{
            if(this.gameController.checkDanger(this,100) && this.Dodge()) {
                this.aiDodgeCd = this.aiDodgeInterval;
                return;
            }
    	}    	
    	
        var safeArea = this.gameController.GetSafeArea(this);
        var target: any;
        var targetPos: number;
        if(safeArea.length > 0) {
            var idx = -1;
            var l = 2000;
            for(var i = 0;i < safeArea.length;i++) {
                var min = safeArea[i][0] + this.height / 2;
                var max = safeArea[i][1] - this.height / 2;
                //        	     if(this.speed > 0){
                //                     min += this.speed * 0.2;
                //        	     }else{
                //      max += this.speed * 0.2;
                //        	     }

                if(this.y >= min && this.y <= max) {
                    targetPos = (max + min) / 2;
                    var near = this.gameController.GetNearestInArea(this,[min,max]);
                    if(near != null){
                        target = near;  
                        targetPos = near.y;
                    }
                    break;
                } else if(this.y <= min) {
                    if(min - this.y < l) {
                        targetPos = min;
                        l = min - this.y;
                    }
                } else {
                    if(this.y - max < l) {
                        targetPos = max;
                        l = this.y - max;
                    }
                }
            }
        }
        if(target != null){
            if(Math.abs(targetPos - this.y) < 30){
                this.Shoot();
            }
        }
        if(this.y > targetPos){
            this.isUp = true;
        }else{
            this.isUp = false;
        }
	}
	
	public GetState(): UnitState{
	    return this.state;
	}
	
    public get rect(): Rect {
        if(this.state == UnitState.Move || this.state == UnitState.Die || this.state == UnitState.Dodge){
            return (new Rect(-10000,-10000,0,0,this.rotation));
        }
        return new Rect(this.x, this.y, this.width, this.height, this.rotation);
    }
    
    private get shootInterval(): number{
        return this.gunData.interval;
    }
    
    public HaveItem(): boolean{
        return this.gunData.id != this.heroData.gun;
    }
}

enum AiType{
    Follow
}
