import java.io.File

enum class Direction {
    forward,
    up,
    down
}

data class Instruction(val direction: Direction, val value: Int)
data class Point(var x: Int, var y: Int) {
    override fun toString(): String {
        return "$x / $y"
    }
}
data class NavigationData(var x: Int, var depth: Int, var aim: Int) {
    override fun toString(): String {
        return "$x x $depth, aim $aim"
    }
}

public class Navigator1(val instructions: List<Instruction>) {
    val position = Point(0, 0)

    fun execute() {
        instructions.forEach {
            when (it.direction) {
                Direction.forward -> position.x += it.value
                Direction.down -> position.y += it.value
                Direction.up -> position.y -= it.value
            }
        }
    }
}

public class Navigator2(val instructions: List<Instruction>) {
    val position = NavigationData(0, 0, 0)

    fun execute() {
        instructions.forEach {
            when (it.direction) {
                Direction.forward -> {
                    position.x += it.value
                    position.depth += (position.aim * it.value)
                }
                Direction.down -> position.aim += it.value
                Direction.up -> position.aim -= it.value
            }
        }
    }
}

fun readInputFromFile(fileName: String): List<Instruction>
        = File(fileName)
    .useLines { it.toList() }
    .map { s ->
        val data = s.split(' ')
        Instruction(Direction.valueOf(data[0]), data[1].toInt())
    }

val sampleInput = ArrayList<Instruction>(6)
sampleInput.add(Instruction(Direction.forward, 5))
sampleInput.add(Instruction(Direction.down, 5))
sampleInput.add(Instruction(Direction.forward, 8))
sampleInput.add(Instruction(Direction.up, 3))
sampleInput.add(Instruction(Direction.down, 8))
sampleInput.add(Instruction(Direction.forward, 2))

fun p1sample() {
    val navigator = Navigator1(sampleInput)
    navigator.execute()
    println("Final position is ${navigator.position}")
}

fun puzzle1() {
    val input = readInputFromFile("./input.txt")
    val navigator = Navigator1(input)
    navigator.execute()
    println("Final position is ${navigator.position}. Result is ${navigator.position.x * navigator.position.y}")
}

fun p2sample() {
    val navigator = Navigator2(sampleInput)
    navigator.execute()
    println("Final position is ${navigator.position}")
}

fun puzzle2() {
    val input = readInputFromFile("./input.txt")
    val navigator = Navigator2(input)
    navigator.execute()
    println("Final position is ${navigator.position}. Result is ${navigator.position.x * navigator.position.depth}")
}

puzzle2()