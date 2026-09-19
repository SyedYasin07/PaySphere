package com.sy.main.Entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Table(name="wallets")
@Entity
public class Wallet {
	public Wallet() {

	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="wallet_id")
	private Integer walletId;
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;
	 @Column(name = "wallet_number", nullable = false)
	private String walletNumber;
	 @Column(name = "balance", nullable = false)
	private BigDecimal balance=BigDecimal.ZERO;
	 @Column(name = "wallet_status", nullable = false)
	private String walletStatus;
	 @Column(name = "created_at", insertable = false, updatable = false)
	private LocalDateTime createdAt;
	 @Column(name = "updated_at", insertable = false, updatable = false)
	private LocalDateTime updatedAt;
	 public Integer getWalletId() {
		 return walletId;
	 }
	 public void setWalletId(Integer walletId) {
		 this.walletId = walletId;
	 }
	 public User getUser() {
		 return user;
	 }
	 public void setUser(User user) {
		 this.user = user;
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
	 public LocalDateTime getCreatedAt() {
		 return createdAt;
	 }
	 public void setCreatedAt(LocalDateTime createdAt) {
		 this.createdAt = createdAt;
	 }
	 public LocalDateTime getUpdatedAt() {
		 return updatedAt;
	 }
	 public void setUpdatedAt(LocalDateTime updatedAt) {
		 this.updatedAt = updatedAt;
	 }
	 

}
