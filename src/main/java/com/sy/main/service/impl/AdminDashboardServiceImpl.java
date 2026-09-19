package com.sy.main.service.impl;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sy.main.dto.AdminDashboardRespDTO;
import com.sy.main.repository.TransactionRepo;
import com.sy.main.repository.UserRepo;
import com.sy.main.repository.WalletRepo;
import com.sy.main.service.AdminDashboardService;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {
	
	@Autowired
	private UserRepo ur;
	@Autowired
	private WalletRepo wr;
	@Autowired
	private TransactionRepo tr;

	@Override
	public AdminDashboardRespDTO getDashboard() {
		AdminDashboardRespDTO dto= new AdminDashboardRespDTO();
		dto.setTotalUsers(ur.count());
		dto.setActiveUsers(ur.countByStatus("ACTIVE"));
		dto.setBlockedUsers(ur.countByStatus("BLOCKED"));
		
		dto.setTotalWallet(wr.count());
		dto.setActiveWallet(wr.countByWalletStatus("ACTIVE"));
		dto.setBlockedWallet(wr.countByWalletStatus("BLOCKED"));
		
		dto.setTotalTransactions(tr.count());
		dto.setSuccessfulTransactions(tr.countByTransactionStatus("SUCCESS"));
		dto.setSuccessfulTransactions(tr.countByTransactionStatus("FAILED"));
		BigDecimal total= tr.getTotalSuccessfulAmount();
		dto.setTotalTransferredAmount(total);
		return dto;
	}

}
