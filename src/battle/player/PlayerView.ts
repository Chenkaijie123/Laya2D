import Movie from "../../view/Movie/Movie";
import PoolUtil from "../../utils/pool/PoolUtil";
import PlayerAppearanceInfo from "./model/PlayerAppearanceInfo";

export default class PlayerView extends Laya.Box {
    direction: direction = direction.dwon;
    action: action_type;

    appearance: PlayerAppearanceInfo
    private movieMap: Map<number, Movie> = new Map;

    private sortLayer(): void {
        this._children.sort(
            (a, b) => a["mvType"] - b["mvType"]
        );
    }

    setInfo(info: PlayerAppearanceInfo): void {
        this.appearance = info;
    }

    clear(): void {
        this.appearance = null;
        this.movieMap.forEach((v) => {
            v.removeSelf();
            PoolUtil.Movie.release(v)
        });
        this.movieMap.clear();
    }

    play(action: action_type, dir: direction = this.direction): void {
        this.direction = dir;
        this.action = action;
        this.setAppearance(dir, action);
    }

    private setMovie(type: player_movie_type, url: string): void {
        let mv = this.movieMap.get(type) || PoolUtil.Movie.create();
        mv.loopPlay = true;
        mv["mvType"] = type;
        mv.autoPlay = true;
        mv.skin = url;
        this.movieMap.set(type, mv);
        this.addChild(mv);
        this.callLater(this.sortLayer);
    }

    /**设置模型 */
    private setAppearance(dir: direction, action: action_type): void {
        let info = this.appearance;
        if (!info) return;
        this.setMovie(player_movie_type.body, this.getUrlByID(info.bodyID, dir, action));
    }

    private getUrlByID(id: string | number, dir: direction, action: action_type): string {
        let dirFlag = dir > 4 ? 8 - dir : dir;
        return `asset/${id}${action}${dirFlag}.json`;
    }
}

/**所有序列帧类型，层级 */
export enum player_movie_type {
    body, weapon
}

export enum direction {
    up, up_right, right, right_down, dwon, down_left, left, left_up
}

export enum action_type {
    stand = 1, run, attack
}