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
        
        var hitHeroes: Array<Hero> = this.gameController.CheckHitHero(this);
        var hitItem: Boolean = this.gameController.CheckHitItem(this);
        var outScreen: Boolean = this.gameController.CheckOutScreen(this);
        if(hitHeroes.length > 0 || hitItem || outScreen) {
            this.remove();
        }
    }

}
