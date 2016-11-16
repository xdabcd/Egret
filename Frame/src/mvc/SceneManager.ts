/**
 *
 * 场景管理器
 *
 */
class SceneManager {
    /** 所有界面 */
    private _scenes: { [id: number]: BaseScene };
    /** 开启中的界面 */
    private _opens: Array<SceneID>;

    /**
     * 构造函数
     */
    public constructor() {
        this._opens = [];
        this._scenes = {};
    }

    /**
     * 打开界面
     */
    public open(id: SceneID, ...param: any[]): BaseScene {
        var scene = this._scenes[id];
        if (!scene) {
            switch (id) {
                case SceneID.Loading:
                    scene = ObjectPool.pop("LoadingScene");
                    break;
                case SceneID.Menu:
                    scene = ObjectPool.pop("MenuScene");
                    break;
                case SceneID.Game:
                    scene = ObjectPool.pop("GameScene");
                    break;
                default:
                    Log.trace("Scene_" + id + "不存在");
                    return;
            }
            this._scenes[id] = scene;
            StageUtils.stage.addChild(scene);
        }
        scene.open(param);
        if (this._opens.indexOf(id) < 0) {
            this._opens.push(id);
        }
        return scene;
    }

    /**
     * 关闭界面
     */
    public close(id: SceneID, ...param: any[]) {
        if (this._opens.indexOf(id) < 0) {
            return;
        }
        var scene = this._scenes[id];
        if (!scene) {
            return;
        }
        ArrayUtils.remove(this._opens, id);
        scene.close(param);
    }

    /**
     * 获取界面
     */
    public getScene(id: SceneID): BaseScene {
        return this._scenes[id];
    }

    /**
     * 关闭所有开启中的界面
     */
    public closeAll() {
        while (this._opens.length) {
            this.close(this._opens[0]);
        }
    }

    private static _instance: SceneManager;
    public static get instance(): SceneManager {
        return this._instance || (this._instance = new SceneManager);
    }
}

/**
 * 界面
 */
enum SceneID {
    Loading,
    Menu,
    Game
}