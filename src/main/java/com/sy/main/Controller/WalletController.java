package com.sy.main.Controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sy.main.dto.TransferMoneyReqDTO;
import com.sy.main.dto.WalletRespDto;
import com.sy.main.service.WalletService;

@RestController
@RequestMapping("/wallets")
public class WalletController {
	
	@Autowired
	private WalletService ws;
	
	@PostMapping("/create/{userId}")
	public WalletRespDto createWallet(@PathVariable Integer userId) {
		return ws.createWallet(userId);
	}
	@GetMapping("/user/{userId}")
	public WalletRespDto getWalletByUserId(@PathVariable Integer userId) {
		return ws.getWalletByUserId(userId);
	}
	@GetMapping("/balance")
	public BigDecimal getBalance() {
	    return ws.getMyBalance();
	}

	@PostMapping("/add-money")
	public WalletRespDto addMoney(@RequestParam BigDecimal amount) {
	    return ws.addMoneyToMyWallet(amount);
	}

	@PostMapping("/withdraw")
	public WalletRespDto withdrawMoney(@RequestParam BigDecimal amount) {
	    return ws.withdrawFromMyWallet(amount);
	}
	@GetMapping("/my-wallet")
		public WalletRespDto getMyWallet() {
		    return ws.getMyWallet();
		}
	@PostMapping("/transfer")
	public String transferMoney(@RequestBody TransferMoneyReqDTO req) {
		return ws.transferMoney(req);
	}
	}
	
	

