export class ArrayUtils {
    static find<v>(arr: v[], cb: (ele: v) => boolean): v | null {
        for (let i of arr) {
            if (cb(i)) return i;
        }
        return null;
    }

    /**除重 */
    static unique(arr: any[]): any[] {
        return Array.from(new Set(arr));
    }

}