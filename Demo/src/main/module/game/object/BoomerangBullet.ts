/**
 *  
 * 回旋镖
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
        
        this.img.rotation += time;
        switch(this.state){
            case 0:
                this.speed -= time * 0.9;
                if(this.speed <= 600) {
                    this.state = 1;
                    this.ignoreHeroes = [];
                    this.ignoreStones = [];
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
                if(this.rect.intersectTo(this.creater.rect)) {
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
    }  
	
    protected hitHero(heroes: Array<Hero>) {
        super.hitHero(heroes);
        
        for(var i = 0;i < heroes.length;i++) {
            this.ignoreHeroes.push(heroes[i]);
        }
    }

    protected hitItems(items: Array<Item>) {
        super.hitItems(items);
        this.state = 2;
    }

    protected outScreen() {
        super.outScreen();
    }
}
