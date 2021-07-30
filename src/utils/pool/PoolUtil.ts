import MapNodePool from "./item/MapNodePool";
import MapGridPool from "./item/MapGridPool";
import MoviePool from "./item/MoviePool";
import PlayerPool from "./item/PlayerPool";

export default class PoolUtil {
    static get MapNode(): MapNodePool {
        return MapNodePool.ins;
    }

    static get MapGrid(): MapGridPool {
        return MapGridPool.ins;
    }

    static get Movie():MoviePool{
        return MoviePool.ins;
    }

    static get player():PlayerPool{
        return PlayerPool.ins;
    }
}
