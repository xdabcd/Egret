/**
 *
 * @author 
 *
 */
class NormalBullet extends Bullet {
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,creater: Hero,moveData: MoveData): void {
        super.init(id,creater,moveData);
        super.setImg(this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
    }

    public update(time: number) {
        super.update(time);
    }
    
    protected hitHero(heroes: Array<Hero>) {
        super.hitHero(heroes);
        this.remove();
    }

    protected hitItems(items: Array<Item>) {
        super.hitItems(items);
        this.remove();
    }

    protected outScreen() {
        super.outScreen();
    }

}
