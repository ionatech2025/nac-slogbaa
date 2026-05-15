dependencies {
    implementation(project(":shared-ports"))
    implementation("org.springframework.boot:spring-boot-starter-mail")


    // Used for PDF generation (Certificates)
    implementation("com.openhtmltopdf:openhtmltopdf-core:1.0.10")
    implementation("com.openhtmltopdf:openhtmltopdf-pdfbox:1.0.10")
    implementation("org.jsoup:jsoup:1.18.3")

    // OpenPDF — backend-generated reports
    implementation("com.github.librepdf:openpdf:1.3.39")

    // XChart — analytics and chart rendering
    implementation("org.knowm.xchart:xchart:3.8.8")

    // Better SVG support if needed later
    implementation("org.apache.xmlgraphics:batik-all:1.18")

    // Thumbnail/image utilities (optional but useful)
    implementation("net.coobird:thumbnailator:0.4.20")
}
