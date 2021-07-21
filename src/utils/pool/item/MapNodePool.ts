import { IMapNode } from "../../../battle/map/AStar";
import MapNode from "../../../battle/map/MapNode";
import { PoolBase } from "../PoolBase";


export default class MapNodePool extends PoolBase<MapNode>{
    create(x: number, y: number, width: number, height: number): MapNode {
        let node: MapNode = this.pool.pop() || new MapNode;
        node.setTo(x, y, width, height);
        return node;
    }

    release(node:MapNode):void{
        node.release();
        this.pool.push(node);
    }
}