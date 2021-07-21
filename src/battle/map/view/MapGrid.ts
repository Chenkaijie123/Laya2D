export default class MapGrid extends Laya.Image{
    release():void{
        this.skin = null;
        this.removeSelf();
    }
}