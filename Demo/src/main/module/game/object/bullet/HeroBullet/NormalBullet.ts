/**
 *
 * @author 
 *
 */
class NormalBullet extends HeroBullet {
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
    
    protected hitUnit(units: Array<Unit>) {
        super.hitUnit(units);

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
