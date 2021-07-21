import { IMapNode } from "./AStar";
/**地图节点数据 */
export default class MapNode implements IMapNode {
    width: number
    height: number
    x: number
    y: number
    parent?: IMapNode
    G?: number
    H?: number
    F?: number


    release(): void {
        this.width = this.height = this.x = this.y =
            this.G = this.H = this.F = 0;
    }

    setTo(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}