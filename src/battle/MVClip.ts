import ResourceMgr from "../ResourceMgr";

export default class MVClip extends Laya.Component{
    private _skin:string;
    set skin(v:string){
        this._skin = v;
        this.load(v);
    }

    get skin():string{
        return this._skin
    }

    private async load(path:string){
        ResourceMgr.ins.addAtlasRefrence(path + ".atlas")
        let [url] = await Promise.all([this.loadSource(path + ".json"),this.loadSource(path + ".png")]);
        if(this._skin != url) {
            ResourceMgr.ins.removeAtlasRefrence(path + "atlas");
        }else{
            this.setSource();
        }

    }

    private async loadSource(url:string):Promise<string>{
        return new Promise<string>((resovle,reject)=>{
            Laya.loader.load(url,Laya.Handler.create(this,()=>{
                resovle(url)
            }))
        })
    }

    private setSource():void{
        let texture:Laya.Texture = Laya.loader.getRes(this._skin + ".png");
        let json = Laya.Loader.getRes(this.skin + ".altas");

    }
}