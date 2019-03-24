'use strict'

class Player {
    x: number;
    y: number;
    height: number;
    width: number;
    vX: number;
    vY: number;
    constructor(x: number, y: number, height: number, width: number) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.height = height;
        this.width = width;
    }
}

function checkSpeed(p: Player) {
    let speed1 = Math.sqrt(p.vX * p.vX + p.vY * p.vY);
    if (speed1 > 10) {
        p.vX = 0;
        p.vY = 0;
    }
}

class PlayablePlayer extends Player {
    constructor(p: Player) {
        super(p.x, p.y, p.height, p.width);
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
    constructor(diameter: number, x: number, y: number, vX: number, vY: number) {
        this.diameter = diameter;
        this.vY = vY;
        this.vX = vX;
        this.x = x;
        this.y = y;
    }
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
        this.player1 = new Player(fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.player2 = new Player(fieldWidth - fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.ball = new Ball(10, fieldWidth / 2, fieldHeight / 2, 5, 0);
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

    ballPossitionCorrection() {

    }

    ballCorrectionP1(): boolean {
        if (this.player1.x + this.player1.width / 2 + this.player1.vX < this.ball.x - this.ball.diameter / 2 + this.ball.vX) {
            return false;
        } else {
            let ballRelspeedx = this.ball.vX - this.player1.vX;
            let ballRelspeedy = this.ball.vY - this.player1.vY;
        }
    }

    ballCorrectionP2(): boolean {
        if (this.player1.x + this.player1.vX < this.ball.x + this.ball.vX) {
            return false;
        }
    }

    p1PossitionCorrection() {

    }

    p2PossitionCorrection() {

    }

    saveObjects(st1: [PlayablePlayer, Player, Ball], st2: [PlayablePlayer, Player, Ball]) {
        let p1 = st1[0];
        let p2 = st2[0];
        checkSpeed(p1);
        checkSpeed(p2);

        this.player1.vX = p1.vX;
        this.player1.vY = p1.vY;
        this.player2.vX = p2.vX;
        this.player2.vY = p2.vY;

        this.ballCorrectionP1();
        this.ballCorrectionP2();

        this.player1.x += this.player1.vX;
        this.player1.y += this.player1.vY;
        this.player2.x += this.player2.vX;
        this.player2.y += this.player2.vY;

        this.p1PossitionCorrection();
        this.p2PossitionCorrection();
    }
}

export { PlayablePlayer, Player, Ball, Game };