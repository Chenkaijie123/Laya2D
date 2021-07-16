export default interface IView extends Laya.View{
    dependenceAtlas?:string[]
    dependenceCfg?:string[]
    open(...args:any[]):void
    close():void;
}