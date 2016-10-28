/**
 *
 * 数据管理器
 *
 */
class DataManager {
    /** 设置 */
    private static setting: any;
    /** 语言 */
    private static lang: any;
    /** 关卡类型列表 */
    private static cats: Array<CatData>;
    /** 选择的语言 */
    private static selectedLang: string;
    /** 高亮颜色 */
    public static HL_COLOR: number = 0x345C8A;

    public static init() {
        this.setting = RES.getRes("settings_json");
        this.lang = RES.getRes("languages_json");
        this.cats = RES.getRes("levels_json");
        var index = 0;
        this.cats.forEach(cat => {
            cat.active = (cat.desktop && DeviceUtils.IsPC) || (cat.mobile && !DeviceUtils.IsPC);
            cat.nr = index;
            index += 1;
        });
        this.setLang("en");
        PlayerDataManager.load();
    }

    /**
     * 获取关卡类型列表
     */
    public static getCats(): Array<CatData> {
        return this.cats;
    }

    /**
     * 获取该关卡类型数据
     */
    public static getCatData(catNr: number): CatData {
        return this.cats && this.cats[catNr];
    }

    /**
    * 获取关卡数据
    */
    public static getLevelData(catNr: number, levelNr: number): LevelData {
        var cat = this.getCatData(catNr);
        return cat && cat.levels && cat.levels[levelNr];
    }

    /**
     * 开放关卡数
     */
    public static get availableLevelsInCategory(): number {
        return this.setting.availableLevelsInCategory;
    }

    /**
     * 获取棋盘数据
     */
    public static getBoardData(type: string): BoardData {
        return this.setting.boards[type];
    }

    /**
     * 是否惩罚
     */
    public static get penalties(): boolean {
        return this.setting.penalties;
    }

    /**
     * 获取惩罚时间
     */
    public static getPenaltiesTime(index: number): number {
        var arr: Array<number> = this.setting.penaltiesTime;
        return arr[Math.min(arr.length - 1, index)];
    }

    /**
     * 获取文本
     */
    public static getTxt(txt): string {
        return this.lang[this.selectedLang][txt];
    }

    /**
     * 设置语言
     */
    public static setLang(lang) {
        this.selectedLang = lang;
    }
}