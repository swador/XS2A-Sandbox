package de.adorsys.ledgers.oba.rest.server.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.Contact;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.ApiKeyVehicle;
import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket productApi() {
        return new Docket(DocumentationType.SWAGGER_2)
           .groupName("PUS-API")
           .select()
           .apis(RequestHandlerSelectors.basePackage("de.adorsys.ledgers.oba.rest"))
           .paths(PathSelectors.any())
           .build()
           .pathMapping("/")
           .apiInfo(metaData())
           .securitySchemes(Arrays.asList(apiKey()))
           .securityContexts(Arrays.asList(securityContext()));
    }
    
    private ApiKey apiKey() {
        return new ApiKey("apiKey", "Authorization", "header");
      }
    
    @Bean
    SecurityConfiguration security() {
        return new SecurityConfiguration(null, null, null, // realm Needed for authenticate button to work
                null, // appName Needed for authenticate button to work
                "  ", // apiKeyValue
                ApiKeyVehicle.HEADER, "apiKey", // apiKeyName
                null);
    }
    
    private SecurityContext securityContext() {
    	return SecurityContext.builder()
    			.securityReferences(defaultAuth())
    			.forPaths(PathSelectors.regex("/*"))
    			.build();
    }    
    
    private List<SecurityReference> defaultAuth() {
    	AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
    	AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
    	authorizationScopes[0] = authorizationScope;
    	return Arrays.asList(new SecurityReference("apiKey", authorizationScopes));
    }    
    private ApiInfo metaData() {

        Contact contact = new Contact("Adorsys GmbH", "https://www.adorsys.de",
                                      "fpo@adorsys.de");

        return new ApiInfo(
                "Ledgers",
                "Implementation of a simple double entry accounting module with a sample deposit account module. "
                + "We have 3 preloaded users: <b>marion.mueller</b>, <b>anton.brueckner</b>, <b>max.musterman</b> all with the PIN <b>12345</b>. "
                + "You can use the User Login API <b>/users/authorise2</b> endpoint to gain an access token. Then use the access token with the prefix 'Bearer ' to Authorize on this ui.",
                "0.5.0",
                "Terms of Service: to be edited...",
                contact,
                "Apache License Version 2.0",
                "https://www.apache.org/licenses/LICENSE-2.0",
                new ArrayList<>());
    }
}