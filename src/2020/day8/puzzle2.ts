import { clone, cloneDeep } from 'lodash';
import { assertEquals } from '../../2019/helper';
import { splitFileContents } from '../helper';

(() => {
    enum Operation {
        Nop,
        Acc,
        Jmp,
    }

    interface Instruction {
        operation: Operation;
        argument: number;
    }

    class CodeExecutor {
        private code: Instruction[] = [];
        private position: number = 0;
        private accumulator: number = 0;

        private circleDetect: number[] = [];

        get accumulatorValue() {
            return this.accumulator;
        }

        constructor(input: Instruction[]) {
            this.code = input;
        }

        repairCode(pos: number) {
            const instruction = this.code[pos];
            switch (instruction.operation) {
                case Operation.Nop:
                    instruction.operation = Operation.Jmp;
                    return;
                case Operation.Jmp:
                    instruction.operation = Operation.Nop;
                    return;
            }
        }

        runCode() {
            while (this.position < this.code.length) {
                if (this.circleDetect.includes(this.position)) {
                    throw new Error('Infinite loop detected!');
                }
                this.circleDetect.push(this.position);

                const currentInstruction = this.code[this.position];
                switch (currentInstruction.operation) {
                    case Operation.Nop:
                        this.position++;
                        break;
                    case Operation.Acc:
                        this.accumulator += currentInstruction.argument;
                        this.position++;
                        break;
                    case Operation.Jmp:
                        this.position += currentInstruction.argument;
                        break;
                }
            }
        }
    }

    const parseInstructions = (line: string): Instruction => {
        const convertOp = (opStr: string): Operation => {
            switch (opStr) {
                case 'nop': return Operation.Nop;
                case 'acc': return Operation.Acc;
                case 'jmp': return Operation.Jmp;
                default:
                    throw new Error('Unknown operation ' + opStr);
            }
        }
        const [ op, num ] = line.split(' ');
        return {
            operation: convertOp(op),
            argument: parseInt(num, 10),
        };
    }

    const instructions = splitFileContents('day8/input.txt', '\n')
        .map<Instruction>(line => parseInstructions(line));

    // Example
    const exampleInstructions = [
        'nop +0',
        'acc +1',
        'jmp +4',
        'acc +3',
        'jmp -3',
        'acc -99',
        'acc +1',
        'jmp -4',
        'acc +6',
    ].map<Instruction>(line => parseInstructions(line));

    const runAndFix = (instr: Instruction[]) => {
        let finalAccumulator = 0;
        instr.some((instruction, index) => {
            switch (instruction.operation) {
                case Operation.Acc:
                    return false;
                case Operation.Nop:
                case Operation.Jmp:
                    try {
                        const fixedInstructions = cloneDeep(instr);
                        const executor = new CodeExecutor(fixedInstructions);
                        executor.repairCode(index);
                        executor.runCode();
                        finalAccumulator = executor.accumulatorValue;
                    }
                    catch (e) {
                        return false
                    }
                    return true;
            }
        });
        return finalAccumulator;
    }

    const exampleValue = runAndFix(exampleInstructions);
    assertEquals(8, exampleValue);

    const accumulatorValue = runAndFix(instructions);
    console.log('Code was executed now with result:', accumulatorValue);
})();
