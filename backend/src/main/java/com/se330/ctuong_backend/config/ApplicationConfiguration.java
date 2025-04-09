package com.se330.ctuong_backend.config;

import com.auth0.client.mgmt.ManagementAPI;
import dto.response.Game;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.net.http.HttpClient;
import java.util.Random;


@Configuration
@EnableScheduling
public class ApplicationConfiguration {
    public static Game DEFAULT_GAME = Game.builder()
            .whitePlayerId("google-oauth2|107467322953502622934")
            .blackPlayerId("auth0|67e67a37850ac85be855463a")
            .build();

    @Value("${springdoc.oAuthFlow.authorizationUrl}")
    private String authorizationUrl;

    @Value("${springdoc.oAuthFlow.tokenUrl}")
    private String tokenUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        var scopes = new Scopes();
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("okta"))
                .components(new Components()
                        .addSecuritySchemes("okta",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.OAUTH2)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .flows(new OAuthFlows()
                                                .authorizationCode(new OAuthFlow()
                                                        .authorizationUrl(authorizationUrl)
                                                        .tokenUrl(tokenUrl)
                                                        .scopes(new Scopes()
                                                                .addString("openid", "openid")
                                                                .addString("email", "email")
                                                                .addString("profile", "profile"))
                                                )
                                        )
                        )
                );
    }

    @Bean
    public Random random() {
        return new Random();
    }

    @Bean
    public HttpClient httpClient() {
        return HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    @Value("${auth0.domain}")
    private String issuerUri;
    @Value("${auth0.apiToken}")
    private String apiToken;

    @Bean
    public ManagementAPI managementAPI() {
        return ManagementAPI.newBuilder(issuerUri, apiToken).build();
    }
}
