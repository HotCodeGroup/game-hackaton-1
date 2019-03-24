'use strict'

class GameObject {
    x: number;
    y: number;

    vX: number;
    vY: number;
    constructor(x: number, y: number, vX: number, vY: number) {
        this.x = x;
        this.y = y;

        this.vX = vX;
        this.vY = vY;
    }
}

class Player extends GameObject {
    height: number;
    width: number;

    constructor(x: number, y: number, height: number, width: number) {
        super(x, y, 0, 0); 

        this.height = height;
        this.width = width;
    }
}

class PlayablePlayer extends Player {
    constructor(p: Player) {
        super(p.x, p.y, p.height, p.width);
    }

    setMoveVector(speed: number, x: number, y: number) {
        let nSpeed = speed / Math.sqrt(x * x + y * y);
        this.vX = x * nSpeed;
        this.vY = y * nSpeed;
    }
}
class Ball extends GameObject {
    diameter: number;
    constructor(diameter: number, x: number, y: number, vX: number, vY: number) {
        super(x, y, vX, vY)
        this.diameter = diameter;
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

    getInfo(): any {
        return {
            "ratio": this.fieldWidth / this.fieldHeight
        }
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
        this.checkSpeed(p1);
        this.checkSpeed(p2);

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

     // Validators
     checkSpeed(p: Player) {
        if (Math.sqrt(p.vX * p.vX + p.vY * p.vY) > 10) {
            throw new Error("speed can not be > 10")
        }
    }
}

export { PlayablePlayer, Player, Ball, Game };