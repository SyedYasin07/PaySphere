package com.sy.main.dto;

import java.math.BigDecimal;

public class TransferMoneyReqDTO {
	
	private String receiverQrData;
	private BigDecimal amount;
	private String remarks;
	public String getReceiverQrData() {
		return receiverQrData;
	}
	public void setReceiverQrData(String receiverQrData) {
		this.receiverQrData = receiverQrData;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	

}
