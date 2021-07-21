import GameConfig from "./GameConfig";
import RedTipMgr from "./redTip/RedTipMgr";
import RedTipTest from "./redTip/RedTipTest";
import ResourceMgr from "./ResourceMgr";
import { ui } from "./ui/layaMaxUI";
import { PanelRegister } from "./view/base/PanelRegister";
import ViewMgr from "./view/base/ViewMgr";
import MapScene from "./battle/map/view/MapScene";
import App from "./App";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		// Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
		this.onConfigLoaded();
		ResourceMgr.ins.startCheck();
	}
	static app:App;
	onConfigLoaded(): void {
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene,true,null,Laya.Handler.create(this,this.openScene));
		// this.createBtn(
		// ["btn1",()=>{ViewMgr.ins.openPanel(PanelRegister.PANEL1)}],
		// ["btn2",()=>{ViewMgr.ins.openPanel(PanelRegister.PANEL2)}],
		// ["btn3",()=>{ViewMgr.ins.openPanel(PanelRegister.PANEL3)}]
		// );
		Main.app = new App;
		
	}

	createBtn(...btns:[string,Function][]):void{
		let _x = 0;
		for(let arr of btns){
			let lab = new Laya.Label;
			lab.color = "#fff"
			lab.text = arr[0]
			Laya.stage.addChild(lab)
			lab.x = _x;
			lab.fontSize = 30
			_x += 100
			lab.on(Laya.Event.CLICK,this,arr[1])
		}
	}

	openScene(sence:Laya.Scene):void{

	}
}

//激活启动类
new Main();
