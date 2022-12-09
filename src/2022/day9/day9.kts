import java.io.File
import kotlin.math.abs

var DEBUG = false

enum class Direction {
    Right,
    Left,
    Up,
    Down
}
data class Instruction(val direction: Direction, val steps: Int)
data class Point(var x: Int, var y: Int)

fun loadInstructions(fileName: String): List<Instruction>
        = File(fileName)
    .useLines { it.toList() }
    .mapNotNull { s: String ->
        val data: List<String> = s.split(" ")
        when (data[0]) {
            "R" -> Instruction(Direction.Right, data[1].toInt())
            "L" -> Instruction(Direction.Left, data[1].toInt())
            "U" -> Instruction(Direction.Up, data[1].toInt())
            "D" -> Instruction(Direction.Down, data[1].toInt())
            else -> null
        }
    }

fun printGrid(head: Point, tails: List<Point>) {
    val maxY = maxOf(head.y, tails.maxOf { it.y }, 30)
    val maxX = maxOf(head.x, tails.maxOf { it.x }, 30)
    for (y in maxY downTo -1 * maxY) {
        for (x in -1 * maxX..maxX) {
            val tail = tails.find { it.x == x && it.y == y}
            if (head.x == x && head.y == y) {
                print("H")
            }
            else if (tail != null) {
                print(tails.indexOf(tail) + 1 )
            }
            else if (x == 0 && y == 0) {
                print("s")
            }
            else {
                print(".")
            }
        }
        print("\n")
    }
    print("\n")
}

fun printVisitedSteps(visitedSteps: List<Point>) {
    for (y in visitedSteps.maxOf { it.y } downTo visitedSteps.minOf { it.y }) {
        for (x in visitedSteps.minOf { it.x }..visitedSteps.maxOf { it.x }) {
            val point = visitedSteps.find { it.x == x && it.y == y}
            if (point?.x == x && point?.y == y) {
                print("#")
            }
            else {
                print(".")
            }
        }
        print("\n")
    }
    print("\n")
}

fun runInstructions(instructions: List<Instruction>, tails: Int): List<Point> {
    fun moveX(compareTo: Point, tail: Point) {
        if ((compareTo.x - tail.x) < 0) tail.x-- else tail.x++
    }

    fun moveY(compareTo: Point, tail: Point) {
        if ((compareTo.y - tail.y) < 0) tail.y-- else tail.y++
    }

    var head = Point(0, 0)
    var tails = generateSequence { Point(0, 0) }.take(tails).toList()
    val visitedSteps = mutableListOf<Point>()

    if (DEBUG) printGrid(head, tails)

    instructions.forEach { instruction ->
        if (DEBUG) println("\n== ${instruction.direction} -> ${instruction.steps}")
        for (step in 0..instruction.steps - 1) {
            when (instruction.direction) {
                Direction.Right -> head.x++
                Direction.Left -> head.x--
                Direction.Up -> head.y++
                Direction.Down -> head.y--
            }

            tails.forEachIndexed { index, tail ->
                val compareTo = if (index == 0) head else tails[index - 1]
                val dx = abs(compareTo.x - tail.x)
                val dy = abs(compareTo.y - tail.y)
                val diagonal = dx + dy >= 3
                if (dy == 2) {
                    moveY(compareTo, tail)
                    if (diagonal) moveX(compareTo, tail)
                }
                else if (dx == 2) {
                    moveX(compareTo, tail)
                    if (diagonal) moveY(compareTo, tail)
                }
            }

            if (DEBUG) printGrid(head, tails)
            visitedSteps.add(tails.last().copy())
        }
    }

    if (DEBUG) printVisitedSteps(visitedSteps)
    return visitedSteps.distinct()
}

fun runExample() {
    // DEBUG = true
    val visitedSteps1 = runInstructions(loadInstructions("./sample1.txt"), 1)
    println("Sample1: Total steps with tail 1: ${visitedSteps1.count()}");
    val visitedSteps2 = runInstructions(loadInstructions("./sample1.txt"), 9)
    println("Sample1: Total steps with tail 9: ${visitedSteps2.count()}");
    val visitedSteps3 = runInstructions(loadInstructions("./sample2.txt"), 9)
    println("Sample2: Total steps with tail 9: ${visitedSteps3.count()}");
}

runExample()

val visitedStepsShortTail = runInstructions(loadInstructions("./input.txt"), 1)
println("Total visited steps (tail 1): ${visitedStepsShortTail.count()}")

val visitedStepsLongTail = runInstructions(loadInstructions("./input.txt"), 9)
println("Total visited steps (tail 9): ${visitedStepsLongTail.count()}")

