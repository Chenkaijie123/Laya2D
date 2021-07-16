

export class MapStruct <K, V>{
    private keys: K[] = []
    private values: V[] = []
    private _size = 0;
    constructor() {
    }

    clear(): void {
        this.keys.length = this.values.length = this._size = 0;
    }

    delete(key: K): boolean {
        let idx = this.keys.indexOf(key);
        if (idx == -1) {
            return false;
        }
        this.keys.splice(idx, 1);
        this.values.splice(idx, 1);
        this._size--;
        return true;
    }
    forEach(callbackfn: (value: V, key: K, map: this) => void, thisArg?: any): void {
        for (let i = 0, len = this.keys.length; i < len; i++) {
            callbackfn(this.values[i], this.keys[i], this)
        }
    }
    get(key: K): V | undefined {
        let idx = this.keys.indexOf(key);
        return this.values[idx];
    }
    has(key: K): boolean {
        return this.keys.indexOf(key) >= 0;
    }
    set(key: K, value: V): this {
        let idx = this.keys.indexOf(key);
        if (idx >= 0) {
            this.values[idx] = value;
        } else {
            this.keys.push(key)
            this.values.push(value);
            this._size++;
        }
        return this;
    }
    get size(): number {
        return this._size;
    }
}