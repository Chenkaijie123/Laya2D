import Sprite = Laya.Sprite;
import AutoBitmap = laya.ui.AutoBitmap
import ResourceMgr from "../../ResourceMgr";
export default class Movie extends Sprite {
    frameRace: number = 2;
    private _skin: string;
    private bitMap: AutoBitmap;
    private _index = 0;
    loadComplete: boolean = false;
    private cfg:{mc:{frameRate:string,frames:{res:string,x:number,y:number}[]},res:{[key:string]:{x:number,y:number,w:number,h:number}}}
    constructor() {
        super();
        this.graphics = this.bitMap = new AutoBitmap;
    }
    set skin(v: string) {
        this.setSkin(v);
    }

    get skin(): string { return this._skin; }

    /***加载序列帧资源 */
    private async setSkin(path: string) {
        this.loadComplete = false;
        this.cfg = null;
        ResourceMgr.ins.addMovieRefrence(path);
        let res = await ResourceMgr.ins.getMovieResource(path);
        if (this._skin != path) {
            ResourceMgr.ins.removeMovieRefrence(path);
        } else {
            this.loadComplete = true;
            this.cfg = ResourceMgr.ins.getMovieJson(path);
        }
    }

    set index(v: number) {
        this._index = v;
        if (this.loadComplete) {

        }
    }

    get index() {
        return this._index;
    }

    private setSource():void{

    }

}