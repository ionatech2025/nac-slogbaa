dependencies {
    implementation(project(":shared-ports"))
    implementation("org.springframework.boot:spring-boot-starter-mail")

    // AWS SDK S3 — used for Cloudflare R2 (S3-compatible object storage)
    implementation(platform("software.amazon.awssdk:bom:2.31.1"))
    implementation("software.amazon.awssdk:s3")


    implementation("com.openhtmltopdf:openhtmltopdf-core:1.0.10")
    implementation("com.openhtmltopdf:openhtmltopdf-pdfbox:1.0.10")
}
