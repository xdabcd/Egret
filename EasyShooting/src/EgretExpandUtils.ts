/**
 *
 * 引擎扩展工具类
 *
 */
class EgretExpandUtils {
	/**
     * 初始化函数
     */
    public static init(): void {
        AnchorUtils.init();
        KeyboardUtils.init();
        TimerManager.init();
    }
}
