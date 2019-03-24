'use strict';

interface Game {
    isDone(): boolean;
    getState(): any;

    getObjectsP1(): any[];
    getObjectsP2(): any[];

    saveObjects(p1: any[], p2: any[]): void;
}

interface Player {
    (...args: any[]): void;
}

class Tester {
    game: Game;
    ticksCount: number;
    player1: Player;
    player2: Player;

    constructor(p1: Player, p2: Player, g: Game, count: number) {
        this.player1, this.player2 = p1, p2;
        this.ticksCount = count;
        this.game = g;
    }

    run(): any[] {
        let ticks: any[]
        for (let tick = 0; tick < this.ticksCount; tick++) {
            const p1Args = this.game.getObjectsP1();
            const p2Args = this.game.getObjectsP2();

            this.player1(p1Args)
            this.player2(p2Args)

            this.game.saveObjects(p1Args, p2Args)
            ticks.push(this.game.getState())
        }

        return ticks
    }
}