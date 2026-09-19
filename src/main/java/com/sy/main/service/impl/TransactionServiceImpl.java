package com.sy.main.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sy.main.Entity.Transaction;
import com.sy.main.Entity.User;
import com.sy.main.Entity.Wallet;
import com.sy.main.dto.AdminTransactionRespDto;
import com.sy.main.dto.TransactionRespDto;
import com.sy.main.repository.TransactionRepo;
import com.sy.main.repository.UserRepo;
import com.sy.main.repository.WalletRepo;
import com.sy.main.security.SecurityUtil;
import com.sy.main.service.TransactionService;

import jakarta.transaction.Transactional;

@Service
public class TransactionServiceImpl implements TransactionService {
	
	@Autowired
	private TransactionRepo tr;
	@Autowired
	private WalletRepo wr;
	@Autowired
	private UserRepo ur;

	@Override
	@Transactional
	public TransactionRespDto transferMoney(
	        Integer receiverId,
	        BigDecimal amount) {

	    User sender = SecurityUtil.getCurrentUser();

	    User receiver = ur.findById(receiverId)
	            .orElseThrow(() -> new RuntimeException("Receiver not found"));

	    if (sender.getUserId().equals(receiver.getUserId())) {
	        throw new RuntimeException(
	                "Sender and receiver cannot be the same");
	    }

	    Wallet senderWallet = wr.findByUser(sender)
	            .orElseThrow(() ->
	                    new RuntimeException("Sender wallet not found"));

	    Wallet receiverWallet = wr.findByUser(receiver)
	            .orElseThrow(() ->
	                    new RuntimeException("Receiver wallet not found"));
		
		if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
		    throw new RuntimeException("Amount must be greater than zero");
		}

		if ("BLOCKED".equals(senderWallet.getWalletStatus())) {
		    throw new RuntimeException("Sender wallet is blocked");
		}

		if ("BLOCKED".equals(receiverWallet.getWalletStatus())) {
		    throw new RuntimeException("Receiver wallet is blocked");
		}

		if (senderWallet.getBalance().compareTo(amount) < 0) {
		    throw new RuntimeException("Insufficient balance");
		}
//		if(senderId.equals(receiverId)) {
//		    throw new RuntimeException("Sender and receiver cannot be the same");
//		}
		senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
		receiverWallet.setBalance(receiverWallet.getBalance().add(amount));
		wr.save(senderWallet);
		wr.save(receiverWallet);
		
		Transaction t= new Transaction();
		t.setWallet(senderWallet);
		t.setSender(sender);
		t.setReceiver(receiver);
		t.setAmount(amount);
		t.setTransactionType("TRANSFER");
		t.setTransactionStatus("SUCCESS");
	t.setReferenceNumber("TXN" + System.currentTimeMillis());
	t.setRemarks("Money Transfer");
	t.setCreatedAt(LocalDateTime.now());
	Transaction saved= tr.save(t);
	TransactionRespDto resp = new TransactionRespDto();

	resp.setTransactionId(saved.getTransactionId());
	resp.setSenderName(saved.getSender().getFirstName());
	resp.setReceiverName(saved.getReceiver().getFirstName());
	resp.setAmount(saved.getAmount());
	resp.setTransactionType(saved.getTransactionType());
	resp.setTransactionStatus(saved.getTransactionStatus());
	resp.setReferenceNumber(saved.getReferenceNumber());
	resp.setRemarks(saved.getRemarks());
	resp.setCreatedAt(saved.getCreatedAt());
	
	if (saved.getSender().getUserId().equals(sender.getUserId())) {
	    resp.setTransactionDirection("SENT");
	} else {
	    resp.setTransactionDirection("RECEIVED");
	}

	return resp;


	}

	@Override
	public List<TransactionRespDto> getTransactionHistory() {

	    User user = SecurityUtil.getCurrentUser();

	    List<Transaction> trans =
	            tr.findUserTransactions(user);

	    return trans.stream().map(transaction -> {

	        TransactionRespDto resp = new TransactionRespDto();

	        resp.setTransactionId(
	                transaction.getTransactionId());

	        resp.setSenderName(
	                transaction.getSender().getFirstName());

	        resp.setReceiverName(
	                transaction.getReceiver().getFirstName());

	        resp.setAmount(transaction.getAmount());

	        resp.setTransactionType(
	                transaction.getTransactionType());

	        resp.setTransactionStatus(
	                transaction.getTransactionStatus());

	        resp.setReferenceNumber(
	                transaction.getReferenceNumber());

	        resp.setRemarks(
	                transaction.getRemarks());

	        resp.setCreatedAt(
	                transaction.getCreatedAt());
	        if (transaction.getSender().getUserId()
	                .equals(user.getUserId())) {

	            resp.setTransactionDirection("SENT");

	        } else {

	            resp.setTransactionDirection("RECEIVED");
	        }

	        return resp;

	    }).toList();
	}
	@Override
	public List<AdminTransactionRespDto> getAllTransactions() {

	    List<Transaction> transactions = tr.findAll();

	    return transactions.stream().map(transaction -> {

	        AdminTransactionRespDto resp =
	                new AdminTransactionRespDto();

	        resp.setTransactionId(
	                transaction.getTransactionId());

	        resp.setSenderId(
	                transaction.getSender().getUserId());

	        resp.setSenderName(
	                transaction.getSender().getFirstName()
	                + " "
	                + transaction.getSender().getLastName());

	        resp.setReceiverId(
	                transaction.getReceiver().getUserId());

	        resp.setReceiverName(
	                transaction.getReceiver().getFirstName()
	                + " "
	                + transaction.getReceiver().getLastName());

	        resp.setAmount(transaction.getAmount());

	        resp.setTransactionType(
	                transaction.getTransactionType());

	        resp.setTransactionStatus(
	                transaction.getTransactionStatus());

	        resp.setReferenceNumber(
	                transaction.getReferenceNumber());

	        resp.setRemarks(
	                transaction.getRemarks());

	        resp.setCreatedAt(
	                transaction.getCreatedAt());

	        return resp;

	    }).toList();
	}
	@Override
	public TransactionRespDto getTransactionByReference(String referenceNumber) {
		User user = SecurityUtil.getCurrentUser();

		Transaction trans = tr.findUserTransactionByReference(
		        referenceNumber,
		        user
		).orElseThrow(
		        () -> new RuntimeException("Transaction not found")
		);
	    TransactionRespDto resp = new TransactionRespDto();

	    resp.setTransactionId(trans.getTransactionId());
	    resp.setSenderName(trans.getSender().getFirstName());
	    resp.setReceiverName(trans.getReceiver().getFirstName());
	    resp.setAmount(trans.getAmount());
	    resp.setTransactionType(trans.getTransactionType());
	    resp.setTransactionStatus(trans.getTransactionStatus());
	    resp.setReferenceNumber(trans.getReferenceNumber());
	    resp.setRemarks(trans.getRemarks());
	    resp.setCreatedAt(trans.getCreatedAt());
	    if (trans.getSender().getUserId()
	            .equals(user.getUserId())) {

	        resp.setTransactionDirection("SENT");

	    } else {

	        resp.setTransactionDirection("RECEIVED");
	    }

	    return resp;
	}
	@Override
	public AdminTransactionRespDto getAdminTransactionByReference(
	        String referenceNumber) {

	    Transaction transaction = tr.findByReferenceNumber(referenceNumber)
	            .orElseThrow(() ->
	                    new RuntimeException("Transaction not found"));

	    AdminTransactionRespDto dto = new AdminTransactionRespDto();

	    dto.setTransactionId(transaction.getTransactionId());

	    dto.setSenderId(
	            transaction.getSender().getUserId());

	    dto.setSenderName(
	            transaction.getSender().getFirstName() + " " +
	            transaction.getSender().getLastName());

	    dto.setReceiverId(
	            transaction.getReceiver().getUserId());

	    dto.setReceiverName(
	            transaction.getReceiver().getFirstName() + " " +
	            transaction.getReceiver().getLastName());

	    dto.setAmount(transaction.getAmount());
	    dto.setTransactionType(transaction.getTransactionType());
	    dto.setTransactionStatus(transaction.getTransactionStatus());
	    dto.setReferenceNumber(transaction.getReferenceNumber());
	    dto.setRemarks(transaction.getRemarks());
	    dto.setCreatedAt(transaction.getCreatedAt());

	    return dto;
	}
	@Override
	public List<AdminTransactionRespDto> getTransactionsByStatus(
	        String status) {

	    List<Transaction> transactions =
	            tr.findByTransactionStatusOrderByCreatedAtDesc(status);

	    return transactions.stream().map(transaction -> {

	        AdminTransactionRespDto dto =
	                new AdminTransactionRespDto();

	        dto.setTransactionId(
	                transaction.getTransactionId());

	        dto.setSenderId(
	                transaction.getSender().getUserId());

	        dto.setSenderName(
	                transaction.getSender().getFirstName() + " " +
	                transaction.getSender().getLastName());

	        dto.setReceiverId(
	                transaction.getReceiver().getUserId());

	        dto.setReceiverName(
	                transaction.getReceiver().getFirstName() + " " +
	                transaction.getReceiver().getLastName());

	        dto.setAmount(transaction.getAmount());

	        dto.setTransactionType(
	                transaction.getTransactionType());

	        dto.setTransactionStatus(
	                transaction.getTransactionStatus());

	        dto.setReferenceNumber(
	                transaction.getReferenceNumber());

	        dto.setRemarks(
	                transaction.getRemarks());

	        dto.setCreatedAt(
	                transaction.getCreatedAt());

	        return dto;

	    }).toList();
	}

}
