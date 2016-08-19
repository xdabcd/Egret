class MainScene extends BaseScene {
    public constructor() {
        super()
    }

    public onEnter() {
        super.onEnter();

        this.addLayer(LayerManager.Game_Main);

        App.ViewManager.open(ViewConst.Main);
    }

    public onExit() {
        super.onExit();
    }
}