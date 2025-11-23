package com.unihub.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableJpaRepositories
@SpringBootApplication
public class UniHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(UniHubApplication.class, args);
	}

}
