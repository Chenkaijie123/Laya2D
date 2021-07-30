import Sprite = Laya.Sprite;

import Box = Laya.Box;
import MapGrid from "./MapGrid";
import PoolUtil from "../../../utils/pool/PoolUtil";
import PlayerView, { action_type } from "../../player/PlayerView";
import PlayerAppearanceInfo from "../../player/model/PlayerAppearanceInfo";

import AStar, { terrain_type, IMapNode } from "../AStar";
import PlayerInfo from "../../player/model/PlayerInfo";
import Player from "../../player/Player";
import PlayerControl from "../../player/control/PlayerControl";
import MapMdl from "../model/MapMdl";
import MapUtil from "./MapUtil";
import MapGridInfo from "../model/MapGridInfo";
/**[路径，水平个数，竖直个数，格子大小] */
const mapCfg = {
    1: ["./asset/map/80001/", 8, 6, 256],
}
const mapNodeMsg = [250, 250, 8, 4,
    1, 3, 3, 3, 3, 3, 3, 3,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    3, 1, 1, 1, 1, 1, 1, 3
]
/**地图显示层 */
export default class MapScene extends Sprite {
    mapLayer: SceneLayer;
    playerLayer: SceneLayer;

    /**地图上所有的角色 */
    playerList: Player[] = [];
    constructor() {
        super();
        this.init();
    }
    private init(): void {
        this.addChild(this.mapLayer = new SceneLayer);
        this.addChild(this.playerLayer = new SceneLayer);
        this.mapLayer.on(Laya.Event.CLICK, this, this.mapClik);
        this.ChangeMap(1);
        Laya.timer.frameLoop(1, this, this.loop);
    }


    ChangeMap(id: number): void {
        let cfg = mapCfg[id];
        this.releaseMap();
        let node: MapGrid;
        let index = 1;
        for (let i = 0; i < cfg[2]; i++) {
            for (let j = 0; j < cfg[1]; j++) {
                node = PoolUtil.MapGrid.create(cfg[0] + index + ".jpg");
                index++;
                node.y = cfg[3] * i;
                node.x = cfg[3] * j;
                this.mapLayer.addChild(node);

            }
        }
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;

        //格子
        let gwid = mapNodeMsg[0]
        let gheig = mapNodeMsg[1]
        let xNum = mapNodeMsg[2]
        let yNum = mapNodeMsg[3]
        let idx = 3
        MapMdl.ins.AStarNodeWidth = gwid;
        MapMdl.ins.AStarNodeHeight = gheig;
        let gridArr: MapGridInfo[][] = [];
        let rows: MapGridInfo[];
        for (let i = 0; i < xNum; i++) {
            gridArr.push(rows = [])
            for (let j = 0; j < yNum; j++) {
                idx++;
                let info = new MapGridInfo;
                info.x = i;
                info.y = j;
                info.terrain = mapNodeMsg[idx]
                rows.push(info);
            }
        }
        AStar.ins.init(MapMdl.ins.mapNode = gridArr);
    }

    private mapClik(e: Laya.Event): void {

    }

    addPlayer(info: PlayerInfo, bornX: number, bornY: number,control:PlayerControl): void {
        let player: Player = PoolUtil.player.create(Player) as any;
        this.playerList.push(player as any);
        player.info = info;
        player.x = bornX;
        player.y = bornY;
        player.control = control;
        player.mapNode = MapUtil.getMapNodeByPos(bornX, bornY);
    }

    private loop(): void {
        let costTime = Laya.timer.delta;
        for (let player of this.playerList) {
            player.loop(costTime);
        }
    }



    releaseMap(): void {
        let node: MapGrid;
        while (this.mapLayer.numChildren) {
            node = this.getChildAt(0) as MapGrid;
            PoolUtil.MapGrid.release(node);
        }
        let player: PlayerView;
        while (this.playerLayer.numChildren) {
            player = this.getChildAt(0) as any;
            PoolUtil.player.release(player);
        }
    }


}

class SceneLayer extends Box {
    constructor() {
        super();
        this.top = this.left = this.bottom = this.right = 0;
    }
}

