package com.se330.ctuong_backend.controller;

import com.auth0.exception.Auth0Exception;
import com.se330.ctuong_backend.dto.rest.UserDto;
import com.se330.ctuong_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current authenticated user",
            description = "Returns the currently authenticated user's details. If the user doesn't exist in the system, it tries to sync from Auth0.")
    @ApiResponse(responseCode = "200", description = "Authenticated user info",
            content = @Content(schema = @Schema(implementation = UserDto.class)))
    @ApiResponse(responseCode = "401", description = "User not authenticated",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public Object getUser(Principal principal) {
        if (principal == null) {
            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "User not authenticated");
            detail.setTitle("User not authenticated");
            return detail;
        }
        final var sub = principal.getName();

        return userService.getUserBySub(sub).orElseGet(() -> {
            try {
                return userService.syncAuthUser(principal);
            } catch (Auth0Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
    @GetMapping("/search")
    public Page<UserDto> searchUsers(
            @RequestParam(required = false) String username, // Make username optional
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return userService.searchUsersByUsername(username, page, size);
    }

//    @PutMapping("/me")
//    @PreAuthorize("isAuthenticated()")
//    public Object updateCurrentUser(Principal principal, @Validated @RequestBody UpdateUserRequest request) {
//        if (principal == null) {
//            final var detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "User not authenticated");
//            detail.setTitle("User not authenticated");
//            return detail;
//        }
//        userService.updateUser(principal, request);
//
//        return ResponseEntity.noContent().build();
//    }
}
