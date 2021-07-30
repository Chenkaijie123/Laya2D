import { ArrayUtils } from "../utils/ArrayUtils";
import { MapStruct } from "../utils/MapStruct";

/**
 * 红点管理
 * 分离显示和数据，每个节点都有一个状态，可以把红点实例与任意节点绑定/解绑
 * 节点可以绑定handle或者通过关系其他节点实现更新，更新是自动的，同时如果有绑定实例，实例的状态也会自动更新
 * 
 */
export default class RedTipBase extends Laya.EventDispatcher {
    private temp: RedTipBase;
    private tempTarget: string[];
    // private tempName:string;
    /**关心列表 */
    private careMap: MapStruct<string, [RedTipBase, string[]][]> = new MapStruct;
    /**红点状态缓存 */
    private stateMap: MapStruct<string, boolean> = new MapStruct;
    /**绑定红点实例 */
    private bindRedTip: MapStruct<string, Laya.Sprite[]> = new MapStruct;
    /**节点与handle映射 */
    private registerMap: MapStruct<string, [Function, any]> = new MapStruct;
    static get ins(): RedTipBase {
        let s: any = this;
        return s["_ins_"] || (s["_ins_"] = new s);
    }

    public _init():void{
        this.init();
    }

    protected init():void{
        throw new Error("在init方法中绑定触发点或者关系节点")
    }

    /**
     * 注册节点更新handle,没注册也不影响，可以只关心其他节点，节点的创建是任意的
     * @param name 
     * @param call 
     * @param caller 
     */
    register(name: string, fn: () => boolean, caller: any) {
        this.registerMap.set(name, [fn, caller]);
        return this.bindHandle.bind(this,name);
    }

    /**
     * 绑定外部触发点，比如游戏模块数据层更新数据，绑定红点触发，在调用完register后面直接调用
     */
    private bindHandle(name:string,eventName:string,dispatcher:Laya.EventDispatcher){
        dispatcher.on(eventName,this,this.emit,[name]);
        return this.bindHandle.bind(this,name);
    }

    debugCheck():void{
        
    }


    /**
     * 绑定关心节点
     * @param t 
     * @returns 
     */
    takecare(t: RedTipBase) {
        this.temp = t;
        return this;
    }
    /**
     * 绑定本红点管理器的红点节点
     */
    bindName(...flags: string[]) {
        this.tempTarget = flags;
        return this;
    }

    /**
     * 关心节点的红点节点名
     */
    care(...flags: string[]) {
        //为关系节点添加改变触发handle
        for (let f of flags) {
            this.temp.on(f, this, this.childrenChange, [this.tempTarget]);
        }
        let strArr:string[]
        for (let k of this.tempTarget) {
            let ls = this.careMap.get(k);
            if (ls) {
                let target = ArrayUtils.find(ls, (v) => {
                    return v[0] == this.temp;
                })
                if (target) {
                    strArr = ArrayUtils.unique(target[1].concat(flags));
                    target[1].length = 0;
                    target[1].push(...strArr);
                } else {
                    ls.push([this.temp, flags]);
                }
            } else {
                this.careMap.set(k, [[this.temp, flags]]);
            }
        }
    }

    /**
     * 触发红点计算
     * @param flag 
     */
    emit(flag: string): void {
        this.change(flag);
    }

    /**
     * 为红点绑定执行handle
     * @param name 红点名
     * @param redTip 红点实例
     */
    bindRed(name: string, redTip: Laya.Sprite): void {
        let ls = this.bindRedTip.get(name);
        if (!ls) {
            this.bindRedTip.set(name, [redTip]);
        } else {
            if (ls.indexOf(redTip) == -1) {
                ls.push(redTip);
            }
        }
        redTip.visible = this.getStatus(name);
    }

    /**
     * 解绑红点，只是解绑红点显示，数据层仍会计算
     * @param name 
     * @param redTip 
     */
    unBindRed(name: string, redTip: Laya.Sprite): void {
        let ls = this.bindRedTip.get(name);
        if (ls) {
            ls.splice(ls.indexOf(redTip), 1);
        }
    }

    /**
     * 获取红点节点状态
     */
    getStatus(flag: string): boolean {
        let res = !!this.stateMap.get(flag);
        if (res) return true;
        let map = this.careMap.get(flag);
        if (map) {
            for (let t of map) {
                for (let k of t[1]) {
                    if (t[0].getStatus(k)) return true;
                }
            }
        }
        return false;
    }



    private setRedTip(flag: string, state: boolean): void {
        let ls = this.bindRedTip.get(flag);
        if (ls) {
            for (let i of ls) {
                i.visible = state;
            }
        }
    }


    /**子节点状态改变，不会触发新计算，拿缓存 */
    private childrenChange(targerFlags: string[], status: boolean): void {
        let value: boolean = status;
        for (let k of targerFlags) {
            status = value || this.getStatus(k);
            //设置红点实例
            this.setRedTip(k, status);
            //通知父节点
            this.event(k, value);
        }
    }

    /**本节点状态改变 */
    private change(flag: string): void {
        let status = this.calculate(flag);
        this.stateMap.set(flag, status);
        status = status || this.getStatus(flag)
        //更新视图
        this.setRedTip(flag, status);
        //通知父节点
        this.event(flag, status);
    }

    /**重新计算 */
    private calculate(flag: string): boolean {
        if (this.registerMap.has(flag)) {
            let [fn, caller] = this.registerMap.get(flag);
            let res = fn.call(caller);
            // this.stateMap.set(flag, res);
            return res;
        } else {
            console.warn(`红点钩子${flag}未添加处理函数`);
            return false;
        }
    }
}