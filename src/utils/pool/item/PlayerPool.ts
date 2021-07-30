import { PoolBase } from "../PoolBase";
import PlayerView from "../../../battle/player/PlayerView";

export default class PlayerPool extends PoolBase<PlayerView>{
    create(clz:new()=>PlayerView = PlayerView): PlayerView {
        let node = this.pool.pop() || new clz;
        return node;
    }
    release(node: PlayerView): void {
        node.clear();
        this.pool.push(node);
    }
}