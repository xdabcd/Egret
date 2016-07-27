/**
 *
 * @author 
 *
 */
class GameManager {
    private static _bottomHeight: number;
    private static _heroDic: { [id: number]: HeroData } = {};
    private static _gunDic: { [id: number]: GunData } = {};
    private static _bulletDic: { [id: number]: BulletData } = {};

    /**
     * 初始化游戏数据
     */
    public static init() {
        var data = RES.getRes("game_json");
        this._bottomHeight = data["bottom_h"];
        var heroes: Array<HeroData> = data["heroes"];
        var guns: Array<GunData> = data["guns"];
        var bullets: Array<BulletData> = data["bullets"];

        for(let i = 0;i < heroes.length;i++) {
            let h = heroes[i];
            this._heroDic[h.id] = h;
        }

        for(let i = 0;i < guns.length;i++) {
            let g = guns[i];
            this._gunDic[g.id] = g;
        }

        for(let i = 0;i < bullets.length;i++) {
            let b = bullets[i];
            this._bulletDic[b.id] = b;
        }
    }
    
    /**
     * 获取英雄数据
     */ 
    public static getHeroData(id: number) {
        return this._heroDic[id];
    }
    
    /**
     * 获取枪数据
     */
    public static getGunData(id: number) {
        return this._gunDic[id];
    }
    
    /**
     * 获取子弹数据
     */
    public static getBulletData(id: number) {
        return this._bulletDic[id];
    }
    
    /**
     * 底部UI高度
     */ 
    public static get bottomHeight(): number{
        return this._bottomHeight;
    }
}
