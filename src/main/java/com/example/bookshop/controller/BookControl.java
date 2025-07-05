package com.example.bookshop.controller;

import com.example.bookshop.model.Book;
import com.example.bookshop.repository.BookRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookControl {
    @Autowired
    private BookRepo bookRepo;

    @GetMapping
    public List<Book> listBooks() {
        return bookRepo.findAll();
    }
}
