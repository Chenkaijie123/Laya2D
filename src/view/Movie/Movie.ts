import Sprite = Laya.Sprite;
import AutoBitmap = laya.ui.AutoBitmap
import ResourceMgr from "../../ResourceMgr";
export default class Movie extends Sprite {
    /***更新一帧 */
    static readonly UPDATE:string = "UPDATE";
    /**加载完成 */
    static readonly LOAD_COMPLETE:string = "LOAD_COMPLETE";
    /**播放完成 */
    static readonly PLAY_COMPLETE:string = "PLAY_COMPLETE";
    /**完成一轮循环 */
    static readonly LOOP_COMPLETE:string = "LOOP_COMPLETE";
    frameRace: number = 2;
    private _skin: string;
    private bitMap: AutoBitmap;
    private _index = 0;
    private _frameNum: number = 0;
    private _loopPlay: boolean = false;
    private _autoPlay: boolean = true;
    private _isPlaying:boolean = false;
    loadComplete: boolean = false;
    private cfg: { mc: { frameRate: string, frames: { res: string, x: number, y: number }[] }, res: { [key: string]: { x: number, y: number, w: number, h: number } } }
    private bitMapSource: { [key: string]: Laya.Texture }
    constructor() {
        super();
        this.graphics = this.bitMap = new AutoBitmap;
    }
    get frameNum() { return this._frameNum; }
    get loopPlay() { return this._loopPlay; }
    set loopPlay(v: boolean) { 
        this._loopPlay = v; 
        this.play();
    }
    get autoPlay() { return this._autoPlay; }
    set autoPlay(v: boolean) { this._autoPlay = v; }
    set skin(v: string) {
        if (this._skin == v) return;
        this.clear();
        this._skin = v;
        this.setSkin(v);
    }

    get skin(): string { return this._skin; }

    /***加载序列帧资源 */
    private async setSkin(path: string) {
        if(!path) return;
        ResourceMgr.ins.addMovieRefrence(path);
        let res = await ResourceMgr.ins.getMovieResource(path);
        if (this._skin != path) {
            ResourceMgr.ins.removeMovieRefrence(path);
        } else {
            this.event(Movie.LOAD_COMPLETE);
            this.loadComplete = true;
            this.cfg = ResourceMgr.ins.getMovieJson(path);
            this.bitMapSource = res;
            this._frameNum = this.cfg.mc.frames.length;
            this.frameRace == 0 && (this.frameRace = +this.cfg.mc.frameRate);
            this.index = this._index;
            if (this._autoPlay) {
                this.play();
            }
        }
    }

    private loopRefresh(): void {
        if(!this.loadComplete) return;
        if (this._frameNum <= ++this._index) {
            if (this._loopPlay) {
                this.index = 0;
                this.event(Movie.LOOP_COMPLETE);
            } else {
                this.event(Movie.PLAY_COMPLETE);
                this.clear();
            }
        }else{
            this.index = this._index;
            this.event(Movie.UPDATE,this._index);
        }
    }

    set index(v: number) {
        this._index = v;
        if (this.loadComplete) {
            if(v >= this.frameNum) this._index = v = this.frameNum - 1;
            let cfg = this.cfg.mc.frames[v];
            this.bitMap.source = this.bitMapSource[cfg.res];
            this.bitMap.source.offsetX = cfg.x;
            this.bitMap.source.offsetY = cfg.y;
        }
    }

    get index() {
        return this._index;
    }

    play(startIndex: number = 0): void {
        this.index = startIndex;
        if(this._isPlaying) return;
        this._isPlaying = true;
        Laya.timer.frameLoop(this.frameRace, this, this.loopRefresh);
    }

    stop() {
        if(!this._isPlaying) return;
        this._isPlaying = false;
        Laya.timer.clear(this, this.loopRefresh);
    }

    clear() {
        this.bitMapSource = this.cfg = null;
        this.bitMap.source = this._skin = null;
        this._frameNum = this.frameRace = 0;
        this.loadComplete = false;
        this._autoPlay = true;
        this._skin && ResourceMgr.ins.removeMovieRefrence(this._skin);
        this.stop();
    }

}