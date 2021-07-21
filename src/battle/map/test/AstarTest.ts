import AStar, { IMapNode, terrain_type, move_type } from "../AStar"
import { ui } from "../../../ui/layaMaxUI";
import IView from "../../../view/base/IView";
let  startPoint:IMapNode= undefined,endPoint:IMapNode = undefined
export default class AstarTest extends ui.test.AstarUI implements IView {
    open(...args: any[]): void { }
    close(): void { }
   
    map:{[key:string]:SpNode} = {}
    constructor() {
        super()
        let arr = []
        for (let i = 0; i < 30; i++) {
            let rol = []
            arr.push(rol)
            for (let j = 0; j < 30; j++) {
                let node = new mapNode;
                let sp = new SpNode(node)
                this.map[`${j}_${i}`] = sp;
                sp.terrain = terrain_type.water;
                this.container.addChild(sp)
                sp.x = j * 15
                sp.y = i * 15
                node.x = j
                node.y = i
                node.width = 10
                node.height = 10
                rol.push(node)
            }
        }
        AStar.ins.init(arr);
        this.starBtn.on(Laya.Event.CLICK,this,()=>{
            startPoint = null
        })
        this.endBtn.on(Laya.Event.CLICK,this,()=>{
            endPoint = null
        })
        this.searchBtn.on(Laya.Event.CLICK,this,()=>{
            let res = AStar.ins.findPath(startPoint,endPoint,move_type.walk)
            const fn = ()=>{
                if(!res.length){
                    Laya.timer.clear(this,fn);
                    return;
                }
                let node = res.pop()
                this.map[`${node.x}_${node.y}`].graphics.clear()
            }
            Laya.timer.loop(300,this,fn)
        })
    }
}

class mapNode implements IMapNode {
    width: number
    height: number
    x: number
    y: number
    cost?: number
    terrain?: terrain_type
    flag?: number
    parent?: IMapNode
    G?: number
    H?: number
    F?: number
}

class SpNode extends Laya.Box {
    constructor(public node: IMapNode) {
        super();
        this.width = this.height = 10
        this.on(Laya.Event.RIGHT_CLICK,this,()=>{
            this.terrain = 3;
        })
        this.on(Laya.Event.CLICK, this, () => {
            if(startPoint === null){
                startPoint = this.node
                this.graphics.clear()
                return
            }
            if(endPoint === null){
                endPoint = this.node
                this.graphics.clear()
                return
            }
            if (this._terrain >= terrain_type.unwalk) {
                this._terrain = 0;
            } else {
                this._terrain++;
            }
            this.terrain = this._terrain;
        })
    }
    _terrain: terrain_type;
    set terrain(type: terrain_type) {
        this._terrain = type;
        this.node.terrain = type;
        let color: string;
        switch (type) {
            case terrain_type.water:
                color = "#1628ef"
                break
            case terrain_type.normal:
                color = "#7a80cd"
                break
            case terrain_type.fly:
                color = "#c37acd"
                break
            case terrain_type.unwalk:
                color = "#ee0e3b"
                break
        }
        let s = this.graphics;
        s.clear()
        s.drawCircle(0, 0, 5, color)
    }
}