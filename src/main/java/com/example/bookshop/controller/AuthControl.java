package com.example.bookshop.controller;

import com.example.bookshop.model.User;
import com.example.bookshop.repository.UserRepo;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthControl {
    @Autowired
    private UserRepo userRepo;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        user.setRole("CUSTOMER");
        userRepo.save(user);
        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password, HttpSession session) {
        User user = userRepo.findByUsernameAndPassword(username, password);
        if (user != null) {
            session.setAttribute("user", user);
            return ResponseEntity.ok("Logged in successfully");
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
    @GetMapping("/user")
    public ResponseEntity<User> getLoggedInUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(user);
    }
    @GetMapping("/session-user")
    public ResponseEntity<User> getSessionUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }

}