package com.nac.slogbaa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = { "com.nac.slogbaa" })
@EntityScan(basePackages = { "com.nac.slogbaa.iam.adapters.persistence.entity" })
@EnableJpaRepositories(basePackages = { "com.nac.slogbaa.iam.adapters.persistence.repository" })
public class SlogbaaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SlogbaaApplication.class, args);
	}

}
