import MapScene from "./battle/map/view/MapScene";
import RedTipMgr from "./redTip/RedTipMgr";
import ViewMgr from "./view/base/ViewMgr";
import { PanelRegister } from "./view/base/PanelRegister";
import Movie from "./view/Movie/Movie";
import PlayerView, { action_type } from "./battle/player/PlayerView";
import PlayerAppearanceInfo from "./battle/player/model/PlayerAppearanceInfo";

export default class App{
    mapScene:MapScene;
    redTipMgr:RedTipMgr;
    viewMgr:ViewMgr
    constructor(){
        this.init();
    }
    init():void{
        Laya.stage.addChild(this.mapScene = new MapScene);
        this.viewMgr = ViewMgr.ins;
        this.redTipMgr = new RedTipMgr;
        ViewMgr.ins.openPanel(PanelRegister.PANEL4);


    }
}