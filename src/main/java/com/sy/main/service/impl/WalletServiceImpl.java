package com.sy.main.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sy.main.Entity.Transaction;
import com.sy.main.Entity.User;
import com.sy.main.Entity.Wallet;
import com.sy.main.dto.TransferMoneyReqDTO;
import com.sy.main.dto.WalletRespDto;
import com.sy.main.repository.TransactionRepo;
import com.sy.main.repository.UserRepo;
import com.sy.main.repository.WalletRepo;
import com.sy.main.security.SecurityUtil;
import com.sy.main.service.WalletService;

@Service
public class WalletServiceImpl implements WalletService {

	@Autowired
	private WalletRepo wr;
	@Autowired
	private UserRepo usr;
	@Autowired
	private TransactionRepo tr;
	@Override
	public WalletRespDto createWallet(Integer userId) {
		User user= usr.findById(userId).orElseThrow(
				()-> new RuntimeException("User not found"));
		Optional<Wallet> exist= wr.findByUser(user);
		if(exist.isPresent()) {
			throw new RuntimeException("Wallet already exists for this user");
		}
		Wallet w= new Wallet();
		w.setUser(user);
		w.setWalletNumber("PAY" + System.currentTimeMillis());
		w.setBalance(BigDecimal.ZERO);
		w.setWalletStatus("ACTIVE");
		Wallet  savedWallet= wr.save(w);
		WalletRespDto resp= new WalletRespDto();
		resp.setWalletId(savedWallet.getWalletId());
		resp.setBalance(savedWallet.getBalance());
		resp.setWalletNumber(savedWallet.getWalletNumber());
		resp.setWalletStatus(savedWallet.getWalletStatus());
		return resp;
	}
	@Override
	public WalletRespDto getWalletByUserId(Integer userId) {
		User user= usr.findById(userId).orElseThrow(()-> new RuntimeException("User not found "));
		Wallet wal= wr.findByUser(user).orElseThrow(()-> new RuntimeException("Wallet not found"));
		WalletRespDto resp= new WalletRespDto();
		resp.setWalletId(wal.getWalletId());
		resp.setWalletNumber(wal.getWalletNumber());
		resp.setBalance(wal.getBalance());
		resp.setWalletStatus(wal.getWalletStatus());
		return resp;
	}
	@Override
	public BigDecimal getBalance(Integer walletId) {
		Wallet wal= wr.findById(walletId).orElseThrow(()->new RuntimeException("Wallet not found"));
		return wal.getBalance();
	}
	@Override
	public WalletRespDto addMoney(Integer walletId, BigDecimal amount) {
	    Wallet wal = wr.findById(walletId)
	            .orElseThrow(() -> new RuntimeException("Wallet not found"));
	    if(amount.compareTo(BigDecimal.ZERO)<=0) {
	    	throw new RuntimeException("Amount must be greater than zero");
	    }
	    wal.setBalance(wal.getBalance().add(amount));
	    Wallet update=wr.save(wal);
	    WalletRespDto resp= new WalletRespDto();
		resp.setWalletId(update.getWalletId());
		resp.setBalance(update.getBalance());
		resp.setWalletNumber(update.getWalletNumber());
		resp.setWalletStatus(update.getWalletStatus());
		return resp;
	}
	@Override
	public WalletRespDto withdrawMoney(Integer walletId, BigDecimal amount) {
		  Wallet wal = wr.findById(walletId)
		            .orElseThrow(() -> new RuntimeException("Wallet not found"));
		    if(amount.compareTo(BigDecimal.ZERO)<=0) {
		    	throw new RuntimeException("Amount must be greater than zero");
		    }
		    if(wal.getBalance().compareTo(amount)<0) {
		    	throw new RuntimeException("Insufficient balance");
		    }
		    wal.setBalance(wal.getBalance().subtract(amount));
		    Wallet update=wr.save(wal);
		    WalletRespDto resp= new WalletRespDto();
			resp.setWalletId(update.getWalletId());
			resp.setBalance(update.getBalance());
			resp.setWalletNumber(update.getWalletNumber());
			resp.setWalletStatus(update.getWalletStatus());
			return resp;
	}
	
	@Override
	public WalletRespDto getMyWallet() {

	    User user = SecurityUtil.getCurrentUser();

	    Wallet wal = wr.findByUser(user)
	            .orElseThrow(() -> new RuntimeException("Wallet not found"));

	    WalletRespDto resp = new WalletRespDto();

	    resp.setWalletId(wal.getWalletId());
	    resp.setWalletNumber(wal.getWalletNumber());
	    resp.setBalance(wal.getBalance());
	    resp.setWalletStatus(wal.getWalletStatus());

	    return resp;
	}
	@Override
	public BigDecimal getMyBalance() {

	    User user = SecurityUtil.getCurrentUser();

	    Wallet wallet = wr.findByUser(user)
	            .orElseThrow(() -> new RuntimeException("Wallet not found"));

	    return wallet.getBalance();
	}
	@Override
	public WalletRespDto addMoneyToMyWallet(BigDecimal amount) {

	    User user = SecurityUtil.getCurrentUser();

	    Wallet wallet = wr.findByUser(user)
	            .orElseThrow(() -> new RuntimeException("Wallet not found"));
	    if("BLOCKED".equals(wallet.getWalletStatus())) {
	    	throw new RuntimeException("Wallet is blocked");
	    }

	    if (amount.compareTo(BigDecimal.ZERO) <= 0) {
	        throw new RuntimeException("Amount must be greater than zero");
	    }

	    wallet.setBalance(wallet.getBalance().add(amount));

	    Wallet updated = wr.save(wallet);

	    WalletRespDto resp = new WalletRespDto();
	    resp.setWalletId(updated.getWalletId());
	    resp.setWalletNumber(updated.getWalletNumber());
	    resp.setBalance(updated.getBalance());
	    resp.setWalletStatus(updated.getWalletStatus());

	    return resp;
	}
	@Override
	public WalletRespDto withdrawFromMyWallet(BigDecimal amount) {

	    User user = SecurityUtil.getCurrentUser();

	    Wallet wallet = wr.findByUser(user)
	            .orElseThrow(() -> new RuntimeException("Wallet not found"));
	    if("BLOCKED".equals(wallet.getWalletStatus())) {
	    	throw new RuntimeException("Wallet is blocked");
	    }

	    if (amount.compareTo(BigDecimal.ZERO) <= 0) {
	        throw new RuntimeException("Amount must be greater than zero");
	    }

	    if (wallet.getBalance().compareTo(amount) < 0) {
	        throw new RuntimeException("Insufficient balance");
	    }

	    wallet.setBalance(wallet.getBalance().subtract(amount));

	    Wallet updated = wr.save(wallet);

	    WalletRespDto resp = new WalletRespDto();
	    resp.setWalletId(updated.getWalletId());
	    resp.setWalletNumber(updated.getWalletNumber());
	    resp.setBalance(updated.getBalance());
	    resp.setWalletStatus(updated.getWalletStatus());

	    return resp;
	}
	@Override
	public WalletRespDto blockWallet(Integer walletId) {

	    Wallet wallet = wr.findById(walletId)
	            .orElseThrow(() -> new RuntimeException("Wallet not found"));

	    wallet.setWalletStatus("BLOCKED");

	    Wallet updated = wr.save(wallet);

	    WalletRespDto resp = new WalletRespDto();
	    resp.setWalletId(updated.getWalletId());
	    resp.setBalance(updated.getBalance());
	    resp.setWalletNumber(updated.getWalletNumber());
	    resp.setWalletStatus(updated.getWalletStatus());

	    return resp;
	}

	@Override
	public WalletRespDto unblockWallet(Integer walletId) {

	    Wallet wallet = wr.findById(walletId)
	            .orElseThrow(() -> new RuntimeException("Wallet not found"));

	    wallet.setWalletStatus("ACTIVE");

	    Wallet updated = wr.save(wallet);

	    WalletRespDto resp = new WalletRespDto();
	    resp.setWalletId(updated.getWalletId());
	    resp.setBalance(updated.getBalance());
	    resp.setWalletNumber(updated.getWalletNumber());
	    resp.setWalletStatus(updated.getWalletStatus());

	    return resp;
	}
	@Transactional
	@Override
	public String transferMoney(TransferMoneyReqDTO req) {
		 // 1. Get logged-in sender
	    User sender = SecurityUtil.getCurrentUser();

	    // 2. Validate amount
	    BigDecimal amount = req.getAmount();

	    if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
	        throw new RuntimeException("Amount must be greater than zero");
	    }

	    // 3. Validate QR data
	    String qrData = req.getReceiverQrData();

	    if (qrData == null || !qrData.startsWith("PAYSPHERE:USER:")) {
	        throw new RuntimeException("Invalid PaySphere QR code");
	    }

	    // 4. Extract receiver ID from QR
	    String receiverIdString =
	            qrData.substring("PAYSPHERE:USER:".length());

	    Integer receiverId;

	    try {
	        receiverId = Integer.parseInt(receiverIdString);
	    } catch (NumberFormatException e) {
	        throw new RuntimeException("Invalid PaySphere QR code");
	    }

	    // 5. Find receiver
	    User receiver = usr.findById(receiverId)
	            .orElseThrow(() ->
	                    new RuntimeException("Receiver not found"));

	    // 6. Prevent sending money to yourself
	    if (sender.getUserId().equals(receiver.getUserId())) {
	        throw new RuntimeException(
	                "You cannot transfer money to yourself");
	    }

	    // 7. Get sender wallet
	    Wallet senderWallet = wr.findByUser(sender)
	            .orElseThrow(() ->
	                    new RuntimeException("Sender wallet not found"));

	    // 8. Get receiver wallet
	    Wallet receiverWallet = wr.findByUser(receiver)
	            .orElseThrow(() ->
	                    new RuntimeException("Receiver wallet not found"));

	    // 9. Check wallet status
	    if (!"ACTIVE".equals(senderWallet.getWalletStatus())) {
	        throw new RuntimeException("Sender wallet is blocked");
	    }

	    if (!"ACTIVE".equals(receiverWallet.getWalletStatus())) {
	        throw new RuntimeException("Receiver wallet is blocked");
	    }

	    // 10. Check sender balance
	    if (senderWallet.getBalance().compareTo(amount) < 0) {
	        throw new RuntimeException("Insufficient wallet balance");
	    }

	    // 11. Deduct money from sender
	    senderWallet.setBalance(
	            senderWallet.getBalance().subtract(amount)
	    );

	    // 12. Add money to receiver
	    receiverWallet.setBalance(
	            receiverWallet.getBalance().add(amount)
	    );

	    // 13. Save wallets
	    wr.save(senderWallet);
	    wr.save(receiverWallet);

	    // 14. Create transaction
	    Transaction transaction = new Transaction();

	    transaction.setWallet(senderWallet);
	    transaction.setSender(sender);
	    transaction.setReceiver(receiver);
	    transaction.setAmount(amount);
	    transaction.setTransactionType("TRANSFER");
	    transaction.setTransactionStatus("SUCCESS");
	    transaction.setRemarks(req.getRemarks());
	    transaction.setReferenceNumber(
	            "TXN" + System.currentTimeMillis()
	    );
	    transaction.setCreatedAt(LocalDateTime.now());

	    // 15. Save transaction
	    tr.save(transaction);

	    // 16. Return success
	    return "Money transferred successfully";
	}
	}
	
	

