const DEFAULT_EXPLORED = [Infinity, null];

class ExploredList {
    constructor(width, height) {
        this.arr = [];
        this.width = width;
        this.height = height;
    }

    getCost(x, y) {
        return this.arr[this.getIndex(x, y)][0];
    }

    getParent(x, y) {
        return this.arr[this.getIndex(x, y)][1];
    }

    setExplored(x, y, cost, parent) {
        this.arr[this.getIndex(x, y)] = [cost, parent];
    }

    getIndex(x, y) {
        return this.width * x + y;
    }

    getNode(x, y) {
        return this.arr[this.getIndex(x, y)];
    }

    isExplored(x, y) {
        return this.getCost(x, y) !== Infinity;
    }

    nextPosition(endX, endY) {
        let [currentX, currentY] = this.getParent(endX, endY);
        let [beforeX, beforeY] = [currentX, currentY];

        if (this.isStartNode(currentX, currentY)) {
            return [endX, endY];
        }

        while (!this.isStartNode(currentX, currentY)) {
            [beforeX, beforeY] = [currentX, currentY];
            [currentX, currentY] = this.getParent(currentX, currentY);
        }
        return [beforeX, beforeY]
    }

    isStartNode(x, y) {
        return this.getNode(x, y)[1] == null;
    }

    clean() {
        if (this.arr.length === 0) {
            for (let i = 0; i < this.width * this.height; i++) {
                this.arr.push(DEFAULT_EXPLORED);
            }
            return;
        }
        for (let i = 0; i < this.width * this.height; i++) {
            this.arr[i] = DEFAULT_EXPLORED;
        }
    }
}

const explored = new ExploredList(WIDTH, HEIGTH)

function dijkstra(map, startX, startY, findX, findY) {
    const pq = new PriorityQueue((a, b) => (a[0] < b[0]));

    explored.clean();
    pq.push([0, [startX, startY], null])

    while (!pq.isEmpty()) {
        const [cost, node, parent] = pq.pop();

        if (cost < explored.getCost(...node)) {
            explored.setExplored(...node, cost, parent);
        }

        if (equals(...node, findX, findY)) {
            return explored;
        }

        getAdj(...node, map, explored).forEach(adj => {
            const newCost = cost + map.getSlow(...adj);
            pq.push([newCost, adj, node])
        });
    }
}

const ADJ_POINTS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function getAdj(x, y, map, explored) {
    points = ADJ_POINTS.map(p => add(p, [x, y]));
    return points.filter(p => map.isWithinBounds(...p) && map.isBlockFree(...p, map) && !explored.isExplored(...p));
}

function getCostPQ(elemPQ) {
    return elemPQ[0];
}


