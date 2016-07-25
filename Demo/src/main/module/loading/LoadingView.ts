/**
 *
 * @author 
 *
 */
class LoadingView extends BaseEuiView{
    public constructor($controller: BaseController, $parent: eui.Group) {
        super($controller, $parent);
        this.skinName = LoadingSceneSkin;
	}
	
    public progress: eui.Label;

    public setProgress(current: number,total: number): void {
        this.progress.text = "加载中...(" + current + "/" + total + ")";
    }
}
