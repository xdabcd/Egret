/**
 *
 * 游戏界面
 *
 */
class GameScene extends BaseScene {
    private bg: Background;
    private clouds: Clouds;
    private timer: egret.Timer;
    private gameBtns: GameButtons;

    private catData: CatData;
    private levelNr: number;
    private levelData: LevelData;
    private EDITORMODE: boolean;
    private paused: boolean;
    private tapControll: boolean;

    public preSet(cat: CatData, levelNr: number, editor: boolean) {
        this.catData = cat;
        this.levelNr = levelNr
        this.levelData = cat.levels[this.levelNr];
        this.EDITORMODE = editor || false;
        // SG_Hooks.levelStarted(Griddlers.utils.getLvlNr(this.category.nr, this.levelNr));

    }

    /**
     * 初始化
     */
    protected init() {
        super.init();
        var timer = new egret.Timer(1000);
        timer.addEventListener(egret.TimerEvent.TIMER, this.updateTimer, this);
        this.timer.start();
        this.paused = false;

        this.tapControll = PlayerDataManager.isTapControll;

        this.addChild(this.bg = new Background());
        this.addChild(this.clouds = new Clouds());
        this.addChild(this.gameBtns = new GameButtons());


        // this.board = new Griddlers.Board(this.level);
        // this.board.onBoardClear.add(this.finishedLevel,this);

        // this.toolbar = new Griddlers.ToolBar(this.board);
        // this.board.toolbar = this.toolbar;

        // this.pauseTxt = game.add.bitmapText(320,game.height*0.45,'font-blue',game.getTxt('Pause'),60);
        // this.pauseTxt.cacheAsBitmap = true;
        // this.pauseTxt._cachedSprite.anchor.setTo(0.5)
        // this.pauseTxt.alpha = 0;
        // this.pauseTxt.board = this.board;
        // game.add.tween(this.pauseTxt.scale).to({x:1.4,y:1.4},1000,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);
        // this.pauseTxt.onResize = function() {
        //     this.x = this.board.x+(this.board.scale.x*this.board.board.pxBgWidth*0.5);
        //     this.y = this.board.y+(this.board.scale.y*this.board.board.pxBgWidth*0.45);
        // };
        
        // this.winLayer = Griddlers.makeWindowLayer();
        // this.fader = Griddlers.makeFadeLayer();
    }


    private updateTimer(){

    }
}