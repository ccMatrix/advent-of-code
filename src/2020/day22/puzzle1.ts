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
            30, 42, 25, 7, 29, 1, 16, 50, 11, 40, 4, 41, 3, 12,
            8, 20, 32, 38, 31, 2, 44, 28, 33, 18, 10,
        ],
        player2: [
            36, 13, 46, 15, 27, 45, 5, 19, 39, 24, 14, 9, 17,
            22, 37, 47, 43, 21, 6, 35, 23, 48, 34, 26, 49,
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
