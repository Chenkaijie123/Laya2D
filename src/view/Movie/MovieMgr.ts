export default class MovieMgr {
    private _movieMap: { [key: string]: { [key: string]: Laya.Texture } } = {};
    private _movieJsonMap: { [key: string]: any } = {};
    private _movieRefrenceMap: { [key: string]: number } = {};
    private static _ins: MovieMgr;
    static get ins(): MovieMgr {
        if (!MovieMgr._ins) {
            MovieMgr._ins = new MovieMgr;
        }
        return MovieMgr._ins;
    }

}