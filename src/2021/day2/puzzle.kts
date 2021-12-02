import java.io.File
import java.util.Arrays

enum class Direction {
    forward,
    up,
    down
}

data class Instruction(val direction: Direction, val value: Int)
data class NavigationData(var x: Int, var depth: Int, var aim: Int) {
    override fun toString(): String = "$x x $depth, aim $aim"
}

public class Navigator(val instructions: List<Instruction>) {
    val position = NavigationData(0, 0, 0)

    fun navigateDirectly() {
        instructions.forEach {
            when (it.direction) {
                Direction.forward -> position.x += it.value
                Direction.down -> position.depth += it.value
                Direction.up -> position.depth -= it.value
            }
        }
    }

    fun navigateWithAim() {
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

    fun calcResult(): Int {
        return position.x * position.depth
    }
}

fun readInputFromFile(fileName: String): List<Instruction>
        = File(fileName)
    .useLines { it.toList() }
    .map { s ->
        val data = s.split(' ')
        Instruction(Direction.valueOf(data[0]), data[1].toInt())
    }

val sampleInput = Arrays.asList(
    Instruction(Direction.forward, 5),
    Instruction(Direction.down, 5),
    Instruction(Direction.forward, 8),
    Instruction(Direction.up, 3),
    Instruction(Direction.down, 8),
    Instruction(Direction.forward, 2)
)

fun p1sample() {
    val navigator = Navigator(sampleInput)
    navigator.navigateDirectly()
    println("Final position is ${navigator.position}. Result is ${navigator.calcResult()}")
}

fun puzzle1() {
    val input = readInputFromFile("./input.txt")
    val navigator = Navigator(input)
    navigator.navigateDirectly()
    println("Final position is ${navigator.position}. Result is ${navigator.calcResult()}")
}

fun p2sample() {
    val navigator = Navigator(sampleInput)
    navigator.navigateWithAim()
    println("Final position is ${navigator.position}. Result is ${navigator.calcResult()}")
}

fun puzzle2() {
    val input = readInputFromFile("./input.txt")
    val navigator = Navigator(input)
    navigator.navigateWithAim()
    println("Final position is ${navigator.position}. Result is ${navigator.calcResult()}")
}

p1sample()
puzzle1()
p2sample()
puzzle2()