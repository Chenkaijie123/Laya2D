/**
 * 初始化一次寻路的地图 Astar.ins.init()
 * 开启寻路 Astar.ins.findPath()
 * 
 */
export default class AStar {
    /**固定消耗 */
    static readonly staticCost = 10;
    static xNum: number
    static yNum: number

    /**地图格子集合 */
    static mapNodeList: IMapNode[][];

    private openList: IMapNode[] = [];
    private closeList: IMapNode[] = [];
    private static _ins: AStar;
    static get ins(): AStar {
        if (!AStar._ins) AStar._ins = new AStar;
        return AStar._ins;
    }
    init(arr: IMapNode[][]): void {
        AStar.xNum = arr[0].length;
        AStar.yNum = arr.length;
        AStar.mapNodeList = arr;

    }
    /**曼哈顿估价法 */
    private manhattan(fromNode: IMapNode, targetNode: IMapNode): number {
        return Math.abs(fromNode.x - targetNode.x) * AStar.staticCost + Math.abs(fromNode.y - targetNode.y) * AStar.staticCost;
    }

    /**移动成本，影响走斜对角还是垂直 */
    private getG(fromNode: IMapNode, targetNode: IMapNode): number {
        return fromNode.x - targetNode.x == 0 || fromNode.y - targetNode.y == 0 ? 10 : 14;
    }

    /**获取周围8格 */
    private getAroundNode(node: IMapNode) {
        let x = node.x % AStar.xNum;
        let y = node.y % AStar.yNum;
        let res: IMapNode[] = [];
        let map = AStar.mapNodeList;
        let temp: IMapNode[];
        if (temp = map[y - 1]) {
            if (temp[x - 1]) {
                res.push(temp[x - 1]);
            }
            if (temp[x]) {
                res.push(temp[x]);
            }
            if (temp[x + 1]) {
                res.push(temp[x + 1]);
            }
        }
        if (map[y][x - 1]) {
            res.push(map[y][x - 1]);
        }
        if (map[y][x + 1]) {
            res.push(map[y][x + 1]);
        }

        if (temp = map[y + 1]) {
            if (temp[x - 1]) {
                res.push(temp[x - 1]);
            }
            if (temp[x]) {
                res.push(temp[x]);
            }
            if (temp[x + 1]) {
                res.push(temp[x + 1]);
            }
        }
        return res;
    }

    /**
     * 
     * @param fromNode 起始点
     * @param toNode 目标点
     * @param moveType 移动类型，影响可穿越地形
     * @returns 
     */
    findPath(fromNode: IMapNode, toNode: IMapNode, moveType: move_type): IMapNode[] {
        if (fromNode == toNode || (moveType as number) < toNode.terrain) return [fromNode];
        fromNode.parent = null;
        this.openList.length = this.closeList.length = 0;
        this.openList.push(fromNode);
        fromNode.G = 0;
        let g: number;
        let index: number;
        while (fromNode = this.openList.pop()) {
            let around = this.getAroundNode(fromNode);
            this.closeList.push(fromNode);
            for (let node of around) {
                //找到目标
                if (node == toNode) {
                    node.parent = fromNode;
                    return this.parsePath(node);
                }
                if (this.closeList.indexOf(node) >= 0 || (moveType as number) < node.terrain) continue;
                g = fromNode.G + this.getG(fromNode, node);
                index = this.openList.indexOf(node)
                if (index == -1) {
                    this.openList.push(node);
                    node.parent = fromNode;
                    node.H = this.manhattan(node, toNode);
                    node.G = g;
                    node.F = node.H + node.G;
                } else {
                    if (this.openList[index].G > g) {
                        node.G = g;
                        node.parent = fromNode;
                        node.F = this.openList[index].G + this.openList[index].H;
                    }
                }
            }
            this.openList.sort((a, b) => b.F - a.F);
        }
        return [toNode];
    }


    private parsePath(node: IMapNode) {
        let res: IMapNode[] = [];
        do {
            res.push(node);
            node = node.parent;
        } while (node)
        return res;
    }
}

export interface IMapNode {
    width: number
    height: number
    x: number
    y: number
    /**地形消耗(预留) */
    cost?: number
    /**地形（预留） */
    terrain?: terrain_type
    parent?: IMapNode
    G?: number
    H?: number
    F?: number
}

/**按大小顺序，越大消耗越高 */
export enum terrain_type {
    water,
    normal,
    fly,
    unwalk
}

/**可以移动的方式 */
export enum move_type {
    walk = terrain_type.normal,
    fly = terrain_type.fly
}