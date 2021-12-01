import java.io.File

fun readFileAsLinesUsingUseLines(fileName: String): List<String>
        = File(fileName).useLines { it.toList() };

fun calcSlidingValues(input: List<Int>): Array<Int> =
    Array<Int>(input.count() - 2, { input.subList(it, it + 3).sum() })

fun countIncreases(input: Array<Int>): Int {
    var increases = 0;
    for (index in 0..input.count() - 2) {
        if (input[index + 1] > input[index]) {
            increases++;
        }
    }
    return increases
}

fun puzzle1() {
    val input = readFileAsLinesUsingUseLines("./input.txt")
        .map { s ->  s.toInt() };
    var increases = 0;
    for (index in 0..input.count() - 2) {
        if (input[index + 1] > input[index]) {
            increases++;
        }
    }
    println("There are $increases increases")
}

fun p2sample() {
    val input: List<Int> = listOf(199, 200, 208, 210, 200, 207, 240, 269, 260, 263)
    val slidingValues = calcSlidingValues(input)
    val increases = countIncreases(slidingValues)
    println("There are $increases increases")
}

fun puzzle2() {
    val input: List<Int> = readFileAsLinesUsingUseLines("./input.txt")
        .map { s ->  s.toInt() };
    val slidingValues = calcSlidingValues(input)
    val increases = countIncreases(slidingValues)
    println("There are $increases increases")
}

puzzle2()
