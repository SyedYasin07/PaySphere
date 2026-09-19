package com.sy.main.dto;

import java.math.BigDecimal;

public class WalletRespDto {
	private Integer walletId;
	private String walletNumber;
	private BigDecimal balance;
	private String walletStatus;
	public WalletRespDto() {
		
	}
	public Integer getWalletId() {
		return walletId;
	}
	public void setWalletId(Integer walletId) {
		this.walletId = walletId;
	}
	public String getWalletNumber() {
		return walletNumber;
	}
	public void setWalletNumber(String walletNumber) {
		this.walletNumber = walletNumber;
	}
	public BigDecimal getBalance() {
		return balance;
	}
	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}
	public String getWalletStatus() {
		return walletStatus;
	}
	public void setWalletStatus(String walletStatus) {
		this.walletStatus = walletStatus;
	}
	

}
