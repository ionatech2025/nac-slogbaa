package com.nac.slogbaa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@ComponentScan(basePackages = { "com.nac.slogbaa", "com.nac.slogbaa.iam", "com.nac.slogbaa.learning", "com.nac.slogbaa.progress" })
@EntityScan(basePackages = {
        "com.nac.slogbaa.iam.adapters.persistence.entity",
        "com.nac.slogbaa.learning.adapters.persistence.entity",
        "com.nac.slogbaa.progress.adapters.persistence.entity"
})
@EnableJpaRepositories(basePackages = {
        "com.nac.slogbaa.iam.adapters.persistence.repository",
        "com.nac.slogbaa.learning.adapters.persistence.repository",
        "com.nac.slogbaa.progress.adapters.persistence.repository"
})
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
	
	@Bean
    ApplicationRunner runner(PasswordEncoder encoder) {
        return args -> {
            // This will print to your terminal every time the app starts
            System.out.println("Encoded Password: " + encoder.encode("superadmin123"));
            System.out.println("Encoded Password: " + encoder.encode("admin123"));
            System.out.println("Encoded Password: " + encoder.encode("trainee1"));
            System.out.println("Encoded Password: " + encoder.encode("trainee2"));
            System.out.println("Encoded Password: " + encoder.encode("trainee3"));
        };
    }

}
