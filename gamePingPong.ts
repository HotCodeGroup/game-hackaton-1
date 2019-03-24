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

enum collision_type {
    right,
    left,
    up,
    down
}

function intersection(ax1: number, ay1: number, ax2: number, ay2: number, bx1: number, by1: number, bx2: number, by2: number): boolean {
    let v1 = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
    let v2 = (bx2 - bx1) * (ay2 - by1) - (by2 - by1) * (ax2 - bx1);
    let v3 = (ax2 - ax1) * (by1 - ay1) - (ay2 - ay1) * (bx1 - ax1);
    let v4 = (ax2 - ax1) * (by2 - ay1) - (ay2 - ay1) * (bx2 - ax1);
    return (v1 * v2 < 0) && (v3 * v4 < 0);
}


function collision(p: Player, b: Ball) {
    let bRelVx = b.vX - p.vX;
    let bRelVy = b.vY - p.vY;

    let p_left = p.x - p.width / 2;
    let p_right = p.x + p.width / 2;
    let p_down = p.y - p.height / 2;
    let p_up = p.x + p.height / 2;

    let b_left = b.x - b.diameter / 2;
    let b_right = b.x + b.diameter / 2;
    let b_down = b.y - b.diameter / 2;
    let b_up = b.x + b.diameter / 2;

    if (p_right < b_left) {
        let inter =
            intersection(p_down, p_right, p_up, p_right, b_down, b_left, b_down + bRelVy, b_left + bRelVx) ||
            intersection(p_down, p_right, p_up, p_right, b_up, b_left, b_up + bRelVy, b_left + bRelVx);
        if (inter) {
            let to_ratio = bRelVx / (b_left - p_right);
            let out_ratio = 1 - to_ratio;
            b.x += to_ratio * b.vX - out_ratio * b.vX;
            b.y += b.vY;
            b.vX = - b.vX;
        }
    }

    if (p_left > b_right) {
        let inter =
            intersection(p_down, p_left, p_up, p_left, b_down, b_right, b_down + bRelVy, b_right + bRelVx) ||
            intersection(p_down, p_left, p_up, p_left, b_up, b_right, b_up + bRelVy, b_right + bRelVx);
        if (inter) {
            let to_ratio = bRelVx / (p_left - b_right);
            let out_ratio = 1 - to_ratio;
            b.x += to_ratio * b.vX - out_ratio * b.vX;
            b.y += b.vY;
            b.vX = - b.vX;
        }
    }

    if (p_up < b_down) {
        let inter =
            intersection(p_left, p_up, p_right, p_up, b_left, b_down, b_left + bRelVx, b_down + bRelVy) ||
            intersection(p_left, p_up, p_right, p_up, b_right, b_down, b_right + bRelVx, b_down + bRelVy);
        if (inter) {
            let to_ratio = bRelVy / (b_down - p_up);
            let out_ratio = 1 - to_ratio;
            b.y += to_ratio * b.vY - out_ratio * b.vY;
            b.x += b.vX;
            b.vY = - b.vY;
        }
    }

    if (p_down > b_up) {
        let inter =
            intersection(p_left, p_down, p_right, p_down, b_left, b_up, b_left + bRelVx, b_up + bRelVy) ||
            intersection(p_left, p_down, p_right, p_down, b_right, b_up, b_right + bRelVx, b_up + bRelVy);
        if (inter) {
            let to_ratio = bRelVy / (p_down - b_up);
            let out_ratio = 1 - to_ratio;
            b.y += to_ratio * b.vY - out_ratio * b.vY;
            b.x += b.vX;
            b.vY = - b.vY;
        }
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
        return {
            "player_1": {
                "x": this.player1.x / this.fieldWidth,
                "y": this.player1.y / this.fieldHeight
            },
            "player_2": {
                "x": this.player2.x / this.fieldWidth,
                "y": this.player2.y / this.fieldHeight
            },
            "ball": {
                "x": this.ball.x / this.fieldWidth,
                "y": this.ball.y / this.fieldHeight
            }
        };
    }

    isDone(): number {
        if (this.ball.x - this.ball.diameter / 2 <= 0)
            return 2;
        if (this.ball.x + this.ball.diameter / 2 >= this.fieldWidth)
            return 1;
        return 0;
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