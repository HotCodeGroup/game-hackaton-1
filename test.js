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
var Player = /** @class */ (function () {
    function Player(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.height = height;
        this.width = width;
    }
    return Player;
}());
function checkSpeed(p) {
    var speed1 = Math.sqrt(p.vX * p.vX + p.vY * p.vY);
    if (speed1 > 10) {
        p.vX = 0;
        p.vY = 0;
    }
}
var PlayablePlayer = /** @class */ (function (_super) {
    __extends(PlayablePlayer, _super);
    function PlayablePlayer(p) {
        return _super.call(this, p.x, p.y, p.height, p.width) || this;
    }
    PlayablePlayer.prototype.setMoveVector = function (speed, x, y) {
        if (Math.abs(speed) > 10) {
            speed = 0;
        }
        var nSpeed = speed / Math.sqrt(x * x + y * y);
        this.vX = x * nSpeed;
        this.vY = y * nSpeed;
    };
    return PlayablePlayer;
}(Player));
var Ball = /** @class */ (function () {
    function Ball(diameter, x, y, vX, vY) {
        this.diameter = diameter;
        this.vY = vY;
        this.vX = vX;
        this.x = x;
        this.y = y;
    }
    return Ball;
}());
var Game = /** @class */ (function () {
    function Game(fieldHeight, fieldWidth) {
        this.fieldHeight = fieldHeight;
        this.fieldWidth = fieldWidth;
        this.player1 = new Player(fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.player2 = new Player(fieldWidth - fieldWidth / 10, fieldHeight / 2, fieldHeight / 5, fieldWidth / 20);
        this.ball = new Ball(10, 5, 0);
    }
    Game.prototype.getState = function () {
        return JSON.stringify({ 
            "player_1": { 
                "x": this.player1.x,
                "y": this.player1.y 
            },
            "player_2": {
                "x": this.player2.x,
                "y": this.player2.y 
            },
            "ball": {
                "x": this.ball.x,
                "y": this.ball.y
            }
         });
    };
    Game.prototype.isDone = function () {
        return true;
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
    };
    Game.prototype.ballCorrectionP2 = function () {
        if (this.player1.x + this.player1.vX < this.ball.x + this.ball.vX) {
            return;
        }
    };
    Game.prototype.p1PossitionCorrection = function () {
    };
    Game.prototype.p2PossitionCorrection = function () {
    };
    Game.prototype.saveObjects = function (p1, p2) {
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
        var ticks = [];
        for (var tick = 0; tick < this.ticksCount; tick++) {
            var p1Args = this.game.getObjectsP1();
            var p2Args = this.game.getObjectsP2();
            this.player1(...p1Args);
            this.player2(...p2Args);
            this.game.saveObjects(p1Args, p2Args);
            ticks.push(this.game.getState());
        }
        return ticks;
    };
    return Tester;
}());

var p1 = function (me, enemy, ball) {
    me.setMoveVector(1, 0, 1);
};
var p2 = function (me, enemy, ball) {
    me.setMoveVector(1, 0, -1);
};
var g = new Game(250, 500);
var t = new Tester(p1, p2, g, 10000);
console.log(t.run());
