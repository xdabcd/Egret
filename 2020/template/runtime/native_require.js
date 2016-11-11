
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"bin-debug/EgretExpendManager.js",
	"bin-debug/Main.js",
	"bin-debug/game/Block.js",
	"bin-debug/game/BtnList.js",
	"bin-debug/game/Bubble.js",
	"bin-debug/game/Burst.js",
	"bin-debug/game/Button.js",
	"bin-debug/game/ForbidHint.js",
	"bin-debug/scene/BaseScene.js",
	"bin-debug/game/GameUI.js",
	"bin-debug/game/Hand.js",
	"bin-debug/game/Label.js",
	"bin-debug/game/Orbit.js",
	"bin-debug/game/PopHint.js",
	"bin-debug/game/Praise.js",
	"bin-debug/game/RecParticle.js",
	"bin-debug/game/TutorialHand.js",
	"bin-debug/game/data/DataManager.js",
	"bin-debug/game/data/EffectManager.js",
	"bin-debug/game/data/PlayerData.js",
	"bin-debug/game/data/PlayerDataManager.js",
	"bin-debug/game/data/SoundManager.js",
	"bin-debug/scene/EndScene.js",
	"bin-debug/scene/GameScene.js",
	"bin-debug/scene/ItemScene.js",
	"bin-debug/scene/LoadingScene.js",
	"bin-debug/scene/MenuScene.js",
	"bin-debug/scene/PauseScene.js",
	"bin-debug/scene/SceneManager.js",
	"bin-debug/utils/AnchorUtils.js",
	"bin-debug/utils/ArrayUtils.js",
	"bin-debug/utils/DateUtils.js",
	"bin-debug/utils/DebugUtils.js",
	"bin-debug/utils/DeviceUtils.js",
	"bin-debug/utils/DisplayUtils.js",
	"bin-debug/utils/DrawUtils.js",
	"bin-debug/utils/EffectUtils.js",
	"bin-debug/utils/FrameExecutor.js",
	"bin-debug/utils/KeyboardUtils.js",
	"bin-debug/utils/MathUtils.js",
	"bin-debug/utils/MazeUtils.js",
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
		frameRate: 60,
		scaleMode: "fixedHeight",
		contentWidth: 640,
		contentHeight: 1136,
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