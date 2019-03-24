import tester from './tester';
import { PlayablePlayer, Player, Ball, Game } from './gamePingPong';
import Tester from './tester';
 
const p1 = (me: PlayablePlayer, enemy: Player, ball: Ball) => {
    me.setMoveVector(1, 0, 1);
};

const p2 = (me: PlayablePlayer, enemy: Player, ball: Ball) => {
    me.setMoveVector(1, 0, -1);
};

const g = new Game(250, 500);
const t = new Tester(p1, p2, g, 10000);

console.log(t.run())