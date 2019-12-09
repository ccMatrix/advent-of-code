import { clone } from 'lodash';

enum Instruction {
    Add = 1,
    Mul = 2,
    Input = 3,
    Output = 4,
    JumpIfTrue = 5,
    JumpIfFalse = 6,
    LessThan = 7,
    Equals = 8,
    AdjustRelativeBase = 9,
    Break = 99,
}

enum Mode {
    Position = 0,
    Immediate = 1,
    Relative = 2,
}

export enum Status {
    Init = 0,
    Running = 1,
    Wait = 2,
    Break = 3,
}

class IntCoder {
    private _memory: number[];
    private _outputs: number[];
    private _iterator = 0;
    private _status = Status.Init;
    private _relativeBase = 0;

    get status() {
        return this._status;
    }

    get outputs() {
        return this._outputs;
    }

    get lastOutput() {
        return this._outputs[this.outputs.length - 1];
    }

    get memory() {
        return this._memory;
    }

    constructor(memory: number[]) {
        this._memory = clone(memory);
        this._outputs = [];
    }

    public run(input?: number[]) {
        const runOutputs = [];
        while (true) {
            const value = this._memory[this._iterator];
            const instruction = value % 100;
            const modes = this.parseModes(value);
            switch (instruction) {
                case Instruction.Add:
                    const sum = this.fromMemory(this._iterator + 1, modes[0]) + this.fromMemory(this._iterator + 2, modes[1]);
                    this.toMemory(this._iterator + 3, modes[2], sum);
                    this._iterator += 4;
                    break;
                case Instruction.Mul:
                    const mul = this.fromMemory(this._iterator + 1, modes[0]) * this.fromMemory(this._iterator + 2, modes[1]);
                    this.toMemory(this._iterator + 3, modes[2], mul);
                    this._iterator += 4;
                    break;
                case Instruction.Input:
                    if (input.length === 0) {
                        this._status = Status.Wait;
                        return runOutputs;
                    }
                    this.toMemory(this._iterator + 1, modes[0], input.shift());
                    this._iterator += 2;
                    break;
                case Instruction.Output:
                    const output = this.fromMemory(this._iterator + 1, modes[0]);
                    this._outputs.push(output);
                    runOutputs.push(output);
                    this._iterator += 2;
                    break;
                case Instruction.JumpIfTrue: {
                    const newPosition = this.fromMemory(this._iterator + 1, modes[0]);
                    if (newPosition !== 0) {
                        this._iterator = this.fromMemory(this._iterator + 2, modes[1]);
                    } else {
                        this._iterator += 3;
                    }
                    break;
                }
                case Instruction.JumpIfFalse: {
                    const newPosition = this.fromMemory(this._iterator + 1, modes[0]);
                    if (newPosition === 0) {
                        this._iterator = this.fromMemory(this._iterator + 2, modes[1]);
                    } else {
                        this._iterator += 3;
                    }
                    break;
                }
                case Instruction.LessThan: {
                    const first = this.fromMemory(this._iterator + 1, modes[0]);
                    const second = this.fromMemory(this._iterator + 2, modes[1]);
                    this.toMemory(this._iterator + 3, modes[2], (first < second) ? 1 : 0);
                    this._iterator += 4;
                    break;
                }
                case Instruction.Equals: {
                    const first = this.fromMemory(this._iterator + 1, modes[0]);
                    const second = this.fromMemory(this._iterator + 2, modes[1]);
                    this.toMemory(this._iterator + 3, modes[2], (first === second) ? 1 : 0);
                    this._iterator += 4;
                    break;
                }
                case Instruction.AdjustRelativeBase:
                    this._relativeBase += this.fromMemory(this._iterator + 1, modes[0]);
                    this._iterator += 2;
                    break;
                case Instruction.Break:
                    this._status = Status.Break;
                    return runOutputs;
                default:
                    throw Error(`Unknown opt code ${instruction} detected!`);
            }
        }
    }

    private fromMemory(position: number, mode: number) {
        switch (mode) {
            case Mode.Position:
                return this._memory[this._memory[position]] || 0;
            case Mode.Immediate:
                return this._memory[position] || 0;
            case Mode.Relative:
                return this._memory[this._memory[position] + this._relativeBase] || 0;
        }
    }

    private toMemory(position: number, mode: number, value: number) {
        switch (mode) {
            case Mode.Position:
                this._memory[this._memory[position]] = value;
                break;
            case Mode.Immediate:
                throw Error('to memory location invalid');
            case Mode.Relative:
                this._memory[this._memory[position] + this._relativeBase] = value;
                break;

        }

    }

    private parseModes(value: number) {
        return value.toString()
            .padStart(5, '0')
            .substring(0, 3)
            .split('')
            .reverse()
            .map((d) => parseInt(d, 10));
    }

}

export default IntCoder;
