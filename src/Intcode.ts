enum Instruction {
    Add = 1,
    Mul = 2,
    Input = 3,
    Output = 4,
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
        const modes: number[] = [];
        let v = Math.floor(value / 100);
        modes.push(v % 10);
        v = Math.floor(v / 10);
        modes.push(v % 10);
        v = Math.floor(v / 10);
        modes.push(v % 10);
        return modes;
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
                outputs.push(fromMemory(i + 1, Mode.Position));
                i += 2;
                break;
            case Instruction.Break:
                i += 1;
                return memory;
            default:
                throw Error('Unknown opt code detected!');
        }
    }
    return memory;
};

export default intCode;
