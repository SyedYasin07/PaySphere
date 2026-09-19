package com.sy.main.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sy.main.Entity.Wallet;
import com.sy.main.dto.AdminWalletRespDto;
import com.sy.main.dto.WalletRespDto;
import com.sy.main.repository.WalletRepo;
import com.sy.main.service.WalletService;

@RestController
@RequestMapping("/admin/wallets")
public class AdminWalletController {

    @Autowired
    private WalletRepo wr;
    @Autowired
    private WalletService ws;

    @GetMapping
    public List<AdminWalletRespDto> getAllWallets() {

        return wr.findAll().stream().map(wallet -> {

            AdminWalletRespDto dto = new AdminWalletRespDto();

            dto.setWalletId(wallet.getWalletId());
            dto.setUserId(wallet.getUser().getUserId());
            dto.setUserName(
                wallet.getUser().getFirstName() + " " +
                wallet.getUser().getLastName()
            );
            dto.setEmail(wallet.getUser().getEmail());
            dto.setWalletNumber(wallet.getWalletNumber());
            dto.setBalance(wallet.getBalance());
            dto.setWalletStatus(wallet.getWalletStatus());
            dto.setCreatedAt(wallet.getCreatedAt());
            dto.setUpdatedAt(wallet.getUpdatedAt());

            return dto;

        }).toList();
    }
    @PutMapping("/{walletId}/block")
    public WalletRespDto blockWallet(
            @PathVariable Integer walletId) {

        return ws.blockWallet(walletId);
    }

    @PutMapping("/{walletId}/unblock")
    public WalletRespDto unblockWallet(
            @PathVariable Integer walletId) {

        return ws.unblockWallet(walletId);
    }
}