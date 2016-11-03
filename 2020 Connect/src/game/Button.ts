/**
 *
 * 按钮
 *
 */
class Button extends egret.DisplayObjectContainer {
	private sprite: egret.Bitmap;
	private callBack: Function;

	public constructor() {
		super();

		this.addChild(this.sprite = new egret.Bitmap);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.touchEnabled = true;
	}

	public init(sprite: string, callBack: Function) {
		this.sprite.texture = RES.getRes(sprite);
		this.callBack = callBack;
	}

	private onTap() {
		if (this.callBack) {
			this.callBack();
		}
	}
}