/**
 *
 * 游戏场景
 *
 */
class GameScene extends BaseView {

    /** 游戏 */
    private _gameView: GameView;
    /** ui */
    private _uiView: GameUIView;

    /** 英雄 */
    private _hero: Hero;
    /** 英雄子弹列表 */
    private _heroBullets: Array<Bullet>;
    /** 敌人列表 */
    private _enemies: Array<Enemy>;
    /** 敌人子弹列表 */
    private _enemyBullets: Array<Bullet>;

    /** 跳跃开关 */
    private _jumpFlag: boolean = false;

    /** 物理世界与真实世界的转换因子 */
    private _factor: number = 30;
    /** 世界 */
    private _world: p2.World;
    /** 重力 */
    private _gravity: number = 20;
    /** 物理碰撞框 */
    private _debugDraw: p2DebugDraw;
    /** 天花板 */
    private _topBody: p2.Body;
    /** 地板 */
    private _bottomBody: p2.Body;

	/**
	 * 处理消息
	 */
    public handleMessage(message: GameMessage, data: any) {
        switch (message) {
            case GameMessage.CreateBullet:
                this.createBullet(data.id, data.creater, data.pos, data.rotation);
                break;
            case GameMessage.RemoveBullet:
                this.removeBullet(data.bullet);
                break;
            default:
                break;
        }
    }

	/**
	 * 初始化
	 */
    protected init() {
        super.init();

        GameMessageCenter.register(this);
        GameDataManager.Init();

        this._gameView = new GameView;
        this.addChild(this._gameView);

        this._uiView = new GameUIView;
        this.addChild(this._uiView);

        this._gameView.x = 0;
        this._uiView.y = StageUtils.stageH;
        AnchorUtils.setAnchorY(this._uiView, 1);

        this.initWorld();
        this.initLand(0, StageUtils.stageH - GameDataManager.UI_H);
        this.showDebugDraw();

        this.reset();
        this.addHero(1);
        this.addEnemy(1);

        this.initBtns();
    }

	/**
	 * 更新
	 */
    protected update(time: number) {
        super.update(time);

        var t = time / 1000;

        /** 世界更新，更新位置 */
        this._world.step(t);

        var self = this;
        this._world.bodies.forEach(function (b: p2.Body) {
            if (b.displays != null && b.displays.length > 0) {
                var pos = self.convertTruePoint(b.position);
                b.displays[0].x = pos[0];
                b.displays[0].y = pos[1];
                b.displays[0].rotation = b.angle * 180 / Math.PI;
            }
        });

        /** 绘制物理世界 */
        this._debugDraw.drawDebug();

        /** 跳 */
        if (this._jumpFlag) {
            let body = this._hero.body;
            body.applyForce([0, -100], this._bottomBody.position);
        }

        /** 更新所有单位 */
        var func = (unit: Unit) => {
            unit.update(t);
            var ex = 200;
            if (unit.x < -unit.width / 2 - ex || unit.x > StageUtils.stageW + unit.width / 2 + ex ||
                unit.y < -unit.height / 2 - ex || unit.y > StageUtils.stageH + unit.height / 2 + ex) {
                unit.remove();
            }
        }
        this._hero.update(t);
        this._heroBullets.forEach(func);
        this._enemies.forEach(func);
        this._enemyBullets.forEach(func);
    }

	/**
	 * 重置数据
	 */
    private reset() {
        this._hero = null;
        this._heroBullets = [];
        this._enemies = [];
        this._enemyBullets = [];
    }

    /**
     * 添加英雄
     */
    private addHero(id: number) {
        var hero: Hero = ObjectPool.pop("Hero");
        hero.init(id, Side.Hero);
        var pos: egret.Point = this.getHeroPos(0);
        hero.x = pos.x;
        hero.y = pos.y;
        this._gameView.addHero(hero);
        this._hero = hero;

        this.createBody(hero);
        this._world.addBody(hero.body);
        hero.body.fixedRotation = true;
        hero.body.fixedX = true;
    }

    /**
     * 添加敌人
     */
    private addEnemy(id: number) {
        var enemy: Enemy = ObjectPool.pop("Enemy");
        enemy.init(id, Side.Enemy);
        var pos: egret.Point = this.getHeroPos(3);
        enemy.x = pos.x;
        enemy.y = pos.y;
        this._gameView.addEnemy(enemy);
        this._enemies.push(enemy);

        this.createBody(enemy);
        this._world.addBody(enemy.body);
        enemy.body.fixedRotation = true;
        enemy.body.fixedX = true;
    }

    /**
     * 添加子弹
     */
    private createBullet(id: number, creater: Unit, pos: egret.Point, rotation: number) {
        var data: BulletData = GameDataManager.GetBulletData(id);
        var bullet: Bullet = ObjectPool.pop(data.name);
        bullet.init(id, creater, rotation);
        bullet.x = pos.x;
        bullet.y = pos.y;
        this._gameView.addBullet(bullet);
        switch (creater.side) {
            case Side.Hero:
                this._heroBullets.push(bullet);
                break;
            case Side.Enemy:
                this._enemyBullets.push(bullet);
                break;
            default:
                break;
        }

        this.createBody(bullet, true);
        this._world.addBody(bullet.body);
        bullet.body.velocity = [this.convertPhy(data.speed), 0];
    }

    /**
     * 移除子弹
     */
    private removeBullet(bullet: Bullet) {
        switch (bullet.side) {
            case Side.Hero:
                ArrayUtils.remove(this._heroBullets, bullet);
                break;
            case Side.Enemy:
                ArrayUtils.remove(this._enemyBullets, bullet);
                break;
            default:
                break;
        }
        bullet.destory();

        this._world.removeBody(bullet.body);
    }

    /**
     * 获取英雄位置
     */
    private getHeroPos(idx: number): egret.Point {
        return new egret.Point(StageUtils.stageW * GameDataManager.GetHeroPos(idx), StageUtils.stageH * 0.3);
    }

    /**
     * 初始化按钮
     */
    private initBtns() {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchCallBack, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchCallBack, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchCallBack, this);
        this.touchEnabled = true;

        KeyboardUtils.addKeyUp(this.onKeyUp, this);
        KeyboardUtils.addKeyDown(this.onKeyDown, this);
    }

    /**
     * 触碰回调
     */
    private touchCallBack(evt: egret.TouchEvent) {
        var x = evt.stageX;
        var w = StageUtils.stageW;
        if (x > 0 && x < w / 3) {
            /** 跳 */
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                this._jumpFlag = true;
            } else if (evt.type == egret.TouchEvent.TOUCH_END) {
                this._jumpFlag = false;
            }
        } else if (x > w * 2 / 3 && x < w * 5 / 6) {
            /** 闪避 */
        } else if (x > w * 5 / 6 && x < w) {
            /** 射击 */
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                this._hero.shoot();
            }
        }
    }

    /**
     * 按下按键
     */
    private onKeyDown(keyCode: number) {
        switch (keyCode) {
            case Keyboard.W:
                /** 跳 */
                this._jumpFlag = true;
                break;
            case Keyboard.I:
                /** 射击 */
                this._hero.shoot();
                break;
            case Keyboard.U:
                /** 闪避 */
                break;
            case Keyboard.SPACE:
                TimerManager.setTimeScale(0.1);
                break;
            case Keyboard.J:
                TimerManager.setTimeScale(1);
                break;
            default:
                break;
        }
    }

    /**
     * 按键回弹
     */
    private onKeyUp(keyCode: number) {
        switch (keyCode) {
            case Keyboard.W:
                /** 跳 */
                this._jumpFlag = false;
                break;
            case Keyboard.I:
                /** 射击 */
                break;
            case Keyboard.U:
                /** 闪避 */
                break;
            default:
                break;
        }
    }

    /** ---------物理引擎---------- */

    /**
     * 碰撞处理
     */
    private contact(evt) {
        var bodyA: p2.Body = evt.bodyA;
        var bodyB: p2.Body = evt.bodyB;
        var shapeA: p2.Shape = evt.shapeA;
        var shapeB: p2.Shape = evt.shapeB;
        /** 触碰地面不处理 */
        if (shapeA.type == p2.Shape.PLANE || shapeB.type == p2.Shape.PLANE) {
            return;
        }

        var unitA: Unit = bodyA.displays[0] as Unit;
        var unitB: Unit = bodyB.displays[0] as Unit;
        /** 相同阵营不处理 */
        if (unitA.side == unitB.side) {
            return;
        }

        /** 确定子弹,击中处理由子弹进行 */
        var bullet: Bullet = null;
        if ("Bullet".indexOf(unitA.className) >= 0) {
            bullet = unitA as Bullet;
            bullet.hit(unitB);
        } else if ("Bullet".indexOf(unitB.className) >= 0) {
            bullet = unitB as Bullet;
            bullet.hit(unitA);
        }
    }

    /**
	 * 初始化世界
	 */
    private initWorld() {
        this._world = new p2.World;
        this._world.sleepMode = p2.World.NO_SLEEPING;
        this._world.gravity = [0, this._gravity];

        this._world.on("beginContact", this.contact);
    }

	/**
	 * 初始化天花板和地面
	 */
    private initLand(x: number, y: number): void {
        this._topBody = new p2.Body();
        this._topBody.addShape(new p2.Plane);
        this._topBody.type = p2.Body.STATIC;
        this._topBody.position = this.convertPhyPoint([0, 0]);
        this._topBody.angle = 0;
        this._world.addBody(this._topBody);

        this._bottomBody = new p2.Body();
        this._bottomBody.addShape(new p2.Plane);
        this._bottomBody.type = p2.Body.STATIC;
        this._bottomBody.position = this.convertPhyPoint([x, y]);
        this._bottomBody.angle = Math.PI;
        this._world.addBody(this._bottomBody);
    }

    /**
     * 创建物理对象
     */
    private createBody(unit: Unit, sensor: boolean = false) {
        var body = new p2.Body({ mass: unit.mass });
        var box: p2.Box = new p2.Box({ width: this.convertPhy(unit.w), height: this.convertPhy(unit.h) });
        box.sensor = sensor;
        body.addShape(box);
        body.position = this.convertPhyPoint([unit.x, unit.y]);
        body.displays = [unit];
        unit.body = body;
    }

	/**
	 * 显示物理碰撞框
	 */
    private showDebugDraw(): void {
        var sprite: egret.Sprite = new egret.Sprite();
        this.addChild(sprite);
        this._debugDraw = new p2DebugDraw(this._world, sprite);
    }

    /**
     * 转换真实数值
     */
    private convertTrue(value: number): number {
        return value * this._factor;
    }

    /**
     * 转换物理数值
     */
    private convertPhy(value: number): number {
        return value / this._factor;
    }

    /**
     * 转换真实点
     */
    private convertTruePoint(point: Array<number>): Array<number> {
        return [this.convertTrue(point[0]), this.convertTrue(point[1])];
    }

    /**
     * 转换物理点
     */
    private convertPhyPoint(point: Array<number>): Array<number> {
        return [this.convertPhy(point[0]), this.convertPhy(point[1])];
    }
}
