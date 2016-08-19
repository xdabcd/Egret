/**
 *
 * @author 
 *
 */
class GameManager {
    private static ui_h: number;
    private static bossDic: { [id: number]: BossData } = {};
    private static heroDic: { [id: number]: HeroData } = {};
    private static gunDic: { [id: number]: GunData } = {};
    private static bulletDic: { [id: number]: BulletData } = {};
    private static itemDic: { [id: number]: ItemData } = {};
    private static stoneDic: { [id: number]: StoneData } = {};
    private static heroPosArr: Array<number> = [];
    
    /**
     * 初始化游戏数据
     */
    public static Init() {
        var data = RES.getRes("game_json");
        this.ui_h = data["ui_h"];
        var bosses: Array<BossData> = data["bosses"];
        var heroes: Array<HeroData> = data["heroes"];
        var guns: Array<GunData> = data["guns"];
        var bullets: Array<BulletData> = data["bullets"];
        var items: Array<ItemData> = data["items"];
        var stones: Array<StoneData> = data["stones"];
        this.heroPosArr = data["posArr"];

        for(let i = 0;i < bosses.length;i++) {
            let b = bosses[i];
            this.bossDic[b.id] = b;
        }
        
        for(let i = 0;i < heroes.length;i++) {
            let h = heroes[i];
            this.heroDic[h.id] = h;
        }

        for(let i = 0;i < guns.length;i++) {
            let g = guns[i];
            this.gunDic[g.id] = g;
        }

        for(let i = 0;i < bullets.length;i++) {
            let b = bullets[i];
            this.bulletDic[b.id] = b;
        }
        
        for(let i = 0;i < items.length;i++) {
            let item = items[i];
            this.itemDic[item.id] = item;
        }
        
        for(let i = 0;i < stones.length;i++) {
            let stone = stones[i];
            this.stoneDic[stone.id] = stone;
        }
    }

    /**
     * 获取Boss数据
     */
    public static GetBossData(id: number) {
        return this.bossDic[id];
    }
    
    /**
     * 获取英雄数据
     */
    public static GetHeroData(id: number) {
        return this.heroDic[id];
    }

    /**
     * 获取枪数据
     */
    public static GetGunData(id: number) {
        return this.gunDic[id];
    }

    /**
     * 获取子弹数据
     */
    public static GetBulletData(id: number) {
        return this.bulletDic[id];
    }
    
    /**
     * 获取道具数据
     */
    public static GetItemData(id: number) {
        return this.itemDic[id];
    }
    
    /**
     * 获取石头数据
     */
    public static GetStoneData(id: number) {
        return this.stoneDic[id];
    }

    /**
     * 底部UI高度
     */
    public static get UI_H(): number {
        return this.ui_h;
    }
    
    public static GetHeroPos(idx: number): number{
        return this.heroPosArr[idx];
    }
}
