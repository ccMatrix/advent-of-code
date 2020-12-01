import { maxBy } from 'lodash';
import {  splitFileContents } from '../helper';
import IntCoder from '../Intcode';

(async () => {
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

    const visualGame = true;
    const interactiveGame = true;

    const input = splitFileContents('day13/input.txt', ',');
    const data = input.filter((d) => d !== '').map((d) => parseInt(d, 10));

    const renderGame = async (tiles: ITile[], score: number) => {
        const width = maxBy(tiles, (tile) => tile.x).x;
        const height = maxBy(tiles, (tile) => tile.y).y;
        console.clear();
        console.log(`score: ${score}`);
        const lines: string[] = [];
        for (let y = 0; y <= height; ++y) {
            const line: string[] = [];
            for (let x = 0; x <= width; ++x) {
                const tile = tiles.find((t) => t.x === x && t.y === y) || { x: 0, y: 0, type: TileId.Empty };
                switch (tile.type) {
                    case TileId.Ball:
                        line.push('•');
                        break;
                    case TileId.Block:
                        line.push('▄');
                        break;
                    case TileId.Empty:
                        line.push(' ');
                        break;
                    case TileId.HorizontalPaddle:
                        line.push('‾');
                        break;
                    case TileId.Wall:
                        line.push('█');
                        break;
                }
            }
            lines.push(line.join(''));
        }
        console.log(lines.join('\n'));
        await new Promise((resolve) => setTimeout(resolve, interactiveGame ? 300 : 125));
    };

    const runCode = async (memory: number[]) => {
        let score = 0;

        // Enable free play
        memory[0] = 2;
        const intCoder = new IntCoder(memory);
        let joystick: number = Joystick.Neutral;

        if (interactiveGame) {
            const stdin = process.stdin;
            stdin.setRawMode(true);
            stdin.resume();
            stdin.setEncoding('utf8');
            stdin.on( 'data', (key) => {
                switch (key.toString()) {
                    case 'a':
                        joystick = Joystick.Left;
                        break;
                    case 'd':
                        joystick = Joystick.Right;
                        break;
                    case '\u0003':
                        process.exit();
                }
              });
        }

        const tiles: ITile[] = [];
        while (true) {
            intCoder.run([joystick]);
            if (interactiveGame) {
                joystick = Joystick.Neutral;
            }
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
            if (visualGame) {
                await renderGame(tiles, score);
            }

            // Determine next joystick direction
            if (!interactiveGame) {
                const ball = tiles.find((t) => t.type === TileId.Ball);
                const paddle = tiles.find((t) => t.type === TileId.HorizontalPaddle);

                if (ball.x === paddle.x) {
                    joystick = Joystick.Neutral;
                } else if (ball.x < paddle.x) {
                    joystick = Joystick.Left;
                } else if (ball.x > paddle.x) {
                    joystick = Joystick.Right;
                }
            }

            const blockCount = tiles.reduceRight<number>((counter, tile) => counter + (tile.type === TileId.Block ? 1 : 0), 0);
            if (blockCount === 0) {
                break;
            }

            if (interactiveGame) {
                const ball = tiles.find((t) => t.type === TileId.Ball);
                const paddle = tiles.find((t) => t.type === TileId.HorizontalPaddle);
                if (ball.y > paddle.y) {
                    console.log('Game over');
                    process.exit();
                    break;
                }
            }
        }
        return score;
    };

    console.log(await runCode(data));

})();
