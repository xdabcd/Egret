/**
 *
 * @author 
 *
 */
class WaveBullet extends HeroBullet {
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,creater: Hero,moveData: MoveData): void {
        super.init(id,creater,moveData);
        super.setImg(this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
        
        this.img.scaleX = this.img.scaleY = 0.3;
    }

    public update(time: number) {
        super.update(time);

        if(this.img.scaleX < 1){
            this.img.scaleX = this.img.scaleY = Math.min(time / 1000 + this.img.scaleX, 1);
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
    }

    protected outScreen() {
        super.outScreen();
    }
    
    public get rect(): Rect {
        var width = this.width * this.img.scaleX;
        var height = this.height * this.img.scaleY;
        return new Rect(this.x + width * 0.4 * this.scaleX, this.y, width * 0.2, height, this.rotation);
    }
}
