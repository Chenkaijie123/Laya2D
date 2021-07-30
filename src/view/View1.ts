

export default class View1 extends Laya.View{
    constructor(){
        super()
        let lab = new Laya.Label
        lab.text = "hello"
        lab.color = "#FF0000"
        this.addChild(lab);
        let img = new Laya.Image
        img.skin = "comp/image.png"//"test/c1.png"
        this.addChild(img)
    }
}

export class View2 extends Laya.View{
    constructor(){
        super()
    }
}