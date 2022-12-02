import java.io.File

enum class Hand(val points: Int) {
    Rock(1),
    Paper(2),
    Scissors(3)
}

enum class Score(val score: Int) {
    Lost(0),
    Draw(3),
    Win(6)
}
val decoderMapHand = mapOf('A' to Hand.Rock, 'B' to Hand.Paper, 'C' to Hand.Scissors)
val decoderMapOutcome = mapOf('X' to Score.Lost, 'Y' to Score.Draw, 'Z' to Score.Win)
data class Strategy(public val opponent: Hand, public val target: Score)

fun scorePuzzle(strategy: Strategy): Int {
    val result = when (strategy.opponent) {
        Hand.Rock ->
            when (strategy.target) {
                Score.Draw -> Hand.Rock;
                Score.Win -> Hand.Paper;
                Score.Lost -> Hand.Scissors;
            }
        Hand.Paper ->
            when (strategy.target) {
                Score.Lost -> Hand.Rock;
                Score.Draw -> Hand.Paper;
                Score.Win -> Hand.Scissors;
            }
        Hand.Scissors ->
            when (strategy.target) {
                Score.Win -> Hand.Rock;
                Score.Lost -> Hand.Paper;
                Score.Draw -> Hand.Scissors;
            }
    }
    return result.points + strategy.target.score
}

fun loadStrategies(fileName: String): List<Strategy>
        = File(fileName)
    .useLines { it.toList() }
    .map { s ->
        val data = s.toCharArray()
        Strategy(decoderMapHand.getValue(data[0]), decoderMapOutcome.getValue(data[2]))
    }

val strategies = loadStrategies("./input.txt");

val totalPoints = strategies.map { scorePuzzle(it) }.sum()
println("Puzzle 2: " + totalPoints)