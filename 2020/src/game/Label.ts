/**
 *
 * 按钮
 *
 */
class Label extends egret.TextField {
    public constructor() {
        super();
        this.fontFamily = "Cookies";
        this.textAlign = "center";
        AnchorUtils.setAnchor(this, 0.5);
    }

    public $setText(value: string): boolean{
        super.$setText(value);
        this.anchorOffsetX = this["anchorX"] * this.width;
        this.anchorOffsetY = this["anchorY"] * this.height;
        return true;
    }
}
