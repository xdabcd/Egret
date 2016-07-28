
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"libs/modules/tween/tween.js",
	"libs/modules/puremvc/puremvc.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/ThemeAdapter.js",
	"bin-debug/game/AppFacade.js",
	"bin-debug/game/app/AppContainer.js",
	"bin-debug/game/controller/ControllerPrepCommand.js",
	"bin-debug/game/controller/ModelPrepCommand.js",
	"bin-debug/game/controller/StartupCommand.js",
	"bin-debug/game/controller/ViewPrepCommand.js",
	"bin-debug/game/controller/commands/GameCommand.js",
	"bin-debug/game/controller/commands/SceneCommand.js",
	"bin-debug/game/model/GameProxy.js",
	"bin-debug/game/model/SceneId.js",
	"bin-debug/game/model/data/BulletData.js",
	"bin-debug/game/model/data/GameManager.js",
	"bin-debug/game/model/data/GunData.js",
	"bin-debug/game/model/data/HeroData.js",
	"bin-debug/game/utils/AnchorUtils.js",
	"bin-debug/game/utils/DisplayUtils.js",
	"bin-debug/game/utils/KeyboardUtils.js",
	"bin-debug/game/utils/StageUtils.js",
	"bin-debug/game/view/AppMediator.js",
	"bin-debug/game/view/GameScene.js",
	"bin-debug/game/view/GameSceneMediator.js",
	"bin-debug/game/utils/DeviceUtils.js",
	"bin-debug/game/utils/UtilsManager.js",
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