import ResourceMgr from "../../ResourceMgr";
import IView from "./IView";
import { cachePanel, getPanel, getPanelVo, panelLayer, PanelRegister, clearPanel } from "./PanelRegister";

export default class ViewMgr extends Laya.EventDispatcher {
    private panelLayer: Laya.Box
    private static _ins: ViewMgr;
    private currentPanelMap: { [layer: number]: number } = {};//各个层级打开的面板
    private cachePanel: PanelRegister[] = [];//缓存面板
    readonly maxCacheNum: number = 0;//缓存页面数量
    // private historyArr: IView[] = [];
    constructor() {
        super();
        Laya.stage.addChild(this.panelLayer = new Laya.Box)
    }
    static get ins(): ViewMgr {
        return ViewMgr._ins || (ViewMgr._ins = new ViewMgr)
    }

    /**
     * 打开面板
     * @param id 注册面板
     * @param args 面板open方法调用参数
     */
    openPanel(id: PanelRegister, ...args: any[]) {
        let vo = getPanelVo(id);
        if (this.currentPanelMap[vo[3]] === id) return;
        this.closePanel(this.currentPanelMap[vo[3]]);
        this.currentPanelMap[vo[3]] = id;
        let dependenceArr: string[] = [];
        if (vo[1]) {
            for (let url of vo[1]) {
                ResourceMgr.ins.addAtlasRefrence(url);//添加图集引用计数
            }
            dependenceArr = dependenceArr.concat(vo[1]);
        }
        vo[2] && (dependenceArr = dependenceArr.concat(vo[2]));
        if (dependenceArr.length)
            Laya.loader.load(dependenceArr, Laya.Handler.create(this, this.loadComplete, [id, ...args]));
        else
            this.loadComplete(id, ...args);
    }

    /**
     * 关闭面板
     * @param id 注册面板id
     */
    closePanel(id: PanelRegister): void {
        if (!id) return;
        let vo = getPanelVo(id);
        if (!vo) {
            console.error(`未注册面板:${id}`)
            return;
        }
        // this.clearPanelDependence(id);
        //加入缓存队列
        let idx = this.cachePanel.indexOf(id);
        if (idx >= 0) {
            this.cachePanel.splice(idx, 1);
        }
        this.cachePanel.push(id);
        this.currentPanelMap[vo[3]] = null;
        let panel = getPanel(id);
        if (panel) {
            panel.removeSelf();
            panel.close();
        }
    }

    /**
     * 尝试销毁面板
     * @param count 销毁数量
     */
    tryDestoryPanel(count: number = 1): void {
        if (this.cachePanel.length <= this.maxCacheNum) return;
        let panels: PanelRegister[] = this.cachePanel.splice(0, this.cachePanel.length - this.maxCacheNum <= count ? this.cachePanel.length - this.maxCacheNum : count)
        while (panels.length) {
            let id: PanelRegister = panels.pop();
            this.clearPanelDependence(id);
            if (getPanel(id))
                getPanel(id).destroy(true);
            clearPanel(id);
        }
    }

    private clearPanelDependence(id: number): void {
        let vo = getPanelVo(id);
        if (vo[1]) {
            for (let k of vo[1]) {
                ResourceMgr.ins.removeAtlasRefrence(k, true);
            }
        }
    }


    private loadComplete(id: number, ...args: any[]): void {
        let panel = getPanel(id);
        if (!panel) {
            panel = new (getPanelVo(id)[0]);
            cachePanel(id, panel);
        }
        panel.open(...args)
        let vo = getPanelVo(id);
        if (this.currentPanelMap[vo[3]] === id) {
            this.panelLayer.addChild(panel);
        }
    }
}