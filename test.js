'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = /** @class */ (function () {
    function GameObject(x, y, vX, vY) {
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
    }
    return GameObject;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y, height, width) {
        var _this = _super.call(this, x, y, 0, 0) || this;
        _this.height = height;
        _this.width = width;
        return _this;
    }
    return Player;
}(GameObject));
var PlayablePlayer = /** @class */ (function (_super) {
    __extends(PlayablePlayer, _super);
    function PlayablePlayer(p) {
        return _super.call(this, p.x, p.y, p.height, p.width) || this;
    }
    PlayablePlayer.prototype.setMoveVector = function (speed, x, y) {
        var nSpeed = speed / Math.sqrt(x * x + y * y);
        this.vX = x * nSpeed;
        this.vY = y * nSpeed;
    };
    return PlayablePlayer;
}(Player));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(diameter, x, y, vX, vY) {
        var _this = _super.call(this, x, y, vX, vY) || this;
        _this.diameter = diameter;
        return _this;
    }
    return Ball;
}(GameObject));
var Game = /** @class */ (function () {
    function Game(fieldHeight, fieldWidth) {
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;
        this.player1 = new Player(fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.player2 = new Player(fieldWidth - fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.ball = new Ball(10, fieldWidth / 2, fieldHeight / 2, 5, 0);
    }
    Game.prototype.getInfo = function () {
        return {
            "ratio": this.fieldWidth / this.fieldHeight
        };
    };
    Game.prototype.getState = function () {
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
    };
    Game.prototype.isDone = function () {
        if (this.ball.x - this.ball.diameter / 2 <= 0)
            return 2;
        if (this.ball.x + this.ball.diameter / 2 >= this.fieldWidth)
            return 1;
        return 0;
    };
    Game.prototype.getObjectsP1 = function () {
        return [new PlayablePlayer(this.player1), Object.assign({}, this.player2), Object.assign({}, this.ball)];
    };
    Game.prototype.getObjectsP2 = function () {
        return [new PlayablePlayer(this.player2), Object.assign({}, this.player1), Object.assign({}, this.ball)];
    };
    Game.prototype.ballPossitionCorrection = function () {
    };
    Game.prototype.ballCorrectionP1 = function () {
        if (this.player1.x + this.player1.width / 2 + this.player1.vX < this.ball.x - this.ball.diameter / 2 + this.ball.vX) {
            return false;
        }
    };
    Game.prototype.ballCorrectionP2 = function () {
        if (this.player1.x + this.player1.vX < this.ball.x + this.ball.vX) {
            return false;
        }
    };
    Game.prototype.p1PossitionCorrection = function () {
    };
    Game.prototype.p2PossitionCorrection = function () {
    };
    Game.prototype.saveObjects = function (st1, st2) {
        var p1 = st1[0];
        var p2 = st2[0];
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
    };
    // Validators
    Game.prototype.checkSpeed = function (p) {
        if (Math.sqrt(p.vX * p.vX + p.vY * p.vY) > 10) {
            throw new Error("speed can not be > 10");
        }
    };
    return Game;
}());

var Tester = /** @class */ (function () {
    function Tester(p1, p2, g, count) {
        this.player1 = p1;
        this.player2 = p2;
        this.ticksCount = count;
        this.game = g;
    }
    Tester.prototype.run = function () {
        var winner = 0; //0 это ничья
        var ticks = [];
        for (var tick = 0; tick < this.ticksCount; tick++) {
            var p1Args = this.game.getObjectsP1();
            var p2Args = this.game.getObjectsP2();
            this.player1.apply(this, p1Args);
            this.player2.apply(this, p2Args);
            this.game.saveObjects(p1Args, p2Args);
            ticks.push(this.game.getState());
            var res = this.game.isDone();
            if (res != 0) {
                winner = res;
                break;
            }
        }
        return {
            "info": this.game.getInfo(),
            "states": ticks,
            "winner": winner,
        };
    };
    return Tester;
}());

var runCode = function (code) {
    var bot = function (me, enemy, ball) {
        me.setMoveVector(1, 0, -1);
    };
    var p1 = new Function("me", "enemy", "ball", code);
    var g = new Game(250, 500);
    var t = new Tester(p1, bot, g, 10000);
    console.log(JSON.stringify(t.run()));
};


const tarea = document.createElement('textarea')
let button = document.createElement('button');
button.textContent = "Сделать крута";
button.onclick = function() {
    try {
        runCode(tarea.value)
    } catch(e) {
        alert(e)
    }
}

document.body.appendChild(tarea);
document.body.appendChild(button);