import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'))
    .toString()
    .trim()
    .split('\n');

interface INode {
    value: string;
    left: string;
    right: string;
}

const parseMap = (data: string[]) => {
    const map = new Map<string, INode>();
    input.forEach(line => {
        const match = line.match(/([A-Z0-9]{3})\s=\s\(([A-Z0-9]{3}),\s([A-Z0-9]{3})\)/);
        if (match) {
            const [_, value, left, right] = match;
            const node: INode = { value, left, right };
            map.set(value, node);
        }
    });
    return map;
}

(() => {
    const instructions = input[0].trim().split('');
    const traverseMap = (map: Map<string, INode>, instructions: string[]) => {
        let currentNode = 'AAA';
        const endPoint = 'ZZZ';
        let currentPos = 0;
        let totalSteps = 0;
        while (true) {
            const direction = instructions[currentPos];
            const node = map.get(currentNode);
            switch (direction) {
                case 'L':
                    currentNode = node.left;
                    break;
                case 'R':
                    currentNode = node.right;
                    break;
            }
            totalSteps++;
            if (currentNode === endPoint) {
                return totalSteps;
            }

            if (++currentPos >= instructions.length) {
                currentPos = 0;
            }
        }
    }

    const parsedMap = parseMap(input);
    const steps = traverseMap(parsedMap, instructions);
    console.log('Part1:', steps, ' steps');
})();

(() => {
    const instructions = input[0].trim().split('');

    const traverseMap = (map: Map<string, INode>, instructions: string[]) => {
        /**
         * greatest-common-divisor and least-common-multiple methods from ruffle1986:
         * https://github.com/ruffle1986?tab=repositories&q=common
         */
        const gcd = (a: number, b: number): number => (!b) ? a : gcd(b, a % b);
        const lcm = (...args: number[]) => args.reduce((a, b) => Math.abs(a * b) / gcd(a, b));

        let currentNodes = Array.from(map.keys()).filter(n => n.endsWith('A'));
        console.log('Part2:', 'Traversing map for', currentNodes.length, 'starting Nodes');
        const nodeCounter = new Map<string, number>();
        let currentPos = 0;
        let totalSteps = 0;
        while (true) {
            const direction = instructions[currentPos];
            currentNodes.forEach((currentNode, index) => {
                const node = map.get(currentNode);
                switch (direction) {
                    case 'L':
                        currentNodes[index] = node.left;
                        break;
                    case 'R':
                        currentNodes[index] = node.right;
                        break;
                }
            })
            totalSteps++;
            currentNodes
                .filter(n => n.endsWith('Z'))
                .forEach((n) => {
                    console.log('Part2:', 'Node finished after', totalSteps, 'steps');
                    nodeCounter.set(n, totalSteps);
                });
            currentNodes = currentNodes.filter(n => !n.endsWith('Z'));
            if (currentNodes.length === 0) {
                console.log('Part2:', 'All nodes are done');
                return lcm(...Array.from(nodeCounter.values()));
            }

            if (++currentPos >= instructions.length) {
                currentPos = 0;
            }
        }
    }
    const parsedMap = parseMap(input);
    const steps = traverseMap(parsedMap, instructions);
    console.log('Part2:', steps, ' steps');
})();