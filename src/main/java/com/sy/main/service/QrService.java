package com.sy.main.service;

import com.sy.main.dto.UserRespDTO;

public interface QrService {

	byte[] generateMyQr();
	UserRespDTO scanQr(String qrData);
}
