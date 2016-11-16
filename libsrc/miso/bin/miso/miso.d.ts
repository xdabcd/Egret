declare class MISO {
    static lang(langs: Array<string>): string;
    static trigger(event: string, data: any): void;
    static showAd(callBack: Function): void;
}