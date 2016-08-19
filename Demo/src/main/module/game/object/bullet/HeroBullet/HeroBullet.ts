/**
 *
 * @author 
 *
 */
class HeroBullet extends Bullet{
    public update(time: number) {
        super.update(time);
        var hitItems: Array<Item> = this.gameController.CheckHitItem(this);
        var hitStones: Array<Stone> = this.gameController.CheckHitStone(this);
        if(hitItems.length > 0) {
            this.hitItems(hitItems);
        }
        if(this.hitStones.length > 0) {
            this.hitStones(hitStones);
        }
    }
    
    protected hitItems(items: Array<Item>) {
        for(var i = 0;i < items.length;i++) {
            var item = items[i];
            item.ToHero(this.createHero);
        }
    }
    
    protected hitStones(stones: Array<Stone>) {
        for(var i = 0;i < stones.length;i++) {
            var stone = stones[i];
            if(!this.checkIgnoreStone(stone)) {
                if(this.priority == 1) {
                    this.remove();
                }
                var direction = App.MathUtils.getAngle(App.MathUtils.getRadian2(this.x,this.y,stone.x,stone.y));
                stone.Hit(Math.sqrt(this.damage) * 50,direction);
                this.ignoreStones.push(stone);
            }
        }
    }
    
    private checkIgnoreStone(stone: Stone): Boolean {
        return this.ignoreStones.indexOf(stone) >= 0;
    }
    
    protected get createHero(): Hero{
        return this.creater as Hero;
    }
}
