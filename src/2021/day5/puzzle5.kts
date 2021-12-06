import java.io.File
import kotlin.math.abs
import kotlin.math.min
import kotlin.math.max

data class Point(val x: Int, val y: Int)
data class Line(val from: Point, val to: Point)

fun stringToPoint(input: String): Point {
    val data = input.split(',')
    return Point(data[0].toInt(), data[1].toInt())
}

fun readAndParseInputFromFile(fileName: String): List<Line>
     = File(fileName)
        .useLines { it.toList() }
        .map {
            var data = it.toString().split(" -> ").toList()
            Line(stringToPoint(data.first()), stringToPoint(data.last()))
        }

fun findIntersects(lines: List<Line>): Int {
    fun delta(num: Int): Int =
        when (num) {
            0 -> 0
            in 1 .. Int.MAX_VALUE -> -1
            else -> 1
        }

    var pointMap: MutableMap<Point, Int> = emptyMap<Point, Int>().toMutableMap()
    fun markMap(point: Point) {
        val current = pointMap.getOrDefault(point, 0)
        pointMap.set(point, current + 1)
    }

    lines.forEach { line ->
        val dx = delta(line.from.x - line.to.x)
        val dy = delta(line.from.y - line.to.y)

        var p = Point(line.from.x, line.from.y)
        markMap(p)
        while (p != line.to) {
            p = Point(p.x + dx, p.y + dy)
            markMap(p)
        }
    }
    return pointMap.values.count { it > 1 }
}

fun p1sample() {
    val lines = readAndParseInputFromFile("sampleInput.txt")
    val intersects = findIntersects(
        lines.filter { it.from.x == it.to.x || it.from.y == it.to.y }
    )
    println("Total intersects are: $intersects")
}

fun puzzle1() {
    val lines = readAndParseInputFromFile("input.txt")
    val intersects = findIntersects(
        lines.filter { it.from.x == it.to.x || it.from.y == it.to.y }
    )
    println("Total intersects are: $intersects")
}

fun p2sample() {
    val lines = readAndParseInputFromFile("sampleInput.txt")
    val intersects = findIntersects(lines)
    println("Total intersects are: $intersects")
}

fun puzzle2() {
    val lines = readAndParseInputFromFile("input.txt")
    val intersects = findIntersects(lines)
    println("Total intersects are: $intersects")
}

p1sample()
puzzle1()
p2sample()
puzzle2()