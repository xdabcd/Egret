/**
 *
 * 关卡类型数据
 *
 */
class CatData {
    public name: string;
    public desktop: boolean;
    public mobile: boolean;
    public unlock: number;
    public levels: Array<LevelData>;
    public active: boolean;
    public nr: number;
    public starsReq: Array<number>;
}