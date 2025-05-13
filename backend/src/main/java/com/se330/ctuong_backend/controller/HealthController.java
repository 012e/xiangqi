package com.se330.ctuong_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/health/hello")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Server is running");
    }

    @GetMapping("/health/auth")
    public ResponseEntity<?> healthAuth(Principal principal) {
        if (principal == null) {
            var problem = Map.of("error", (Object) "User not authenticated");
            return ResponseEntity.badRequest().body(problem);
        }
        return ResponseEntity.ok(principal);

    }
}
