/**
 * 
 * 广告
 * 
 */
class ADManager {
	public static showAD(callBack: Function = null) {
		SoundManager.stopMusic();
		MISO.showAd(() => {
			if (callBack) {
				SoundManager.playMusic();
				callBack();
			}
		});
	}
}