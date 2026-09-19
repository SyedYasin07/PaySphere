package com.sy.main.service.impl;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.sy.main.Entity.User;
import com.sy.main.Entity.Wallet;
import com.sy.main.dto.UserRespDTO;
import com.sy.main.repository.UserRepo;
import com.sy.main.repository.WalletRepo;
import com.sy.main.security.SecurityUtil;
import com.sy.main.service.QrService;

@Service
public class QrServiceImpl implements QrService {

    @Autowired
    private WalletRepo wr;
    @Autowired
    private UserRepo userRepo;

    @Override
    public byte[] generateMyQr() {

        User user = SecurityUtil.getCurrentUser();

        Wallet wallet = wr.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        String qrData =
                "PAYSPHERE:USER:" + user.getUserId();

        try {

            BitMatrix matrix =
                    new MultiFormatWriter().encode(
                            qrData,
                            BarcodeFormat.QR_CODE,
                            300,
                            300
                    );

            ByteArrayOutputStream output =
                    new ByteArrayOutputStream();

            MatrixToImageWriter.writeToStream(
                    matrix,
                    "PNG",
                    output
            );

            return output.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate QR code", e);
        }
    }

    @Override
    public UserRespDTO scanQr(String qrData) {

        if (qrData == null || !qrData.startsWith("PAYSPHERE:USER:")) {
            throw new RuntimeException("Invalid PaySphere QR code");
        }

        try {

            String userIdString =
                    qrData.substring("PAYSPHERE:USER:".length());

            Integer userId = Integer.parseInt(userIdString);

            User user = userRepo.findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            UserRespDTO resp = new UserRespDTO();

            resp.setUserId(user.getUserId());
            resp.setFirstName(user.getFirstName());
            resp.setLastName(user.getLastName());
            resp.setEmail(user.getEmail());
            resp.setPhone(user.getPhone());
            resp.setGender(user.getGender());
            resp.setStatus(user.getStatus());
            resp.setEmailVerified(user.getEmailVerified());

            return resp;

        } catch (NumberFormatException e) {

            throw new RuntimeException("Invalid QR user ID");
        }
    }
}