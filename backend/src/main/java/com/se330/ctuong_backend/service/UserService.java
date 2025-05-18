package com.se330.ctuong_backend.service;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.se330.ctuong_backend.dto.rest.UserResponse;
import com.se330.ctuong_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final ManagementAPI managementAPI;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;


    public UserResponse syncAuthUser(Principal principal) throws Auth0Exception {
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
            var newUserBuidler = com.se330.ctuong_backend.model.User
                    .builder()
                    .sub(subject)
                    .name(user.getName())
                    .picture(user.getPicture())
                    .username(user.getUsername())
                    .email(user.getEmail());

            if (user.getUsername() == null) {
                newUserBuidler.username(user.getNickname());
            } else {
                newUserBuidler.username(user.getUsername());
            }

            userRepository.save(newUserBuidler.build());
        } else {
            log.info("User already exists in database: {}", subject);
        }
        return userRepository
                .getUserBySub(subject)
                .map(u -> modelMapper.map(u, UserResponse.class))
                .orElseThrow(() -> new IllegalStateException("User not found in database"));
    }

    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> modelMapper.map(user, UserResponse.class));
    }

    public Optional<UserResponse> getUserBySub(String sub) {
        return userRepository.getUserBySub(sub)
                .map(user -> modelMapper.map(user, UserResponse.class));
    }

//    public void updateUser(Principal principal, UpdateUserRequest updateUserRequest) {
//        final var user = userRepository
//                .getUserBySub(principal.getName())
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//
//        user.setDisplayName(updateUserRequest.getDisplayName());
//        user.setUsername(updateUserRequest.getUsername());
//        user.setEmail(updateUserRequest.getEmail());
//        userRepository.save(user);
//    }
}
