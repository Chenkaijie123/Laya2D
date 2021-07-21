import MapNodePool from "./item/MapNodePool";
import MapGridPool from "./item/MapGridPool";

export default class PoolUtil {
    static get MapNode(): MapNodePool {
        return MapNodePool.ins;
    }

    static get MapGrid(): MapGridPool {
        return MapGridPool.ins;
    }
}
