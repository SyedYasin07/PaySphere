package com.sy.main.dto;

import java.math.BigDecimal;

public class AdminDashboardRespDTO {
	private long totalUsers;
	private long activeUsers;
	private long blockedUsers;
	private long totalWallet;
	private long activeWallet;
	private long blockedWallet;
	private long totalTransactions;
	private long successfulTransactions;
	private long failedTransactions;
	private BigDecimal totalTransferredAmount;
	public long getTotalUsers() {
		return totalUsers;
	}
	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}
	public long getActiveUsers() {
		return activeUsers;
	}
	public void setActiveUsers(long activeUsers) {
		this.activeUsers = activeUsers;
	}
	public long getBlockedUsers() {
		return blockedUsers;
	}
	public void setBlockedUsers(long blockedUsers) {
		this.blockedUsers = blockedUsers;
	}
	public long getTotalWallet() {
		return totalWallet;
	}
	public void setTotalWallet(long totalWallet) {
		this.totalWallet = totalWallet;
	}
	public long getActiveWallet() {
		return activeWallet;
	}
	public void setActiveWallet(long activeWallet) {
		this.activeWallet = activeWallet;
	}
	public long getBlockedWallet() {
		return blockedWallet;
	}
	public void setBlockedWallet(long blockedWallet) {
		this.blockedWallet = blockedWallet;
	}
	public long getTotalTransactions() {
		return totalTransactions;
	}
	public void setTotalTransactions(long totalTransactions) {
		this.totalTransactions = totalTransactions;
	}
	public long getSuccessfulTransactions() {
		return successfulTransactions;
	}
	public void setSuccessfulTransactions(long successfulTransactions) {
		this.successfulTransactions = successfulTransactions;
	}
	public long getFailedTransactions() {
		return failedTransactions;
	}
	public void setFailedTransactions(long failedTransactions) {
		this.failedTransactions = failedTransactions;
	}
	public BigDecimal getTotalTransferredAmount() {
		return totalTransferredAmount;
	}
	public void setTotalTransferredAmount(BigDecimal totalTransferredAmount) {
		this.totalTransferredAmount = totalTransferredAmount;
	}
	
}
