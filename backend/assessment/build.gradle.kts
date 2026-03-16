dependencies {
    implementation(project(":shared-ports"))
    implementation(project(":iam"))
    implementation(project(":learning"))

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
}
