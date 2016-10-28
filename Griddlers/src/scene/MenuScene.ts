/**
 *
 * 菜单界面
 *
 */
class MenuScene extends BaseScene {
    private bg: Background;
    private clouds: Clouds;
    private levels: LevelsGroup;
    private cats: CatsGroup;
    private topGroup: TopGroup;
    private logo: Logo;
    private btnGroup: ButtonGroup;
    private fader: Fader;

    private view: number;
    private lastCat: CatData;
    private lastLevelNr: number;

    public preSet(view: number, catData: CatData, levelnr: number) {
        this.view = view || 0;
        this.lastCat = catData || null;
        this.lastLevelNr = levelnr || 0;
    }

    /**
     * 初始化
     */
    protected init() {
        super.init();
        if (!PlayerDataManager.isMute && !SoundManager.isPlayMusic) {
            SoundManager.playMusic();
        }

        this.addChild(this.bg = new Background());
        this.addChild(this.clouds = new Clouds());
        this.addChild(this.levels = new LevelsGroup());
        this.addChild(this.cats = new CatsGroup());
        this.addChild(this.topGroup = new TopGroup());
        this.addChild(this.logo = new Logo());
        this.addChild(this.btnGroup = new ButtonGroup());
        this.addChild(this.fader = new Fader());

        this.topGroup.setBack(() => this.clickBackButton());
        this.btnGroup.setPlay(() => this.goToCategories(false));
        this.cats.setCatTap(catData => this.goToLevels(catData, false, null));

        if (this.view == 1 || this.lastLevelNr == -1) {
            this.initCategoryView();
        } else if (this.view == 2) {
            this.initLevelView(this.lastCat, this.lastLevelNr);
        }
    }

    public lockInputFor(duration: number) {
        this.fader.touchEnabled = true;
        TimerManager.doTimer(duration, 1, () => {
            this.fader.touchEnabled = false;
        }, this);
    }

    public goToCategories(immediately: boolean) {
        this.view = 1;

        this.logo.hide(immediately);
        this.btnGroup.hide(immediately);
        this.cats.show(immediately);
        this.topGroup.show(immediately);

        if (!immediately) {
            this.lockInputFor(1000)
            SoundManager.playEffect("whoosh_mp3");
        };
    }

    public goToBackLogoScreen(immediately: boolean) {
        this.view = 0;

        this.logo.show(immediately);
        this.btnGroup.show(immediately);
        this.cats.hideRight(immediately);
        this.topGroup.hide(immediately);

        if (!immediately) {
            this.lockInputFor(1000)
            SoundManager.playEffect("whoosh_mp3");
        };
    }

    public goToLevels(catData: CatData, immediately: boolean, lastLevel: number) {
        this.view = 2;

        this.cats.hideLeft(immediately);
        this.levels.show(catData, immediately, lastLevel);

        if (!immediately) {
            this.lockInputFor(1000)
            SoundManager.playEffect("whoosh_mp3");
        };
    }

    public goBackToCategories(immediately: boolean) {
        this.view = 1;
        this.cats.show(immediately);
        this.levels.hide(immediately);

        if (!immediately) {
            this.lockInputFor(1000)
            SoundManager.playEffect("whoosh_mp3");
        };
    }

    public clickBackButton() {
        if (this.view == 1) {
            this.goToBackLogoScreen(false);
        } else if (this.view == 2) {
            this.goBackToCategories(false);
        }
    }

    public startLevel(catData: CatData, nr: number) {
        // this.fader.goToState('Game', cat, nr);
        //TODO
    }

    public initLevelView(catData: CatData, lvlNr: number) {
        this.goToCategories(true);
        this.goToLevels(catData, true, lvlNr);
    }

    public initCategoryView() {
        this.goToCategories(true);
    }
}