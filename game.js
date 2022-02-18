const COLORS = ['black', 'lightgray', 'yellow', 'orange', 'red', 'blue', 'purple']
const SLOW_TIME = [2, 5, 10]
const WIDTH = 28;
const HEIGTH = 31;
const TIMEOUT = 150;

const inimigos = [
    createInimigo(1, 1),
    createInimigo(1, 26),
    createInimigo(29, 26)
]

const player = createPlayer(28, 1);

function createInimigo(x, y) {
    return {
        x: x,
        y: y,
        slow: 0,
        color: 5,
        vel: {
            x: 1,
            y: 0,
        }
    }
}

function createPlayer(x, y) {
    return {
        x: x,
        y: y,
        slow: 0,
        color: 6,
        vel: {
            x: -1,
            y: 0,
        }
    }
}

function start() {
    renderMap();
    setInterval(() => {
        updateInimigosList();
        renderMap();
        renderInimigos();
        updatePlayer(player);
        renderPlayer(player);
    }, TIMEOUT);
}

function updateInimigosList() {
    inimigos.forEach(j => updateInimigo(j))
}

function updatePlayer(jogador) {
    const colorIndex = map[jogador.x][jogador.y]

    if (colorIndex > 1) {
        //console.log(jogador.slow)
        if (jogador.slow === 0) {
            jogador.slow = getSlowTime(colorIndex)
            return;
        } else {
            jogador.slow--;
            if (jogador.slow > 0)
                return;
        }
    }

    let y = jogador.y + jogador.vel.y
    let x = jogador.x + jogador.vel.x
    let nextBlock = map[x][y];

    if (!isBlockFree(nextBlock)) {
        jogador.vel.x = 0;
        jogador.vel.y = 0;
    }

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case "ArrowUp":
                if (isBlockFree(nextBlock)) {
                    jogador.vel.x = -1;
                    jogador.vel.y = 0;
                }
                break;
            case "ArrowDown":
                if (isBlockFree(nextBlock)) {
                    jogador.vel.x = 1;
                    jogador.vel.y = 0;
                }
                break;
            case "ArrowLeft":
                if (isBlockFree(nextBlock)) {
                    jogador.vel.x = 0;
                    jogador.vel.y = -1;
                }
                break;
            case "ArrowRight":
                if (isBlockFree(nextBlock)) {
                    jogador.vel.x = 0;
                    jogador.vel.y = 1;
                }
                break;
            default:
                break;
        }
    }, false);

    jogador.x += jogador.vel.x;
    jogador.y += jogador.vel.y;
}

function updateInimigo(jogador) {
    const colorIndex = map[jogador.x][jogador.y]

    if (colorIndex > 1) {
        //console.log(jogador.slow)
        if (jogador.slow === 0) {
            jogador.slow = getSlowTime(colorIndex)
            return;
        } else {
            jogador.slow--;
            if (jogador.slow > 0)
                return;
        }
    }

    let y = jogador.y + jogador.vel.y
    let x = jogador.x + jogador.vel.x
    let nextBlock = map[x][y];

    if (possiblePaths(jogador) > 2)
        nextBlock = randomPlayerPosition(jogador);

    while (!isBlockFree(nextBlock))
        nextBlock = randomPlayerPosition(jogador);

    jogador.x += jogador.vel.x;
    jogador.y += jogador.vel.y;
}

function possiblePaths(jogador) {
    let paths = 0;

    if (isBlockFree(map[jogador.x + 1][jogador.y]))
        paths++;
    if (isBlockFree(map[jogador.x - 1][jogador.y]))
        paths++;
    if (isBlockFree(map[jogador.x][jogador.y + 1]))
        paths++;
    if (isBlockFree(map[jogador.x][jogador.y - 1]))
        paths++;

    return paths;
}

function randomPlayerPosition(jogador) {
    if (getRandomBool()) {
        jogador.vel.x = getRandomBool() ? 1 : -1;
        jogador.vel.y = 0;
    } else {
        jogador.vel.x = 0;
        jogador.vel.y = getRandomBool() ? 1 : -1;
    }

    y = jogador.y + jogador.vel.y;
    x = jogador.x + jogador.vel.x;
    return map[x][y];
}

function getSlowTime(colorIndex) {
    return SLOW_TIME[colorIndex - 2];
}

function getRandomBool() {
    return getRandomInt(0, 2) === 0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function isBlockFree(block) {
    return block > 0;
}

function renderMap() {
    let html = '<table>'
    for (let row = 0; row < HEIGTH; row++) {
        html += '<tr>'
        for (let column = 0; column < WIDTH; column++) {
            let color = COLORS[map[row][column]];
            html += `<td id="${getID(row, column)}" class="celula"style="background-color: ${color}"></td>`
        }
        html += '</tr>'
    }
    window.document.querySelector("#game").innerHTML = html;
}

function getID(x, y) {
    return `block-${x}-${y}`
}

function renderInimigos() {
    inimigos.forEach(j => {
        window.document.querySelector(`#${getID(j.x, j.y)}`).style.backgroundColor = COLORS[j.color]
    })
}

function renderPlayer(jogador) {
    window.document.querySelector(`#${getID(jogador.x, jogador.y)}`).style.backgroundColor = COLORS[jogador.color]
}

start()