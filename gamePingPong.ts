'use strict'

class Player {
    x: number;
    y: number;
    height: number;
    width: number;
    vX: number;
    vY: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
    }
}

function checkSpeed(p: Player){
    let speed1 = Math.sqrt(p.vX*p.vX + p.vY*p.vY);
    if(speed1 > 10){
        p.vX = 0;
        p.vY = 0;
    }
}

class PlayablePlayer extends Player {
    constructor(p: Player) {
        super(p.x, p.y);
    }

    setMoveVector(speed: number, x: number, y: number) {
        if (Math.abs(speed) > 10) {
            speed = 0;
        }
        let nSpeed = speed / Math.sqrt(x * x + y * y);
        this.vX = x * nSpeed;
        this.vY = y * nSpeed;
    }
}
class Ball {
    x: number;
    y: number;
    vX: number;
    vY: number;
    diameter: number;
}

class Game {
    player1: Player;
    player2: Player;
    ball: Ball;
    fieldHeight: number;
    fieldWidth: number;

    constructor(fieldHeight: number, fieldWidth: number) {
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;
    }

    getState(): any {
        return "json"
    }

    isDone(): boolean {
        return true;
    }

    getObjectsP1(): [PlayablePlayer, Player, Ball] {
        return [new PlayablePlayer(this.player1), Object.assign({}, this.player2), Object.assign({}, this.ball)];
    }

    getObjectsP2(): [PlayablePlayer, Player, Ball] {
        return [new PlayablePlayer(this.player2), Object.assign({}, this.player1), Object.assign({}, this.ball)];
    }

    saveObjects(p1: Player, p2: Player) {
        checkSpeed(p1);
        checkSpeed(p2);
    }
}

export { PlayablePlayer, Player, Ball, Game };