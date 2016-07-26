/**
 *
 * @author 
 *
 */
class Hero extends egret.DisplayObjectContainer{
    
    private id: number;
    private upAs: number;
    private downAs: number;
    private heroAni: egret.MovieClip;
    private isUp: Boolean;
    private speed: number;
    
	public constructor(id: number) {
        super();
        this.id = id;
        var heroData = GameManager.HeroDic[id];
        this.height = heroData.width;
        this.width = heroData.height;
        this.createAnim(heroData.anim);
        this.upAs = heroData.upAs;
        this.downAs = heroData.downAs;
        this.isUp = false;
        this.speed = 0;
	}
	
	private createAnim(anim: string){
        var mcData = RES.getRes(anim + "_json");
        var mcTexture = RES.getRes(anim + "_png");
        var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(mcData,mcTexture);
        this.heroAni = new egret.MovieClip(mcDataFactory.generateMovieClipData(anim));
        this.heroAni.gotoAndPlay(1,-1);  
        this.addChild(this.heroAni);
        this.heroAni.anchorOffsetX = -this.width / 2;
        this.heroAni.anchorOffsetY = -this.height;
	}
	
	private setGun(id: number){
	    
	}
	
    public Update(deltaTime: number){
	    let as = -this.downAs;
        if(this.isUp){
	        as += this.upAs;
	    }
	    
	}
}

enum HeroState {
    
}
