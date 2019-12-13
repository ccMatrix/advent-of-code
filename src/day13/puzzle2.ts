import { maxBy } from 'lodash';
import {  splitFileContents } from '../helper';
import IntCoder from '../Intcode';

(() => {
    enum TileId {
        Empty = 0,
        Wall = 1,
        Block = 2,
        HorizontalPaddle = 3,
        Ball = 4,
    }

    interface ITile {
        x: number;
        y: number;
        type: TileId;
    }

    enum Joystick {
        Neutral = 0,
        Left = -1,
        Right = 1,
    }

    const input = splitFileContents('day13/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const renderGame = (tiles: ITile[], score: number) => {
        const width = maxBy(tiles, (tile) => tile.x).x;
        const height = maxBy(tiles, (tile) => tile.y).y;
        console.clear();
        console.log(`score: ${score}`);
        for (let y = 0; y < height; ++y) {
            const line: string[] = [];
            for (let x = 0; x < width; ++x) {
                const tile = tiles.find((t) => t.x === x && t.y === y) || { x: 0, y: 0, type: TileId.Empty };
                switch (tile.type) {
                    case TileId.Ball:
                        line.push('O');
                        break;
                    case TileId.Block:
                        line.push('B');
                        break;
                    case TileId.Empty:
                        line.push(' ');
                        break;
                    case TileId.HorizontalPaddle:
                        line.push('█');
                        break;
                    case TileId.Wall:
                        line.push('P');
                        break;
                }
            }
            console.log(line.join(''));
        }
    };

    const runCode = (memory: number[]) => {
        let score = 0;

        // Enable free play
        memory[0] = 2;
        const intCoder = new IntCoder(memory);
        let joystick: number = Joystick.Neutral;

        const tiles: ITile[] = [];
        while (true) {
            intCoder.run([joystick]);
            let output = intCoder.runOutput;
            while (output.length > 0) {
                const [x, y, type, ...other] = output;
                output = other;
                const tile: ITile = { x, y, type };
                const existingTile = tiles.find((t) => t.x === tile.x && t.y === tile.y);
                if (existingTile) {
                    existingTile.type = tile.type;
                } else if (tile.x === -1 && tile.y === 0) {
                    score = tile.type;
                } else {
                    tiles.push(tile);
                }
            }

            // print game
            renderGame(tiles, score);

            // Determine next joystick direction
            const ball = tiles.find((t) => t.type === TileId.Ball);
            const paddle = tiles.find((t) => t.type === TileId.HorizontalPaddle);

            if (ball.x === paddle.x) {
                joystick = Joystick.Neutral;
            } else if (ball.x < paddle.x) {
                joystick = Joystick.Left;
            } else if (ball.x > paddle.x) {
                joystick = Joystick.Right;
            }

            const blockCount = tiles.reduceRight<number>((counter, tile) => counter + (tile.type === TileId.Block ? 1 : 0), 0);
            if (blockCount === 0) {
                break;
            }
        }
        return score;
    };

    console.log(runCode(data));

})();
