/**
 *
 * 方格
 *
 */
class Grid {
    private data: Array<Array<string>>;
    private undoArray: Array<MoveData>;

    public constructor(levelData) {
        this.data = [];
        levelData.data.forEach(function (collumn, x) {
            var datacollumn = [];
            collumn.forEach(function (cell, y) {
                datacollumn.push('0');
            });
            this.data.push(datacollumn);
        });
    }

    public xRow(nr: number) {
        this.data.forEach(function (collumn) {
            collumn[nr] = 'x';
        })
    }

    public xCollumn(nr: number) {
        this.data[nr].forEach(function (e, index, array) {
            array[index] = 'x';
        });
    }

    public getCell(x: number, y: number) {
        return this.data[x][y];
    }

    public setCell(x: number, y: number, value: string, noUndo: boolean): boolean {
        var oldValue = this.getCell(x, y);
        if (oldValue != 'xx' && value != oldValue) {
            this.data[x][y] = value;
            if (!noUndo) this.undoArray.push(new MoveData(x, y, oldValue));
            return true;
        } else {
            return false;
        }
    }

    public getMoveToUndo(): MoveData {
        if (this.undoArray.length == 0) return;
        return this.undoArray[this.undoArray.length - 1];
    }

    public undo() {
        if (this.undoArray.length == 0) return false;
        var lastMove = this.undoArray.pop();
        var currentValue = this.getCell(lastMove.x, lastMove.y);
        this.data[lastMove.x][lastMove.y] = lastMove.value;
    }

    public getData(): Array<Array<string>>{
        return this.data;
    }
};

class MoveData {
    public x: number;
    public y: number;
    public value: string;

    constructor(x: number, y: number, value: string) {
        this.x = x;
        this.y = y;
        this.value = value;
    }
}