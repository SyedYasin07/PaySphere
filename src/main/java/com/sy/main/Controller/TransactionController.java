package com.sy.main.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sy.main.dto.TransactionRespDto;
import com.sy.main.service.TransactionService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
	@Autowired
	private TransactionService ts;
	
	@PostMapping("/transfer")
	public TransactionRespDto transfermoney(
			
			@RequestParam Integer receiverId,
			@RequestParam BigDecimal amount) {
		return ts.transferMoney( receiverId, amount);
	}
	@GetMapping("/history")
	public List<TransactionRespDto> getTransactionHistory() {
	    return ts.getTransactionHistory();
	}
	@GetMapping("reference/{referenceNumber}")
	public TransactionRespDto getTransactionReference(@PathVariable String referenceNumber) {
		return ts.getTransactionByReference(referenceNumber);
	}
	@GetMapping("/my")
	public List<TransactionRespDto> getMyTransactions() {
	    return ts.getTransactionHistory();
	}

}
