import java.io.File

fun readFile(fileName: String): List<String>
        = File(fileName)
    .useLines { it.toList() }

fun elves(): MutableMap<Int, Int> {
    val calories = readFile("./input.txt")

    val elves: MutableMap<Int, Int> = mutableMapOf()

    var elveIndex = 0
    calories.forEach { it ->
        if (it.isEmpty()) {
            elveIndex++;
        } else {
            if (!elves.containsKey(elveIndex)) {
                elves.set(elveIndex, it.toInt())
            } else {
                elves[elveIndex] = elves[elveIndex]!! + it.toInt()
            }
        }
    }
    return elves
}

val mostCalories = elves().values.maxOrNull()
val topThree = elves().values.sortedDescending().subList(0, 3).sum()

println("Star 1: " + mostCalories)
println("Star 2: " + topThree)