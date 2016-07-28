/**
 *
 * @author 
 *
 */
class Hero extends BaseGameObject{
    
    private id: number;
    private upAs: number;
    private downAs: number;
    private anim: egret.MovieClip;
    private gun: egret.Bitmap;
    private isUp: Boolean;
    private speed: number;
    private aiType: AiType;
    
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
        this.height = heroData.width;
        this.width = heroData.height;
        //设置动画，并装上枪
        this.setAnim(heroData.anim);
        this.setGun(heroData.gun, heroData.gunX, heroData.gunY);
        this.upAs = heroData.upAs;
        this.downAs = heroData.downAs;
        this.isUp = false;
        this.speed = 0;
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
	
	public Shoot(){
	    if(this.shootCd <= 0){
	        this.shootCd = this.shootInterval;
            var x = this.x + this.gun.x + this.bulletX;
            var y = this.y + this.gun.y + this.bulletY;
            var moveData = new MoveData(0);
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.CeateBullet,this.bulletId,this.side,x,y,moveData);
	    }
	}
	
    public update(time: number){
        super.update(time);
        var t = time / 1000;
        let as = -this.downAs;
        if(this.isUp){
	        as += this.upAs;
	    }
        this.y -= this.speed * t + as * t * t / 2;
        this.speed += as + t;
	    if(this.gameController.CheckHeroOut(this)){
	        this.speed = 0;
	    }
	    
	    if(this.shootCd > 0){
	        this.shootCd -= t;
	    }
	}
	
	public set IsUp(value: Boolean){
	    this.isUp = value;
	}
}

enum HeroState {
    
}

enum AiType{
    Follow
}
