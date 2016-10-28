/**
 *
 * 
 *
 */
class MarksLayer extends egret.DisplayObjectContainer {
    private boardData: BoardData;
    private gridData: Array<Array<string>>;
    private blockMap: Array<Array<string>>;
    private tapMode: boolean;
    private sliderPosition: egret.Point;
    private bitmapMark: egret.Bitmap;
    private sliderBitmap: egret.BitmapData;
    private bitmap: egret.BitmapData;

    public constructor(boardData: BoardData, data: Array<Array<string>>, map: Array<Array<string>>) {
        super();
        this.x = boardData.leftMargin;
        this.y = boardData.topMargin;

        this.boardData = boardData;
        this.gridData = data;
        this.blockMap = map;

    }
}
