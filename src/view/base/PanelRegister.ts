import RedTipTest from "../../redTip/RedTipTest";
import IView from "./IView";
import View1, { View2 } from "../View1";
let id: number = 1;
const map: { [key: number]: [new () => IView, string[], string[], panelLayer] } = {};
const panelInstanceMap: { [id: number]: IView } = {};
/**
 * 
 * @param view 注册面板
 * @param dependtenceAtlas 依赖图集
 * @param dependtenceCfgs 依赖配置
 * @returns 面板id
 */
export function registerPanel(view: new () => IView, layer: panelLayer, dependtenceAtlas?: string[], dependtenceCfgs?: string[]): number {
    let key = id++;
    map[key] = [view, dependtenceAtlas, dependtenceCfgs, layer];
    return key;
}

export function cachePanel(id: number, panel: IView): void {
    panelInstanceMap[id] = panel;
}

export function clearPanel(id:number):void{
    delete panelInstanceMap[id];
}

/**面板实例 */
export function getPanel(id: number): IView | null {
    return panelInstanceMap[id]
}

/**面板配置 */
export function getPanelVo(id: number) {
    return map[id];
}



export enum panelLayer {
    base, middle, top
}

export enum PanelRegister {
    PANEL1 = registerPanel(RedTipTest, panelLayer.base, ["res/atlas/comp.atlas"]),
    PANEL2 = registerPanel(View1,panelLayer.base,["res/atlas/test.atlas"]),
    PANEL3 = registerPanel(View2,panelLayer.base)
}
