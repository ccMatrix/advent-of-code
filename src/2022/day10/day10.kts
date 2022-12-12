import java.io.File
import kotlin.math.sign

enum class InstructionMethod {
    Noop,
    Add,
}

enum class CycleStep {
    Start,
    During,
    End,
}
data class Instruction(val method: InstructionMethod, val value: Int? = null)

fun loadInstructions(fileName: String): List<Instruction>
        = File(fileName)
    .useLines { it.toList() }
    .mapNotNull { s: String ->
        if (s == "noop") {
            Instruction(InstructionMethod.Noop)
        }
        else if (s.startsWith("addx")) {
            val data = s.split(" ")
            Instruction(InstructionMethod.Add, data[1].toInt())
        }
        else {
            null
        }
    }

fun runInstructions(instructions: List<Instruction>): Int {
    var cycle = 0
    var valueX = 1
    var sprite = ""
    val checkSteps = mutableMapOf<Int, Int>(
        Pair(20, 0),
        Pair(60, 0),
        Pair(100, 0),
        Pair(140, 0),
        Pair(180, 0),
        Pair(220, 0),
    )

    fun generateSprite() {
        sprite = (0..39)
            .map {
                if (it in valueX .. valueX + 2) '#' else '.'
            }
            .joinToString("")
    }
    generateSprite()

    fun renderCycle(cycle: Int, value: Int) {
        val linePos = cycle % 40
        print("${sprite[linePos]}")
        if (cycle % 40 == 0) {
            print("\n")
        }
    }

    fun checkCycle(step: CycleStep) {
        when (step) {
            CycleStep.Start -> {}
            CycleStep.During -> {
                renderCycle(cycle, valueX)
                if (checkSteps.containsKey(cycle)) {
                    checkSteps[cycle] = valueX
                }
            }
            CycleStep.End -> {
                generateSprite()
            }
        }
    }

    instructions.forEach { instruction ->
        when (instruction.method) {
            InstructionMethod.Noop -> {
                cycle++
                checkCycle(CycleStep.Start)
                checkCycle(CycleStep.During)
                checkCycle(CycleStep.End)
            }
            InstructionMethod.Add -> {
                cycle++
                checkCycle(CycleStep.Start)
                checkCycle(CycleStep.During)
                checkCycle(CycleStep.End)
                cycle++
                checkCycle(CycleStep.Start)
                checkCycle(CycleStep.During)
                valueX += instruction.value!!
                checkCycle(CycleStep.End)
            }
        }
    }

    return checkSteps.entries.sumOf { it.key * it.value }
}

fun assertEquals(expect: Int, original: Int) {
    if (expect != original) {
        throw Exception("${original} does not equal expected ${expect}")
    }
}

fun validateExample() {
    val signalStrength = runInstructions(loadInstructions("./sample.txt"))
    assertEquals(13140, signalStrength)
}
validateExample()

println("\n\n")
val signalStrength = runInstructions(loadInstructions("./input.txt"))
println("Signal strength is ${signalStrength}")
