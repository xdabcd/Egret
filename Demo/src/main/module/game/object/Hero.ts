/**
 *
 * @author 
 *
 */
class Hero extends BaseGameObject{
    
    private state: HeroState;
    private id: number;
    private upAs: number;
    private downAs: number;
    private isUp: Boolean;
    private speed: number;
    private aiType: AiType;
    private hp: number;
    private hurtTime: number;
    
    private anim: egret.MovieClip;
    private gun: egret.Bitmap;
    private hpArr: Array<egret.Shape> = [];
    
    private shootInterval: number;
    private shootCd: number;
    private bulletId: number;
    private bulletX: number;
    private bulletY: number;
    
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
        var heroData = GameManager.GetHeroData(id);
        this.width = heroData.width;
        this.height = heroData.height;
        //设置动画，并装上枪
        this.setAnim(heroData.anim);
        this.setGun(heroData.gun, heroData.gunX, heroData.gunY);
        this.upAs = heroData.upAs;
        this.downAs = heroData.downAs;
        this.isUp = false;
        this.speed = 0;
        //血条
        this.hp = 0;
        this.addHp(heroData.hp);
        
        this.state = HeroState.Idle;
    }
	
    public SetAI(aiType: AiType){
        this.aiType = aiType;
    }
    
	private setAnim(anim: string){
    	  if(this.anim == null){
            this.anim = new egret.MovieClip(); 
            this.anim.anchorOffsetX = -this.width / 2;
            this.anim.anchorOffsetY = -this.height;
            this.addChild(this.anim);
    	  }
    
        var mcData = RES.getRes("hero_json");
        var mcTexture = RES.getRes("hero_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData,mcTexture);
        this.anim.movieClipData = mcDataFactory.generateMovieClipData(anim);
        this.anim.gotoAndPlay(1,-1);  
	}
	
	private setGun(id: number, x: number, y: number){
    	  if(this.gun == null){
    	      this.gun = new egret.Bitmap;
    	      this.gun.x = x;
    	      this.gun.y = y;
    	      this.addChild(this.gun);
    	  }
        var gunData = GameManager.GetGunData(id);
        this.gun.texture = RES.getRes(gunData.img);
        this.shootInterval = gunData.interval;
        this.shootCd = 0;
        this.bulletId = gunData.bullet;
        this.bulletX = gunData.bulletX;
        this.bulletY = gunData.bulletY;
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
	
    public Shoot() {
	    if(this.shootCd <= 0){
	        this.shootCd = this.shootInterval;
            var x = this.x + (this.gun.x + this.bulletX) * this.scaleX;
            var y = this.y + this.gun.y + this.bulletY;
            var moveData = new MoveData(0);
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.CeateBullet,this.bulletId,this.side,x,y,moveData);
	    }
	}
	
	public Hurt(damage: number) {
	    App.ShockUtils.shock(App.ShockUtils.SPRITE, this, 1);
	    this.state = HeroState.Hurt;
	    this.hurtTime = 0.1;
	    this.subHp(damage);
	}
	
    public update(time: number){
        super.update(time);
        var t = time / 1000;

        if(this.shootCd > 0) {
            this.shootCd -= t;
        }
        
        if(this.state == HeroState.Hurt) {
            this.hurtTime -= t;
            if(this.hurtTime <= 0) {
                this.state = HeroState.Idle;
            } else {
                return;
            }
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
        
        let as = -this.downAs;
        if(this.isUp){
	        as += this.upAs;
	    }
        this.y -= this.speed * t + as * t * t / 2;
        this.speed += as + t;
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
}

enum HeroState {
    Idle,
    Hurt
}

enum AiType{
    Follow
}
