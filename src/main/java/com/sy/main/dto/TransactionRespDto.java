package com.sy.main.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionRespDto {
	
	private Integer transactionId;
	private String senderName;
	private String receiverName;
	private BigDecimal amount;
	private String transactionType;
	private String transactionStatus;
	private String remarks;
	private String referenceNumber;
	private LocalDateTime createdAt;
	private String transactionDirection;
	
		public String getTransactionDirection() {
		return transactionDirection;
	}

	public void setTransactionDirection(String transactionDirection) {
		this.transactionDirection = transactionDirection;
	}

		public TransactionRespDto() {
			
		}
	
	public Integer getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(Integer transactionId) {
		this.transactionId = transactionId;
	}
	public String getSenderName() {
		return senderName;
	}
	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
	public String getReceiverName() {
		return receiverName;
	}
	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public String getTransactionType() {
		return transactionType;
	}
	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}
	public String getTransactionStatus() {
		return transactionStatus;
	}
	public void setTransactionStatus(String transactionStatus) {
		this.transactionStatus = transactionStatus;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getReferenceNumber() {
		return referenceNumber;
	}
	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	
}
