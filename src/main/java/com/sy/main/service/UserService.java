package com.sy.main.service;

import java.util.List;

import com.sy.main.dto.ChangePasswordDTO;
import com.sy.main.dto.EmailVerificationDTO;
import com.sy.main.dto.ForgotPasswordDTO;
import com.sy.main.dto.LoginReqDTO;
import com.sy.main.dto.LoginRespDTO;
import com.sy.main.dto.RegReqDTO;
import com.sy.main.dto.ResetPasswordDTO;
import com.sy.main.dto.UserRespDTO;

public interface UserService {
	
	UserRespDTO regUser(RegReqDTO req);
	LoginRespDTO loginUser(LoginReqDTO req);
	UserRespDTO getUserById(Integer userId);
	
	UserRespDTO getMyProfile();
	
	UserRespDTO blockUser(Integer userId);

	UserRespDTO unblockUser(Integer userId);
	UserRespDTO updateMyProfile(RegReqDTO request);
	
	List<UserRespDTO> getAllUsers ();
	
	  UserRespDTO updateUser(Integer userId, RegReqDTO request);

	    void deleteUser(Integer userId);
	    void changePassword(ChangePasswordDTO request);
	    
	    String forgotPassword(ForgotPasswordDTO request);

	    void resetPassword(ResetPasswordDTO request);
	    String sendVerificationToken(EmailVerificationDTO request);

	    void verifyEmail(String token);
	

}
