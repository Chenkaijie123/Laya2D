import { terrain_type, IMapNode } from "../AStar";

export default class MapGridInfo implements IMapNode{
    width: number
    height: number
    x: number
    y: number
    /**地形消耗(预留) */
    // cost?: number
    /**地形（预留） */
    terrain?: terrain_type
    parent?: IMapNode
    G?: number
    H?: number
    F?: number
}