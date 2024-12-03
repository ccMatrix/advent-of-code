import * as fs from 'fs';
import * as path from 'path';

interface ITile {
    type: string;
    energized: number;
}

const input = fs.readFileSync(path.join(__dirname, 'sampleInput.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.split('').map<ITile>(c => {
        return {
            type: c,
            energized: false,
        };
    }));

interface IPoint {
    x: number;
    y: number;
}

enum Direction {
    Up,
    Right,
    Down,
    Left
}

(() => {
    const followLight = (map: ITile[][], position: IPoint, direction: Direction): void => {
        if (position.y < 0 || position.x < 0 || position.y >= map.length || position.x >= map[0].length) {
            return;
        }
        const currentTile = map[position.y][position.x];
        if (currentTile.energized > 2) {
            return;
        }
        currentTile.energized += 1;
        switch (direction) {
            case Direction.Up:
                switch (currentTile.type) {
                    case '\\':
                        return followLight(map, { x: position.x - 1, y: position.y }, Direction.Left);
                    case '/':
                        return followLight(map, { x: position.x + 1, y: position.y }, Direction.Right);
                    case '-':
                        followLight(map, { x: position.x - 1, y: position.y }, Direction.Left);
                        followLight(map, { x: position.x + 1, y: position.y }, Direction.Right);
                        return;
                    case '|':
                    case '.':
                        return followLight(map, { x: position.x, y: position.y - 1 }, Direction.Up);
                }
                break;
            case Direction.Right:
                switch (currentTile.type) {
                    case '\\':
                        return followLight(map, { x: position.x, y: position.y + 1 }, Direction.Down);
                    case '/':
                        return followLight(map, { x: position.x, y: position.y - 1 }, Direction.Up);
                    case '-':
                    case '.':
                        return followLight(map, { x: position.x + 1, y: position.y }, Direction.Right);
                    case '|':
                        followLight(map, { x: position.x, y: position.y - 1 }, Direction.Up);
                        followLight(map, { x: position.x, y: position.y + 1 }, Direction.Down);
                        return
                }
                break;
            case Direction.Down:
                switch (currentTile.type) {
                    case '\\':
                        return followLight(map, { x: position.x + 1, y: position.y }, Direction.Right);
                    case '/':
                        return followLight(map, { x: position.x - 1, y: position.y }, Direction.Left);
                    case '|':
                    case '.':
                        return followLight(map, { x: position.x, y: position.y + 1 }, Direction.Down);
                    case '-':
                        followLight(map, { x: position.x - 1, y: position.y }, Direction.Left);
                        followLight(map, { x: position.x + 1, y: position.y }, Direction.Right);
                        return
                }
                break;
            case Direction.Left:
                switch (currentTile.type) {
                    case '\\':
                        return followLight(map, { x: position.x, y: position.y + 1 }, Direction.Down);
                    case '/':
                        return followLight(map, { x: position.x, y: position.y - 1 }, Direction.Up);
                    case '-':
                    case '.':
                        return followLight(map, { x: position.x - 1, y: position.y }, Direction.Left);
                    case '|':
                        followLight(map, { x: position.x, y: position.y - 1 }, Direction.Up);
                        followLight(map, { x: position.x, y: position.y + 1 }, Direction.Down);
                        return
                }
                break;
        }
    };

    followLight(input, { x: 0, y: 0 }, Direction.Right);
    const totalEnergized = input.reduceRight((prev, current) => prev + current.reduceRight((pre, cur) => pre + (cur.energized > 0 ? 1 : 0), 0), 0);
    console.log('Energized: ', totalEnergized);
})();