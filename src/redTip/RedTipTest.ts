
import { ui } from "../ui/layaMaxUI";
import IView from "../view/base/IView";
import RedTipBase from "./RedTipBase";

export default class RedTipTest extends ui.test.ViewTestUI implements IView{
    constructor(){
        super();
        this.loop()
    }

    open():void{
        let img = new Laya.Image;
        img.skin = "comp/image.png"
        this.addChild(img)
    }


    createView(view:any){
        super.createView(view)
        red1.ins.bindRed("A1",this.A1)
        red1.ins.bindRed("A2",this.A2)
        red1.ins.bindRed("A3",this.A3)
        red2.ins.bindRed("B1",this.B1)
        red2.ins.bindRed("B2",this.B2)
    }

    loop(){

        Laya.timer.loop(500,this,() => {
            // red1.ins.emit("A2")
            // red1.ins.emit("A1")
            // red1.ins.emit("A3")
            // red2.ins.emit("B1")
            // red2.ins.emit("B2")
            TestMDl.ins.event("UPDATE_INFO")
            TestMDl.ins.event("UPDATE_LV")
        })
    }
}

export class red1 extends RedTipBase{
    constructor(){
        super()
    }

    init():void{
        //绑定handle，触发点
        this.register("A2",this.A2,this)("UPDATE_INFO",TestMDl.ins)("UPDATE_LV",TestMDl.ins)
        this.register("A3",this.A3,this)("UPDATE_LV",TestMDl.ins)
        //构建关心列表
        this.takecare(red2.ins).bindName("A2").care("B1","B2")
        this.takecare(red2.ins).bindName("A1").care("B1","B2")
    }
    A1(){
        let a = 0;
        for(let i = 0;i < 10000;i++){
            a++;
        }
        return Math.random() > 0.5;
    }

    A2(){
        let a = 0;
        for(let i = 0;i < 10000;i++){
            a++;
        }
        return Math.random() > 0.5;
    }

    A3(){
        let a = 0;
        for(let i = 0;i < 10000;i++){
            a++;
        }
        return Math.random() > 0.5;
    }
}

export class red2 extends RedTipBase{
    constructor(){
        super()

    }
    init(){
        this.register("B1",this.B1,this)("UPDATE_LV",TestMDl.ins)
        this.register("B2",this.B2,this)("UPDATE_INFO",TestMDl.ins)
    }
    B1(){
        let a = 0;
        for(let i = 0;i < 10000;i++){
            a++;
        }
        return Math.random() > 0.5;
    }
    B2(){
        let a = 0;
        for(let i = 0;i < 10000;i++){
            a++;
        }
        return Math.random() > 0.5;
    }
}

class TestMDl extends Laya.EventDispatcher{
    static get ins():TestMDl{
        return TestMDl["_ins"] || (TestMDl["_ins"] = new TestMDl)
    }
}




