/**
 *
 * @author 
 *
 */
class WaveBullet extends Bullet {
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
    
    protected hitHero(heroes: Array<Hero>) {
        super.hitHero(heroes);

        for(var i = 0;i < heroes.length;i++) {
            this.ignoreHeroes.push(heroes[i]);
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
        return new Rect(this.x, this.y, width, height, this.rotation);
    }
}
