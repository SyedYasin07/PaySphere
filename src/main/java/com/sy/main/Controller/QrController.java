package com.sy.main.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sy.main.dto.QrScanReqDTO;
import com.sy.main.dto.UserRespDTO;
import com.sy.main.service.QrService;

@RestController
@RequestMapping("/qr")
public class QrController {

    @Autowired
    private QrService qrService;

    @GetMapping(
            value = "/my-qr",
            produces = "image/png"
    )
    public byte[] getMyQr() {

        return qrService.generateMyQr();
    }
    
    @PostMapping("/scan")
    public UserRespDTO scanQr(
            @RequestBody QrScanReqDTO request) {

        return qrService.scanQr(request.getQrData());
    }
}