/**
 *
 * @author 
 *
 */
class Hero extends BaseGameObject{
    
    private state: HeroState;
    private id: number;
    private heroData: HeroData;
    private gunData: GunData;
    private isUp: Boolean;
    private speed: number;
    private aiType: AiType;
    private hp: number;
    private hurtTime: number;
    private freezTime: number;
    private releaseTime: number;
    
    private anim: egret.MovieClip;
    private gun: egret.Bitmap;
    private hpArr: Array<egret.Shape> = [];
    private freezImg: egret.Bitmap;
    
    private shootCd: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number, side: Side): void {
        super.init(side);

        this.id = id;
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
        this.setAnim(this.heroData.anim);
        this.setGun(this.heroData.gun);
        this.isUp = false;
        this.speed = 0;
        //血条
        this.hp = 0;
        this.addHp(this.heroData.hp);
        
        this.state = HeroState.Idle;
    }
	
    public SetAI(aiType: AiType){
        this.aiType = aiType;
    }
    
    public ChangeGun(id: number){
        this.setGun(id);
    }
    
	private setAnim(anim: string){
    	  if(this.anim == null){
            this.anim = new egret.MovieClip();
            this.anim.scaleX = this.anim.scaleY = 0.8;
            this.anim.anchorOffsetX = -this.width / 2 / 0.8;
            this.anim.anchorOffsetY = -this.height / 0.8;
            this.addChild(this.anim);
    	  }
    
        var mcData = RES.getRes("hero_json");
        var mcTexture = RES.getRes("hero_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData,mcTexture);
        this.anim.movieClipData = mcDataFactory.generateMovieClipData(anim);
        this.anim.gotoAndPlay(1,-1);  
	}
	
	private setGun(id: number){
	    if(this.gun == null){
	        this.gun = new egret.Bitmap;
	        this.gun.x = this.heroData.gunX;
            this.gun.y = this.heroData.gunY;
	        this.addChild(this.gun);
	    }
	    this.gun.visible = true;
        this.gunData = GameManager.GetGunData(id);
        this.gun.texture = RES.getRes(this.gunData.img);
        this.shootCd = this.gunData.interval;
	}
	
	private addHp(value: number){
        for(let i = this.hp;i < this.hp + value; i++){
	        let bar: egret.Shape;
    	    if(this.hpArr.length > i){
	            bar = this.hpArr[i];
	        }else{
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
            },this, 200 * i);
		}
        this.hp += value;
    }
	
    private subHp(value: number){
        for(let i = this.hp - 1;i >= Math.max(0,this.hp - value);i--) {
            let bar = this.hpArr[i];
            egret.setTimeout(() => {
                egret.Tween.get(bar).to({ scaleX: 0.01,scaleY: 0.01 },300,egret.Ease.elasticOut)
                    .call(()=>{
                        bar.visible = false;
                        });
            },this,200 * (this.hp - 1 - i));
        }
        this.hp = Math.max(0,this.hp - value); 
	}
	
    private showFreez(v: boolean){
	    if(this.freezImg == null){
	        this.freezImg = App.DisplayUtils.createBitmap("freez_png");
	        this.addChild(this.freezImg);
	        this.freezImg.anchorOffsetX = this.freezImg.width / 2;
	        this.freezImg.anchorOffsetY = this.freezImg.height / 2;
	    }
        this.freezImg.x = this.width / 2;
        this.freezImg.y = this.height / 2;
        this.freezImg.visible = v;
	}
	
    public Shoot() {
        if(this.state != HeroState.Idle){
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
                    this.shootCd = this.gunData.interval;
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
	    this.shootCd = this.gunData.interval;
	}
	
	public ResetGun(){
	    this.ChangeGun(this.heroData.gun);
	}
	
	public Hurt(damage: number) {
    	if(damage <= 0){
    	    return;
    	}
	    App.ShockUtils.shock(App.ShockUtils.SPRITE, this, 1);
	    this.state = HeroState.Hurt;
	    this.hurtTime = 0;
	    this.subHp(damage);
	}
	
	public Freez(duration: number){
	    this.state = HeroState.Freez;
        this.freezTime = duration;
	}
	
	public Release(duration: number){
	    this.state = HeroState.Release;
	    this.releaseTime = duration;
	}
	
    public update(time: number){
        super.update(time);
        var t = time / 1000;

        if(this.shootCd > 0) {
            this.shootCd -= t;
        }
        
        if(this.side == Side.Enemy){
            switch(this.aiType){
                case AiType.Follow:
                    this.followAi();
                    break;
                default:
                    break;
            }
        }
        
        if(this.state == HeroState.Hurt) {
            this.hurtTime -= t;
            if(this.hurtTime <= 0) {
                this.state = HeroState.Idle;
            }
        }

        if(this.state == HeroState.Freez) {
            this.isUp = false;
            this.freezTime -= t;
            this.showFreez(true);
            this.speed = 0;
            if(this.freezTime <= 0) {
                this.state = HeroState.Idle;
                this.showFreez(false);
            }
        }

        if(this.state == HeroState.Release) {
            this.isUp = false;
            this.releaseTime -= t;
            this.speed = 0;
            if(this.releaseTime <= 0) {
                this.state = HeroState.Idle;
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
	
	private followAi(){
        var r: number = this.gameController.CheckEnemyPosByHero(this);
        if(r > 0) {
            this.isUp = true;
        } else {
            this.isUp = false;
            if(r == 0) {
                this.Shoot();
            }
        }
	}
	
	public GetState(): HeroState{
	    return this.state;
	}
}

enum HeroState {
    Idle,
    Hurt,
    Freez,
    Release
}

enum AiType{
    Follow
}
