
export abstract class PoolBase<T>{
    protected static _ins: any;
    protected pool: T[] = []
    static get ins() {
        let t: any = this;
        if (!t["_ins"]) t["_ins"] = new t;
        return t["_ins"];
    }

    create(...args): any { }
    release(node: T): void { }
}