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

fun p1sample() {
    val minFuel = findOptimalPosition(sampleInput, calcFuelSimple())
    println("Minimum fuel usage is: $minFuel")
}

fun puzzle1() {
    val minFuel = findOptimalPosition(readFile("input.txt"), calcFuelSimple())
    println("Minimum fuel usage is: $minFuel")
}

fun p2sample() {
    val minFuel = findOptimalPosition(sampleInput, calcFuelComplex())
    println("Minimum fuel usage is: $minFuel")
}

fun puzzle2() {
    val minFuel = findOptimalPosition(readFile("input.txt"), calcFuelComplex())
    println("Minimum fuel usage is: $minFuel")
}

p1sample()
puzzle1()
p2sample()
puzzle2()
