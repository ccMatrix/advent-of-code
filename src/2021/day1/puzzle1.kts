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

fun puzzle1() {
    val increases = readFileAsLinesUsingUseLines("./input.txt")
        .toTypedArray()
        .countIncreases()
    println("There are $increases increases")
}

fun p2sample() {
    val increases = listOf(199, 200, 208, 210, 200, 207, 240, 269, 260, 263)
        .calcSlidingValues()
        .countIncreases()
    println("There are $increases increases")
}

fun puzzle2() {
    val increases = readFileAsLinesUsingUseLines("./input.txt")
        .calcSlidingValues()
        .countIncreases()
    println("There are $increases increases")
}

puzzle1()
puzzle2()
