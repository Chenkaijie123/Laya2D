export default class SetStruct<T>{
    private values: T[] = []
    private _size:number = 0;
    constructor(...args:T[]){
        for(let i of args){
            this.add(i);
        }
    }
    add(value: T): this {
        if(this.has(value)) return this;
        this.values.push(value);
        this._size++;
        return this;
    }
    clear(): void {
        this.values.length = this._size = 0;
    }
    delete(value: T): boolean {
        let idx = this.values.indexOf(value);
        if (idx === -1) {
            return false;
        }
        this.values.splice(idx, 1);
        this._size--;
        return true;
    }
    forEach(callbackfn: (value: T, value2: T, set: this) => void, thisArg?: any): void {
        for (let i of this.values) {
            callbackfn.call(thisArg, i, i, this);
        }
    }
    has(value: T): boolean{
        return this.values.indexOf(value) >= 0;
    }
    get size(): number{
        return this._size;
    }

}