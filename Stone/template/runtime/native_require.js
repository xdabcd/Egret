
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/res/res.js",
	"libs/modules/gui/gui.js",
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
	"bin-debug/game/model/BattleProxy.js",
	"bin-debug/game/model/GridProxy.js",
	"bin-debug/game/model/game/Enemy.js",
	"bin-debug/game/model/game/GameData.js",
	"bin-debug/game/model/game/Gemstone.js",
	"bin-debug/game/model/game/GemstoneEffect.js",
	"bin-debug/game/model/game/GemstoneType.js",
	"bin-debug/game/model/game/Hero.js",
	"bin-debug/game/model/game/MoveInfo.js",
	"bin-debug/game/model/game/Vector2.js",
	"bin-debug/game/model/scene/SceneId.js",
	"bin-debug/game/utils/EffectUtils.js",
	"bin-debug/game/utils/ObjectPool.js",
	"bin-debug/game/utils/SortUtils.js",
	"bin-debug/game/view/AppMediator.js",
	"bin-debug/game/view/BattleSceneMediator.js",
	"bin-debug/game/view/GameScrMediator.js",
	"bin-debug/game/view/GridSceneMediator.js",
	"bin-debug/game/view/StartScrMediator.js",
	"bin-debug/game/view/panel/BattleScene.js",
	"bin-debug/game/view/panel/EnemyUI.js",
	"bin-debug/game/view/panel/GameScr.js",
	"bin-debug/game/view/panel/GemstoneUI.js",
	"bin-debug/game/view/panel/GridScene.js",
	"bin-debug/game/view/panel/HeroUI.js",
	"bin-debug/game/view/panel/ProjUI.js",
	"bin-debug/game/view/panel/StartScr.js",
	"bin-debug/skins/GameScrSkin.g.js",
	"bin-debug/skins/StartScrSkin.g.js",
	"bin-debug/skins/components/ButtonSkin.g.js",
	"bin-debug/skins/components/ProgressBarSkin.g.js",
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
		scaleMode: "showAll",
		contentWidth: 640,
		contentHeight: 960,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
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