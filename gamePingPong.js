'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
export { Player };
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
export { PlayablePlayer };
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball(diameter, x, y, vX, vY) {
        var _this = _super.call(this, x, y, vX, vY) || this;
        _this.diameter = diameter;
        return _this;
    }
    return Ball;
}(GameObject));
export { Ball };
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
    Game.prototype.intersection = function (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
        var v1 = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
        var v2 = (bx2 - bx1) * (ay2 - by1) - (by2 - by1) * (ax2 - bx1);
        var v3 = (ax2 - ax1) * (by1 - ay1) - (ay2 - ay1) * (bx1 - ax1);
        var v4 = (ax2 - ax1) * (by2 - ay1) - (ay2 - ay1) * (bx2 - ax1);
        return (v1 * v2 < 0) && (v3 * v4 < 0);
    };
    Game.prototype.collision = function (p, b) {
        var bRelVx = b.vX - p.vX;
        var bRelVy = b.vY - p.vY;
        var p_left = p.x - p.width / 2;
        var p_right = p.x + p.width / 2;
        var p_down = p.y - p.height / 2;
        var p_up = p.x + p.height / 2;
        var b_left = b.x - b.diameter / 2;
        var b_right = b.x + b.diameter / 2;
        var b_down = b.y - b.diameter / 2;
        var b_up = b.x + b.diameter / 2;
        if (p_right < b_left) {
            var inter = this.intersection(p_down, p_right, p_up, p_right, b_down, b_left, b_down + bRelVy, b_left + bRelVx) ||
                this.intersection(p_down, p_right, p_up, p_right, b_up, b_left, b_up + bRelVy, b_left + bRelVx);
            if (inter) {
                var to_ratio = bRelVx / (b_left - p_right);
                var out_ratio = 1 - to_ratio;
                b.x += to_ratio * b.vX - out_ratio * b.vX;
                b.y += b.vY;
                b.vX = -b.vX;
            }
            return inter;
        }
        if (p_left > b_right) {
            var inter = this.intersection(p_down, p_left, p_up, p_left, b_down, b_right, b_down + bRelVy, b_right + bRelVx) ||
                this.intersection(p_down, p_left, p_up, p_left, b_up, b_right, b_up + bRelVy, b_right + bRelVx);
            if (inter) {
                var to_ratio = bRelVx / (p_left - b_right);
                var out_ratio = 1 - to_ratio;
                b.x += to_ratio * b.vX - out_ratio * b.vX;
                b.y += b.vY;
                b.vX = -b.vX;
            }
            return inter;
        }
        if (p_up < b_down) {
            var inter = this.intersection(p_left, p_up, p_right, p_up, b_left, b_down, b_left + bRelVx, b_down + bRelVy) ||
                this.intersection(p_left, p_up, p_right, p_up, b_right, b_down, b_right + bRelVx, b_down + bRelVy);
            if (inter) {
                var to_ratio = bRelVy / (b_down - p_up);
                var out_ratio = 1 - to_ratio;
                b.y += to_ratio * b.vY - out_ratio * b.vY;
                b.x += b.vX;
                b.vY = -b.vY;
            }
            return inter;
        }
        if (p_down > b_up) {
            var inter = this.intersection(p_left, p_down, p_right, p_down, b_left, b_up, b_left + bRelVx, b_up + bRelVy) ||
                this.intersection(p_left, p_down, p_right, p_down, b_right, b_up, b_right + bRelVx, b_up + bRelVy);
            if (inter) {
                var to_ratio = bRelVy / (p_down - b_up);
                var out_ratio = 1 - to_ratio;
                b.y += to_ratio * b.vY - out_ratio * b.vY;
                b.x += b.vX;
                b.vY = -b.vY;
            }
            return inter;
        }
        return false;
    };
    Game.prototype.ballPossitionCorrection = function () {
    };
    Game.prototype.playerPossitionCorrection = function (p, left, right, bottom, top) {
        if (p.x - p.width / 2 < left) {
            p.x = left + p.width / 2;
        }
        if (p.x + p.width / 2 > right) {
            p.x = right - p.width / 2;
        }
        if (p.y - p.height / 2 < bottom) {
            p.y = bottom + p.height / 2;
        }
        if (p.y + p.height / 2 > top) {
            p.y = top + p.height / 2;
        }
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
        var coll1 = this.collision(this.player1, this.ball);
        var coll2 = this.collision(this.player2, this.ball);
        if (!coll1 && !coll2) {
            this.ball.x += this.ball.vX;
            this.ball.y += this.ball.vY;
        }
        this.player1.x += this.player1.vX;
        this.player1.y += this.player1.vY;
        this.player2.x += this.player2.vX;
        this.player2.y += this.player2.vY;
        this.playerPossitionCorrection(this.player1, 0, this.fieldWidth / 2, 0, this.fieldHeight);
        this.playerPossitionCorrection(this.player2, this.fieldWidth / 2, this.fieldWidth, 0, this.fieldHeight);
    };
    // Validators
    Game.prototype.checkSpeed = function (p) {
        if (Math.sqrt(p.vX * p.vX + p.vY * p.vY) > 10) {
            throw new Error("speed can not be > 10");
        }
    };
    return Game;
}());
export { Game };
