/**
 *
 * 游戏界面
 *
 */
class GameScene extends BaseScene {

    /** 状态 1:作图 2:解题 3:结束*/
    private _state: number;
    /** 数据 */
    private _dataArr: Array<number>;
    /** 格子个数 */
    private _size: number = 10;
    /** 格子大小 */
    private _gridSize: number = 50;
    /** 定时器 */
    private _timer: egret.Timer;

    /** 格子 */
    private _gridContainer: egret.DisplayObjectContainer;
    /** 格子列表 */
    private _grids: Array<Grid>;
    /** 数字 */
    private _numberContainer: egret.DisplayObjectContainer;
    /** 数字列表1 */
    private _numbers1: Array<Array<egret.TextField>>;
    /** 数字列表2 */
    private _numbers2: Array<Array<egret.TextField>>;
    /** 开始按钮 */
    private _startBtn: Button;
    /** 倒计时 */
    private _timerText: egret.TextField;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.initGrids();

        this._startBtn = new Button;
        this._startBtn.init("Start", 200, 60);
        this._startBtn.x = 250;
        this._startBtn.y = 120;
        this.addChild(this._startBtn);
        this._startBtn.touchEnabled = true;
        this._startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.start, this);

        this._timerText = new egret.TextField;
        this._timerText.width = 200;
        this._timerText.x = 200;
        this._timerText.y = 120;
        this._timerText.textAlign = "center";
        this._timerText.size = 50;
        this.addChild(this._timerText);
        this._timerText.visible = false;

        this._state = 1;
    }

    /**
     * 开始
     */
    private start() {
        this._state = 2;
        this._dataArr = this.getData();
        this.setGridsByData();
        this.setNumbers();
        this._startBtn.visible = false;
        this._timerText.visible = true;
        this._timerText.text = "5:00";
        this._timer = new egret.Timer(1000, 300);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.timerUpdate, this);
        this._timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerOver, this);
        this._timer.start();
    }

    /**
     * 倒计时更新
     */
    private timerUpdate() {
        if(this._state == 3){
            return ;
        }
        var cnt: number = this._timer.repeatCount - this._timer.currentCount;
        this._timerText.text = Math.floor(cnt / 60) + ":" + cnt % 60;
    }

    /**
     * 倒计时结束
     */
    private timerOver() {
        this._state = 3;
    }

    /**
     * 初始化格子
     */
    private initGrids() {
        this._grids = [];
        this._gridContainer = new egret.DisplayObjectContainer;
        this.addChild(this._gridContainer);

        for (var i: number = 0; i < this._size; i++) {
            for (var j: number = 0; j < this._size; j++) {
                let grid: Grid = ObjectPool.pop("Grid");
                grid.init(this._gridSize);
                grid.x = i * this._gridSize;
                grid.y = j * this._gridSize;
                this._grids.push(grid);
                this._gridContainer.addChild(grid);
                grid.$touchEnabled = true;
                grid.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchGrid, this);
                grid.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchGrid, this);
            }
        }

        this._gridContainer.x = StageUtils.stageW - this._gridContainer.width - 10;
        this._gridContainer.y = StageUtils.stageH - this._gridContainer.height - 180;
    }

    /**
     * 根据数据设置格子
     */
    private setGridsByData() {
        for (var i = 0; i < this._grids.length; i++) {
            let grid = this._grids[i];
            grid.setSelect(this._dataArr[i]);
            grid.unSelect();
        }
    }

    /**
     * 设置数字
     */
    private setNumbers() {
        var arr1: Array<Array<number>> = [];
        var arr2: Array<Array<number>> = [];
        for (var i = 0; i < this._size; i++) {
            let numArr: Array<number> = [];
            let num = 0;
            for (var j = 0; j < this._size; j++) {
                if (this._dataArr[i * this._size + j] == 1) {
                    num += 1;
                } else {
                    if (num > 0) {
                        numArr.push(num);
                        num = 0;
                    }
                }
            }
            if (num > 0) {
                numArr.push(num);
            }
            arr1.push(numArr);
        }
        for (var j = 0; j < this._size; j++) {
            let numArr: Array<number> = [];
            let num = 0;
            for (var i = 0; i < this._size; i++) {
                if (this._dataArr[i * this._size + j] == 1) {
                    num += 1;
                } else {
                    if (num > 0) {
                        numArr.push(num);
                        num = 0;
                    }
                }
            }
            if (num > 0) {
                numArr.push(num);
            }
            arr2.push(numArr);
        }
        this._numberContainer = new egret.DisplayObjectContainer;
        this.addChild(this._numberContainer);
        this._numbers1 = [];
        this._numbers2 = [];
        for (var i = 0; i < arr1.length; i++) {
            var numArr: Array<number> = arr1[i];
            var textArr: Array<egret.TextField> = [];
            this._numbers1.push(textArr);
            for (var j = 0; j < numArr.length; j++) {
                let num = numArr[j];
                if (num > 0) {
                    var text: egret.TextField = new egret.TextField;
                    text.width = this._gridSize;
                    text.x = this._gridContainer.x + this._gridSize * i;
                    text.y = this._gridContainer.y - (numArr.length - j) * 40;
                    text.textAlign = "center";
                    text.text = "" + num;
                    textArr.push(text);
                    this._numberContainer.addChild(text);
                }
            }
        }

        for (var i = 0; i < arr1.length; i++) {
            var numArr: Array<number> = arr2[i];
            var textArr: Array<egret.TextField> = [];
            this._numbers2.push(textArr);
            for (var j = 0; j < numArr.length; j++) {
                let num = numArr[j];
                if (num > 0) {
                    var text: egret.TextField = new egret.TextField;
                    text.width = this._gridSize;
                    text.x = this._gridContainer.x - (numArr.length - j) * 35 - 15;
                    text.y = this._gridContainer.y + this._gridSize * i + this._gridSize / 2 - 10;
                    text.textAlign = "center";
                    text.text = "" + num;
                    textArr.push(text);
                    this._numberContainer.addChild(text);
                }
            }
        }
    }

    /**
     * 获取数据
     */
    private getData(): Array<number> {
        var arr: Array<number> = [];
        for (var i = 0; i < this._grids.length; i++) {
            let grid: Grid = this._grids[i];
            if (grid.isSelected) {
                arr.push(1);
            } else {
                arr.push(0);
            }
        }
        return arr;
    }

    /**
     * 触碰格子
     */
    private touchGrid(event: egret.TouchEvent) {
        if (this._state == 3) {
            return;
        }
        var grid: Grid = event.target as Grid;
        if (!grid.isSelected) {
            if (grid.value == 1) {


            } else if (grid.value == 0) {
                this._timer.repeatCount -= 10;
                if (this._timer.repeatCount <= 0) {
                    this._timer.stop();
                    this._timerText.text = "0:00";
                    this._state = 3;
                } else {
                    var cnt: number = this._timer.repeatCount - this._timer.currentCount;
                    this._timerText.text = Math.floor(cnt / 60) + ":" + cnt % 60;
                }
            }
        }

        grid.select();
    }
}
