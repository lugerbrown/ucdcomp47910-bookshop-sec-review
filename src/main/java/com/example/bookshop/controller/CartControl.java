package com.example.bookshop.controller;

import com.example.bookshop.model.*;
import com.example.bookshop.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartControl {
    @Autowired private CartItemRepo cartRepo;
    @Autowired private BookRepo bookRepo;

    @PostMapping("/add/{bookId}")
    public ResponseEntity<String> addToCart(@PathVariable Long bookId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(403).body("Please log in to add items to cart");
        }
        Book book = bookRepo.findById(bookId).orElse(null);
        if (book == null) {
            return ResponseEntity.status(404).body("Book not found");
        }
        if (book.getCopies() <= 0) {
            return ResponseEntity.status(400).body("Book is out of stock");
        }
        Cart existingCartItem = cartRepo.findByUserAndBook(user, book);

        if (existingCartItem != null) {
            if (book.getCopies() < existingCartItem.getQuantity() + 1) {
                return ResponseEntity.status(400).body("Not enough stock available");
            }
            existingCartItem.setQuantity(existingCartItem.getQuantity() + 1);
            cartRepo.save(existingCartItem);
        } else {
            Cart cartItem = new Cart();
            cartItem.setUser(user);
            cartItem.setBook(book);
            cartItem.setQuantity(1);
            cartRepo.save(cartItem);
        }
        return ResponseEntity.ok("Book added to cart successfully");
    }

    @GetMapping("/view")
    public List<Cart> viewCart(HttpSession session) {
        User user = (User) session.getAttribute("user");
        return cartRepo.findByUser(user);
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<String> removeItem(@PathVariable Long itemId) {
        cartRepo.deleteById(itemId);
        return ResponseEntity.ok("Removed from cart");
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<String> checkout(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(403).body("Please log in");
        }
        List<Cart> cartItems = cartRepo.findByUser(user);
        for (Cart cartItem : cartItems) {
            Book book = cartItem.getBook();
            if (book.getCopies() < cartItem.getQuantity()) {
                if (book.getCopies() == 0) {
                    cartRepo.delete(cartItem);
                    return ResponseEntity.status(400).body(
                            book.getTitle() + " is no longer available and has been removed from your cart"
                    );
                } else {
                    cartItem.setQuantity(book.getCopies());
                    cartRepo.save(cartItem);
                    return ResponseEntity.status(400).body(
                            "Only " + book.getCopies() + " copies of " + book.getTitle() + " are available. Cart updated."
                    );
                }
            }
            book.setCopies(book.getCopies() - cartItem.getQuantity());
            bookRepo.save(book);
        }
        cartRepo.deleteAll(cartItems);
        return ResponseEntity.ok("Order placed successfully. Thank you!");
    }
}
