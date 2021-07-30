import { IMapNode } from "../AStar";
import MapMdl from "../model/MapMdl";
import { direction } from "../../player/PlayerView";

export default class MapUtil {
    static dirMap = {
        [0b1000]:direction.up,
        [0b1100]:direction.up_right,
        [0b0100]:direction.right,
        [0b0110]:direction.right_down,
        [0b0010]:direction.dwon,
        [0b0011]:direction.down_left,
        [0b1001]:direction.left_up,

    }
    /**获取寻路格子 */
    static getMapNodeByPos(x: number, y: number): IMapNode {
        if (!MapMdl.ins.mapNode) return null;
        let _x = Math.floor(x / MapMdl.ins.AStarNodeWidth);
        let _y = Math.floor(y / MapMdl.ins.AStarNodeHeight);
        return MapMdl.ins.mapNode[_y] ? MapMdl.ins.mapNode[_y][_x] : null;
    }

    /**获取寻路格子中心坐标 */
    static getMapNodeCenterPos(node:IMapNode,point = new Laya.Point):Laya.Point{
        point.x = node.x +( node.width >>1);
        point.y = node.y + (node.height >> 1);
        return point;
    }

    /**获取方向 */
    static getDirection(startX:number,startY:number,endX:number,endY:number):direction | null{
        let x = startX - endX;
        let y = startY - endY;
        let key = 0;
        let temp :number;
        if(x > 0){
            key |= 0b0100;
        }else if(x < 0){
            key |= 0b0001;
        }
        if(y > 0){
            key |= 0b0010;
        }else if(y < 0){
            key |= 0b0001;
        }
        return MapUtil.dirMap[key];
    }
}