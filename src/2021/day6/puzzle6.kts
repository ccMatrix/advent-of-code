import java.io.File

val sampleInput = listOf(3, 4, 3, 1, 2);
fun readFile(fileName: String): List<Int>
        = File(fileName)
        .readText()
        .trim()
        .split(',')
        .map {
            it.toInt()
        }

fun simulateDaysLowMem(lanternfish: List<Int>, days: Int) {
    var fishPopulation: Array<Long> = Array(9, { 0L })
    lanternfish.forEach {
        fishPopulation[it]++
    }
    for (day in 0..days - 1) {
        val newFishPopulation: Array<Long> = Array(9, { 0L })
        fishPopulation.forEachIndexed { index, fish ->
            when (index) {
                in 1..8 -> {
                    newFishPopulation[index - 1] += fish
                }
                0 -> {
                    newFishPopulation[6] += fish
                    newFishPopulation[8] += fish
                }
            }
        }
        fishPopulation = newFishPopulation
    }
    val totalFish = fishPopulation.sumOf { it }
    println("Total fish population is: ${totalFish}")
}

fun p1sample() {
    var lanternfish = sampleInput
    simulateDaysLowMem(lanternfish, 80)
}

fun puzzle1() {
    var lanternfish = readFile("input.txt")
    simulateDaysLowMem(lanternfish, 80)
}

fun p2sample() {
    var lanternfish = sampleInput
    simulateDaysLowMem(lanternfish, 256)
}

fun puzzle2() {
    var lanternfish = readFile("input.txt")
    simulateDaysLowMem(lanternfish, 256)
}

p1sample()
puzzle1()
p2sample()
puzzle2()
