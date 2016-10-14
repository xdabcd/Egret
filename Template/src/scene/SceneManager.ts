/**
 *
 * 场景管理器
 *
 */
class SceneManager {
    /** 当前界面 */
    private static _curScene: BaseScene;

    /**
     * 进入界面
     */
    public static enterScene(scene: Scene): BaseScene {
        /** 销毁当前界面 */
        if (this._curScene) {
            this._curScene.destroy();
        }

        /** 进入新界面 */
        switch (scene) {
            case Scene.Loading:
                this._curScene = new LoadingScene();
                break;
            case Scene.Game:
                this._curScene = new GameScene();
                break;
            default:
                break;
        }
        this.stage.addChild(this._curScene);
        return this._curScene;
    }

    /**
     * 舞台
     */
    private static get stage(): egret.Stage {
        return StageUtils.stage;
    }
}

/**
 * 界面
 */
enum Scene {
    Loading,
    Game
}