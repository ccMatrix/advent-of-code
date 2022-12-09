import java.io.File

fun loadMap(fileName: String): List<List<Int>>
        = File(fileName)
    .useLines { it.toList() }
    .map { s: String ->
        s.toList().map { it.digitToInt() }
    }

fun isVisible(tree: Int, target: Int?) = (target == null || target < tree)

fun countVisibleTrees(map: List<List<Int>>): Int {
    var visible = 0

    for (y in 0..map.count() - 1) {
        val line = map[y]
        for (x in 0..line.count() - 1) {
            val tree = map[y][x]
            val column = map.map { it[x] }
            if (isVisible(tree, line.subList(0, x).maxOrNull()) ||
                isVisible(tree, line.subList(x + 1, line.count()).maxOrNull()) ||
                isVisible(tree, column.subList(0, y).maxOrNull()) ||
                isVisible(tree, column.subList(y + 1, column.count()).maxOrNull())) {
                visible++
                continue
            }
        }
    }
    return visible
}

fun countTrees(tree: Int, trees: List<Int>): Int {
    for (i in 0..trees.count() - 1) {
        if (trees[i] >= tree) {
            return i + 1
        }
    }
    return trees.count()
}

fun maxScenicScore(map: List<List<Int>>): Int {
    val scenicScores = mutableListOf<Int>()

    for (y in 0..map.count() - 1) {
        val line = map[y]
        for (x in 0..line.count() - 1) {
            val tree = map[y][x]
            val column = map.map { it[x] }
            val treeCounts = arrayOf(
                countTrees(tree, column.subList(0, y).reversed()),
                countTrees(tree, line.subList(0, x).reversed()),
                countTrees(tree, column.subList(y + 1, column.count())),
                countTrees(tree, line.subList(x + 1, line.count())),
            )
            val scenicScore = treeCounts.fold(1, { acc, i -> acc * i })
            scenicScores.add(scenicScore)
        }
    }
    return scenicScores.max()
}

fun assertEquals(expect: Int, original: Int) {
    if (expect != original) {
        throw Exception("${original} does not equal expected ${expect}")
    }
}

fun checkSample() {
    val sampleMap = loadMap("./sample.txt")
    val sampleVisibleTrees = countVisibleTrees(sampleMap)
    assertEquals(21, countVisibleTrees(sampleMap))
    assertEquals(8, maxScenicScore(sampleMap))
}

fun processMap() {
    val map = loadMap("./input.txt")
    println("There are ${countVisibleTrees(map)} visible trees")
    println("The max scenic score is ${maxScenicScore(map)}")
}

checkSample()
processMap()