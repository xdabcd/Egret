
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"libs/modules/p2Physics/p2Physics.js",
	"bin-debug/EgretExpandUtils.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/base/BaseView.js",
	"bin-debug/game/GameScene.js",
	"bin-debug/SceneManager.js",
	"bin-debug/game/GameDataManager.js",
	"bin-debug/game/GameMessageCenter.js",
	"bin-debug/game/GameUIView.js",
	"bin-debug/game/GameView.js",
	"bin-debug/game/data/BossData.js",
	"bin-debug/game/data/UnitData.js",
	"bin-debug/game/data/BulletData.js",
	"bin-debug/game/data/GunData.js",
	"bin-debug/game/data/HeroData.js",
	"bin-debug/game/data/ItemData.js",
	"bin-debug/game/data/MoveData.js",
	"bin-debug/game/data/Rect.js",
	"bin-debug/game/data/StoneData.js",
	"bin-debug/game/obj/Unit.js",
	"bin-debug/game/obj/Bullet.js",
	"bin-debug/game/obj/Hero.js",
	"bin-debug/p2DebugDraw.js",
	"bin-debug/utils/AnchorUtils.js",
	"bin-debug/utils/ArrayUtils.js",
	"bin-debug/utils/DateUtils.js",
	"bin-debug/utils/DebugUtils.js",
	"bin-debug/utils/DeviceUtils.js",
	"bin-debug/utils/DisplayUtils.js",
	"bin-debug/utils/EffectUtils.js",
	"bin-debug/utils/FrameExecutor.js",
	"bin-debug/utils/KeyboardUtils.js",
	"bin-debug/utils/MathUtils.js",
	"bin-debug/utils/ObjectPool.js",
	"bin-debug/utils/RandomUtils.js",
	"bin-debug/utils/Rocker.js",
	"bin-debug/utils/ShockUtils.js",
	"bin-debug/utils/SortUtils.js",
	"bin-debug/utils/StageUtils.js",
	"bin-debug/utils/StringUtils.js",
	"bin-debug/utils/TextFlowMaker.js",
	"bin-debug/utils/TimerManager.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "fixedWidth",
		contentWidth: 1334,
		contentHeight: 750,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};