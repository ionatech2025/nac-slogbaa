plugins {
    java
    id("org.springframework.boot") version "4.0.5" apply false
    id("io.spring.dependency-management") version "1.1.7" apply false
}

group = "com.nac"
version = "0.0.1-SNAPSHOT"

// ---------- shared config applied to every subproject ----------
subprojects {
    apply(plugin = "java")
    apply(plugin = "io.spring.dependency-management")

    group = rootProject.group
    version = rootProject.version

    java {
        toolchain { languageVersion = JavaLanguageVersion.of(21) }
    }

    // Spring Framework 7 / Boot 4 requires -parameters for @PathVariable, @RequestParam, etc.
    tasks.withType<JavaCompile> {
        options.compilerArgs.add("-parameters")
    }

    repositories { mavenCentral() }

    the<io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension>().apply {
        imports {
            mavenBom("org.springframework.boot:spring-boot-dependencies:4.0.5")
        }
    }

    dependencies {
        "compileOnly"("org.projectlombok:lombok")
        "annotationProcessor"("org.projectlombok:lombok")
        "testCompileOnly"("org.projectlombok:lombok")
        "testAnnotationProcessor"("org.projectlombok:lombok")

        "testImplementation"("org.springframework.boot:spring-boot-starter-test")
        // Align junit-platform-launcher with the JUnit 5 version from the Spring Boot BOM
        "testRuntimeOnly"("org.junit.platform:junit-platform-launcher")
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }

    // Library modules must NOT produce a Boot fat-jar
    tasks.findByName("bootJar")?.enabled = false
    tasks.findByName("jar")?.let { (it as Jar).enabled = true }
}
