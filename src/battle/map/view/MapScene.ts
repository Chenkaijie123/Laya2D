import Sprite = Laya.Sprite;

import Box = Laya.Box;
import MapGrid from "./MapGrid";
import PoolUtil from "../../../utils/pool/PoolUtil";
/**[路径，水平个数，竖直个数，格子大小] */
const mapCfg = {
    1: ["./asset/map/80001/", 8, 6, 256],
}
/**地图显示层 */
export default class MapScene extends Sprite {
    mapLayer: Box;
    constructor() {
        super();
        this.init();
    }
    private init(): void {
        this.addChild(this.mapLayer = new Box);
        this.mapLayer.top = this.mapLayer.left = this.mapLayer.right = this.mapLayer.bottom = 0
        this.ChangeMap(1);
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
    }

    

    releaseMap(): void {
        let node: MapGrid;
        while (this.mapLayer.numChildren) {
            node = this.getChildAt(0) as MapGrid;
            PoolUtil.MapGrid.release(node);
        }
    }
}

