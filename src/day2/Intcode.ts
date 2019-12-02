enum Instruction {
    Add = 1,
    Mul = 2,
    Break = 99,
}

const intCode = (memory: number[]) => {
    let i = 0;
    while (i < memory.length) {
        const instruction = memory[i];
        switch (instruction) {
            case Instruction.Add: 
                const sum = memory[memory[i + 1]] + memory[memory[i + 2]];
                memory[memory[i + 3]] = sum;
                i += 4;
                break;
            case Instruction.Mul:
                const mul = memory[memory[i + 1]] * memory[memory[i + 2]];
                memory[memory[i + 3]] = mul;
                i += 4;
                break;
            case Instruction.Break:
                i += 1;
                return memory;
            default:
                throw Error('Unknown opt code detected!');
        }
    }
    return memory;
}

export default intCode;
