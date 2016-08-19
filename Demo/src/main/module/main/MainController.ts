class MainController extends BaseController {

    private mainView: MainView;

    public constructor() {
        super()

        this.mainView = new MainView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Main, this.mainView);

        this.registerFunc(MainFuncConst.ENTER_GAME, this.enterGame, this);
        this.registerFunc(MainFuncConst.LEAVE, this.leave, this);
        this.registerFunc(MainFuncConst.MENU, this.enterMenu, this);
    }

    public enterGame() {
        App.ControllerManager.register(ControllerConst.Game,new GameController());
        App.SceneManager.runScene(SceneConst.Game);
    }

    public leave() {

    }

    public enterMenu() {

    }

}