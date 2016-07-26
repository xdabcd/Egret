/**
 *
 * @author 
 *
 */
class GameManager {
	
    public static Bottom_H: number;
    public static HeroDic: { [id: number]: HeroData } = {};
    public static GunDic: { [id: number]: GunData } = {};
    public static BulletDic: { [id: number]: BulletData } = {};
    
    /**
     * 初始化游戏数据
     */ 
    public static Init(){
        var data = RES.getRes("game_json");
        GameManager.Bottom_H = data["bottom_h"];
        var heroes: Array<HeroData> = data["heroes"];
        var guns: Array<GunData> = data["guns"];
        var bullets: Array<BulletData> = data["bullets"];
        
        for(let i = 0; i < heroes.length; i++){
            let h = heroes[i];
            GameManager.HeroDic[h.id] = h;
        }
	
        for(let i = 0;i < guns.length;i++) {
            let g = guns[i];
            GameManager.GunDic[g.id] = g;
        }
        
        for(let i = 0;i < bullets.length;i++) {
            let b = bullets[i];
            GameManager.BulletDic[b.id] = b;
        }
	}
}
