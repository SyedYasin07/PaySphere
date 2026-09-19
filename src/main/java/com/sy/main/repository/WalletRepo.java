package com.sy.main.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sy.main.Entity.User;
import com.sy.main.Entity.Wallet;

public interface WalletRepo extends JpaRepository<Wallet, Integer>{
	
	Optional<Wallet> findByUser(User user);
	Optional<Wallet> findById(Integer walletId);
	long countByWalletStatus(String status);

}
