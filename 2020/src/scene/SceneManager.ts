/**
 *
 * 场景管理器
 *
 */
class SceneManager {
    /** 当前界面 */
    private static _curScene: BaseScene;

    private static _flag: boolean = true;

    /**
     * 进入界面
     */
    public static enterScene(scene: Scene, ...args: any[]): BaseScene {
        if (!this._flag) return;
        var oldScene = this._curScene;
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
        this._flag = false;
        if (oldScene) {
            egret.Tween.get(oldScene).to({ alpha: 0.3 }, 500).call(() => {
                ObjectPool.push(oldScene);
                DisplayUtils.removeFromParent(oldScene);
                this._curScene.alpha = 0.3;
                this.stage.addChild(this._curScene);
                egret.Tween.get(this._curScene).to({ alpha: 1 }, 500).call(() => {
                    this._flag = true;
                });
            })
        } else {
            this._curScene.alpha = 1;
            this.stage.addChild(this._curScene);
            this._flag = true;
        }

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