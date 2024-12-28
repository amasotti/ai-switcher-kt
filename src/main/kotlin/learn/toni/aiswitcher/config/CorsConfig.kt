package learn.toni.aiswitcher.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
open class CorsConfig {

    @Bean
    open fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/api/**") // Allow CORS for all endpoints under /api
                    .allowedOrigins("http://localhost:3000") // Allow requests from the Next.js frontend
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow these HTTP methods
                    .allowedHeaders("*")
                    .allowCredentials(true)
            }
        }
    }
}
