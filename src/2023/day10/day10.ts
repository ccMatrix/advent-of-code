import * as fs from 'fs';
import * as path from 'path';
import classifyPoint from 'robust-point-in-polygon';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.split(''));

interface IPoint {
    x: number;
    y: number;
}

const findStart = (maze: string[][]): IPoint | undefined => {
    for (let y = 0; y < maze.length; y++) {
        const line = maze[y];
        for (let x = 0; x < line.length; x++) {
            if (line[x] === 'S') {
                return { x, y };
            }
        }
    }
    return undefined;
};

const traveseMaze = (maze: string[][], start: IPoint) => {
    const stepsTaken: IPoint[] = [];

    const mazeValueByPoint = (point: IPoint): string | undefined => {
        if (point.y < 0 || point.y >= maze.length) {
            return undefined;
        }
        const line = maze[point.y];
        if (point.x < 0 || point.x >= line.length) {
            return undefined;
        };
        return maze[point.y][point.x];
    };

    const getValidDirections = (point: IPoint) => {
        const directions: {
            [propname: string]: IPoint;
        } = {
            up: { y: point.y - 1, x: point.x },
            right: { y: point.y, x: point.x + 1 },
            left: { y: point.y, x: point.x - 1 },
            down: { y: point.y + 1, x: point.x },
        }

        const isValidDirection = (direction: string) => {
            const stepPoint = directions[direction];
            if (stepsTaken.find(p => p.x === stepPoint.x && p.y === stepPoint.y)) {
                return false;
            }
            const pointValue = mazeValueByPoint(stepPoint);
            if (pointValue === undefined) {
                return false;
            }
            const valueBefore = mazeValueByPoint(point);

            switch (direction) {
                case 'up': return ['|', 'L', 'J', 'S'].includes(valueBefore) && ['|', 'F', '7'].includes(pointValue);
                case 'down': return ['|', 'F', '7', 'S'].includes(valueBefore) && ['|', 'L', 'J'].includes(pointValue);
                case 'left': return ['-', '7', 'J', 'S'].includes(valueBefore) && ['-', 'F', 'L'].includes(pointValue);
                case 'right': return ['-', 'F', 'L', 'S'].includes(valueBefore) && ['-', 'J', '7'].includes(pointValue);
            }
        }

        const validDirections = Object.keys(directions).filter(direction => isValidDirection(direction));
        return validDirections.map(direction => directions[direction]);
    }

    stepsTaken.push(start);
    let directions = getValidDirections(start);
    while (directions.length > 0) {
        let nextStep = directions.pop();
        stepsTaken.push(nextStep)
        directions = getValidDirections(nextStep);
    }
    return stepsTaken;
}
const start = findStart(input);

(() => {
    const steps = traveseMaze(input, start);
    console.log('part1:', Math.floor(steps.length / 2));
})();

(() => {
    const steps = traveseMaze(input, start);
    const polygon = steps.map(p => [ p.x, p.y ]);
    let insidePoints = 0;
    for (let y = 0; y < input.length; ++y) {
        for (let x = 0; x < input[0].length; ++x) {
            const pointClassification = classifyPoint(polygon as any, [ x, y ]);
            if (pointClassification === -1) {
                insidePoints++;
            }
        }
    }
    console.log('Dots found', insidePoints);
})();