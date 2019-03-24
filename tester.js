'use strict';
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
export default Tester;
