
class InteligentEnemy {
    constructor(x, y, map) {
        this.map = map;
        this.x = x;
        this.y = y;
        this.slow = 0;
        this.color = 8;
    }

    update(player) {
        if (this.map.hasBlockSlow(this.x, this.y)) {
            if (this.slow === 0) {
                this.slow = this.map.getSlow(this.x, this.y);
                return;
            } else {
                this.slow--;
                if (this.slow > 0)
                    return;
            }
        }
        
        const shortestPaths = dijkstra(map, this.x, this.y, player.x, player.y);

        if(shortestPaths === undefined){
            return;
        }
        
        // [this.x, this.y] = shortestPaths.nextPosition(player.x, player.y);
    }

    render() {
        this.map.setColor(this.x, this.y, this.color);
    }

    collide(obj){
        return hasCollided(this, obj);
    }
}