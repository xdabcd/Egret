/**
 *
 * @author 
 *
 */
class BoomerangBullet extends Bullet{
    
    /** 0: 飞出状态 1: 返回状态 2: 落下状态 */
    private state: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }
    
    public init(id: number,creater: Hero,moveData: MoveData): void {
        super.init(id , creater, moveData);
        super.setImg(this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
        this.state = 0;
    }
    
    public update(time: number) {
        super.update(time);
        switch(this.state){
            case 0:
                this.speed -= time * 0.9;
                if(this.speed <= 700) {
                    this.state = 1;
                    this.ignoreHeroes = [];
                }
                break;
            case 1:
                this.speed += time * 0.9;
                var r = App.MathUtils.getRadian2(this.x,this.y,this.creater.x,this.creater.y);
                if(this.scaleX == -1) {
                    r = App.MathUtils.getRadian2(this.creater.x,this.creater.y,this.x,this.y);
                }
                var a = App.MathUtils.getAngle(r);
                this.rotation = a;
                if(this.rect.intersects(this.creater.rect)) {
                    this.remove();
                    this.creater.GunReturn();
                }
                break;
            case 2:
                this.speed += time;
                var targetR = 90;
                var curR = this.rotation;
                if(this.rotation < 0) {
                    curR += 360;
                }
                if(this.scaleX == -1) {
                    targetR = -90;
                    if(curR > 180) {
                        targetR = 270;
                    }
                }
                if(curR > targetR) {
                    this.rotation = Math.max(targetR,curR - time / 5);
                } else {
                    this.rotation = Math.min(targetR,curR + time / 5);
                }
                break;
        }

        var hitHeroes: Array<Hero> = this.gameController.CheckHitHero(this);
        var hitItem: Boolean = this.gameController.CheckHitItem(this);
        var outScreen: Boolean = this.gameController.CheckOutScreen(this);
       
        this.img.rotation += time;
        if(hitItem) {
            this.state = 2;
        } else if(outScreen) {
            this.remove();
        }
        if(hitHeroes.length > 0) {
            for(var i = 0;i < hitHeroes.length;i++) {
                this.ignoreHeroes.push(hitHeroes[i]);
            }
        }
    }  
	
}
