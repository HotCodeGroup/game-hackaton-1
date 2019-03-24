import { Game } from './gamePingPong';
import Tester from './tester';
var runCode = function (code) {
    var bot = function (me, enemy, ball) {
        me.setMoveVector(1, 0, -1);
    };
    var p1 = new Function("me", "enemy", "ball", code);
    var g = new Game(250, 500);
    var t = new Tester(p1, bot, g, 10000);
    return t.run();
};
