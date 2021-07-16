import RedTipBase from "./RedTipBase";
import {red1,red2} from "./RedTipTest"
export default class RedTipMgr{
    private redArray:RedTipBase[] = []
    constructor(){
        this.init();
    }

    private init():void{
        this.register();
        for(let i of this.redArray){
            i._init();
        }
    }

    private register():void{
        this.redArray = [
            red1.ins,
            red2.ins,
        ]

    }
}