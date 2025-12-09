import * as fs from 'node:fs';
import * as path from 'node:path';

class JunctionBox {
    constructor(public x: number, public y: number, public z: number) { }

    static parse(posStr: string) {
        const [x, y, z] = posStr.split(',').map((s) => parseInt(s.trim(), 10));
        return new JunctionBox(x, y, z);
    }

    // Squared distance is enough for comparison (faster)
    distanceTo(other: JunctionBox): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return dx * dx + dy * dy + dz * dz;
    }

}

class UnionFind {
    parent: number[];
    size: number[];

    constructor(n: number) {
        this.parent = new Array(n).fill(0).map((_, i) => i);
        this.size = new Array(n).fill(1);
    }

    find(x: number): number {
        if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }

    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return false; // already connected

        if (this.size[rootX] < this.size[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        }
        else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        }
        return true;
    }
}

const loadInput = (filename: string): JunctionBox[] => {
    return fs
        .readFileSync(path.join(__dirname, filename))
        .toString()
        .trim()
        .split('\n')
        .map((line) => JunctionBox.parse(line.trim()));
};

interface Edge {
    from: number;
    to: number;
    dist: number;
}

interface SizeOfLargestCircuitsOptions {
    maxEdges?: number; // limit number of edges to consider
    maxConnections?: number; // limit number of connections to make
    lastOnly?: boolean; // only return product of last connection
}

const sizeOfLargestCircuits = (boxes: JunctionBox[], options: SizeOfLargestCircuitsOptions = {}): number => {
    let edges: Edge[] = [];
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            edges.push({ from: i, to: j, dist: boxes[i].distanceTo(boxes[j])});
        }
    }

    edges = edges.toSorted((a, b) => a.dist - b.dist);

    if (options.maxEdges !== undefined) {
        edges = edges.splice(0, options.maxEdges);
    }

    // Create union-find data structure for n boxes
    const uf = new UnionFind(boxes.length);

    let lastConnection: Edge;
    let connectionsMade = 1;
    for (const edge of edges) {
        const merged = uf.union(edge.from, edge.to); // attempts to union sets
        if (!merged) {
            continue;
        }

        lastConnection = edge;
        connectionsMade++;
        if (connectionsMade === options.maxConnections) {
            break;
        }
    }

    if (options.lastOnly && lastConnection !== undefined) {
        const from = boxes[lastConnection.from];
        const to = boxes[lastConnection.to];
        return from.x * to.x;
    }

    // Count sizes of connected components by root
    const rootToSize = new Map<number, number>();
    for (let i = 0; i < boxes.length; i++) {
        const root = uf.find(i);
        rootToSize.set(root, (rootToSize.get(root) ?? 0) + 1);
    }

    const sizes = Array.from(rootToSize.values()).sort((a, b) => b - a);

    const product = sizes.slice(0, 3).reduce((acc, val) => acc * val, 1);
    return product;
}

// Load inputs and run
const sampleInput = loadInput('sampleInput.txt');
const input = loadInput('input.txt');

console.log('Closest positions (sample):', sizeOfLargestCircuits(sampleInput, { maxConnections: 10 }));
console.log('Closest positions (real):', sizeOfLargestCircuits(input, { maxEdges: 1000 }));

console.log('Last connection (sample):', sizeOfLargestCircuits(sampleInput, { lastOnly: true }));
console.log('Last connection (real):', sizeOfLargestCircuits(input, { lastOnly: true }));
