package com.nac.slogbaa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.nac.slogbaa", "com.nac.slogbaa.iam", "com.nac.slogbaa.learning", "com.nac.slogbaa.progress", "com.nac.slogbaa.assessment" })
@EntityScan(basePackages = {
        "com.nac.slogbaa.iam.adapters.persistence.entity",
        "com.nac.slogbaa.learning.adapters.persistence.entity",
        "com.nac.slogbaa.progress.adapters.persistence.entity",
        "com.nac.slogbaa.assessment.adapters.persistence.entity",
        "com.nac.slogbaa.app.cms.entity"
})
@EnableJpaRepositories(basePackages = {
        "com.nac.slogbaa.iam.adapters.persistence.repository",
        "com.nac.slogbaa.learning.adapters.persistence.repository",
        "com.nac.slogbaa.progress.adapters.persistence.repository",
        "com.nac.slogbaa.assessment.adapters.persistence.repository",
        "com.nac.slogbaa.app.cms.repository"
})
public class SlogbaaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SlogbaaApplication.class, args);
	}
}
