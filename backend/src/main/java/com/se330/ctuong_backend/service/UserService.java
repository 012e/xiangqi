package com.se330.ctuong_backend.service;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.se330.ctuong_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final ManagementAPI managementAPI;
    private final UserRepository userRepository;

    public void syncAuthUser(Authentication authentication) throws Auth0Exception {
        if (authentication == null) {
            throw new IllegalArgumentException("Authentication must not be null");
        }
        syncAuthUser((Principal) authentication.getPrincipal());
    }

    public void syncAuthUser(Principal principal) throws Auth0Exception {
        if (principal == null) {
            throw new IllegalArgumentException("Principal must not be null");
        }
        final var subject = principal.getName();

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
