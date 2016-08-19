/**
 *
 * 冰冻弹
 *
 */
class FreezBullet extends NormalBullet{    
    protected doEffect(unit: Unit) {
        unit.Freez(0.5);
    }
}
