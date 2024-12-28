import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.springBoot)
    alias(libs.plugins.springDependencyManagement)
    alias(libs.plugins.kotlinJvm)
    alias(libs.plugins.detekt) apply true
}

group = "learn.toni"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.spring.web)
    implementation(libs.spring.thymeleaf)
    implementation(libs.jackson.kotlin)
    implementation(libs.kotlin.stdlib)
    implementation(libs.kotlin.reflect)
    developmentOnly(libs.spring.devtools)
    testImplementation(libs.spring.starter.test)
    testImplementation(libs.kotlin.test.junit5)
    testImplementation(libs.junit.platform.launcher)
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}


tasks.withType<Test> {
    useJUnitPlatform()
}
