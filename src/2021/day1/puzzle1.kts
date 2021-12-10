import java.io.File

fun readFileAsLinesUsingUseLines(fileName: String): List<Int>
        = File(fileName)
            .useLines { it.toList() }
            .map { s ->  s.toInt() }

fun List<Int>.calcSlidingValues(): Array<Int>
        = Array<Int>(this.count() - 2, { this.subList(it, it + 3).sum() })

fun Array<Int>.countIncreases(): Int
        = this.foldIndexed(0, {
            idx, acc, element ->
                if (idx < this.size - 1 && this[idx + 1] > element) acc + 1 else acc
        })

val sampleInput = listOf(199, 200, 208, 210, 200, 207, 240, 269, 260, 263)

fun puzzle1(input: List<Int>) {
    val increases = input
        .toTypedArray()
        .countIncreases()
    println("There are $increases increases")
}

fun puzzle2(input: List<Int>) {
    val increases = input
        .calcSlidingValues()
        .countIncreases()
    println("There are $increases increases")
}

puzzle1(sampleInput)
puzzle1(readFileAsLinesUsingUseLines("./input.txt"))
puzzle2(sampleInput)
puzzle2(readFileAsLinesUsingUseLines("./input.txt"))
