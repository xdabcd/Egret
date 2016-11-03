/**
 *
 * 棋盘
 *
 */
class Board extends egret.DisplayObjectContainer {
	private game: GameScene;

	public constructor(game: GameScene) {
		super();
		this.game = game;
	}

	public get hor(): number {
		return 5;
	}

	public get ver(): number {
		return 8;
	}

	public get cellSize(): number {
		return 122;
	}
}