package com.example.bookshop.controller;

import com.example.bookshop.repository.CartItemRepo.*;
import com.example.bookshop.model.*;
import com.example.bookshop.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminControl {
    @Autowired
    private BookRepo bookRepo;

    @PostMapping("/book")
    public ResponseEntity<String> addBook(@RequestBody Book book, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !"ADMIN".equals(user.getRole())) return ResponseEntity.status(403).body("Access denied");
        bookRepo.save(book);
        return ResponseEntity.ok("Book added");
    }

    @PutMapping("/book/{id}")
    public ResponseEntity<String> updateBook(@PathVariable Long id, @RequestBody Book book, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !"ADMIN".equals(user.getRole())) return ResponseEntity.status(403).body("Access denied");
        book.setId(id);
        bookRepo.save(book);
        return ResponseEntity.ok("Book updated");
    }

    @DeleteMapping("/book/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !"ADMIN".equals(user.getRole())) return ResponseEntity.status(403).body("Access denied");
        bookRepo.deleteById(id);
        return ResponseEntity.ok("Book deleted");
    }
    @Autowired
    private CartItemRepo cartItemRepo;

    @DeleteMapping("/book/{id}/from-carts")
    @Transactional // Add this if using Solution 1
    public ResponseEntity<String> removeBookFromAllCarts(@PathVariable Long id) {
        cartItemRepo.deleteByBook_Id(id);
        return ResponseEntity.ok("Book removed from all carts");
    }
}