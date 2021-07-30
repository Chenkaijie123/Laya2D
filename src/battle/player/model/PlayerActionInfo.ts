export default class PlayerActionInfo{
    type:player_action_type
    endTime:number
    isDoing:boolean
    data:any
}
export enum player_action_type{
    /**移动 */
    move,
    /**攻击 */
    attack,
    /**被击杀 */
    dead,
    /**受击 */
    hit
}