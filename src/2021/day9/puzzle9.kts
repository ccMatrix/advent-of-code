import java.io.File

fun readFile(fileName: String): List<List<Int>>
        = File(fileName)
    .useLines { it.toList() }
    .map {
        it.map { it.digitToInt() }
    }

data class Point(val x: Int, val y: Int, val value: Int, var fields: MutableList<Point> = emptyList<Point>().toMutableList())

fun List<List<Int>>.point(x: Int, y: Int): Point? {
    val columns = this.first().count()
    if (x < 0 || y < 0 || x > (columns - 1) || y > (this.count() - 1)) {
        return null
    }
    return Point(x, y, this[y][x])
}

fun findLowPoints(area: List<List<Int>>): List<Point> {
    val columns = area.first().count()
    val lowPoints: MutableList<Point> = emptyList<Point>().toMutableList()

    for (y in 0..area.count() - 1) {
        for (x in 0..columns - 1) {
            val current = area[y][x];
            val minimum = listOf(area.point(x, y - 1), area.point(x, y + 1), area.point(x - 1, y), area.point(x + 1, y))
                .filterNotNull()
                .minOf { it.value }
            if (current < minimum) {
                lowPoints.add(Point(x, y, current))
            }
        }
    }
    return lowPoints.toList()
}

fun calculateRiskLevel(lowPoints: List<Point>): Int =
    lowPoints.fold(0, {
        acc, p -> acc + (p.value + 1)
    })

fun findBasins(area: List<List<Int>>): List<Point> {
    val lowPoints = findLowPoints(area)
    fun collectSurroundings(point: Point, points: MutableList<Point>) {
        val x = point.x
        val y = point.y
        listOf(area.point(x, y - 1), area.point(x, y + 1), area.point(x - 1, y), area.point(x + 1, y))
            .filterNotNull()
            .forEach { p ->
                if (p.value != 9 && !points.contains(p)) {
                    points.add(p)
                    collectSurroundings(p, points)
                }
            }
    }

    lowPoints.forEach { point ->
        val list = emptyList<Point>().toMutableList()
        collectSurroundings(point, list)
        point.fields = list
    }
    return lowPoints.toList()
}

fun largestBasinsSize(basins: List<Point>): Int =
    basins.sortedBy { 1 - it.fields.count() }
        .subList(0, 3)
        .map { it.fields.count() }
        .fold(1, { acc, i -> acc * i })

fun p1sample() {
    val risk = calculateRiskLevel(
        findLowPoints(readFile("sampleInput.txt"))
    )
    println("Risk level is $risk")
}

fun puzzle1() {
    val risk = calculateRiskLevel(
        findLowPoints(readFile("input.txt"))
    )
    println("Risk level is $risk")
}

fun p2sample() {
    val largestBasinSize = largestBasinsSize(
        findBasins(readFile("sampleInput.txt"))
    )
    println("Sum of largest basins is $largestBasinSize")
}

fun puzzle2() {
    val largestBasinSize = largestBasinsSize(
        findBasins(readFile("input.txt"))
    )
    println("Sum of largest basins is $largestBasinSize")
}

p1sample()
puzzle1()
p2sample()
puzzle2()