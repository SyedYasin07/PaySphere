package com.sy.main.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sy.main.Entity.User;
import com.sy.main.Entity.WalletOperation;

public interface WalletOperationRepo extends JpaRepository<WalletOperation, Integer> {

    long countByUserAndOperationTypeAndOperationStatusAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(
            User user,
            String operationType,
            String operationStatus,
            LocalDateTime startOfDay,
            LocalDateTime startOfNextDay
    );
}