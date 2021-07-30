import PlayerView from "./PlayerView";
import { IMapNode, move_type } from "../map/AStar";
import PlayerInfo from "./model/PlayerInfo";
import PlayerControl from "./control/PlayerControl";
import MapMdl from "../map/model/MapMdl";

export default class Player extends PlayerView{
    /**当前所在格子 */
    mapNode:IMapNode
    info:PlayerInfo
    control:PlayerControl
    /**寻路格子 */
    private pathArr:IMapNode[];
    private currentMapNode:IMapNode;//下一步目标格子
    private nextPoint:Laya.Point = new Laya.Point;
    private currentPosition:Laya.Point = new Laya.Point;//最终目标点

    /**@private */
    loop(costTime:number):void{

    }

    move(x:number,y:number):void{

    }

    clear():void{
        super.clear();
        this.info = null;
    }

    dispose():void{
        this.clear();
        this.control.dispose();
        this.control = null;
    }
}