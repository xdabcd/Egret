/**
 *  
 * 回旋镖
 *
 */
class BoomerangBullet extends HeroBullet{
    
    /** 0: 飞出状态 1: 返回状态 2: 落下状态 */
    private state: number;
    private targetX: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }
    
    public init(id: number,creater: Hero,moveData: MoveData): void {
        super.init(id , creater, moveData);
        super.setImg(this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
        this.targetX = this.gameController.GetPerX(0.5 + 0.45 * this.scaleX);

        this.state = 0;
    }
    
    public update(time: number) {
        super.update(time);
        
        this.img.rotation += time;
        switch(this.state){
            case 0:
                this.speed -= time * 0.9;
                if(this.scaleX > 0 && this.x >= this.targetX || this.scaleX < 0 && this.x <= this.targetX) {
                    this.state = 1;
                    this.ignoreUnits = [];
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
                var rect = new Rect(this.creater.x, this.creater.y, this.creater.width, this.creater.height, 0);
                if(this.rect.intersectTo(rect)) {
                    this.remove();
                    this.createHero.GunReturn();
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
	
    protected hitUnit(units: Array<Unit>) {
        super.hitUnit(units);

        for(var i = 0;i < units.length;i++) {
            this.ignoreUnits.push(units[i]);
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
