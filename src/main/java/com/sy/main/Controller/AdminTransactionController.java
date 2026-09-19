package com.sy.main.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sy.main.dto.AdminTransactionRespDto;
import com.sy.main.service.TransactionService;

@RestController
@RequestMapping("/admin/transactions")
public class AdminTransactionController {

    @Autowired
    private TransactionService ts;

    @GetMapping
    public List<AdminTransactionRespDto> getAllTransactions() {

        return ts.getAllTransactions();
    }
    @GetMapping("/{referenceNumber}")
    public AdminTransactionRespDto getTransactionByReference(
            @PathVariable String referenceNumber) {

        return ts.getAdminTransactionByReference(referenceNumber);
    }
    @GetMapping("/status/{status}")
    public List<AdminTransactionRespDto> getTransactionsByStatus(
            @PathVariable String status) {

        return ts.getTransactionsByStatus(status);
    }
}