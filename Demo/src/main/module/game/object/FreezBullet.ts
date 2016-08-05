/**
 *
 * 冰冻弹
 *
 */
class FreezBullet extends NormalBullet{    
    protected doEffect(hero: Hero) {
        hero.Freez(0.5);
    }
}
