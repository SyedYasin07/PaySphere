package com.sy.main.service;

import java.math.BigDecimal;
import java.util.List;

import com.sy.main.dto.AdminTransactionRespDto;
import com.sy.main.dto.TransactionRespDto;

public interface TransactionService {

    TransactionRespDto transferMoney(
            Integer receiverId,
            BigDecimal amount);

    List<TransactionRespDto> getTransactionHistory();

    TransactionRespDto getTransactionByReference(
            String referenceNumber);

    List<AdminTransactionRespDto> getAllTransactions();

    AdminTransactionRespDto getAdminTransactionByReference(
            String referenceNumber);
    List<AdminTransactionRespDto> getTransactionsByStatus(
            String status);
}
