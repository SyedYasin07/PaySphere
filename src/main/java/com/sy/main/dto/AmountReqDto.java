package com.sy.main.dto;

import java.math.BigDecimal;

public class AmountReqDto {

	private BigDecimal amount;
	public AmountReqDto() {
		
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount=amount;
	}
}
