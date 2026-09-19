package com.sy.main.service;

import java.math.BigDecimal;

import com.sy.main.Entity.Wallet;
import com.sy.main.dto.TransferMoneyReqDTO;
import com.sy.main.dto.WalletRespDto;

public interface WalletService {

	
	WalletRespDto createWallet(Integer userId);

	WalletRespDto getWalletByUserId(Integer userId);

	    BigDecimal getBalance(Integer walletId);

	    WalletRespDto addMoney(Integer walletId, BigDecimal amount);

	    WalletRespDto withdrawMoney(Integer walletId, BigDecimal amount);
	    WalletRespDto getMyWallet();
	    BigDecimal getMyBalance();

	    WalletRespDto addMoneyToMyWallet(BigDecimal amount);

	    WalletRespDto withdrawFromMyWallet(BigDecimal amount);
	    WalletRespDto blockWallet(Integer walletId);

	    WalletRespDto unblockWallet(Integer walletId);
	    String transferMoney(TransferMoneyReqDTO req);
}
