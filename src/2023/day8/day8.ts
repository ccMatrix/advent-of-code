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
    data.forEach(line => {
        const match = line.match(/([A-Z0-9]{3})\s=\s\(([A-Z0-9]{3}),\s([A-Z0-9]{3})\)/);
        if (match) {
            const [_, value, left, right] = match;
            const node: INode = { value, left, right };
            map.set(value, node);
        }
    });
    return map;
}

const traverseMap = (map: Map<string, INode>, instructions: string[], startNode: string, endNode: string) => {
    let currentNodes = Array.from(map.keys()).filter(n => n.endsWith(startNode));
    console.log('Traversing map for', currentNodes.length, 'starting Nodes');
    const nodeCounter = new Map<string, number>();
    let currentPos = 0;
    let totalSteps = 0;
    while (true) {
        const direction = instructions[currentPos];
        currentNodes = currentNodes.map(currentNode => {
            const node = map.get(currentNode);
            switch (direction) {
                case 'L':
                    return node.left;
                case 'R':
                    return node.right;
            }
        });
        totalSteps++;
        currentNodes
            .filter(n => n.endsWith(endNode))
            .forEach((n) => {
                console.log('Node finished after', totalSteps, 'steps');
                nodeCounter.set(n, totalSteps);
            });
        currentNodes = currentNodes.filter(n => !n.endsWith(endNode));
        if (currentNodes.length === 0) {
            console.log('All nodes are done');
            return Array.from(nodeCounter.values());
        }

        if (++currentPos >= instructions.length) {
            currentPos = 0;
        }
    }
}

(() => {
    const instructions = input[0].trim().split('');

    const parsedMap = parseMap(input);
    const steps = traverseMap(parsedMap, instructions, 'AAA', 'ZZZ');
    console.log('Part1:', steps.pop(), 'steps');
})();

(() => {
    const instructions = input[0].trim().split('');

    /**
     * greatest-common-divisor and least-common-multiple methods from ruffle1986:
     * https://github.com/ruffle1986?tab=repositories&q=common
     */
    const gcd = (a: number, b: number): number => (!b) ? a : gcd(b, a % b);
    const lcm = (...args: number[]) => args.reduce((a, b) => Math.abs(a * b) / gcd(a, b));

    const parsedMap = parseMap(input);
    const steps = traverseMap(parsedMap, instructions, 'A', 'Z');
    const totalSteps = lcm(...steps);
    console.log('Part2:', totalSteps, 'steps');
})();
