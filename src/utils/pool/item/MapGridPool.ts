
import MapGrid from "../../../battle/map/view/MapGrid";
import { PoolBase } from "../PoolBase";

export default class MapGridPool extends PoolBase<MapGrid> {
    create(skin: string): MapGrid {
        let node = this.pool.pop() || new MapGrid;
        node.skin = skin;
        return node;
    }

    release(node: MapGrid): void {
        node.release();
        this.pool.push(node);
    }
}