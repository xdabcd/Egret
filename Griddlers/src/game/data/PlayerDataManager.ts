/**
 *
 * 玩家数据管理器
 *
 */
class PlayerDataManager {
    private static playerData: PlayerData;
    private static soundBtnList: Array<Button> = [];

    public static save() {
        egret.localStorage.setItem('gmdatastring', JSON.stringify(this.playerData.getData()));
    }

    public static load() {
        var item = egret.localStorage.getItem('gmdatastring');
        this.playerData = new PlayerData();
        if (item) {
            this.playerData.setData(JSON.parse(item));
        }
    }

    public static passLevel(cat: CatData, levelNr: number, time: number): number {
        console.log("PASS LEVEL: " + cat.nr + "x" + levelNr);

        var current = this.playerData.getStar(cat.nr, levelNr);
        var star = time < cat.starsReq[0] ? 3 : time < cat.starsReq[1] ? 2 : 1;

        if (star > current) {
            this.playerData.setStar(cat.nr, levelNr, star);
            this.save();
        }
        return star;
    }

    public static setControll(tapControll: boolean) {
        this.playerData.tapControll = tapControll;
        this.save();
    }

    public static get isTapControll(): boolean {
        return this.playerData.tapControll;
    }

    public static setMute(mute: boolean) {
        this.playerData.mute = mute;
        this.soundBtnList.forEach(btn => {
            btn.setSprite(mute ? "spritesheet.griddlers-button-soundOff" : "spritesheet.griddlers-button-soundOn");
        });
        if(mute){
            SoundManager.stopMusic();
        }else{
            SoundManager.playMusic();
        }
        this.save();
    }

    public static get isMute(): boolean {
        return this.playerData.mute;
    }

    public static registerSoundBtn(btn: Button) {
        if (this.soundBtnList.indexOf(btn) < 0) {
            this.soundBtnList.push(btn);
            this.setMute(this.playerData.mute);
        }
    }

    public static getAllStar(): number {
        return this.playerData.getAllStar();
    }

    public static getStarFromCategory(catNr: number): number {
        return this.playerData.getStarFromCatNr(catNr);
    }

    public static getAllAvailableStarFromCategory(cat: CatData) {
        return cat.levels.length * 3;
    }

    public static getCategoryInfo(cat: CatData): PlayerCatData {
        var allStar: number = this.getAllStar();
        var star: number = this.getStarFromCategory(cat.nr);
        var maxStar: number = this.getAllAvailableStarFromCategory(cat);
        var data = new PlayerCatData;
        data.star = star;
        data.maxAvailableStar = maxStar;
        data.unlock = cat.unlock <= allStar;
        data.unlockProgress = allStar / cat.unlock;
        data.progress = star / maxStar;
        return data;
    }

    public static getNumberOfPassedLevels(catNr: number): number {
        if (this.playerData.stars && this.playerData.stars[catNr]) {
            return this.playerData.stars[catNr].length;
        } else {
            return 0;
        }
    }

    public static getLevelInfo(catNr: number, levelNr: number) {
        var cat = DataManager.getCatData(catNr);
        var level = DataManager.getLevelData(catNr, levelNr);
        if (!level) return null;

        var star = this.playerData.getStar(catNr, levelNr);
        var numberOfPassed = this.getNumberOfPassedLevels(catNr) + DataManager.availableLevelsInCategory;
        var data = new PlayerLevelData();
        data.icon = cat.name + '-' + levelNr;
        data.star = star;
        data.unlocked = levelNr < numberOfPassed;
        return data;
    }
}