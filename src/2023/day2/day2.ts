import * as fs from 'fs';
import * as path from 'path';

interface ICubeSet {
    [propname: string]: number;
    red: number;
    blue: number;
    green: number;
}

interface IGame {
    id: number;
    pulls: ICubeSet[];
}

const games = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n')
    .map(line => {
        const game: IGame = {
            id: parseInt(line.match(/Game\s(\d+):/)![1], 10),
            pulls: line.substring(line.indexOf(':') + 1)
                .split(';')
                .map(pull => {
                    const regex = /(?<count>\d+)\s(?<color>green|blue|red)/g;
                    const counts: ICubeSet = { green: 0, blue: 0, red: 0 };
                    let match: RegExpMatchArray | null;
                    while (match = regex.exec(pull)) {
                        if (match.groups) {
                            counts[match.groups.color] = parseInt(match.groups.count, 10);
                        }
                    }
                    return counts;
                }),
        }
        return game;
    });

const filterGames = (red: number, green: number, blue: number) => {
    return games.filter(game => game.pulls.every(set => set.red <= red && set.green <= green && set.blue <= blue))
}

(() => {
    console.log('part1:', filterGames(12, 13, 14).reduce((prev, current) => current.id + prev, 0));
})();

(() => {
    const gamePowerSet = games.map(g => {
        const reduced = g.pulls.reduce((prev, current) => {
            return {
                red: Math.max(current.red, prev.red),
                green: Math.max(current.green, prev.green),
                blue: Math.max(current.blue, prev.blue),
            }
        }, { red: 0, green: 0, blue: 0});
        return reduced.red * reduced.green * reduced.blue;
    });
    const totalSum = gamePowerSet.reduce((prev, current) => prev + current, 0);
    console.log('part2:', `Total sum is ${totalSum}`);
})();