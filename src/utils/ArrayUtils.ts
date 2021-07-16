export class ArrayUtils{
    static find<v>(arr:v[],cb:(ele:v)=>boolean):v|null{
        for(let i of arr){
            if(cb(i)) return i;
        }
        return null;
    }

    /**除重 */
    static unique(arr:any[]):any[]{
        let left:number = 0,right:number = 0;
        while(left < arr.length){
            right = arr.lastIndexOf(arr[left],left)
            while(left != right){
                arr.splice(right);
                right = arr.lastIndexOf(arr[left],left);
            }
            left++;
        }
        return arr;
    }

}