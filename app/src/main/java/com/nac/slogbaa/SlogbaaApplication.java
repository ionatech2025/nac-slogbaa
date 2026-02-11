package com.nac.slogbaa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import java.util.Arrays;

@SpringBootApplication
@ComponentScan(basePackages = { "com.nac.slogbaa", "com.nac.slogbaa.iam" })
@EntityScan(basePackages = { "com.nac.slogbaa.iam.adapters.persistence.entity" })
@EnableJpaRepositories(basePackages = { "com.nac.slogbaa.iam.adapters.persistence.repository" })
public class SlogbaaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SlogbaaApplication.class, args);
	}
	
//	@Bean
//	ApplicationRunner runner(ApplicationContext ctx) {
//	    return args -> {
//	        System.out.println("==== REGISTERED CONTROLLERS ====");
//	        Arrays.stream(ctx.getBeanDefinitionNames())
//	                .filter(name -> name.toLowerCase().contains("auth"))
//	                .forEach(System.out::println);
//	    };
//	}
	

}
