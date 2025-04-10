package com.se330.ctuong_backend.service;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.se330.ctuong_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpRequest;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final ManagementAPI managementAPI;
    private final UserRepository userRepository;

    public void syncAuthUser(Authentication authentication) throws Auth0Exception {
        var jwt = (JwtAuthenticationToken) authentication;
        String subject = jwt.getToken().getSubject(); // this is the "sub" claim
        User user = managementAPI.users().get(subject, new UserFilter()).execute().getBody();
        if (user == null) {
            throw new IllegalStateException("User not found in Auth0");
        }

        if (!userRepository.existsUserBySub(subject)) {
            log.info("User not found in database, creating new user: {}", subject);
            com.se330.ctuong_backend.model.User newUser = com.se330.ctuong_backend.model.User
                    .builder()
                    .sub(subject)
                    .name(user.getName())
                    .email(user.getEmail())
                    .build();
            userRepository.save(newUser);
        } else {
            log.info("User already exists in database: {}", subject);
        }
    }
}
