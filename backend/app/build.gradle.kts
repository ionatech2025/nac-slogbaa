plugins {
    id("org.springframework.boot")
}

// Load .env from repo root into bootRun (local dev). Production uses platform env vars.
tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
    val envFile = rootProject.file("../.env")
    if (envFile.exists()) {
        envFile.readLines()
            .filter { it.contains("=") && !it.trim().startsWith("#") }
            .forEach { line ->
                val parts = line.split("=", limit = 2)
                if (parts.size == 2) {
                    val value = parts[1].trim().removeSurrounding("\"", "\"")
                    environment(parts[0].trim(), value)
                }
            }
    }
}

// This is the only module that builds a bootable fat-jar
tasks.named<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    enabled = true
    mainClass = "com.nac.slogbaa.SlogbaaApplication"
}
tasks.named<Jar>("jar") { enabled = false }

dependencies {
    implementation(project(":shared-ports"))
    implementation(project(":iam"))
    implementation(project(":learning"))
    implementation(project(":progress"))
    implementation(project(":assessment"))
    implementation(project(":infrastructure"))

    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-autoconfigure")
    implementation("org.springframework.boot:spring-boot-starter-security")

    // Database & migrations
    implementation("org.springframework.boot:spring-boot-starter-flyway")
    implementation("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")

    // Caching
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("com.github.ben-manes.caffeine:caffeine")

    // Observability
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.micrometer:micrometer-registry-prometheus")

    // API documentation (OpenAPI 3.1 / Swagger UI)
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.6")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
