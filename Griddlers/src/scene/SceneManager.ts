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
    public static enterScene(scene: Scene, ...args: any[]): BaseScene {
        /** 销毁当前界面 */
        if (this._curScene) {
            ObjectPool.push(this._curScene);
            DisplayUtils.removeFromParent(this._curScene);
        }

        /** 进入新界面 */
        switch (scene) {
            case Scene.Loading:
                this._curScene = ObjectPool.pop("LoadingScene");
                break;
            case Scene.Game:
                this._curScene = ObjectPool.pop("GameScene");
                break;
            case Scene.Menu:
                this._curScene = ObjectPool.pop("MenuScene");
                break;
            default:
                break;
        }
        this._curScene.preSet(args);
        this.stage.addChild(this._curScene);
        return this._curScene;
    }

    /**
     * 舞台
     */
    private static get stage(): egret.Stage {
        return StageUtils.stage;
    }

    /**
     * 当前界面
     */
    public static get curScene(): BaseScene {
        return this._curScene;
    }
}

/**
 * 界面
 */
enum Scene {
    Loading,
    Menu,
    Game
}