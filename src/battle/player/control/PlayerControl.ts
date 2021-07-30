import Player from "../Player";
import { IMapNode } from "../../map/AStar";
import PlayerActionInfo, { player_action_type } from "../model/PlayerActionInfo";
import MapUtil from "../../map/view/MapUtil";

export default class PlayerControl {
    private player: Player;

    init(player: Player): void {
        this.player = player;
    }

    loopUndate(costTime: number): void {

        
    }
    
    dispose():void{
        this.player = null
    }
}



