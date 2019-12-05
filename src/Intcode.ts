enum Instruction {
    Add = 1,
    Mul = 2,
    Input = 3,
    Output = 4,
    JumpIfTrue = 5,
    JumpIfFalse = 6,
    LessThan = 7,
    Equals = 8,
    Break = 99,
}

enum Mode {
    Position = 0,
    Immediate = 1,
}

const intCode = (memory: number[], input?: number, outputs?: number[]) => {
    const fromMemory = (position: number, mode: number) => {
        switch (mode) {
            case Mode.Position:
                return memory[memory[position]];
            case Mode.Immediate:
                return memory[position];
        }
    };

    const parseModes = (value: number) => {
        return value.toString()
            .padStart(5, '0')
            .substring(0, 3)
            .split('')
            .reverse()
            .map((d) => parseInt(d, 10));
    };

    let i = 0;
    while (i < memory.length) {
        const value = memory[i];
        const instruction = value % 100;
        const modes = parseModes(value);
        switch (instruction) {
            case Instruction.Add:
                const sum = fromMemory(i + 1, modes[0]) + fromMemory(i + 2, modes[1]);
                memory[memory[i + 3]] = sum;
                i += 4;
                break;
            case Instruction.Mul:
                const mul = fromMemory(i + 1, modes[0]) * fromMemory(i + 2, modes[1]);
                memory[memory[i + 3]] = mul;
                i += 4;
                break;
            case Instruction.Input:
                memory[memory[i + 1]] = input;
                i += 2;
                break;
            case Instruction.Output:
                if (!outputs) {
                    throw Error('Output array not specified');
                }
                outputs.push(fromMemory(i + 1, modes[0]));
                i += 2;
                break;
            case Instruction.JumpIfTrue: {
                const newPosition = fromMemory(i + 1, modes[0]);
                if (newPosition !== 0) {
                    i = fromMemory(i + 2, modes[1]);
                } else {
                    i += 3;
                }
                break;
            }
            case Instruction.JumpIfFalse: {
                const newPosition = fromMemory(i + 1, modes[0]);
                if (newPosition === 0) {
                    i = fromMemory(i + 2, modes[1]);
                } else {
                    i += 3;
                }
                break;
            }
            case Instruction.LessThan: {
                const first = fromMemory(i + 1, modes[0]);
                const second = fromMemory(i + 2, modes[1]);
                memory[memory[i + 3]] = (first < second) ? 1 : 0;
                i += 4;
                break;
            }
            case Instruction.Equals: {
                const first = fromMemory(i + 1, modes[0]);
                const second = fromMemory(i + 2, modes[1]);
                memory[memory[i + 3]] = (first === second) ? 1 : 0;
                i += 4;
                break;
            }
            case Instruction.Break:
                i += 1;
                return memory;
            default:
                throw Error(`Unknown opt code ${instruction} detected!`);
        }
    }
    return memory;
};

export default intCode;
