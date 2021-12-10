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

fun puzzle1(input: List<Int>) {
    simulateDaysLowMem(input, 80)
}

fun puzzle2(input: List<Int>) {
    simulateDaysLowMem(input, 256)
}

puzzle1(sampleInput)
puzzle1(readFile("input.txt"))
puzzle2(sampleInput)
puzzle2(readFile("input.txt"))
