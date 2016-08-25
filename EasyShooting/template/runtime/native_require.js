
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"bin-debug/EgretExpandUtils.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/Utils/AnchorUtils.js",
	"bin-debug/Utils/ArrayUtils.js",
	"bin-debug/Utils/DateUtils.js",
	"bin-debug/Utils/DebugUtils.js",
	"bin-debug/Utils/DeviceUtils.js",
	"bin-debug/Utils/DisplayUtils.js",
	"bin-debug/Utils/EffectUtils.js",
	"bin-debug/Utils/FrameExecutor.js",
	"bin-debug/Utils/KeyboardUtils.js",
	"bin-debug/Utils/MathUtils.js",
	"bin-debug/Utils/ObjectPool.js",
	"bin-debug/Utils/RandomUtils.js",
	"bin-debug/Utils/Rocker.js",
	"bin-debug/Utils/ShockUtils.js",
	"bin-debug/Utils/SortUtils.js",
	"bin-debug/Utils/StageUtils.js",
	"bin-debug/Utils/StringUtils.js",
	"bin-debug/Utils/TextFlowMaker.js",
	"bin-debug/Utils/TimerManager.js",
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