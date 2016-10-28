/**
 *
 * 棋盘
 *
 */
class Board extends egret.DisplayObjectContainer {
    private levelData: LevelData;
    private boardData: BoardData;
    private errParticle: ErrParticle;
    private rows: Array<Array<egret.TextField>>;
    private collumns: Array<Array<egret.TextField>>;
    private gridCon: egret.DisplayObjectContainer;
    private gridBg: egret.Bitmap;
    private numCon: egret.DisplayObjectContainer;
    private marksLayer: MarksLayer;

    private inputMask: boolean;
    private penalties: boolean;
    private penaltyIndex: number;
    private waitingInHint: boolean;
    private inputBlockMap: Array<Array<string>>;
    private grid: Grid;
    private tapMode: boolean;

    public constructor(levelData: LevelData) {
        super();

        var w = StageUtils.stageW;

        this.x = w / 2;
        this.y = 300;
        this.levelData = levelData;
        this.boardData = DataManager.getBoardData(levelData.type);

        this.errParticle = ObjectPool.pop("ErrParticle");
        this.addChild(this.errParticle);

        this.inputMask = false;
        this.penalties = DataManager.penalties;
        this.penaltyIndex = 0;
        this.waitingInHint = false;
        this.tapMode = PlayerDataManager.isTapControll;

        this.initMap();
        this.initGrid();

        this.gridBg = DisplayUtils.createBitmap(this.boardData.spriteName);

        this.boardData.pxBgWidth = this.gridBg.width;
        this.boardData.pxBgHeight = this.gridBg.height;
        this.gridCon.addChild(this.gridBg);
        this.boardData.pxWholeWidth = this.width;
        this.boardData.pxWholeHeight = this.height;

        this.numCon = new egret.DisplayObjectContainer;

        this.rows.concat(this.collumns).forEach(function (ar) {
            this.numberGroup.addMultiple(ar);
        }, this);

        this.addChild(this.numCon);

        this.addChild(this.marksLayer = new MarksLayer(this.boardData, this.grid.getData(), this.inputBlockMap))

    }

    private initMap() {
        var arr = [];
        for (var col = 0; col < this.levelData.data.length; col++) {
            arr[col] = [];
            for (var row = 0; row < this.levelData.data[0].length; row++) {
                arr[col][row] = null;
            }

        }
        this.inputBlockMap = arr;
    }

    private initGrid() {
        var boardData = this.boardData;
        var levelData = this.levelData;
        this.grid = new Grid(levelData);
        this.rows = [];
        this.collumns = [];
        this.gridCon = new egret.DisplayObjectContainer;
        this.addChild(this.gridCon);

        var xx: number;
        var yy: number;
        var numbers: Array<number>;
        var strip: egret.Bitmap;
        var lastNum: egret.TextField;
        //collumns
        for (let i = 0; i < boardData.size[0]; i++) {
            xx = boardData.sizeOfCell * (i + 0.5) + boardData.leftMargin;
            numbers = this.calcNumbers(levelData.data[i]);
            this.collumns.push(this.makeNumbersTxt(xx, 0, -20, -10, boardData.fontSize, numbers));
            strip = DisplayUtils.createBitmap("spritesheet." + (i % 2 == 0) ? "griddlers-num_bg1" : "griddlers-num_bg2");
            strip.x = xx;
            strip.y = 20;
            strip.scaleX = strip.scaleY = boardData.sizeOfCell * 0.54 / strip.height;
            AnchorUtils.setAnchorX(strip, 1);
            AnchorUtils.setAnchorY(strip, 0.5);
            strip.rotation = 90;

            if (this.collumns[i].length > 0) {
                lastNum = this.collumns[i][this.collumns[i].length - 1];
                strip.y = (lastNum.y - lastNum.height - (this.boardData.fontSize * 0.66)) + strip.width;
                if (strip.y < 0) {
                    strip.width = -strip.y + strip.width;
                    strip.y = 0;
                }
            } else {
                strip.visible = false;
                this.grid.xCollumn(i);
                this.inputBlockMap[i].forEach(function (e, index, array) {
                    array[index] = 'h';
                });
            }
            this.gridCon.addChild(strip);
        }
        //rows
        for (let j = 0; j < boardData.size[1]; j++) {
            yy = boardData.sizeOfCell * (j + 0.5) + boardData.topMargin;
            numbers = [];
            levelData.data.forEach(function (collumn) {
                numbers.push(collumn[j]);
            });
            this.rows.push(this.makeNumbersTxt(-20, -15, yy, 0, boardData.fontSize, this.calcNumbers(numbers)));

            strip = DisplayUtils.createBitmap("spritesheet." + (j % 2 == 0) ? "griddlers-num_bg1" : "griddlers-num_bg2");
            strip.x = 20;
            strip.y = yy;
            strip.scaleX = strip.scaleY = boardData.sizeOfCell * 0.54 / strip.height;
            AnchorUtils.setAnchorX(strip, 1);
            AnchorUtils.setAnchorY(strip, 0.5);

            if (this.rows[j].length > 0) {
                lastNum = this.rows[j][this.rows[j].length - 1];
                strip.x = (lastNum.x - lastNum.width - boardData.fontSize) + strip.width;
                if (strip.x < 0) {
                    strip.width = -strip.x + strip.width;
                    strip.x = 0;
                }
            } else {
                strip.visible = false;
                this.grid.xRow(j);
                this.inputBlockMap.forEach(function (collumn) {
                    collumn[j] = 'h';
                });
            }
            this.gridCon.addChild(strip);
        }

        this.rows.forEach(function (row, index, array) {
            array[index] = row.reverse();
        });
        this.collumns.forEach(function (collumn, index, array) {
            array[index] = collumn.reverse();
        });
    }

    private calcNumbers(arr: Array<number>): Array<number> {
        var result = [];
        var value = 0;
        var lastCell = 0;

        arr.forEach(function (cell, index, ar) {
            if (cell == 1) {
                value++;
            } else {
                if (lastCell == 1) {
                    result.push(value);
                    value = 0;
                }
            }
            lastCell = cell;

            if (index == ar.length - 1 && value > 0) {
                result.push(value);
            }
        });
        return result;
    }

    private makeNumbersTxt(xx: number, addX: number, yy: number, addY: number, fontSize: number, array: Array<number>): Array<egret.TextField> {
        var result = [];

        array.reverse();

        array.forEach(function (num) {
            let txt = new egret.TextField();
            txt.size = fontSize;
            txt.textColor = DataManager.HL_COLOR;
            txt.x = xx;
            txt.y = yy;
            txt.text = num.toString();
            AnchorUtils.setAnchor(txt, 0.5);
            result.push(txt);
            xx += addX + (MathUtils.sign(addX) * txt.width);
            yy += addY + (MathUtils.sign(addY) * txt.height);
        });

        return result;
    };
}
