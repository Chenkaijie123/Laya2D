import { IMapNode } from "../AStar";

export default class MapMdl{
    /**寻路地图数据 */
    mapNode:IMapNode[][]
    AStarNodeWidth:number
    AStarNodeHeight:number
    private static _ins:MapMdl;
    static get ins():MapMdl{
        if(!MapMdl._ins){
            MapMdl._ins = new MapMdl;
        }
        return MapMdl._ins;
    }
}