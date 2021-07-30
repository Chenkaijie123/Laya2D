import { PoolBase } from "../PoolBase";
import Movie from "../../../view/Movie/Movie";

export default class MoviePool extends PoolBase<Movie>{
    create(): Movie {
        let node = this.pool.pop() || new Movie;
        return node;
    }
    release(node: Movie): void {
        node.clear();
        this.pool.push(node);
    }
}