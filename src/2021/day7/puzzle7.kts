import java.io.File
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

val sampleInput = listOf(16, 1, 2, 0, 4, 2, 7, 1, 2, 14);
fun readFile(fileName: String): List<Int>
        = File(fileName)
    .readText()
    .trim()
    .split(',')
    .map {
        it.toInt()
    }

fun calcFuelSimple() = { input: List<Int>, pos: Int ->
    input.fold(0, { acc, curPos -> acc + abs(curPos - pos) })
}

fun calcFuelComplex() = { input: List<Int>, pos: Int ->
    input.fold(0, { acc, curPos ->
        var fuelUsage = 0
        for (x in 1..abs(curPos - pos)) {
            fuelUsage += x
        }
        acc + fuelUsage
    })
}

fun findOptimalPosition(input: List<Int>, fuelCalculation: (input: List<Int>, pos: Int) -> Int): Int {
    val range = IntRange(input.minOf { it }, input.maxOf { it })
    var minFuel = Int.MAX_VALUE

    for (pos in range) {
        val fuel = fuelCalculation(input, pos)
        minFuel = min(minFuel, fuel)
    }

    return minFuel
}

fun puzzle1(input: List<Int>) {
    val minFuel = findOptimalPosition(input, calcFuelSimple())
    println("Minimum fuel usage is: $minFuel")
}

fun puzzle2(input: List<Int>) {
    val minFuel = findOptimalPosition(input, calcFuelComplex())
    println("Minimum fuel usage is: $minFuel")
}

puzzle1(sampleInput)
puzzle1(readFile("input.txt"))
puzzle2(sampleInput)
puzzle2(readFile("input.txt"))
