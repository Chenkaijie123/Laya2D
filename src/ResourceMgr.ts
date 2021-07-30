import ViewMgr from "./view/base/ViewMgr";

/**
 * 散图完全计数管理
 * 图集和序列帧动画中间架构一层大资源计数管理
 */
export default class ResourceMgr {
    clearAtlasQueue: string[] = [];
    clearQueue: Laya.Texture[] = [];
    clearMovieQueue: string[] = [];
    //大图集引用计数
    atlasMap: { [key: string]: number } = {};

    private _movieMap: { [key: string]: { [key: string]: Laya.Texture } } = {};
    private _movieJsonMap: { [key: string]: any } = {};
    private _movieRefrenceMap: { [key: string]: number } = {};
    //每帧销毁资源最大数量
    static readonly frameClearCount: number = 2;
    static readonly checkClearTime: number = 1000;
    private static _ins: ResourceMgr;
    static get ins(): ResourceMgr {
        return ResourceMgr._ins || (ResourceMgr._ins = new ResourceMgr)
    }
    startCheck(): void {
        Laya.timer.loop(ResourceMgr.checkClearTime, this, this.loopCheckTexture);
        Laya.timer.frameLoop(1, this, this.loopDestroyTexture);
    }

    stopCheck(): void {
        Laya.timer.clear(this, this.loopCheckTexture);
        Laya.timer.clear(this, this.loopDestroyTexture);
    }

    /**
     * 检测图片资源，如果引用计数为0则添加到销毁队列
     */
    loopCheckTexture(): void {
        if (this.clearQueue.length) return;
        let temp: Laya.Texture;
        for (let k in Laya.Loader.loadedMap) {
            temp = Laya.Loader.loadedMap[k];
            if (!temp.bitmap) continue;
            if (temp["_referenceCount"] == 0 && temp.bitmap["_referenceCount"] == 0) {
                /**简易判断如果是图集就自动不清理（忽略只有一张图片的图集） */
                if ((temp.bitmap as Laya.Texture2D).width == temp.width
                    && (temp.bitmap as Laya.Texture2D).height == temp.height) {
                    //压入销毁队列
                    this.clearQueue.push(temp);
                }
            }
        }
        this.addMovieToClearQueue();
    }

    /**
     * 批量销毁图片
     */
    loopDestroyTexture(): void {
        ViewMgr.ins.tryDestoryPanel();
        let idx = 0;
        let texture: Laya.Texture = this.clearQueue.shift();
        while (texture) {
            /**重新判断是否有被引用，避免等待销毁过程中又被引用造成误删 */
            if (texture.bitmap && texture.bitmap["_referenceCount"] == 0) {
                if (texture.url) {
                    // Laya.loader.clearRes(texture.url);
                    this.clearEngineCache(texture.bitmap);
                    idx++;
                }
            }
            if (idx >= ResourceMgr.frameClearCount) break;
            texture = this.clearQueue.shift();
        }
        //清理一个大图集
        this.clearOneAtlas();
        //清理一个movie
        this.clearMovieRes();
    }

    //---------------------------------图集---------------------------
    addAtlasRefrence(url: string): void {
        if (this.atlasMap[url]) {
            this.atlasMap[url] = this.atlasMap[url] + 1;
        } else {
            this.atlasMap[url] = 1;
        }
    }

    removeAtlasRefrence(url: string, autoClear: boolean = false): void {
        if (!this.atlasMap[url]) {
            console.error("图集引用计数逻辑有问题")
        } else {
            this.atlasMap[url] = this.atlasMap[url] - 1;
            if (!this.atlasMap[url] && autoClear) {
                this.pushDestoryAtlasQueue(url);
            }
        }

    }

    /**添加清理队列 */
    pushDestoryAtlasQueue(atlas: string): void {
        if (this.clearAtlasQueue.indexOf(atlas) == -1) {
            this.clearAtlasQueue.push(atlas);
        }
    }

    /**执行清理大图集 */
    private clearOneAtlas(): void {
        if (!this.clearAtlasQueue.length) return;
        let url: string;
        //大图集添加引用计数有可能图集还没加载，如果没有资源表示还没加载
        for (let i = 0, len = this.clearAtlasQueue.length; i < len; i++) {
            if (Laya.loader.getRes(this.clearAtlasQueue[i])) {
                url = this.clearAtlasQueue.splice(i, 1)[0];
                break;
            }
        }
        if (url && !this.atlasMap[url]) {
            delete this.atlasMap[url];
            Laya.loader.clearRes(url);
            url = Laya.URL.formatURL(url.substring(0, url.lastIndexOf(".")) + ".png");
            this.clearEngineCache(Laya.loader.getRes(url));
        }
    }

    /**清理引擎的缓存 (彻底清理)*/
    private clearEngineCache(texture: Laya.Texture2D): void {
        if (texture) {
            Laya.Loader.clearRes(texture.url);
            let resource = Laya.Resource.getResourceByID(texture["id"]);
            resource && resource.destroy();
        }
    }

    //-----------------------movie-------------------------
    async getMovieResource(path: string) {
        if (!this._movieMap[path]) {
            await new Promise((resolve, reject) => {
                let imgPath = path.replace(".json", ".png")
                Laya.loader.load([path, imgPath], Laya.Handler.create(this, () => {
                    let texture: Laya.Texture = Laya.Loader.getRes(imgPath);
                    let json: any = Laya.loader.getRes(path);
                    if (!texture || !json) reject();
                    let res: { [key: string]: Laya.Texture } = {};
                    let cfg: any;
                    //防止被资源管理当散图清掉
                    texture.width++;
      
                    for (let k in json.res) {
                        cfg = json.res[k];
                        res[k] = Laya.Texture.create(texture, cfg.x, cfg.y, cfg.w, cfg.h);
                    }
                    this._movieMap[path] = res;
                    this._movieJsonMap[path] = json;
                    resolve();
                }));
            });
        }
        return Promise.resolve(this._movieMap[path]);
    }

    getMovieJson(path: string): any {
        return this._movieJsonMap[path];
    }

    addMovieRefrence(path: string): void {
        this._movieRefrenceMap[path] = this._movieRefrenceMap[path] ? this._movieRefrenceMap[path] + 1 : 1;
    }

    removeMovieRefrence(path: string): void {
        if (!this._movieRefrenceMap[path]) {
            console.error("Movie资源计数错误")
        }
        this._movieRefrenceMap[path] = this._movieRefrenceMap[path] - 1;
    }

    clearMovieRes(): void {
        let path: string;
        while (path = this.clearMovieQueue.pop()) {
            if (this._movieRefrenceMap[path]) {
                break;
            }
        }
        if (!path) return;
        delete this._movieRefrenceMap[path];
        //json
        delete this._movieJsonMap[path];
        Laya.Loader.clearRes(path);
        if (this._movieMap[path]) {
            for (let k in this._movieMap[path]) {
                this._movieMap[path][k].destroy();
            }
        }
        //image
        Laya.loader.clearRes(path.replace(".json", ".png"));
    }

    //把引用为0的movie资源加入销毁队列
    addMovieToClearQueue(): void {
        for (let k in this._movieRefrenceMap) {
            if (!this._movieRefrenceMap[k]) {
                this.clearMovieQueue.indexOf(k) == -1 && this.clearMovieQueue.unshift(k);
            }
        }
    }

}