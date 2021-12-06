import java.io.File

val sampleInput = mutableListOf(3, 4, 3, 1, 2);
fun readFile(fileName: String): List<Int>
        = File(fileName)
        .readText()
        .trim()
        .split(',')
        .map {
            it.toInt()
        }

fun simulateDay(lanternfishes: MutableList<MutableList<Int>>) {
    var newFishCount = 0
    lanternfishes.forEach { lanternfish ->
        lanternfish.forEachIndexed { idx, timer ->
            when (timer) {
                in 1..8 -> lanternfish[idx] = timer - 1
                0 -> {
                    lanternfish[idx] = 6
                    newFishCount++
                }
            }
        }
    }
    lanternfishes.add(MutableList<Int>(newFishCount, { 8 }))
}

fun countFishes(lanternfishes: List<List<Int>>): Int =
    lanternfishes.fold(0, { acc, list -> acc + list.count() })

fun p1sample() {
    var lanternfish = mutableListOf(sampleInput)
    for (day in 0..79) {
        simulateDay(lanternfish)
    }
    println("There are now ${countFishes(lanternfish)} lanternfish")
}

fun puzzle1() {
    var lanternfish = mutableListOf(readFile("input.txt").toMutableList())
    for (day in 0..79) {
        simulateDay(lanternfish)
    }
    println("There are now ${countFishes(lanternfish)} lanternfish")
}

fun p2sample() {
    var lanternfish = mutableListOf(sampleInput)
    for (day in 0..255) {
        println("Processing s2 day $day ...")
        simulateDay(lanternfish)
    }
    println("There are now ${lanternfish.count()} lanternfish")
}

//fun puzzle2() {
//    var lanternfish = mutableListOf(readFile("input.txt").toMutableList())
//    for (day in 0..255) {
//        println("Processing day $day ...")
//        simulateDay(lanternfish)
//    }
//    println("There are now ${lanternfish.count()} lanternfish")
//}

p1sample()
puzzle1()
p2sample()
//puzzle2()
