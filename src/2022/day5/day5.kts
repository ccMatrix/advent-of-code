import kotlin.collections.ArrayDeque
import java.io.File

inline fun <T> arrayDequeOf(vararg elements: T) = ArrayDeque(elements.toList())

data class Instruction(val count: Int, val from: Int, val to: Int)

fun loadInstructions(fileName: String): List<Instruction>
        = File(fileName)
    .useLines { it.toList() }
    .mapNotNull { s: String ->
        val data = "move (\\d+) from (\\d+) to (\\d+)".toRegex().find(s)
        if (data !== null && data.groupValues.count() === 4) {
            return@mapNotNull Instruction(data.groupValues.get(1).toInt(), data.groupValues.get(2).toInt(), data.groupValues.get(3).toInt())
        }
        null
    }

val instructions = loadInstructions("./input.txt")

//[N]         [C]     [Z]
//[Q] [G]     [V]     [S]         [V]
//[L] [C]     [M]     [T]     [W] [L]
//[S] [H]     [L]     [C] [D] [H] [S]
//[C] [V] [F] [D]     [D] [B] [Q] [F]
//[Z] [T] [Z] [T] [C] [J] [G] [S] [Q]
//[P] [P] [C] [W] [W] [F] [W] [J] [C]
//[T] [L] [D] [G] [P] [P] [V] [N] [R]
//1   2   3   4   5   6   7   8   9
fun initialStack() = mutableListOf(
    arrayDequeOf('T', 'P', 'Z', 'C', 'S', 'L', 'Q', 'N'),
    arrayDequeOf('L', 'P', 'T', 'V', 'H', 'C', 'G'),
    arrayDequeOf('D', 'C', 'Z', 'F'),
    arrayDequeOf('G', 'W', 'T', 'D', 'L', 'M', 'V', 'C'),
    arrayDequeOf('P', 'W', 'C'),
    arrayDequeOf('P', 'F', 'J', 'D', 'C', 'T', 'S', 'Z'),
    arrayDequeOf('V', 'W', 'G', 'B', 'D'),
    arrayDequeOf('N', 'J', 'S', 'Q', 'H', 'W'),
    arrayDequeOf('R', 'C', 'Q', 'F', 'S', 'L', 'V')
)

fun runInstructions9000(crateStacks: List<ArrayDeque<Char>>, instructions: List<Instruction>): List<ArrayDeque<Char>> {
    instructions.forEach { instruction ->
        for (i in 1..instruction.count) {
            val value = crateStacks[instruction.from - 1].removeLast()
            crateStacks[instruction.to - 1].addLast(value);
        }
    }
    return crateStacks
}

val result9000 = runInstructions9000(initialStack(), instructions)
println("Result word is: " + result9000.map { it.removeLast() }.joinToString(""))

fun runInstructions9001(crateStacks: List<ArrayDeque<Char>>, instructions: List<Instruction>): List<ArrayDeque<Char>> {
    instructions.forEach { instruction ->
        val fromStack = crateStacks[instruction.from - 1]
        var tmpStack = ArrayDeque<Char>(fromStack.subList(fromStack.count() - instruction.count, fromStack.count()))
        for (i in 1..instruction.count) {
            fromStack.removeLast()
        }
        tmpStack.forEach { crateStacks[instruction.to - 1].addLast(it) }
    }
    return crateStacks
}

val result9001 = runInstructions9001(initialStack(), instructions)
println("Result word is: " + result9001.map { it.removeLast() }.joinToString(""))