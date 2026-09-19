package com.sy.main.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sy.main.Entity.Transaction;
import com.sy.main.Entity.User;

public interface TransactionRepo extends JpaRepository<Transaction, Integer> {

    Optional<Transaction> findByReferenceNumber(
            String referenceNumber);

    @Query("""
        SELECT t FROM Transaction t
        WHERE t.sender = :user
           OR t.receiver = :user
        ORDER BY t.createdAt DESC
    """)
    List<Transaction> findUserTransactions(
            @Param("user") User user);

    @Query("""
        SELECT t FROM Transaction t
        WHERE t.referenceNumber = :referenceNumber
        AND (t.sender = :user OR t.receiver = :user)
    """)
    Optional<Transaction> findUserTransactionByReference(
            @Param("referenceNumber") String referenceNumber,
            @Param("user") User user);
    
    List<Transaction> findByTransactionStatusOrderByCreatedAtDesc(
            String transactionStatus);
    long countByTransactionStatus(String status);
    @Query(""" 
    SELECT COALESCE(SUM(t.amount),0) 
    FROM Transaction t 
    WHERE t.transactionStatus = 'SUCCESS'   
    """) 
    BigDecimal getTotalSuccessfulAmount();
}