import { Interface } from 'readline';
import { assertEquals, splitFileContents } from '../helper';

(() => {
    interface Game {
        player1: number[];
        player2: number[];
    }

    const exampleGame: Game = {
        player1: [ 9, 2, 6, 3, 1 ],
        player2: [ 5,  8,  4,  7,  10 ],
    };
    const puzzleGame: Game = {
        player1: [
            17, 19, 30, 45, 25, 48, 8, 6, 39, 36, 28, 5, 47, 26,
            46, 20, 18, 13, 7, 49, 34, 23, 43, 22, 4,
        ],
        player2: [
            44, 10, 27, 9, 14, 15, 24, 16, 3, 33, 21, 29, 11, 38,
            1, 31, 50, 41, 40, 32, 42, 35, 37, 2, 12,
        ],
    };

    const runGame = (game: Game) => {
        while (game.player1.length && game.player2.length) {
            const card1 = game.player1.shift();
            const card2 = game.player2.shift();
            if (card1 > card2) {
                game.player1.push(card1, card2);
            } else {
                game.player2.push(card2, card1);
            }
        }
        return game;
    };

    const scoreGame = (game: Game) => {
        const res = [...game.player1, ...game.player2];
        return res
            .reverse()
            .reduceRight((prev, num, idx) => prev + (num * (idx + 1)), 0);
    };

    runGame(exampleGame);
    assertEquals(306, scoreGame(exampleGame));

    runGame(puzzleGame);
    console.log('Game score:', scoreGame(puzzleGame));
})();
