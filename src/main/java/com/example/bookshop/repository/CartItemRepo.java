package com.example.bookshop.repository;

import com.example.bookshop.model.Book;
import com.example.bookshop.model.Cart;
import com.example.bookshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemRepo extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);
    Cart findByUserAndBook(User user, Book title);
    void deleteByBook_Id(Long bookId);
}