package learn.toni.aiswitcher

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class AiSwitcherApplication

fun main(args: Array<String>) {
    runApplication<AiSwitcherApplication>(*args)
}
